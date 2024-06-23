/*
 * Install the Generative AI SDK
 *
 * $ yarn add @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

import { GoogleGenerativeAI, GenerativeModel, ChatSession, GenerationConfig } from "@google/generative-ai";

// Ensure the environment variable is typed
const apiKey: string = process.env.GEMINI_API_KEY as string;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model: GenerativeModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig: GenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

async function run(): Promise<void> {
  const chatSession: ChatSession = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          { text: "produce inferences from the following results which i will send in the next response, give me data to map out on a bar chart the data should be in a json format \n{}" },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
}

run().catch(error => console.error(error));
