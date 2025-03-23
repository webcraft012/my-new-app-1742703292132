import { ICodeSandBox } from 'src/ai/interfaces/CodeSandBox';
import { CodeSandBox } from './CodeSandBox';
import { AwsSandbox } from './aws/sandbox';

export class CodeSandBoxFactory {
  static createCodeSandBox(
    provider: 'aws' | 'codesandbox',
    appName: string,
    repoUrl?: string,
  ): ICodeSandBox {
    if (provider === 'aws') {
      return new AwsSandbox(appName, repoUrl);
    }
    return new CodeSandBox(appName, repoUrl);
  }
}
