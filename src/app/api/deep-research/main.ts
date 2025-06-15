import { generateSearchQueries } from "./research-function";
import { ResearchState } from "./type";

export async function deepResearch(researchState: ResearchState, dataStream) {
  const intialQueries = await generateSearchQueries(researchState);
  console.log("🚀 ~ useDeepResearchStore ~ intialQueries:", intialQueries);
  return intialQueries;
}
