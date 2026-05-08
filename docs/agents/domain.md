# Domain Docs

## Layout

This repo uses a **single-context** layout:

- `/CONTEXT.md` — domain glossary (create lazily when first needed)
- `/docs/adr/` — architectural decision records (create lazily when first needed)

## Rules for agents

- Read `CONTEXT.md` first when exploring the codebase to understand domain vocabulary
- Use terms from `CONTEXT.md` exactly in code, tests, and issue descriptions
- Check `docs/adr/` before proposing architectural changes — don't re-litigate decided questions
- Create `CONTEXT.md` lazily when the first term needs to be captured
- Create `docs/adr/` lazily when the first ADR is needed
