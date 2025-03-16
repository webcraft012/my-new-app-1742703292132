import * as dotenv from 'dotenv';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { FileManager } from 'src/managers/file-manager';
import { parseXmlTags, TagTypes } from 'src/utils/tags-parser';
import { AgentFactory } from '../agents/AgentFactory';
import { codeAgent } from '../agents/agents/MasterAgent';
import { AgentType } from '../agents/AgentsConfig';
import { AiClient as AiClientInterface } from '../interfaces/AiClient';
// Load environment variables
dotenv.config();

export class AiClient implements AiClientInterface {
  constructor(apiKey: string) {}

  async generateCode(codeBase: string, prompt: string): Promise<string> {
    const result = await codeAgent(codeBase, prompt);
    return result.text;
  }

  async generateContent(): Promise<any> {
    console.log('Generating content...');

    const appConfig = await AgentFactory.createAgent(AgentType.Master)
      .setPrompt(
        'Please make an app that handle Budgeting and Expense Tracking',
      )
      .run();
    console.log('Config generated...');
    const ui = await AgentFactory.createAgent(AgentType.Ui)
      .setPrompt(JSON.stringify(appConfig))
      .run();
    console.log('UI config generated...');

    const pageStructures: any[] = [];
    for (const page of ui.pages) {
      const pageStructure = await AgentFactory.createAgent(AgentType.Page)
        .setPrompt(JSON.stringify(page))
        .run();
      console.log('Page structure generated...');
      pageStructures.push(pageStructure);
    }
    return pageStructures;
  }
}
