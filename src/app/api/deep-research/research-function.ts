import { z } from "zod";
import { callModel } from "./model-caller";
import { ANALYSIS_SYSTEM_PROMPT, EXTRACTION_SYSTEM_PROMPT, getAnalysisPrompt, getExtractionPrompt, getPlanningPrompt, PLANNING_SYSTEM_PROMPT } from "./prompts";
import { ResearchState, SearchResult } from "./type";
import { exa } from "./services";
import { MAX_CONTENT_CHARS, MAX_ITERATIONS, MAX_SEARCH_RESULTS, MODELS } from "./constants";
import { combineFindings } from "./utils";

export async function generateSearchQueries(researchState: ResearchState) {
  const result = await callModel(
    {
      model: MODELS.PLANNING,
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
      numResults: MAX_SEARCH_RESULTS,
      startPublishedDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      endPublishedDate: new Date().toISOString(),
      startCrawlDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      endCrawlDate: new Date().toISOString(),
      excludeDomains: ["https://youtube.com"],
      text: {
        maxCharacters: MAX_CONTENT_CHARS,
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

export async function extractContent(content: string, url: string, researchState: ResearchState) {
  try {
    const modelCallOptions = {
      model: MODELS.EXTRACTION,
      prompt: getExtractionPrompt(content, researchState.topic, researchState.clarificationsText),
      system: EXTRACTION_SYSTEM_PROMPT,
      schema: z.object({
        summary: z.string().describe("A comprehensive summary of the content"),
      }),
    };
    const result = await callModel(modelCallOptions, researchState);
    return {
      url,
      summary: result.summary,
    };
  } catch (error) {
    console.log("🚀 ~ extractContent ~ error:", error);
  }
}

export async function processSearchResults(searchResults: SearchResult[], researchState: ResearchState) {
  const extractionPromises = searchResults.map(result => extractContent(result.content, result.url, researchState));
  const extractionResults = await Promise.allSettled(extractionPromises);
  const availableResults = extractionResults.filter(resItem => resItem.status === "fulfilled" && resItem.value !== undefined);
  const newFindings = availableResults.map(res => {
    const { summary, url } = res.value;
    return { summary, source: url };
  });

  return newFindings;
}

export async function analyzeFindings(researchState: ResearchState, currentQueries: string[], currentIteration: number) {
  const contentText = combineFindings(researchState.findings);

  const modelCallOptions = {
    model: MODELS.ANALYSIS,
    prompt: getAnalysisPrompt(contentText, researchState.topic, researchState.clarificationsText, currentQueries, currentIteration, MAX_ITERATIONS, contentText.length),
    system: ANALYSIS_SYSTEM_PROMPT,
    schema: z.object({
      sufficient: z.boolean().describe("Whether the collected content is sufficient for a useful report"),
      gaps: z.array(z.string()).describe("Identified gaps in the content"),
      queries: z.array(z.string()).describe("Search queries for missing information. Max 3 queries."),
    }),
  };

  const result = await callModel(modelCallOptions, researchState);

  return result;
}
