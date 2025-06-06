import 'dotenv/config';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { StateGraph, Annotation } from "@langchain/langgraph";
import MermaidGraph from "../../MermaidGraph/MermaidGraph";
import { END, START } from "@langchain/langgraph";
export async function promptChaining(llm: BaseChatModel) {
  // Graph state
  const StateAnnotation = Annotation.Root({
    topic: Annotation<string>,
    joke: Annotation<string>,
    improvedJoke: Annotation<string>,
    finalJoke: Annotation<string>,
  });
  
  // Define node functions
  
  // First LLM call to generate initial joke
  async function generateJoke(state: typeof StateAnnotation.State) {
    const msg = await llm.invoke(`Write a short joke about ${state.topic}`);
    return { joke: msg.content };
  }
  
  // Gate function to check if the joke has a punchline
  function checkPunchline(state: typeof StateAnnotation.State) {
    // Simple check - does the joke contain "?" or "!"
    if (state.joke?.includes("?") || state.joke?.includes("!")) {
      return "Pass";
    }
    return "Fail";
  }
  
    // Second LLM call to improve the joke
  async function improveJoke(state: typeof StateAnnotation.State) {
    const msg = await llm.invoke(
      `Make this joke funnier by adding wordplay: ${state.joke}`
    );
    return { improvedJoke: msg.content };
  }
  
  // Third LLM call for final polish
  async function polishJoke(state: typeof StateAnnotation.State) {
    const msg = await llm.invoke(
      `Add a surprising twist to this joke: ${state.improvedJoke}`
    );
    return { finalJoke: msg.content };
  }
  
  // Build workflow
  const chain = new StateGraph(StateAnnotation)
    .addNode("generateJoke", generateJoke)
    .addNode("improveJoke", improveJoke)
    .addNode("polishJoke", polishJoke)
    .addEdge(START, "generateJoke")
    .addConditionalEdges("generateJoke", checkPunchline, {
      Pass: "improveJoke",
      Fail: END
    })
    .addEdge("improveJoke", "polishJoke")
    .addEdge("polishJoke", END)
    .compile();

  // Draw the agent graph
  await MermaidGraph.drawMermaidByConsole(chain);

  // Draw the graph
  chain.name = "promptChaining";
  await MermaidGraph.drawMermaidAsImage(chain);
  
  // Invoke
  const state = await chain.invoke({ topic: "cats" });
  console.log("Initial joke:");
  console.log(state.joke);
  console.log("\n--- --- ---\n");
  if (state.improvedJoke !== undefined) {
    console.log("Improved joke:");
    console.log(state.improvedJoke);
    console.log("\n--- --- ---\n");
  
    console.log("Final joke:");
    console.log(state.finalJoke);
  } else {
    console.log("Joke failed quality gate - no punchline detected!");
  }
}
