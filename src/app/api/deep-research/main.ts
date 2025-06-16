import { MAX_ITERATIONS } from "./constants";
import { analyzeFindings, generateSearchQueries, processSearchResults, search } from "./research-function";
import { ResearchState } from "./type";

export async function deepResearch(researchState: ResearchState, dataStream) {
  let iteration = 0;
  const intialQueries = await generateSearchQueries(researchState);
  console.log("🚀 ~ useDeepResearchStore ~ intialQueries:", intialQueries);

  let currentQueries = intialQueries.searchQueries;
  while (currentQueries && currentQueries.length > 0 && iteration <= MAX_ITERATIONS) {
    iteration++;
    const searchResult = currentQueries.map((query: string) => search(query, researchState));
    const searchResultResponses = await Promise.allSettled(searchResult);

    const effectiveSearchResults = searchResultResponses.filter(resItem => resItem.status === "fulfilled" && resItem.value.length > 0);
    const allSearchResults = effectiveSearchResults.map(resItem => resItem.value).flat();

    const newFindings = await processSearchResults(allSearchResults, researchState);
    researchState.findings = [...researchState.findings, ...newFindings];

    const analysis = await analyzeFindings(researchState, currentQueries, iteration);

    console.log("Analysis: ", analysis);

    if (analysis.sufficient) {
      break;
    }

    currentQueries = (analysis.queries || []).filter((query: string) => !currentQueries.includes(query));
    currentQueries = [];
  }

  return intialQueries;
}
