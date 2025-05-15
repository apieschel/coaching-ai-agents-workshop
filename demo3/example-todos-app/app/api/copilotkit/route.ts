import {
  CopilotRuntime,
  LangChainAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import { ChatOpenAI } from "@langchain/openai";
import { NextRequest } from 'next/server';
 
// const model = new ChatOpenAI({ model: "gpt-4o", apiKey: process.env.OPENAI_API_KEY });
// const serviceAdapter = new LangChainAdapter({
//     chainFn: async ({ messages, tools }) => {
//     return model.bindTools(tools).stream(messages);
//     // or optionally enable strict mode
//     // return model.bindTools(tools, { strict: true }).stream(messages);
//   }
// });

async function getLangChainGithubOpenAIAdapter() {
  const { LangChainAdapter } = await import("@copilotkit/runtime");
  const { ChatOpenAI } = await import("@langchain/openai");
  return new LangChainAdapter({
    chainFn: async ({ messages, tools }) => {
      const model = new ChatOpenAI({
        modelName: "gpt-4o",
        apiKey: process.env.GITHUB_OPENAI_API_KEY,
        configuration: {
          baseURL: 'https://models.inference.ai.azure.com'
        }
      }).bind(tools as any) as any;
      return model.stream(messages, { tools });
    },
  });
}

const runtime = new CopilotRuntime();
 
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: await getLangChainGithubOpenAIAdapter(),
    endpoint: '/api/copilotkit',
  });
 
  return handleRequest(req);
};