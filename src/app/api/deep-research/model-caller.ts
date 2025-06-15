import { generateObject } from "ai";
import { ModelCallOptions, ResearchState } from "./type";
import { openrouter } from "./services";

export async function callModel<T>(modelCallOptions: ModelCallOptions<T>, researchState: ResearchState): Promise<T | string> {
  const { model, prompt, system, schema } = modelCallOptions;

  const { object, usage } = await generateObject({
    model: openrouter(model),
    prompt,
    system,
    schema,
  });

  researchState.tokenUsed += usage?.totalTokens || 0;
  researchState.completedSteps++;

  return object;
}
