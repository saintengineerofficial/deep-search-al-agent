import { generateSearchQueries, search } from "./research-function";
import { ResearchState } from "./type";

export async function deepResearch(researchState: ResearchState, dataStream) {
  const intialQueries = await generateSearchQueries(researchState);
  console.log("🚀 ~ useDeepResearchStore ~ intialQueries:", intialQueries);

  let currentQueries = intialQueries.searchQueries;
  while (currentQueries && currentQueries.length > 0) {
    const searchResult = currentQueries.map((query: string) => search(query, researchState));
    const searchResultResponses: any[] = await Promise.allSettled(searchResult);

    const effectiveSearchResults = searchResultResponses.filter(resItem => resItem.status === "fulfilled" && resItem.value.length > 0);
    const allSearchResults = effectiveSearchResults.map(resItem => resItem.value).flat();

    console.log("🚀 ~ deepResearch ~ allSearchResults:", allSearchResults);
    currentQueries = [];
  }

  return intialQueries;
}
