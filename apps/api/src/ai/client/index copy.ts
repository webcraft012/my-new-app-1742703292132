import { exec, execSync, spawn } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';
import OpenAI from 'openai';
import os from 'os';
import path from 'path';
import { AiClient as AiClientInterface } from '../interfaces/AiClient';

// Load environment variables from .env file
dotenv.config();

export class AiClient implements AiClientInterface {
  private readonly client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
    });
  }

  async generateCode(codeBase: string, prompt: string): Promise<string> {
    return 'test';
  }

  async generateContent(): Promise<any> {
    // const appConfig = await AgentFactory.createAgent(AgentType.Master)
    //   .setPrompt(
    //     'Please make an app that handle Budgeting and Expense Tracking',
    //   )
    //   .run();
    // console.log('Config generated...');
    // const ui = await AgentFactory.createAgent(AgentType.Ui)
    //   .setPrompt(JSON.stringify(appConfig))
    //   .run();
    // JSON.stringify(appConfig), console.log('UI config generated...');

    const tmpDir = os.tmpdir();
    const repoName = 'preconfigured-nextjs-app';
    const projectPath = path.join(tmpDir, repoName);

    // Clean the directory if it exists already
    if (fs.existsSync(projectPath)) {
      fs.rmSync(projectPath, { recursive: true, force: true });
    }

    console.log(`Generating Next.js app in: ${projectPath}`);

    // Step 1: Create a new Next.js app with TypeScript and ESLint (specifically v14)
    execSync(
      `CI=true npx create-next-app@14 ${projectPath} --ts --eslint --no-app --src-dir --no-experimental-app`,
      {
        stdio: 'inherit',
      },
    );

    console.log('Installing dependencies...');

    // Step 2: Install only necessary dependencies (Tailwind CSS, PostCSS, and Autoprefixer)
    // execSync(
    //   `cd ${projectPath} && npm install tailwindcss@latest postcss@latest`,
    //   { stdio: 'inherit' },
    // );

    // // Step 3: Initialize Tailwind CSS configuration files
    // execSync(`cd ${projectPath} && CI=true npx tailwindcss init -p`, {
    //   stdio: 'inherit',
    // });

    console.log('Starting the app in the background...');

    const port = 3013;

    // Start `pnpm dev` in the background
    // First build the app
    execSync('pnpm build', {
      cwd: projectPath,
      stdio: 'inherit',
    });

    // Then start it on the specified port
    const appProcess = spawn('pnpm', ['start', '--port', port.toString()], {
      cwd: projectPath, // Use projectPath instead of path
      detached: true, // Run in background
      stdio: 'inherit', // Ignore output (or use 'inherit' to see logs)
    });

    appProcess.unref(); // Allows process to continue after script exits

    console.log('App started successfully!');
    // wait for 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log('Starting Ngrok...');

    let publicUrl = null;

    try {
      // Use a direct approach with exec instead of the ngrok package
      // First, make sure ngrok is installed
      try {
        execSync('which ngrok || npm install -g ngrok', { stdio: 'inherit' });
      } catch (error) {
        console.log('Installing ngrok globally...');
        execSync('npm install -g ngrok', { stdio: 'inherit' });
      }

      // Start ngrok directly and capture its output to get the URL
      const ngrokProcess = exec(
        `ngrok config add-authtoken ${process.env.NGROK_AUTH_TOKEN} && ngrok http ${port} --log=stdout`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Ngrok exec error: ${error}`);
            return;
          }
        },
      );

      // Wait for ngrok to start and extract the URL from its output
      await new Promise((resolve) => {
        let dataBuffer = '';

        ngrokProcess.stdout?.on('data', (data) => {
          dataBuffer += data.toString();

          // Look for the URL in the output with a more robust pattern
          // This will match both older ngrok.io and newer ngrok-free.app formats
          const urlMatch = dataBuffer.match(
            /url=(https:\/\/[a-z0-9-]+\.(ngrok\.io|ngrok-free\.app))/i,
          );
          if (urlMatch) {
            publicUrl = urlMatch[1]; // Use capture group to get just the URL
            console.log(`Public URL: ${publicUrl}`);
            resolve(true);
          }
        });

        // Set a timeout in case we can't find the URL
        setTimeout(() => {
          console.log('Timed out waiting for ngrok URL');
          resolve(false);
        }, 10000);
      });

      // If we couldn't get the URL from stdout, try using the API directly
      if (!publicUrl) {
        console.log('Trying alternative method to get ngrok URL...');
        try {
          const response = await fetch('http://127.0.0.1:4040/api/tunnels');
          const data = await response.json();
          publicUrl = data.tunnels[0]?.public_url;
          if (publicUrl) {
            console.log(`Public URL (alternative method): ${publicUrl}`);
          }
        } catch (apiError) {
          console.error('Failed to get ngrok URL from API:', apiError);
        }
      }
    } catch (error) {
      console.error('Failed to start ngrok:', error);
      console.log('Continuing without public URL...');
    }

    // Wait a few seconds for app to fully initialize
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const tailwindConfigPath = path.join(projectPath, 'tailwind.config.js');
    const tailwindConfigContent = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;
    fs.writeFileSync(tailwindConfigPath, tailwindConfigContent);
    console.log(projectPath);
    return 'ui';

    // const completion = await this.client.chat.completions.create({
    //   model: 'google/gemini-2.0-pro-exp-02-05:free',
    //   messages: [
    //     {
    //       role: 'system',
    //       content: `You are a UI generator AI that creates structured component hierarchies using **EXACT** Tailwind class strings. Follow these strict rules:

    //     ### 1. Component Structure:
    //     - **Hierarchy:** \`container > row > column > elements\`
    //     - **Valid Types:** \`container\`, \`row\`, \`column\`, \`button\`, \`text\`, \`workplace\`, \`image\`
    //     - **Parent-Child Rules:**
    //       - You must always start with \`workplace\` as the root element
    //       - \`container\` → **only** contains \`row\`
    //       - \`row\` → **only** inside \`container\`, **must** have at least one \`column\`
    //       - \`column\` → **only** inside \`row\`, **must** have exactly one child
    //       - \`column\` children → **only** \`button\`, \`text\`, or a nested \`container\`
    //       -- use \`textContent\` to set the text content of an element
    //       - **To add multiple children to a \`column\`, wrap them inside a new \`container\`**

    //     ### 2. Tailwind Class Usage:
    //     - **Use full Tailwind class strings** – do not abbreviate or concatenate.
    //     - **Separate related utilities into different props** (except for \`transition\`).
    //     - ** do not use responsive classes like \`sm:text\` or \`md:text\` ...**
    //     - **Examples:**
    //       - ✅ \`"px": "px-6", "py": "py-3"\` (Correct)
    //       - ❌ \`"p": "px-6 py-3"\` (Wrong)
    //       - ✅ \`"text": "text-3xl", "font": "font-extrabold", "textColor": "text-gray-900""\`
    //       - ❌ \`"text": "text-3xl font-extrabold text-gray-900"\`

    //     ### 3. State & Interaction:
    //     - Use nested props for states:
    //       \`\`\`json
    //       {
    //         "hover": { "bg": "bg-blue-600" },
    //         "focus": { "ring": "ring-2" },
    //         "active": { "transform": "scale-95" }
    //       }
    //       \`\`\`

    //     ### 4. Example of **Correct Output**:
    //     \`\`\`json
    //     {
    //       "type": "container",
    //       "props": {
    //         "p": "p-8",
    //         "bg": "bg-slate-50",
    //         "hover": { "bg": "bg-slate-100" }
    //       },
    //       "children": [
    //         {
    //           "type": "row",
    //           "props": {
    //             "flexDirection": "flex-row",
    //             "justifyContent": "justify-between",
    //             "gap": "gap-6"
    //           },
    //           "children": [
    //             {
    //               "type": "column",
    //               "props": { "borderRadius": "rounded-xl", "shadow": "shadow-lg" },
    //               "children": [
    //                 {
    //                   "type": "button",
    //                   "textContent": "Click me",
    //                   "props": {
    //                     "bg": "bg-blue-500",
    //                     "textColor": "text-white",
    //                     "hover": { "bg": "bg-blue-600" }
    //                   }
    //                 }
    //               ]
    //             },
    //             {
    //               "type": "column",
    //               "props": { "borderRadius": "rounded-xl", "shadow": "shadow-lg" },
    //               "children": [
    //                 {
    //                   "type": "text",
    //                   "textContent": "Click me",
    //                   "props": {
    //                     "fontSize": "text-2xl",
    //                     "textColor": "text-gray-500",
    //                   }
    //                 }
    //               ]
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //     \`\`\`

    //     ### 5. Invalid Output Examples (Must **Not** Return):

    //     ❌ **Incorrect Hierarchy:**
    //     (Column cannot have multiple children)

    //    \`\`\`json
    //     {
    //       "type": "column",
    //       "children": [{ "type": "text" }, { "type": "text" }]
    //     }
    //     \`\`\`

    //     ❌ **Incorrect Hierarchy:**
    //     \`\`\`json
    //     {
    //       "type": "column",
    //       "children": [{ "type": "row" }]
    //     }
    //     \`\`\`
    //     (Row cannot be inside a \`column\`)

    //     ❌ **Incorrect Class Formatting:**
    //     \`\`\`json
    //     {
    //       "type": "button",
    //       "props": { "class": "px-6 py-3 bg-blue-500 text-white" }
    //     }
    //     \`\`\`
    //     (Props should be separate: \`"px": "px-6", "py": "py-3", "bg": "bg-blue-500"\`)

    //     ### 6. Critical Guidelines:
    //     - **Do NOT use numeric values** (e.g., \`"w": "100"\` ❌ → \`"w": "w-full"\` ✅).
    //     - **Use only official Tailwind class names**.
    //     - **Ensure accessibility** where applicable (e.g., \`"focus": { "outline": "outline-none", "ring": "ring-2" }"\`).
    //     - **Include responsive variants first** (e.g., \`"md:w-1/2"\` before \`"w-1/2"\`).
    //     - You can not use flexDirection: "flex-col" for \`row\` elements
    //     - use https://placehold.co/ for placeholder images
    //     - You can position elements inside a \`column\` with example: \`justifyContent: "center"\` and \`alignItems: "center"\`
    //     - for images sizes please refer to width and height with tailwind classes example: w-52
    //     - Generate at least 100 elements the more the better
    //     - Do not return an ARRAY; you need to return a JSON object
    //     - Be creative and generate a lot of elements,  use rounded without shadow

    //     ### 7. Default props:
    //     Here are the default props for some elements:
    //     For \`row\`:   display: "flex", flexDirection: "flex-row", w: "w-full", gap: "gap-8", position: "relative",
    //     For \`column\`:   flex: "flex-1", h: "h-full", display: "flex",

    //     Remember to use only one child for a \`column\` element !!

    //     Strictly follow these rules and return **only valid** JSON structures.`,
    //     },
    //     {
    //       role: 'user',
    //       content:
    //         'Design a modern and elegant Landing page for a car rental company. Use good description for the company and the services. Use Card technique where the workplace should have a light background and the containers should have shadow. The section should have a sleek and professional look, using a minimalistic color palette with elegant tones. Ensure it is visually appealing, with a clean layout and high-quality typography. The content must include specific details about the company, such as services, pricing, key features, and a strong call-to-action. The design should be modern, engaging, and conversion-focused. Add a section to showcase the 3 most popular cars with images and description.',
    //     },
    //   ],
    //   temperature: 0.2,
    //   response_format: { type: 'json_object' },
    // });

    // const ui = completion.choices?.[0]?.message?.content;

    // return chat;
  }
}
