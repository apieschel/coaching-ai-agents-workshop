
import "dotenv/config";


import { StringOutputParser, StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";

const parser = new StringOutputParser();

import { LlmProviderManager } from './LlmProviderManager';
const model = await LlmProviderManager.getLlmProvider();


const stream = await model.pipe(parser).stream("Who wrote the 'Harry Potter' series book?");

for await (const chunk of stream) {
  console.log(chunk);
}


