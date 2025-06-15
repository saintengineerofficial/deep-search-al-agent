import { createDataStreamResponse } from "ai";
import { ResearchState } from "./type";
import { deepResearch } from "./main";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;
    const parsedMessage = JSON.parse(lastMessage);

    const topic = parsedMessage.topic;
    const clarifications = parsedMessage.clarifications;

    return createDataStreamResponse({
      status: 200,
      statusText: "OK",
      async execute(dataStream) {
        // dataStream.writeData({ value: "Hello" });

        const researchState: ResearchState = {
          completedSteps: 0,
          tokenUsed: 0,
          findings: [],
          processedUrl: new Set(),
          clarificationsText: JSON.stringify(clarifications),
          topic,
        };
        await deepResearch(researchState, dataStream);
      },
      // onError: error => `Custom error: ${error.message}`,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Invalid message format!",
      }),
      { status: 200 }
    );
  }
}
