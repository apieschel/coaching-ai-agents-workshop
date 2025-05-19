import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { StateGraph, Annotation } from "@langchain/langgraph";
import MermaidGraph from "../../MermaidGraph/MermaidGraph";
import { END, START } from "@langchain/langgraph";

export async function parallelization(llm: BaseChatModel) {
  // Graph state
  const StateAnnotation = Annotation.Root({
    topic: Annotation<string>,
    joke: Annotation<string>,
    story: Annotation<string>,
    poem: Annotation<string>,
    combinedOutput: Annotation<string>,
  });

  // Nodes
  // First LLM call to generate initial joke
  async function callLlm1(state: typeof StateAnnotation.State) {
    const msg = await llm.invoke(`Write a joke about ${state.topic}`);
    return { joke: msg.content };
  }

  // Second LLM call to generate story
  async function callLlm2(state: typeof StateAnnotation.State) {
    const msg = await llm.invoke(`Write a story about ${state.topic}`);
    return { story: msg.content };
  }

  // Third LLM call to generate poem
  async function callLlm3(state: typeof StateAnnotation.State) {
    const msg = await llm.invoke(`Write a poem about ${state.topic}`);
    return { poem: msg.content };
  }

  // Combine the joke, story and poem into a single output
  async function aggregator(state: typeof StateAnnotation.State) {
    const combined = `Here's a story, joke, and poem about ${state.topic}!\n\n` +
      `STORY:\n${state.story}\n\n` +
      `JOKE:\n${state.joke}\n\n` +
      `POEM:\n${state.poem}`;
    return { combinedOutput: combined };
  }

  // Build workflow
  const parallelWorkflow = new StateGraph(StateAnnotation)
    .addNode("callLlm1", callLlm1)
    .addNode("callLlm2", callLlm2)
    .addNode("callLlm3", callLlm3)
    .addNode("aggregator", aggregator)
    .addEdge(START, "callLlm1")
    .addEdge(START, "callLlm2")
    .addEdge(START, "callLlm3")
    .addEdge("callLlm1", "aggregator")
    .addEdge("callLlm2", "aggregator")
    .addEdge("callLlm3", "aggregator")
    .addEdge("aggregator", END)
    .compile();

  // Draw the agent graph
  await MermaidGraph.drawMermaidByConsole(parallelWorkflow);

  // Draw the graph
  parallelWorkflow.name = "parallelWorkflow";
  await MermaidGraph.drawMermaidAsImage(parallelWorkflow);

  // Invoke
  const result = await parallelWorkflow.invoke({ topic: "cats" });
  console.log(result.combinedOutput);
}
