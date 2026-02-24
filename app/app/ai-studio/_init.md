# AI Studio

## Purpose
AI-powered HTML template generator with chat-based refinement. Users describe a document (type, style, details), optionally upload a logo, and chat with GPT-4o to iteratively perfect the template. Templates use `{{ variable }}` placeholders for dynamic content, with realistic sample data filled in for the live preview. Saved templates land in the user's template library.

## Data Sources
- `User.plan` — determines AI credit limit (starter=1, growth=20, business=50 per month)
- `UsageEvent` where `endpoint = "ai-generate"` — tracks monthly AI generation count
- OpenAI GPT-4o via `lib/openai.ts` — generates HTML from conversation history

## Actions
- `chatGenerateAction` (`app/actions/ai-generate.ts`) — auth check, credit check, builds OpenAI messages from conversation history, calls OpenAI, parses HTML + sample data, logs UsageEvent
- `saveAiTemplateAction` (`app/actions/ai-generate.ts`) — validates name+html, creates Template record (raw HTML with {{ variables }}), revalidates paths

## Component Split
- `page.tsx` — server component: fetches session, plan, monthly usage count, passes to client
- `ai-studio-client.tsx` — client component:
  - Left panel: config (doc type, style, logo upload) → chat messages → text input
  - Right panel: A4 paper preview with sample data filled in, copy HTML, save-as-template
  - Chat flow: each message calls `chatGenerateAction` directly via `useTransition`
  - Preview shows `{{ variables }}` replaced with sample data from AI response
  - Logo uploaded as base64 data URI, injected into `{{ logo_url }}` for preview
  - Saving stores raw HTML with `{{ variables }}` (not the filled-in preview)

## Variable System
- AI generates HTML with `{{ variable_name }}` placeholders (snake_case)
- AI also returns a `sampleData` JSON object with realistic values for each variable
- Preview replaces all `{{ var }}` with sample values client-side
- User-uploaded logo overrides `logo_url` sample value with actual data URI
- Saved template retains `{{ variables }}` for use with the rendering API

## Credit Limits
| Plan | Credits/month |
|------|--------------|
| starter | 1 |
| growth | 20 |
| business | 50 |

Each chat message (initial + refinements) costs 1 credit.
