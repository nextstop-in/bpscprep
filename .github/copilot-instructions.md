# 🚀 Copilot Instructions – Project Standards

You are working on a production-grade React + TypeScript + AWS project.

Before generating or modifying code, you MUST follow these principles:

---

# 🧠 Core Philosophy

- Think like a senior engineer, not a code generator
- Prefer improving existing code over adding new code
- Avoid duplication at all costs
- Keep code simple, reusable, and maintainable

---

# 🔍 Codebase Awareness

- Always analyze the existing codebase before writing new code
- Reuse existing utilities, hooks, and components whenever possible
- Do NOT create new services/functions if similar logic already exists
- Refactor and clean unused or redundant code

---

# 🔁 API & Data Fetching Rules

❌ DO NOT:
- Create new API calls if data is already available
- Call APIs from multiple components unnecessarily
- Create separate services for each request

✅ DO:
- Use shared hooks for API calls
- Prefer centralized data fetching

---

# 🪝 Custom Hooks (MANDATORY)

- All API calls must go through reusable hooks

### Example pattern:
```ts
const { data, error, loading } = useQuery(url, params);
const { mutate, loading } = useMutation(url);