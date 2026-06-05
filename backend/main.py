from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
import anthropic
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ACTO SuperAgent API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """You are an ACTO SuperAgent — a pharma field rep AI assistant purpose-built for life sciences commercial and medical teams.

You are currently assisting with a call with Dr. Raj, Oncologist at Sunnybrook Hospital, Toronto.
HCP Profile: ~40 patients/week, specialist in solid tumors and immunotherapy, early adopter of checkpoint inhibitors, data-driven communicator.

You have the following skills. You MUST always respond with valid JSON only — no prose outside the JSON.

Respond ONLY with this exact JSON structure:
{
  "skill": "<one of: Drug Information | Objection Handling | CRM Action | Compliance Guard | HCP Profile>",
  "reasoning": "<1-2 sentences of your internal agent reasoning — what you detected and why you routed to this skill>",
  "response": "<your main response to the field rep — clear, concise, professional, under 150 words>",
  "crm_action": "<null or a short string describing what to log in Veeva/Salesforce>",
  "compliance_flag": "<null or a specific compliance concern to flag>"
}

Rules:
- NEVER fabricate drug approval data. If unsure, say so and recommend checking with medical affairs.
- Flag any off-label promotion risk immediately in compliance_flag.
- Keep responses professional and evidence-based.
- CRM actions should be specific and actionable.
- Compliance Guard skill triggers on off-label, regulatory, or promotional boundary questions.
- Return ONLY valid JSON. No markdown, no backticks, no extra text."""


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]
    stream: Optional[bool] = False


class HCPContext(BaseModel):
    name: str
    specialty: str
    hospital: str
    notes: Optional[str] = None


@app.get("/")
def root():
    return {"status": "ACTO SuperAgent API running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat")
async def chat(request: ChatRequest):
    """Non-streaming chat endpoint — returns full JSON response."""
    try:
        messages = [{"role": m.role, "content": m.content} for m in request.messages]

        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=messages,
        )

        raw = response.content[0].text.strip()

        # Strip markdown code fences if model wraps in them
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            parsed = {
                "skill": "Drug Information",
                "reasoning": "Could not parse structured response.",
                "response": raw,
                "crm_action": None,
                "compliance_flag": None,
            }

        return {
            "success": True,
            "data": parsed,
            "usage": {
                "input_tokens": response.usage.input_tokens,
                "output_tokens": response.usage.output_tokens,
            },
        }

    except anthropic.AuthenticationError:
        raise HTTPException(status_code=401, detail="Invalid Anthropic API key. Check your .env file.")
    except anthropic.RateLimitError:
        raise HTTPException(status_code=429, detail="Rate limit hit. Please wait a moment.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """Streaming chat endpoint — streams tokens as SSE."""
    messages = [{"role": m.role, "content": m.content} for m in request.messages]

    def generate():
        try:
            with client.messages.stream(
                model="claude-opus-4-5",
                max_tokens=1024,
                system=SYSTEM_PROMPT,
                messages=messages,
            ) as stream:
                full_text = ""
                for text in stream.text_stream:
                    full_text += text
                    yield f"data: {json.dumps({'type': 'delta', 'text': text})}\n\n"

                # Send final parsed message
                raw = full_text.strip()
                if raw.startswith("```"):
                    raw = raw.split("```")[1]
                    if raw.startswith("json"):
                        raw = raw[4:]
                raw = raw.strip()

                try:
                    parsed = json.loads(raw)
                except json.JSONDecodeError:
                    parsed = {
                        "skill": "Drug Information",
                        "reasoning": "Parse error on stream.",
                        "response": raw,
                        "crm_action": None,
                        "compliance_flag": None,
                    }

                yield f"data: {json.dumps({'type': 'done', 'data': parsed})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
