# site

Hermite's product website: landing content, the full feature roadmap across all four stages (clearly separating "available now" from "coming soon"), and `/docs` — real technical documentation for the enterprise API (endpoints, auth, rate limits) plus the MCP/Composio setup guide.

Next.js (deployed on Vercel, root directory `site`) + the Clay design system (`npx getdesign@latest add clay` — follow the generated DESIGN.md for all UI work). Fully JS/TS, so Jest applies cleanly. See [HERMITE-PLAN.md §5](../HERMITE-PLAN.md#5-technical-architecture).
