import { z } from "zod";
import { callModel } from "./model-caller";
import { getPlanningPrompt, PLANNING_SYSTEM_PROMPT } from "./prompts";
import { ResearchState, SearchResult } from "./type";
import { exa } from "./services";

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

export async function search(query: string, researchState: ResearchState): Promise<SearchResult[]> {
  try {
    const searchResult = await exa.searchAndContents(query, {
      type: "keyword",
      numResults: 3,
      startPublishedDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      endPublishedDate: new Date().toISOString(),
      startCrawlDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      endCrawlDate: new Date().toISOString(),
      excludeDomains: ["https://youtube.com"],
      text: {
        maxCharacters: 2000,
      },
    });

    const filterSearchResult = searchResult.results
      .filter(r => r.title && r.text !== undefined)
      .map(r => ({
        title: r.title,
        url: r.url,
        content: r.text,
      }));

    researchState.completedSteps++;
    return filterSearchResult;
  } catch (error) {
    console.error("Error during search:", error);
    return [];
  }
}
