# AI Studio

## Purpose
AI-powered HTML template generator. Users describe a document (type, style, details) and GPT-4o generates a complete, self-contained HTML template with `{{ variable }}` placeholders. Generated templates can be previewed live and saved to the user's template library.

## Data Sources
- `User.plan` — determines AI credit limit (starter=1, growth=20, business=50 per month)
- `UsageEvent` where `endpoint = "ai-generate"` — tracks monthly AI generation count
- OpenAI GPT-4o via `lib/openai.ts` — generates HTML from user prompt

## Actions
- `generateTemplateAction` (`app/actions/ai-generate.ts`) — auth check, credit check, calls OpenAI, logs UsageEvent, returns generated HTML
- `saveAiTemplateAction` (`app/actions/ai-generate.ts`) — validates name+html, creates Template record, revalidates paths

## Component Split
- `page.tsx` — server component: fetches session, plan, monthly usage count, passes to client
- `ai-studio-client.tsx` — client component: two-panel layout with prompt form (left) and iframe preview (right), save-as-template bar

## Credit Limits
| Plan | Credits/month |
|------|--------------|
| starter | 1 |
| growth | 20 |
| business | 50 |
