import { ToolNode } from "@langchain/langgraph/prebuilt";
import {
  END,
  MemorySaver,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { TavilySearch } from "@langchain/tavily";

import { model } from "./model.js";

//#region tools
const webSearchTool = new TavilySearch({
  maxResults: 4,
});
const tools = [webSearchTool];

const toolNode = new ToolNode(tools);
//#endregion

//#region model
const callModel = async (state: typeof MessagesAnnotation.State) => {
  const { messages } = state;

  // Ensure model is defined and has bindTools method
  if (!model || typeof model.bindTools !== "function") {
    throw new Error(
      "Model is not properly initialized or does not support tool binding",
    );
  }

  try {
    // Handle the asynchronous bindTools result
    const llmWithTools = await model.bindTools(tools);
    const result = await llmWithTools.invoke(messages);
    return { messages: [result] };
  } catch (error) {
    console.error("Error calling model:", error);
    throw error;
  }
};
//#endregion

//#region conditionals
const shouldContinue = (state: typeof MessagesAnnotation.State) => {
  const { messages } = state;

  const lastMessage = messages[messages.length - 1];
  if (
    lastMessage._getType() !== "ai" ||
    !(lastMessage as AIMessage).tool_calls?.length
  ) {
    // LLM did not call any tools, or it's not an AI message, so we should end.
    return END;
  }
  return "tools";
};
//#endregion

/**
 * MessagesAnnotation is a pre-built state annotation imported from @langchain/langgraph.
 * It is the same as the following annotation:
 *
 * ```typescript
 * const MessagesAnnotation = Annotation.Root({
 *   messages: Annotation<BaseMessage[]>({
 *     reducer: messagesStateReducer,
 *     default: () => [systemMessage],
 *   }),
 * });
 * ```
 */

//#region graph
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge(START, "agent")
  .addNode("tools", toolNode)
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", shouldContinue, ["tools", END]);

export const graph = workflow.compile({
  // The LangGraph Studio/Cloud API will automatically add a checkpointer
  // only uncomment if running locally
  checkpointer: new MemorySaver(),
});
// Ensure graph.name is always a string to avoid TypeScript error
graph.name = graph.name ?? "graph";

//#endregion

//#region draw graph
import { saveGraphAsImage } from "./drawGraph.js";
// Instead of top-level await, we'll create a function
//#endregion

// Main function to handle async operations
async function main() {
  try {
    await saveGraphAsImage(graph);

    // Now it's time to use!
    const config = { configurable: { thread_id: "1", userId: "1" } };
    const agentFinalState = await graph.invoke(
      { messages: [new HumanMessage("what is the current weather in sf")] },
      { ...config, debug: true },
    );

    console.log(
      agentFinalState.messages[agentFinalState.messages.length - 1].content,
    );

    const agentNextState = await graph.invoke(
      { messages: [new HumanMessage("what about ny")] },
      { ...config, debug: true },
    );

    console.log(
      agentNextState.messages[agentNextState.messages.length - 1].content,
    );
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Call the main function to execute the code
main().catch((error) => console.error("Error in main:", error));
