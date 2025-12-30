'use client'
import { useDeepResearchStore } from '@/store/ds'
import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const CompletedQuestions = () => {
  const { questions, answers, isCompleted } = useDeepResearchStore();

  if (!isCompleted || questions.length === 0) return null;
  return (
    <Accordion type="single" collapsible className="w-full max-w-[90vw] sm:max-w-[80vw] xl:max-w-[50vw] bg-white/60 backdrop-blur-sm border px-[4px] py-[2px] rounded-xl">
      <AccordionItem value="item-0" className="border-0">
        <AccordionTrigger className="text-base capitalize hover:no-underline">
          <span>Questions and Answers</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="mx-auto py-[6px] space-y-[8px]">
            <Accordion type="single" collapsible className="w-full">
              {questions.map((question, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="text-black/70">
                      Question {index + 1}: {question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="bg-muted/50 p-[4px] rounded-md">
                    <p className="text-muted-foreground">{answers[index]}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default CompletedQuestions