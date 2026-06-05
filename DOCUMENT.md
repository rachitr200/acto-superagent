# Architecture Document - ACTO SuperAgent MVP

## Goal

Build a life-sciences AI SuperAgent that helps pharma field teams and MSLs during HCP conversations by routing user questions to the right specialized skill, generating structured responses, logging CRM-ready actions, and flagging compliance risk in seconds.

This project simulates an ACTO-style field rep assistant for a live call with Dr. Raj, an oncologist at Sunnybrook Hospital in Toronto. The agent is designed to support medical and commercial conversations while keeping responses concise, structured, and compliance-aware.

## Agent Loop

This solution uses a full-stack AI agent workflow with a FastAPI backend, React frontend, and Anthropic Claude reasoning layer.

### Flow

1. **receive_message** - The React frontend captures the field rep's message and keeps the conversation history client-side.

2. **send_to_api** - The frontend sends the full message list to the FastAPI backend through the `/api/chat` proxy.

3. **validate_request** - Pydantic validates the incoming request structure, including message role and content.

4. **agent_reasoning** - The backend sends the conversation plus system prompt to Anthropic Claude. Claude detects intent and routes the response to one of five skills: Drug Information, Objection Handling, CRM Action, Compliance Guard, or HCP Profile.

5. **structured_json_output** - Claude returns a strict JSON object with skill, reasoning, response, CRM action, and compliance flag.

6. **parse_and_fallback** - The backend parses the JSON response. If the model returns non-JSON text, the backend falls back to a safe structured response instead of breaking the app.

7. **render_agent_response** - The frontend displays the agent answer, expandable reasoning panel, skill tag, CRM action card, compliance flag, and token usage.

8. **crm_next_action** - When relevant, the agent suggests Veeva/Salesforce-style CRM logging and next-best-action follow-ups.

## Active Skills

1. **Drug Information**
   - Handles approved indications, mechanisms of action, clinical data, and drug-related questions.
   - Example: Keytruda approved indications.

2. **Objection Handling**
   - Helps a rep respond to physician concerns using professional, evidence-based language.
   - Example: safety, efficacy, or adoption concerns.

3. **CRM Action**
   - Creates CRM-ready summaries and next-best-action recommendations.
   - Example: log discussion topic, HCP sentiment, follow-up action, and suggested next meeting.

4. **Compliance Guard**
   - Detects off-label, regulatory, or promotional boundary risks.
   - Example: flags when a question could create off-label promotion risk.

5. **HCP Profile**
   - Uses the loaded HCP context to personalize responses.
   - Example: Dr. Raj is an oncology specialist with strong interest in immunotherapy.

## State Management

The MVP keeps conversation state in the frontend React application. The backend receives the full message history on every request and uses it as context for the LLM call.

State includes:

- user messages
- assistant messages
- selected skill
- agent reasoning
- main response
- CRM action
- compliance flag
- token usage
- active HCP profile
- quick prompt selection

For MVP, this is enough because the app is a local demo. In production, I would move persistent state to a backend database.

### Production State Design

- **Redis** for short-lived active conversation/session state
- **Postgres** for persistent call history, HCP interactions, CRM logs, and audit trails
- **Vector database** for approved medical content, product labels, FAQs, and medical/legal/regulatory content
- **Object storage** for uploaded documents and call artifacts

## Why FastAPI

FastAPI is a strong fit for this project because it provides:

- clean REST endpoints
- async support for LLM calls
- automatic OpenAPI documentation at `/docs`
- Pydantic validation for safe request handling
- easy integration with Python AI libraries
- simple deployment path for production APIs

## Why React + Vite

React and Vite make the demo fast and interactive. The frontend visualizes the AI workflow instead of only showing a plain chatbot.

The UI includes:

- HCP profile sidebar
- active skill panel
- quick prompt buttons
- expandable agent reasoning
- CRM action cards
- compliance indicator
- token usage tracking

This makes the project more interview-ready because it shows both backend AI engineering and user-facing product thinking.

## Why Anthropic Claude

Claude is used as the reasoning engine because this project requires:

- strong instruction following
- structured JSON output
- professional tone
- long-context reasoning
- safe handling of medical and compliance-sensitive prompts

