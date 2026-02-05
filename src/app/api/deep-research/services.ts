import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import Exa from "exa-js";
import { createOpenAI } from "@ai-sdk/openai";

export const exa = new Exa(process.env.EXA_SEARCH_API_KEY);

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

export const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
  baseURL: "https://api.deepseek.com/v1",
});
