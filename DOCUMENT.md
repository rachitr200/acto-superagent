# Architecture Document -  SuperAgent MVP

## System Objective

Build a life-sciences AI SuperAgent that helps pharmaceutical field teams and Medical Science Liaisons (MSLs) during HCP conversations by routing user questions to specialized skills, generating structured responses, recommending CRM actions, and flagging compliance concerns in real time.

This project demonstrates a multi-skill AI copilot designed for pharmaceutical commercial and medical teams. The system routes user requests to specialized reasoning capabilities, generates structured outputs, surfaces compliance considerations, and produces CRM-ready recommendations.

---

## System Architecture

This solution uses a full-stack AI architecture consisting of:

- React + Vite Frontend
- FastAPI Backend
- OpenAI GPT-4o-mini Reasoning Engine
- Structured JSON Agent Responses

### End-to-End Flow

1. Receive Message
   - The React frontend captures the field representative's message and maintains conversation history.

2. Send Request
   - The frontend sends the conversation history to the FastAPI backend through the /chat endpoint.

3. Validate Request
   - Pydantic validates incoming request structures and message formats.

4. Agent Reasoning
   - FastAPI sends the conversation and system instructions to OpenAI GPT-4o-mini.
   - The model identifies intent and routes the request to the most relevant skill.

5. Structured Output Generation
   - GPT-4o-mini returns a structured JSON response containing:
     - Skill
     - Reasoning
     - Response
     - CRM Action
     - Compliance Flag

6. Response Parsing
   - FastAPI validates and parses the JSON response.
   - Fallback handling prevents UI failures if malformed output is returned.

7. Frontend Rendering
   - The UI displays:
     - Skill classification
     - Agent response
     - Reasoning
     - CRM recommendation
     - Compliance indicators
     - Token usage

8. Next Best Action
   - The system generates CRM-ready recommendations and follow-up actions.

---

## Core Agent Capabilities

### 1. Drug Information

Handles:

- Approved indications
- Mechanism of action
- Clinical trial information
- Product information

Example:

> What are the approved indications for Keytruda?

---

### 2. Objection Handling

Supports field representatives when responding to:

- Safety concerns
- Efficacy concerns
- Competitive objections
- Adoption barriers

Example:

> A physician is concerned about long-term safety.

---

### 3. CRM Action

Generates:

- Visit summaries
- Next-best-action recommendations
- Follow-up suggestions
- CRM logging guidance

Example:

> Recommend a follow-up discussion on efficacy data.

---

### 4. Compliance Guard

Identifies:

- Off-label requests
- Promotional risk
- Compliance concerns
- Regulatory boundary questions

Example:

> Is this use approved for an indication not listed on the label?

---

### 5. HCP Profile

Uses physician context to personalize responses.

Example:

- Specialty
- Institution
- Clinical interests
- Previous interactions

---

## State Management

The MVP stores conversation state in the React frontend.

The backend receives the entire conversation history with each request and uses it as contextual memory.

Tracked state includes:

- User messages
- Assistant messages
- Selected skill
- Reasoning
- CRM action
- Compliance flag
- Token usage
- HCP profile
- Quick prompt selection

### Production State Design

For production deployment:

- Redis for active sessions
- PostgreSQL for persistent history
- Vector database for approved medical content
- Object storage for uploaded assets and documents

---

## Why FastAPI

FastAPI was selected because it provides:

- High performance APIs
- Automatic OpenAPI documentation
- Strong request validation
- Async support
- Clean integration with AI frameworks
- Production deployment readiness

Benefits:

- Faster development
- Cleaner API contracts
- Better validation
- Easy testing

---

## Why React + Vite

React and Vite provide a fast and modern frontend experience.

The interface demonstrates:

- HCP profile visualization
- Agent skill routing
- Compliance indicators
- CRM recommendations
- Interactive AI workflow

The goal was to create a product experience rather than a simple chatbot interface.

---

## Why OpenAI GPT-4o-mini

GPT-4o-mini is used as the reasoning engine because it offers:

