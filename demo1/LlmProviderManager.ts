import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { Embeddings } from "@langchain/core/embeddings";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { AzureOpenAIEmbeddings, ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import inquirer from "inquirer";
import { initChatModel } from "langchain/chat_models/universal";

export enum LlmProvider {
  Ollama = 'ollama',
  OpenAI = 'openai',
  Github = 'github',
  Azure = 'azure',
  Anthropic = 'anthropic',
  Bedrock = 'bedrock',
}

export class LlmProviderManager {
  static async getLlmProvider(llmProvider: LlmProvider = LlmProvider.Github): Promise<BaseChatModel> {
    switch (llmProvider) {

      case LlmProvider.Ollama:
        console.log('OLLAMA_BASE_URL', process.env.OLLAMA_BASE_URL);
        console.log('OLLAMA_MODEL_NAME', process.env.OLLAMA_MODEL_NAME);
        console.log('OLLAMA_TEMPERATURE', process.env.OLLAMA_TEMPERATURE);
        return new ChatOllama({
          model: process.env.OLLAMA_MODEL_NAME,
          temperature: parseFloat(process.env.OLLAMA_TEMPERATURE ?? '0.1'),
          baseUrl: process.env.OLLAMA_BASE_URL,
        });

      case LlmProvider.OpenAI:
        console.log('OPENAI_MODEL_NAME', process.env.OPENAI_MODEL_NAME);
        console.log('OPENAI_TEMPERATURE', process.env.OPENAI_TEMPERATURE);
        return new ChatOpenAI({
          model: process.env.OPENAI_MODEL_NAME,
          temperature: parseFloat(process.env.OPENAI_TEMPERATURE ?? '0.1'),
        });

      case LlmProvider.Github:
        console.log('GITHUB_MODEL_NAME', process.env.GITHUB_MODEL_NAME);
        console.log('GITHUB_TEMPERATURE', process.env.GITHUB_TEMPERATURE);
        return new ChatOpenAI({
          modelName: process.env.GITHUB_MODEL_NAME,
          apiKey: process.env.GITHUB_OPENAI_API_KEY,
          temperature: parseFloat(process.env.GITHUB_TEMPERATURE ?? '0.1'),
          configuration: {
            baseURL: "https://models.inference.ai.azure.com"
          }
        });
      case LlmProvider.Azure:
        console.log('AZURE_OPENAI_API_DEPLOYMENT_NAME', process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME);
        console.log('AZURE_OPENAI_TEMPERATURE', process.env.AZURE_OPENAI_TEMPERATURE);
        return await initChatModel(process.env.AZURE_OPENAI_MODEL_NAME, {
          modelProvider: "azure_openai",
          temperature: parseFloat(process.env.AZURE_OPENAI_TEMPERATURE ?? '0.1'),
        });

      case LlmProvider.Anthropic:
        console.log('ANTHROPIC_MODEL_NAME', process.env.ANTHROPIC_MODEL_NAME);
        console.log('ANTHROPIC_TEMPERATURE', process.env.ANTHROPIC_TEMPERATURE);
        return new ChatAnthropic({
          model: process.env.ANTHROPIC_MODEL_NAME,
          temperature: parseFloat(process.env.ANTHROPIC_TEMPERATURE ?? '0.1'),
        });

      case LlmProvider.Bedrock:
        console.log('BEDROCK_MODEL_NAME', process.env.BEDROCK_MODEL_NAME);
        console.log('BEDROCK_TEMPERATURE', process.env.BEDROCK_TEMPERATURE);
        return new BedrockChat({
          model: process.env.BEDROCK_MODEL_NAME,
          temperature: parseFloat(process.env.BEDROCK_TEMPERATURE ?? '0.1'),
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
            sessionToken: process.env.AWS_SESSION_TOKEN,
          }
        });
        
      default:
        throw new Error(`Unsupported LLM provider: ${llmProvider}`);
    }
  }

  static async getEmbeddingsProvider(llmProvider: LlmProvider = LlmProvider.Github): Promise<Embeddings> {
    switch (llmProvider) {

      case LlmProvider.Ollama:
        // must download the model from https://huggingface.co/ollama/nomic-embed-text
        // run : ollama pull nomic-embed-text
        console.log('OLLAMA_EMBEDDINGS_MODEL_NAME', process.env.OLLAMA_EMBEDDINGS_MODEL_NAME);
        return new OllamaEmbeddings({
          model: process.env.OLLAMA_EMBEDDINGS_MODEL_NAME,
        });

      case LlmProvider.OpenAI:
        console.log('OPENAI_EMBEDDINGS_MODEL_NAME', process.env.OPENAI_EMBEDDINGS_MODEL_NAME);
        return new OpenAIEmbeddings({
          model: process.env.OPENAI_EMBEDDINGS_MODEL_NAME,
        });

      case LlmProvider.Github:
        console.log('GITHUB_OPENAI_API_EMBEDDINGS_MODEL_NAME', process.env.GITHUB_OPENAI_API_EMBEDDINGS_MODEL_NAME);
        return new OpenAIEmbeddings({
          model: process.env.GITHUB_OPENAI_API_EMBEDDINGS_MODEL_NAME,
          apiKey: process.env.GITHUB_OPENAI_API_KEY,
          configuration: {
            baseURL: "https://models.inference.ai.azure.com"
          }
        });

      case LlmProvider.Azure:
        console.log('AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME', process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME);
        return new AzureOpenAIEmbeddings({
          model: process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
        });

      case LlmProvider.Anthropic:
        throw new Error(`Anthropic is not supported yet`);

      case LlmProvider.Bedrock:
        throw new Error(`Bedrock is not supported yet`);
        
      default:
        throw new Error(`Unsupported LLM provider: ${llmProvider}`);
    }
  }

  static async selectLlmProviderFromUser(): Promise<BaseChatModel> {
    console.log('\n====================\n');

    const userResponse = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedProvider',
        message: 'Select the LLM provider:',
        choices: Object.values(LlmProvider),
      },
    ]);

    return LlmProviderManager.getLlmProvider(userResponse.selectedProvider);
  }
}