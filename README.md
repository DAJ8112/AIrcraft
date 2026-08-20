# Aircraft (WIP)

AI analysis tool for the aviation industry.

The system understands and analyzes raw excel data and formats into a neat dashboard and shows AI insights and recommendations.

## The name

**Ai**rcraft — the **Ai** is the tool, the rest is what it flies over. The wordmark
always splits the same way: `Ai` in the console's blue (`--led-blue`, the same
color used everywhere else to mark model output) and `rcraft` in `--text-max`.
See `.brand-ai` in `frontend/src/styles.css`.

## Layout

- `backend/` — FastAPI service (analytics + RAG over the maintenance manual)
- `frontend/` — React + Vite FUI console
