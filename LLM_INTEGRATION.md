# BNS Legal LLM Integration Documentation

## Overview

This document outlines the integration of OpenRouter LLM API with the BNS Legal website to provide an AI-powered legal assistant chatbot.

## Configuration

### API Key & Settings

- **Provider**: OpenRouter (https://openrouter.ai)
- **API Key**: `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`
- **Model**: `openai/gpt-3.5-turbo`
- **Base URL**: `https://openrouter.ai/api/v1`
- **Max Tokens**: 500
- **Temperature**: 0.7

### Configuration Files

#### 1. **src/config/llm.ts**

Contains LLM API configuration and header generation:

```typescript
- LLM_CONFIG: Configuration object with API settings
- getOpenRouterHeaders(): Generates authorization headers for API calls
```

#### 2. **src/config/system-prompt.ts**

Contains the system prompt and firm context:

```typescript
- BNS_LEGAL_SYSTEM_PROMPT: Complete system prompt with firm information
- BNS_LEGAL_CONTEXT: Summary context for the firm
```

#### 3. **.env.local**

Environment variables for secure configuration:

```
VITE_OPENROUTER_API_KEY=sk-or-v1-...
VITE_OPENROUTER_MODEL=openai/gpt-3.5-turbo
VITE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

## Integration Details

### ChatButton Component

Located in: `src/components/ChatButton.tsx`

**Features:**

- Real-time AI-powered responses using OpenRouter API
- Conversation history maintained for context
- Loading states with animated indicators
- Error handling with fallback messages
- Session tracking for analytics

**How it works:**

1. User enters a query in the chat input
2. Query is sent to OpenRouter API with system prompt context
3. LLM generates response based on BNS Legal firm information
4. Response is displayed in chat interface
5. Conversation is optionally saved to Supabase database

### System Prompt Details

The system prompt includes:

**Firm Information:**

- Establishment year (1988)
- Founder and team members
- Registration details
- Office locations (Mira Road, Dadar, Fort)
- Contact information

**Practice Areas:**

- Civil Litigation
- Criminal Law
- High Court Practice
- Family & Matrimonial Laws
- Consumer Law
- Co-operative Society Laws
- Corporate & Tribunal Practice
- Legal Advisory & Documentation
- Redevelopment
- Labour Laws

**Team Details:**

- 1 Senior Partner (B. N. Shukla)
- 5 Named Advocates (Deepak, Sandeep, Neelam, Vinayak, Shivprasad)
- 10 Associate Advocates
- 5 Full-time Legal Interns

**Contact Information:**

- Phone: 9223438655 / 9967713812 / 9220473363
- Email: **bnslegal01@gmail.com** (Updated)
- Multiple office locations

## Email Address Updates

All email references throughout the application have been updated to use the firm's official email:

- **Email**: bnslegal01@gmail.com
- **Location**: Displayed in Contact Section, ChatButton, and system prompts

## Usage

### For Development

1. Ensure `.env.local` is configured with the API key
2. Run `npm run dev` to start the development server
3. Test the chat interface by clicking the chat button in the bottom-right corner

### API Call Flow

```
User Input → ChatButton Component → OpenRouter API
                ↓
        System Prompt + Context
                ↓
        LLM Processing
                ↓
        Response Generation
                ↓
        Supabase Storage (Optional)
                ↓
        Display in Chat UI
```

## Error Handling

The ChatButton component includes comprehensive error handling:

- API connection errors
- Response validation
- Database save failures (non-critical)
- User-friendly error messages

## Performance Considerations

- **Context Window**: Last 6 messages kept for conversation context
- **Token Limit**: 500 tokens max per response
- **Temperature**: 0.7 for balanced creativity and consistency
- **Rate Limiting**: Handled by OpenRouter API

## Testing the Integration

### Test Queries

1. "Tell me about BNS Legal"
2. "What practice areas do you cover?"
3. "How can I contact you?"
4. "Do you offer internships?"
5. "What is your office address?"

## Monitoring & Analytics

- Chat queries are logged to Supabase
- Session IDs track conversation flows
- Error rates can be monitored
- User engagement metrics available

## Security Notes

⚠️ **Important**:

- API key is currently visible in `.env.local`
- For production: Use server-side API proxy
- Never expose API key in client-side code in production
- Consider rate limiting if deployed publicly

## Future Enhancements

1. Server-side API proxy for security
2. Conversation history persistence per user
3. Advanced analytics dashboard
4. Integration with CRM for lead tracking
5. Multi-language support
6. Response quality scoring
7. Feedback collection system

## Support

For issues or questions about the LLM integration, contact the development team.

---

**Last Updated**: March 9, 2026
**Integration Version**: 1.0
**API Provider**: OpenRouter
