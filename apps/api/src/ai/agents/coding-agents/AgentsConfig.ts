import { Tool, tool, ToolExecutionOptions } from 'ai';
import { z } from 'zod';
import { buildEditFilePrompt, buildOrchestratorPrompt } from './prompts';
import { buildCreateFilePrompt } from './prompts/create-file';

export enum CodingAgent {
  Orchestrator = 'Orchestrator',
  CreateFile = 'CreateFile',
  // DeleteFile = 'DeleteFile',
  EditFile = 'EditFile',
  // RenameFile = 'RenameFile',
  // MoveFile = 'MoveFile',
}

export type CodingAgentsConfigType = {
  [CodingAgent.Orchestrator]: {
    requirements: string;
    codeBase: string;
    tools: never;
    toolRequired?: boolean;
    type: CodingAgent.Orchestrator;
  };
  [CodingAgent.CreateFile]: {
    codeBaseStructure: string;
    tools: BaseTools;
    type: CodingAgent.CreateFile;
    toolRequired?: boolean;
  };
  // [CodingAgent.DeleteFile]: {
  //   action: string;
  //   codeBaseStructure: string;
  [CodingAgent.EditFile]: {
    codeBaseStructure: string;
    tools: BaseTools;
    type: CodingAgent.EditFile;
    toolRequired?: boolean;
  };
  // [CodingAgent.RenameFile]: {
  //   action: string;
  //   codeBaseStructure: string;
  //   type: CodingAgent.RenameFile;
  // };
  // [CodingAgent.MoveFile]: {
  //   action: string;
  //   codeBaseStructure: string;
  //   type: CodingAgent.MoveFile;
  // };
};
export function getAgentSystemPrompt<K extends CodingAgent>(
  agentType: K,
  payload: CodingAgentsConfigType[K],
): string {
  switch (agentType) {
    case CodingAgent.Orchestrator:
      return buildOrchestratorPrompt(
        (payload as CodingAgentsConfigType[CodingAgent.Orchestrator])
          .requirements,
        (payload as CodingAgentsConfigType[CodingAgent.Orchestrator]).codeBase,
      );
    case CodingAgent.CreateFile:
      return buildCreateFilePrompt(
        (payload as CodingAgentsConfigType[CodingAgent.CreateFile])
          .codeBaseStructure,
      );
    case CodingAgent.EditFile:
      return buildEditFilePrompt(
        (payload as CodingAgentsConfigType[CodingAgent.EditFile])
          .codeBaseStructure,
      );
    default:
      throw new Error(`Unsupported agent type: ${agentType}`);
  }
}

/**
 * Configuration for tools that can be used by AI agents
 * Each tool defines its name, description, and required parameters
 */
export interface BaseTools extends Record<string, Tool> {
  'read-file': Tool;
}

export const tools = {
  'read-file': {
    name: 'Read file content',
    description: 'Read the content of a file from the codebase.',
    parameters: z.object({
      path: z
        .string()
        .describe(
          'The relative path of the file to read within the project structure. Example: "components/Button.tsx" or "lib/utils.ts"',
        ),
    }),
  },
};

/**
 * Creates a configured tool with execution capability
 *
 * @param toolKey - The key of the tool to configure from the tools object
 * @param execute - Function that implements the tool's execution logic
 * @returns A fully configured tool ready for use by an agent
 */
export const makeAgentToolsConfig = (
  toolKey: keyof typeof tools,
  execute: (
    args: z.infer<(typeof tools)[typeof toolKey]['parameters']>,
    options: ToolExecutionOptions,
  ) => Promise<unknown>,
): Tool => {
  const toolConfig = tools[toolKey];
  return tool({
    ...toolConfig,
    execute,
  });
};
