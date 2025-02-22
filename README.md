# Marina AI

## What is it?
Marina AI is intelligent inventory management system powered by AI agents that automates stock monitoring and supplier interactions for businesses of all sizes. The system monitors inventory levels in real-time, facilitates supplier communications, and streamlines the entire restocking workflow.

<img width="1887" alt="image" src="https://github.com/user-attachments/assets/1bbd58b2-d335-43c1-9d9e-3ae065fa79dc" />

## Tools Used

- **Twilio Voice** → Handles phone call functionality
- **ElevenLabs Integration** → Used for AI voice synthesis
- **Google Gemini 2.0 Flash** - Multimodal model used for image recognition to power agents
- **Vercel** - Infrastructure and deployment


## Run locally

**Configuration**

Create a .env file in the root directory with the following variables:
```
GEMINI_API_KEY=your_gemini_api_key
OUTBOUND_CALL_ENDPOINT=your_outbound_call_endpoint
SUPPLIER_PHONE=your_supplier_phone
OUTBOUND_PHONE=your_outbound_phone
RESTAURANT_NAME=your_restaurant_name
```

```
pnpm install
pnpm run dev
```

## Early Prototype

This is an Agnetic workflow based on prototyped on n8n

<img width="1362" alt="image" src="https://github.com/user-attachments/assets/0b117bc9-ba42-45f5-af21-1b8cb9bce971" />