- Strong instruction following
- Structured JSON generation
- Fast response times
- Cost-effective inference
- Reliable reasoning capabilities
- Production-ready API support

The model is instructed to always return structured JSON using the following schema:

json {   "skill": "Drug Information | Objection Handling | CRM Action | Compliance Guard | HCP Profile",   "reasoning": "Why the skill was selected",   "response": "Primary response",   "crm_action": "Suggested CRM action",   "compliance_flag": "Compliance concern if applicable" } 

This approach improves:

- Reliability
- Testability
- Frontend rendering
- Enterprise integration readiness

---

## AI Integration Workflow

1. User submits a question.
2. FastAPI receives the request.
3. GPT-4o-mini analyzes the intent.
4. The model selects the most appropriate skill.
5. Structured JSON is generated.
6. FastAPI validates the response.
7. React renders the output.
8. CRM actions and compliance recommendations are surfaced.

---

## Production Architecture Roadmap

| Component | MVP | Production |
|------------|------------|------------|
| LLM | OpenAI GPT-4o-mini | Multi-model architecture |
| Knowledge Base | Prompt-based | RAG with approved medical content |
| HCP Data | Static profile | CRM-integrated profile |
| CRM | Simulated actions | Veeva / Salesforce integration |
| State | Client-side | Redis + PostgreSQL |
| Compliance | Prompt guardrails | Policy engine + approval workflow |
| Authentication | None | SSO + RBAC |
| Monitoring | Console logs | Observability platform |
| Deployment | Local demo | Cloud deployment |
| Streaming | Basic SSE | Enterprise-grade streaming |

---

## Failure Modes and Handling

### Invalid Request

Example:

- Missing message content
- Incorrect request structure

Handling:

- Pydantic validation
- Structured API errors

---

### Invalid API Key

Example:

- Missing OpenAI API key
- Revoked key

Handling:

- Authentication validation
- Clear backend error messages

---

### Rate Limits

Example:

- Excessive API requests

Handling:

- Retry messaging
- User notification

---

### Invalid JSON Output

Example:

- Model returns malformed JSON

Handling:

- JSON parsing validation
- Safe fallback response

---

### Frontend / Backend Connectivity Issues

Example:

- Backend unavailable

Handling:

- Graceful error display
- Retry capability

---

### Compliance Sensitive Requests

Example:

- Off-label promotion questions

Handling:

- Compliance Guard activation
- Compliance flag generation

---

## Security and Compliance Considerations

This project is a demonstration environment and not intended for production medical usage.

Production controls would include:

- Approved-content-only RAG
- Medical/legal/regulatory review workflows
- Audit logging
- Encryption
- Role-based access control
- PHI / PII redaction
- Prompt injection protection
- Human approval workflows
- Version-controlled prompts

---

## Future Enhancements

### RAG Integration

Retrieve approved medical content before generation.

### CRM Integration

Connect recommendations directly to:

- Veeva CRM
- Salesforce Health Cloud

### Human-in-the-Loop Review

Escalate high-risk outputs for approval.

### Real-Time Streaming

Leverage the existing streaming endpoint.

### Multi-HCP Support

Support multiple physician profiles.

### Conversation Persistence

Store historical interactions.

### Analytics Dashboard

Track:

- Objections
- Product interest
- Follow-up trends
- Agent performance

### Evaluation Framework

Measure:

- Routing accuracy
- JSON validity
- Compliance detection
- CRM recommendation quality

---

## Interview Explanation

I built  SuperAgent to demonstrate how AI agents can support pharmaceutical field teams in realistic workflows.

Rather than building a generic chatbot, I focused on creating a structured assistant that can:

- Route requests to specialized skills
- Generate compliant responses
- Recommend CRM actions
- Surface compliance concerns
- Personalize outputs using HCP context

The key design decision was enforcing structured JSON outputs containing:

- Skill
- Reasoning
- Response
- CRM Action
- Compliance Flag

This makes the system easier to test, easier to integrate into enterprise platforms, and more suitable for regulated industries such as life sciences.

For production deployment, I would extend the solution using RAG, CRM integrations, compliance workflows, audit logging, and human review processes.