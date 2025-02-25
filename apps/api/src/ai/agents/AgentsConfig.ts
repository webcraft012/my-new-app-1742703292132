import {
  componentAgentPrompt,
  componentAgentSchema,
  masterAgentPrompt,
  masterAgentSchema,
  pageStructureAgentPrompt,
  pageStructureAgentSchema,
  sectionAgentPrompt,
  uiAgentPrompt,
  uiAgentSchema,
} from './promptsv2';

export enum AgentType {
  Master = 'Master',
  Ui = 'Ui',
  Page = 'Page',
  Section = 'Section',
  Component = 'Component',
}

export type AgentsConfigType = {
  [AgentType.Master]: {
    systemPrompt: string;
    outputSchema: typeof masterAgentSchema;
  };
  [AgentType.Ui]: {
    systemPrompt: string;
    outputSchema: typeof uiAgentSchema;
  };
  [AgentType.Page]: {
    systemPrompt: string;
    outputSchema: typeof pageStructureAgentSchema;
  };
  [AgentType.Section]: {
    systemPrompt: string;
    outputSchema: typeof uiAgentSchema; // or a dedicated section schema if available
  };
  [AgentType.Component]: {
    systemPrompt: string;
    outputSchema: typeof componentAgentSchema;
  };
};

export const agentsConfig: AgentsConfigType = {
  [AgentType.Master]: {
    systemPrompt: masterAgentPrompt,
    outputSchema: masterAgentSchema,
  },
  [AgentType.Ui]: {
    systemPrompt: uiAgentPrompt,
    outputSchema: uiAgentSchema,
  },
  [AgentType.Page]: {
    systemPrompt: pageStructureAgentPrompt,
    outputSchema: pageStructureAgentSchema,
  },
  [AgentType.Section]: {
    systemPrompt: sectionAgentPrompt,
    outputSchema: uiAgentSchema,
  },
  [AgentType.Component]: {
    systemPrompt: componentAgentPrompt,
    outputSchema: componentAgentSchema,
  },
};
