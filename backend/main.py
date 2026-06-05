from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from openai import OpenAI
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ACTO SuperAgent API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://rachitr200.github.io",
        "https://rachitr200.github.io/acto-superagent",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

OPENAI_MODEL = "gpt-4o-mini"

SYSTEM_PROMPT = """You are an ACTO SuperAgent — a pharma field rep AI assistant purpose-built for life sciences commercial and medical teams.

You are currently assisting with a call with Dr. Raj, Oncologist at Sunnybrook Hospital, Toronto.
HCP Profile: ~40 patients/week, specialist in solid tumors and immunotherapy, early adopter of checkpoint inhibitors, data-driven communicator.

You have the following skills. You MUST always respond with valid JSON only — no prose outside the JSON.

Respond ONLY with this exact JSON structure:
{
  "skill": "<one of: Drug Information | Objection Handling | CRM Action | Compliance Guard | HCP Profile>",
  "reasoning": "<1-2 sentences explaining what you detected and why you routed to this skill>",
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
    try:
        messages = [{"role": m.role, "content": m.content} for m in request.messages]

        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                *messages,
            ],
            temperature=0.3,
            max_tokens=1024,
        )

        raw = response.choices[0].message.content.strip()

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
                "reasoning": "The model returned text instead of structured JSON, so the backend used a fallback response.",
                "response": raw,
                "crm_action": None,
                "compliance_flag": None,
            }

        return {
            "success": True,
            "data": parsed,
            "usage": {
                "prompt_tokens": response.usage.prompt_tokens if response.usage else None,
                "completion_tokens": response.usage.completion_tokens if response.usage else None,
            },
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    messages = [{"role": m.role, "content": m.content} for m in request.messages]

    def generate():
        try:
            stream = client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    *messages,
                ],
                temperature=0.3,
                max_tokens=1024,
                stream=True,
            )

            full_text = ""

            for chunk in stream:
                delta = chunk.choices[0].delta.content

                if delta:
                    full_text += delta
                    yield f"data: {json.dumps({'type': 'delta', 'text': delta})}\n\n"

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
                    "reasoning": "The streaming response could not be parsed as JSON.",
                    "response": raw,
                    "crm_action": None,
                    "compliance_flag": None,
                }

            yield f"data: {json.dumps({'type': 'done', 'data': parsed})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")