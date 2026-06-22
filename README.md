#  SuperAgent – AI Copilot for Pharma Field Teams

## Overview

 SuperAgent is a full-stack AI copilot demo designed for pharmaceutical field teams, including Medical Science Liaisons and Sales Representatives.

The project simulates how an AI assistant can support healthcare professional conversations by helping users access drug information, respond to objections, generate CRM-ready actions, identify compliance risks, and personalize responses using HCP context.

This project was built to demonstrate capabilities aligned with the  Agent Experience Engineer role.

---

## Problem

Pharmaceutical field teams often need to quickly prepare for HCP meetings, answer product-related questions, document interactions, and stay compliant.

These workflows can be time-consuming because information may be spread across product material, CRM notes, compliance guidelines, and physician profiles.

 SuperAgent demonstrates how an AI copilot can bring these workflows into one assistant experience.

---

## Solution

The application provides a conversational AI interface where a field representative can ask questions such as:

- What are the approved indications for Keytruda?
- How should I respond to a safety objection?
- What should I log in CRM after this visit?
- Is this question a compliance risk?
- What is important to know about this HCP?

The agent classifies each request into a specific skill and returns a structured response.

---

## Core Agent Capabilities

### Drug Information

Provides support for drug-related questions such as approved indications, clinical data, and mechanism of action.

### Objection Handling

Helps field representatives respond to physician concerns using professional and evidence-based language.

### CRM Action

Generates CRM-ready summaries, follow-up actions, and next-best-action recommendations.

### Compliance Guard

Flags potential off-label, regulatory, or promotional risk.

### HCP Profile

Uses physician context to personalize responses and recommendations.

---

## Architecture

The system uses a simple full-stack architecture:

```text
User Question
     ↓
React Frontend
     ↓
FastAPI Backend
     ↓
OpenAI GPT-4o-mini
     ↓
Structured JSON Response
     ↓
React UI Display