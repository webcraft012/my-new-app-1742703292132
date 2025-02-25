// import { openai } from '@ai-sdk/openai'; // Ensure OPENAI_API_KEY environment variable is set
// import { generateObject, generateText, LanguageModelV1, Tool } from 'ai';
// import { z } from 'zod';

// interface AgentConfig {
//   id: string;
//   model: LanguageModelV1;
//   name: string;
//   description: string;
//   instructions: string;
//   tools?: (AgentTool | AgentType)[];
//   parameters?: z.ZodObject<any>;
// }

// interface AgentTool {
//   type: 'tool';
//   name: string;
//   tool: Tool;
// }

// interface AgentType {
//   type: 'agent';
//   agent: Agent;
// }

// export class Agent {
//   constructor(private readonly agentConfig: AgentConfig) {}

//   async run() {
//     return generateText({
//       model: this.agentConfig.model,
//       tools: this.getTools(),
//     });
//   }

//   private getTools(): Record<string, Tool> | undefined {
//     if (!this.agentConfig.tools || this.agentConfig.tools.length === 0) {
//       return undefined;
//     }

//     const tools = this.agentConfig.tools.reduce(
//       (acc, tool) => {
//         if (tool.type === 'tool') {
//           return { ...acc, [tool.name]: tool.tool };
//         }
//       },
//       {} as Record<string, Tool>,
//     );
//     const agents = this.agentConfig.tools.filter(
//       (tool) => tool.type === 'agent',
//     );

//     const dedicatedToolsForAgents = agents.reduce(
//       (acc, { agent }) => {
//         return { ...acc, ...this.createDedicatedToolsForAgent(agent) };
//       },
//       {} as Record<string, Tool>,
//     );

//     return { ...tools, ...dedicatedToolsForAgents };
//   }

//   createDedicatedToolsForAgent(agent: Agent): Record<string, Tool> {
//     const transferAgentConfig = agent.getAgentConfig();

//     const defaultTransferPrompt = `
//      A tool to transfer responsibility to the ${transferAgentConfig.id} agent.
//     `;

//     return {
//       [transferAgentConfig.name]: {
//         parameters: transferAgentConfig.parameters,
//         description: `
//       ${defaultTransferPrompt}
//       ${transferAgentConfig.instructions}
//       `,
//         execute: async (input) => {
//           return agent.run();
//         },
//       },
//     };
//   }

//   public getAgentConfig() {
//     return this.agentConfig;
//   }
// }
