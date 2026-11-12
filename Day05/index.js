
import readlineSync from "readline-sync";
import { GoogleGenAI } from "@google/genai";
import { exec } from "child_process";
import { promisify } from "util";
import "dotenv/config";

const asyncExecute = promisify(exec);

// Initialize Gemini AI


const ai = new GoogleGenAI({
  apiKey: "your key",
});

const MODEL = "gemini-3.6-flash";

// Detect current platform
const platform = process.platform;

const currentPlatform = {
  win32: "Windows",
  linux: "Linux",
  darwin: "macOS",
}[platform] || platform;

// System Instruction
const SYSTEM_INSTRUCTION = `
You are an expert Website Builder and Frontend Developer.

Your responsibility is to create complete, modern, responsive, and user-friendly frontend applications based on the user's requirements.

Responsibilities:

1. Understand the user's requirements carefully.
2. Build frontend applications using HTML, CSS, JavaScript, React, and Tailwind CSS.
3. Write clean, reusable, and maintainable code.
4. Create attractive and professional UI/UX designs.
5. Make applications responsive on desktop, tablet, and mobile devices.
6. Use the available terminal execution tool to create folders, files, install packages, modify code, and run development servers.
7. Actually create project files instead of only providing code snippets.
8. Analyze and fix errors whenever they occur.
9. Explain how to run the completed application.
10. Never claim that a feature is implemented unless it actually works.

Development Rules:

- Focus on frontend development unless backend functionality is requested.
- Use reusable React components.
- Maintain a clean project structure.
- Avoid unnecessary dependencies.
- Never delete or overwrite existing user files without permission.
- Ask for confirmation before executing terminal commands.
- If the user asks a general question, answer normally instead of creating a website.

Current user operation platform: ${currentPlatform}

Adapt terminal commands according to the current operating system.

Your primary goal is to turn the user's ideas into fully functional frontend applications.
`;

// Terminal command execution
async function executeCommand({ command }) {
  try {
    console.log(`\nCommand: ${command}`);

    const confirm = readlineSync.keyInYNStrict(
      "Do you want to execute this command?"
    );

    if (!confirm) {
      return "Command execution cancelled by user.";
    }

    const { stdout, stderr } = await asyncExecute(command, {
      timeout: 120000,
      maxBuffer: 10 * 1024 * 1024,
    });

    return JSON.stringify({
      success: true,
      stdout,
      stderr,
    });

  } catch (error) {
    return JSON.stringify({
      success: false,
      message: error.message,
      stdout: error.stdout || "",
      stderr: error.stderr || "",
    });
  }
}

// Function declaration
const executeCommandDeclaration = {
  type: "function",
  name: "executeCommand",
  description:
    "Executes a terminal command to create, edit, install, run, or manage project files and folders.",
  parameters: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description: "A single terminal command.",
      },
    },
    required: ["command"],
  },
};

// Available functions
const availableFunctions = {
  executeCommand,
};

// Conversation context
let previousInteractionId = null;

// Run AI Agent
async function runAgent(userProblem) {
  let input = userProblem;

  while (true) {
    const interaction = await ai.interactions.create({
      model: MODEL,
      input,
      system_instruction: SYSTEM_INSTRUCTION,
      tools: [executeCommandDeclaration],

      ...(previousInteractionId
        ? { previous_interaction_id: previousInteractionId }
        : {}),
    });

    const functionCalls = (interaction.steps || []).filter(
      (step) => step.type === "function_call"
    );

    // No function calls: return final response
    if (functionCalls.length === 0) {
      previousInteractionId = interaction.id;

      return interaction.output_text;
    }

    // Execute requested functions
    const functionResults = [];

    for (const call of functionCalls) {
      const functionToCall = availableFunctions[call.name];

      if (!functionToCall) {
        throw new Error(`Unknown function: ${call.name}`);
      }

      const result = await functionToCall(call.arguments);

      functionResults.push({
        type: "function_result",
        name: call.name,
        call_id: call.id,
        result: [
          {
            type: "text",
            text: String(result),
          },
        ],
      });
    }

    // Continue interaction with function results
    previousInteractionId = interaction.id;
    input = functionResults;
  }
}

// Main function
async function main() {
  console.log("🤖 Gemini Website Builder Agent Started!");
  console.log(`Platform: ${currentPlatform}`);
  console.log("Type 'exit' to stop the agent.\n");

  while (true) {
    try {
      const userProblem = readlineSync.question("You: ");

      if (userProblem.trim().toLowerCase() === "exit") {
        console.log("AI Agent Stopped. Goodbye!");
        break;
      }

      if (!userProblem.trim()) {
        continue;
      }

      const response = await runAgent(userProblem);

      console.log("\nAI:", response);
      console.log("\n----------------------------\n");

    } catch (error) {
      console.error("\nError:", error.message);
    }
  }
}

main();
