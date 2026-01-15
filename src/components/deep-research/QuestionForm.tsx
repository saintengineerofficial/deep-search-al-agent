import React from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDeepResearchStore } from '@/store/ds'

const formSchema = z.object({
  answer: z.string().min(1, "Answer is required!")
})


const QuestionForm = () => {

  const { questions, currentQuestion, answers, setCurrentQuestion, setAnswers, setIsCompleted, isLoading, isCompleted } = useDeepResearchStore()
  console.log("🚀 ~ QuestionForm ~ questions:", questions)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: answers[currentQuestion] || "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = values.answer;
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      form.reset()
    } else {
      setIsCompleted(true)
    }
  }

  if (isCompleted) return;

  if (questions.length === 0) return;


  return (

    <Card className='w-full  max-w-[90vw] sm:max-w-[80vw] xl:max-w-[50vw] shadow-none bg-white/60 backdrop-blur-sm border rounded-xl border-black/10 border-solid px-[4px] py-[6px]'>
      <CardHeader className='px-[4px] sm:px-[6px]'>
        <CardTitle className='text-base text-primary/50'>
          Question {currentQuestion + 1} of {questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-[6px] w-full px-[4px] sm:px-[6px]'>
        <p className='text-base'>{questions[currentQuestion]}</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[8px]">
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Type your answer here..."
                      className='px-[4px] py-[2px] text-base resize-none placeholder:text-sm border-black/20'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center">

              <Button type="button" variant={"outline"}
                onClick={() => {
                  if (currentQuestion > 0) {
                    setCurrentQuestion(currentQuestion - 1)
                    form.setValue("answer", answers[currentQuestion - 1] || "")
                  }
                }}>
                Previous
              </Button>


              <Button type="submit" disabled={isLoading}>
                {currentQuestion === questions.length - 1 ? "Start Research" : "Next"}
              </Button>
            </div>

          </form>
        </Form>

        <div className='h-[1px] w-full bg-gray-200 rounded'>
          <div
            className='h-[1px] bg-primary rounded transition-all duration-300'
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`
            }}
          />
        </div>

      </CardContent>
    </Card>

  )
}

export default QuestionForm