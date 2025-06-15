"use client";
import { useDeepResearchStore } from "@/store/ds";
import React, { useEffect } from "react";
import QuestionForm from "./QuestionForm";
import { useChat } from "@ai-sdk/react";
const QAndA = () => {
  const { questions, isCompleted, topic, answers } = useDeepResearchStore();
  const { append } = useChat({ api: "/api/deep-research" });

  useEffect(() => {
    if (isCompleted && questions.length > 0) {
      const clarifications = questions.map((question, index) => ({
        question,
        answers: answers[index],
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
    </div>
  );
};

export default QAndA;
