import { MemorySaver } from "@langchain/langgraph";

/**
 * In-memory checkpointer. This gives you thread-scoped persistence
 * (pause/resume, "remember what CV was uploaded", etc.) for as long as
 * the server process lives. It is NOT shared across serverless instances
 * or survives a restart/deploy.
 *
 * When you're ready for real persistence, swap this for
 * @langchain/langgraph-checkpoint-postgres (PostgresSaver) or
 * @langchain/langgraph-checkpoint-sqlite — the graph code does not change,
 * only this file does.
 */
let _checkpointer;

export function getCheckpointer() {
  if (!_checkpointer) {
    _checkpointer = new MemorySaver();
  }
  return _checkpointer;
}
