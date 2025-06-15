import { z } from "zod";
import { callModel } from "./model-caller";
import { getPlanningPrompt, PLANNING_SYSTEM_PROMPT } from "./prompts";
import { ResearchState } from "./type";

export async function generateSearchQueries(researchState: ResearchState) {
  const result = await callModel(
    {
      model: "meta-llama/llama-3.3-8b-instruct:free",
      prompt: getPlanningPrompt(researchState.topic, researchState.clarificationsText),
      system: PLANNING_SYSTEM_PROMPT,
      schema: z.object({
        searchQueries: z.array(z.string()).describe("List of search queries to explore the research topic in depth."),
      }),
    },
    researchState
  );

  return result;
}
