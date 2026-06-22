# SuperAgent – AI Copilot for Pharma Field Teams

## Live Demo

### Frontend Demo
https://rachitr200.github.io/acto-superagent/

### Backend API
https://acto-superagent-api.onrender.com

---

## Overview

SuperAgent is a full-stack AI copilot designed to support pharmaceutical field teams, Medical Science Liaisons (MSLs), and healthcare engagement workflows.

The application demonstrates how AI agents can assist field representatives by providing drug information, handling physician objections, generating CRM-ready recommendations, identifying compliance concerns, and personalizing responses using Healthcare Professional (HCP) context.

This project showcases practical AI engineering, agent orchestration, structured reasoning, and enterprise-ready architecture patterns commonly used in regulated industries.

---

## Business Value

Traditional pharmaceutical field representatives often spend significant time searching multiple systems for drug information, compliance guidance, physician profiles, and CRM documentation.

SuperAgent consolidates these workflows into a single AI-powered assistant that:

- Reduces information lookup time
- Generates CRM-ready recommendations
- Identifies compliance risks
- Personalizes responses using HCP context
- Demonstrates enterprise AI orchestration patterns

---

## Key Features

- Multi-skill AI agent routing
- Drug Information Assistant
- Objection Handling Engine
- CRM Recommendation Generator
- Compliance Risk Detection
- HCP Profile Personalization
- Structured JSON Outputs
- FastAPI Backend APIs
- React + Vite Frontend
- Cloud Deployment using Render and GitHub Pages

---

## Core Agent Capabilities

### Drug Information

Provides support for:

- Approved indications
- Clinical information
- Mechanism of action
- Product-related questions

**Example**

What are the approved indications for Keytruda?

---

### Objection Handling

Supports field representatives when responding to:

- Safety concerns
- Efficacy concerns
- Competitive objections
- Adoption barriers

**Example**

A physician is concerned about long-term safety.

---

### CRM Action

Generates:

- Visit summaries
- Next-best-action recommendations
- Follow-up suggestions
- CRM documentation guidance

**Example**

Recommend a follow-up discussion on efficacy data.

---

### Compliance Guard

Identifies:

- Off-label requests
- Promotional risk
- Compliance concerns
- Regulatory boundary questions

**Example**

Is this use approved for an indication not listed on the label?

---

### HCP Profile

Uses physician context to personalize recommendations and responses.

Context can include:

- Specialty
- Institution
- Clinical interests
- Historical interactions

---

## System Architecture

```text
┌──────────────────┐
│   User Question  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ React Frontend   │
│ (Vite)           │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ FastAPI Backend  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ OpenAI GPT-4o    │
│ Mini             │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Structured JSON  │
│ Response         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Response         │
│ Validation       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Frontend Render  │
└──────────────────┘
```

---

## AI Workflow

1. User submits a question
2. React frontend sends conversation history to FastAPI
3. FastAPI validates requests using Pydantic
4. GPT-4o-mini analyzes intent
5. The model selects the most relevant skill
6. Structured JSON is generated
7. Backend validates and parses the response
8. React renders the response and recommendations

---

## Structured Response Schema

```json
{
  "skill": "Drug Information | Objection Handling | CRM Action | Compliance Guard | HCP Profile",
  "reasoning": "Why the skill was selected",
  "response": "Primary response",
  "crm_action": "Suggested CRM action",
  "compliance_flag": "Compliance concern if applicable"
}
```

---

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- FastAPI
- Python
- Pydantic
- Uvicorn

### AI Layer

- OpenAI GPT-4o-mini

### Deployment

- GitHub Pages
- Render

---

## Why This Project

Rather than building a generic chatbot, I focused on creating a specialized AI agent capable of:

- Routing requests to specialized skills
- Producing structured outputs
- Generating CRM recommendations
- Identifying compliance risks
- Personalizing responses using HCP context

The key design decision was enforcing structured JSON outputs, making the system easier to validate, test, monitor, and integrate into enterprise workflows.

This project was built to demonstrate capabilities relevant to Agent Experience Engineering:

- AI orchestration
- Intent routing
- Structured outputs
- Compliance-aware reasoning
- Enterprise integration patterns

---

## Future Enhancements

- Retrieval-Augmented Generation (RAG)
- Veeva CRM Integration
- Salesforce Health Cloud Integration
- Human-in-the-Loop Review
- Multi-HCP Support
- Redis Session Management
- PostgreSQL Persistence
- Analytics Dashboard
- Compliance Workflow Engine

---

## Disclaimer

This project is intended for demonstration and educational purposes only.

It is not intended for clinical decision-making, medical advice, or production healthcare deployment. Any production implementation would require medical, legal, regulatory, and compliance review processes.