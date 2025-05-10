import {
  LlmProviderManager,
  LlmProvider,
} from "./LlmProviderManager/LlmProviderManager.js";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

// Lazy-loaded model to avoid top-level await
let modelInstance: BaseChatModel | null = null;

// Export the model with async initialization
export const getModel = async (): Promise<BaseChatModel> => {
  if (!modelInstance) {
    modelInstance = await LlmProviderManager.getLlmProvider(LlmProvider.Ollama);
  }
  return modelInstance;
};

// Export a proxy object that will initialize the model when needed
/* eslint-disable @typescript-eslint/no-explicit-any */
export const model = {
  async bindTools(tools: any) {
    const model = await getModel();
    if (typeof model.bindTools !== "function") {
      throw new Error("Model does not support tool binding");
    }
    return model.bindTools(tools);
  },
  async invoke(messages: any) {
    const model = await getModel();
    return model.invoke(messages);
  },
};
/* eslint-enable @typescript-eslint/no-explicit-any */