The model is instructed to always return valid JSON with this structure:

```json
{
  "skill": "Drug Information | Objection Handling | CRM Action | Compliance Guard | HCP Profile",
  "reasoning": "why this skill was selected",
  "response": "main response to the field rep",
  "crm_action": "CRM-ready action or null",
  "compliance_flag": "compliance concern or null"
}
```

## What I Would Swap In For Production

| Component | MVP | Production |
|---|---|---|
| LLM | Anthropic Claude | Configurable model layer: Claude, OpenAI, Gemini, or approved enterprise LLM |
| Medical knowledge | Prompt-based simulated knowledge | RAG over approved medical/legal/regulatory content |
| HCP profile | Static frontend config | CRM-integrated HCP profile from Veeva/Salesforce |
| CRM action | Simulated log card | Real Veeva/Salesforce API integration |
| State store | Client-side conversation state | Redis for sessions + Postgres for audit/history |
| Compliance | Prompt-based guardrails | Policy engine + approved content retrieval + human review workflow |
| Auth | None | SSO, JWT, role-based access control |
| Observability | Console logs/token display | Structured logs, tracing, latency metrics, prompt/version tracking |
| Deployment | Localhost demo | Dockerized backend/frontend on cloud infrastructure |
| Streaming | SSE endpoint available | Production streaming with retries and monitoring |

## Failure Modes and Handling

1. **Invalid request input**
   - Example: malformed message object or missing content.
   - Handling: Pydantic rejects invalid input and FastAPI returns a structured validation error.

2. **Invalid API key**
   - Example: missing or revoked Anthropic API key.
   - Handling: backend catches `AuthenticationError` and returns a 401 error with a clear message.

3. **Rate limit**
   - Example: too many LLM calls in a short time.
   - Handling: backend catches `RateLimitError` and returns a 429 error.

4. **LLM returns invalid JSON**
   - Example: model adds markdown or prose outside JSON.
   - Handling: backend strips code fences and attempts JSON parsing. If parsing fails, it returns a fallback structured response.

5. **Frontend/backend connection issue**
   - Example: Vite proxy cannot reach FastAPI on port 8000.
   - Handling: frontend displays an API request failure. Production version would add retry logic and clearer error messages.

6. **Compliance-sensitive question**
   - Example: user asks for off-label promotion support.
   - Handling: system prompt instructs the agent to route to Compliance Guard and return a compliance flag.

## Security and Compliance Considerations

This project is a demo and should not be used as a real medical advice system without production controls.

For production, I would add:

- approved-content-only RAG
- medical/legal/regulatory review workflow
- audit logs for all prompts and responses
- role-based access control
- PII/PHI redaction
- encryption in transit and at rest
- prompt injection protection
- model output monitoring
- human approval for high-risk outputs
- versioned prompts and compliance policies

## What I Would Build Next

1. **RAG over approved medical content** - Use a vector database to retrieve product labels, approved indications, prescribing information, and MLR-approved content before generating responses.

2. **Real CRM integration** - Connect CRM Action output to Veeva or Salesforce so the rep can log calls automatically.

3. **Human-in-the-loop review** - Route high-risk compliance or medical claims to a medical affairs reviewer before sending.

4. **Streaming UI** - Use the existing `/chat/stream` endpoint to display real-time response generation.

5. **Multi-HCP support** - Allow the rep to switch between different physician profiles and call plans.

6. **Conversation persistence** - Store call history, HCP preferences, and previous objections in Postgres.

7. **Analytics dashboard** - Track common objections, product interest, call outcomes, and follow-up recommendations.

8. **Evaluation framework** - Add test cases for routing accuracy, JSON validity, compliance flags, and CRM summary quality.

## Interview Explanation

I built this project to show how an AI agent can support life-sciences field teams in a realistic workflow. The goal was not just to build a chatbot, but to create a structured assistant with skill routing, compliance awareness, CRM logging, and HCP context.

The most important design choice was separating the response into clear fields: skill, reasoning, response, CRM action, and compliance flag. This makes the output easier to test, easier to display in the UI, and easier to integrate with enterprise systems.

In production, I would connect the agent to approved content through RAG, integrate it with Veeva or Salesforce, add audit logging, and include human review for compliance-sensitive cases.
