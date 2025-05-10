import "dotenv/config";
import { WebBrowser } from "langchain/tools/webbrowser";


import { LlmProviderManager } from './LlmProviderManager';
const model = await LlmProviderManager.getLlmProvider();
const embeddings = await LlmProviderManager.getEmbeddingsProvider();

export async function run() {

  const browser = new WebBrowser({ model, embeddings });

  const result = await browser.invoke(
    `"https://www.britannica.com/topic/Harry-Potter","who is harry potter"`
  );

  console.log(result);
}

run();