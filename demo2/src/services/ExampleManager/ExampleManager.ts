import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import inquirer from "inquirer";
import { 
  executeSimpleAgent,
  executeAgentBehavior,
  buildingBlocks,
  promptChaining,
  parallelization,
  routing,
  orchestratorWorker,
  evaluatorOptimizer,
  agent,
} from "./examples";

export enum ExampleOptions {
  SIMPLE_AGENT = '1. Simple agent',
  AGENT_BEHAVIOR = '2. Agent behavior',
  BUILDING_BLOCKS = '3. Building blocks',
  PROMPT_CHAINING = '4. Prompt chaining',
  PARALLELIZATION = '5. Parallelization',
  ROUTING = '6. Routing',
  ORCHESTRATOR_WORKER = '7. Orchestrator-Worker',
  EVALUATOR_OPTIMIZER = '8. Evaluator-optimizer',
  AGENT = '9. Agent',
}

export class ExampleManager {

  static async run(llm: BaseChatModel){
    console.log('\n====================\n');

    const userResponse = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedExample',
        message: 'Select an example to run:',
        choices: Object.values(ExampleOptions),
      },
    ]);

    switch (userResponse.selectedExample) {
      case ExampleOptions.SIMPLE_AGENT:
        await executeSimpleAgent(llm);
        break;
      case ExampleOptions.AGENT_BEHAVIOR:
        await executeAgentBehavior(llm);
        break;
      case ExampleOptions.BUILDING_BLOCKS:
        await buildingBlocks(llm);
        break;
      case ExampleOptions.PROMPT_CHAINING:
        await promptChaining(llm);
        break;
      case ExampleOptions.PARALLELIZATION:
        await parallelization(llm);
        break;
      case ExampleOptions.ROUTING:
        await routing(llm);
        break;
      case ExampleOptions.ORCHESTRATOR_WORKER:
        await orchestratorWorker(llm);
        break;
      case ExampleOptions.EVALUATOR_OPTIMIZER:
        await evaluatorOptimizer(llm);
        break;
      case ExampleOptions.AGENT:
        await agent(llm);
        break;
      default:
        throw new Error('Invalid example option');
    }
  }
}
