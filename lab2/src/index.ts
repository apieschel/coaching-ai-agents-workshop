// LangGraph Agent Example using LangChain Tools and StateGraph
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

import { Calculator } from "@langchain/community/tools/calculator";
import { z } from "zod";
import { tool } from "@langchain/core/tools";

//#region model
import {
  LlmProviderManager,
  LlmProvider,
} from "./LlmProviderManager/LlmProviderManager.js";

const model = await LlmProviderManager.getLlmProvider(LlmProvider.Github);

//#endregion model

const webSearchTool = new TavilySearch({
  maxResults: 4,
});

//#region tools
const todayDateTimeSchema = z.object({
  timeZone: z.string().describe("Time Zone Format"),
  locale: z.string().describe("Locale string"),
});

function getTodayDateTime({
  timeZone,
  locale,
}: {
  timeZone: string;
  locale: string;
}) {
  //const timeZone = 'America/Chicago';
  //const locale = 'en-US';
  console.log("Getting today's date and time in " + timeZone + " timezone");
  const today = new Date();
  const formattedDate = today.toLocaleString(locale, {
    timeZone: timeZone,
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const result = {
    formattedDate: formattedDate,
    timezone: timeZone,
  };
  console.log(result);
  return JSON.stringify(result);
}

const dateTool = tool(
  ({ timeZone, locale }) => {
    return getTodayDateTime({ timeZone, locale });
  },
  {
    name: "todays_date_time",
    description: "Useful to get current day, date and time.",
    schema: todayDateTimeSchema,
  },
);

//console.log(await dateTool.invoke({timeZone: 'America/New_York', locale: 'en-US'}));

const calculator = new Calculator();
const tools = [dateTool, calculator, webSearchTool];
const toolNode = new ToolNode(tools);
//#endregion

const callModel = async (state: typeof MessagesAnnotation.State) => {
  const { messages } = state;
  // Ensure model is defined and has bindTools method
  if (!model || typeof model.bindTools !== "function") {
    throw new Error(
      "Model is not properly initialized or does not support tool binding",
    );
  }
  const llmWithTools = model.bindTools(tools);
  const result = await llmWithTools.invoke(messages);
  return { messages: [result] };
};

//#region workflow
const shouldContinue = (state: typeof MessagesAnnotation.State) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];
  if (
    lastMessage._getType() !== "ai" ||
    !(lastMessage as AIMessage).tool_calls?.length
  ) {
    return END;
  }
  return "tools";
};

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge(START, "agent")
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", shouldContinue, ["tools", END]);

export const graph = workflow.compile({
  // Memory saver for local execution and state persistence
  checkpointer: new MemorySaver(),
});
graph.name = graph.name ?? "default_graph";
//#endregion workflow


//#region execution
// Create main function to execute the code
import MermaidGraph from "./MermaidGraph/MermaidGraph.js";
async function main() {
  try {
    // Draw the agent graph
    graph.name = "agent";
    await MermaidGraph.drawMermaidAsImage(graph);

    const config = { configurable: { thread_id: "1", userId: "1" } };
    const agentFinalState = await graph.invoke(
      {
        messages: [
          new HumanMessage("what is the current time and weather in Dallas?"),
        ],
      },
      config,
    );

    console.log(
      //agentFinalState.messages
      agentFinalState.messages[agentFinalState.messages.length - 1].content,
    );

    const agentNextState = await graph.invoke(
      { messages: [new HumanMessage("what about San Diego?")] },
      config,
    );

    console.log(
      agentNextState.messages[agentNextState.messages.length - 1].content,
    );
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Call the main function
main().catch((error) => console.error("Error in main:", error));
//#endregion execution
