import { CodeGenerationManager } from 'src/managers';
import { Observable } from 'rxjs';
/**
 * This is the interface for the AI client.
 * It is used to generate web content.
 * From different components, and defined props the AI client will generate the content.
 */
export interface AiClient {
  generateCode: (
    codeGenerationManager: CodeGenerationManager,
    prompt: string,
  ) => Promise<Observable<string>>;
}
