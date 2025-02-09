import OpenAI from 'openai';
import { AiClient as AiClientInterface } from '../interfaces/AiClient';
import { z } from 'zod';
import { UIElementSchema } from '../ui-config';
import { zodResponseFormat } from 'openai/helpers/zod';

export class AiClient implements AiClientInterface {
  private readonly client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
    });
  }

  async generateContent(
    uiConfig: z.infer<typeof UIElementSchema>,
  ): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: `You are a UI generator AI that creates structured component hierarchies using **EXACT** Tailwind class strings. Follow these strict rules:
        
        ### 1. Component Structure:
        - **Hierarchy:** \`container > row > column > elements\`
        - **Valid Types:** \`container\`, \`row\`, \`column\`, \`button\`, \`text\`, \`image\`
        - **Parent-Child Rules:**
          - \`container\` → **only** contains \`row\`
          - \`row\` → **only** inside \`container\`, **must** have at least one \`column\`
          - \`column\` → **only** inside \`row\`, **must** have exactly one child
          - \`column\` children → **only** \`button\`, \`text\`, or a nested \`container\`
          - **To add multiple children to a \`column\`, wrap them inside a new \`container\`**
        
        ### 2. Tailwind Class Usage:
        - **Use full Tailwind class strings** – do not abbreviate or concatenate.
        - **Separate related utilities into different props** (except for \`transition\`).
        - **Examples:**
          - ✅ \`"px": "px-6", "py": "py-3"\` (Correct)
          - ❌ \`"p": "px-6 py-3"\` (Wrong)
          - ✅ \`"text": "text-3xl", "font": "font-extrabold", "textColor": "text-gray-900", "sm:text": "sm:text-4xl"\`
          - ❌ \`"text": "text-3xl font-extrabold text-gray-900 sm:text-4xl"\`
        
        ### 3. State & Interaction:
        - Use nested props for states:
          \`\`\`json
          {
            "hover": { "bg": "bg-blue-600" },
            "focus": { "ring": "ring-2" },
            "active": { "transform": "scale-95" }
          }
          \`\`\`
        
        ### 4. Example of **Correct Output**:
        \`\`\`json
        {
          "type": "container",
          "props": {
            "p": "p-8",
            "bg": "bg-slate-50",
            "hover": { "bg": "bg-slate-100" }
          },
          "children": [
            {
              "type": "row",
              "props": {
                "flexDirection": "flex-row",
                "justifyContent": "justify-between",
                "gap": "gap-6"
              },
              "children": [
                {
                  "type": "column",
                  "props": { "borderRadius": "rounded-xl", "shadow": "shadow-lg" },
                  "children": [
                    {
                      "type": "button",
                      "text": "Click me",
                      "props": {
                        "bg": "bg-blue-500",
                        "textColor": "text-white",
                        "hover": { "bg": "bg-blue-600" }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
        \`\`\`
        
        ### 5. Invalid Output Examples (Must **Not** Return):

        ❌ **Incorrect Hierarchy:**
        (Column cannot have multiple children)

       \`\`\`json
        {
          "type": "column",
          "children": [{ "type": "text" }, { "type": "text" }]
        }
        \`\`\`
        
        ❌ **Incorrect Hierarchy:**
        \`\`\`json
        {
          "type": "column", 
          "children": [{ "type": "row" }] 
        } 
        \`\`\`
        (Row cannot be inside a \`column\`)
        
        ❌ **Incorrect Class Formatting:**
        \`\`\`json
        {
          "type": "button",
          "props": { "class": "px-6 py-3 bg-blue-500 text-white" }
        } 
        \`\`\`
        (Props should be separate: \`"px": "px-6", "py": "py-3", "bg": "bg-blue-500"\`)
        
        ### 6. Critical Guidelines:
        - **Do NOT use numeric values** (e.g., \`"w": "100"\` ❌ → \`"w": "w-full"\` ✅).
        - **Use only official Tailwind class names**.
        - **Ensure accessibility** where applicable (e.g., \`"focus:outline-none focus:ring-2"\`).
        - **Include responsive variants first** (e.g., \`"md:w-1/2"\` before \`"w-1/2"\`).
        
        Strictly follow these rules and return **only valid** JSON structures.`,
        },
        {
          role: 'user',
          content:
            'Make Modern Home section where you present a renting car company. Make it modern and beautiful. use modern Colors',
        },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    const ui = completion.choices?.[0]?.message?.content;

    return ui;
  }
}
