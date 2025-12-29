"use client";

import React, { useEffect } from "react";
import { useChat } from "@ai-sdk/react";

import { useDeepResearchStore } from "@/store/ds";
import QuestionForm from "./QuestionForm";
import ResearchActivities from "./ResearchActivities";
import ResearchReport from "./ResearchReport";
import ResearchTimer from "./ResearchTimer";
import CompletedQuestions from "./CompletedQuestions";

const QAndA = () => {
  const {
    questions,
    isCompleted,
    topic,
    answers,
    setIsLoading,
    setActivities,
    setSources,
    setReport,
  } = useDeepResearchStore();
  const { append, data, isLoading } = useChat({ api: "/api/deep-research" });

  useEffect(() => {
    if (!data) return;

    const messages = data as unknown[];
    const activities = messages
      .filter(msg => typeof msg === "object" && (msg as any).type === "activity")
      .map(msg => (msg as any).content);

    setActivities(activities);

    const sources = activities
      .filter(activity => activity.type === "extract" && activity.status === "complete")
      .map(activity => {
        const url = activity.message.split("from ")[1];
        return {
          url,
          title: url?.split("/")[2] || url,
        };
      });

    setSources(sources);

    const reportData = messages.find(msg => typeof msg === "object" && (msg as any).type === "report");
    const report = typeof (reportData as any)?.content === "string" ? (reportData as any).content : "";
    setReport(report);

    setIsLoading(isLoading);
  }, [data, setActivities, setSources, setReport, setIsLoading, isLoading]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  useEffect(() => {
    if (isCompleted && questions.length > 0) {
      const clarifications = questions.map((question, index) => ({
        question,
        answer: answers[index],
      }));

      append({
        role: "user",
        content: JSON.stringify({ topic, clarifications }),
      });
    }
  }, [answers, append, isCompleted, questions, topic]);

  if (!questions.length) {
    return null;
  }

  return (
    <div className='flex gap-4 w-full flex-col items-center mb-16'>
      <QuestionForm />
      <CompletedQuestions />
      <ResearchTimer />
      <ResearchActivities />
      <ResearchReport />
    </div>
  );
};

export default QAndA;
