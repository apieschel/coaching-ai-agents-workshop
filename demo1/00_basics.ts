
// #region 🔌 Imports & Configuration - Where the magic begins
import "dotenv/config"; // Loading secrets like they're ingredients for a spell

import { OpenAI } from "openai"; // Importing the digital crystal ball

const token = process.env["GITHUB_OPENAI_API_KEY"]; // The VIP backstage pass to AI concerts
const endpoint = "https://models.inference.ai.azure.com"; // The cosmic address where AI lives
const modelName = "gpt-4o"; // The Einstein of AI models, but with better hair
// #endregion

// #region 🧙‍♂️ OpenAI Client Setup - Summoning the AI genie
const openai = new OpenAI({ baseURL: endpoint, apiKey: token }); // Digital genie, come forth!

// #region 💬 Chat Function - The telepathic bridge to AI wisdom
async function chat(input: string) {
  // Packaging your question in a digital envelope
  const messages = [{ role: "user" as const, content: input }];

  // Sending your thoughts to the digital oracle
  const response = await openai.chat.completions.create({
    model: modelName,
    messages: messages,
    temperature: 0, // Ice cold logic - no creative fever here
  });

  // Unwrapping the gift of AI wisdom
  return response.choices[0].message;
}
// #endregion

// #region 🔍 Basic Query - Where we ask the important literary questions
const question = "Who wrote the 'Harry Potter' series book? What's the real name? Why choose that name?"; // The question that launched a thousand book clubs

// Summoning knowledge from the digital realm
chat(question)
  .then((response) => console.log(response)) // Success: Information unlocked! 🧙‍♂️
  .catch((error) => console.error(error)); // Failure: AI must be on coffee break ☕
// #endregion

// #region 😂 Comedy Mode - Teaching AI to be the life of the party
const promptTemplate = `
  Be very funny when answering questions
  Question: {question}
  `; // Giving AI its comedy club instructions

// The magical Mad Libs transformation
const prompt = promptTemplate.replace("{question}", question);

// Let's see if silicon can do stand-up comedy
chat(prompt)
  .then((response) => console.log(response)) // If it's funny, we laugh. If not, we pretend to.
  .catch((error) => console.error(error)); // Error 418: I'm a teapot, not a comedian
// #endregion
