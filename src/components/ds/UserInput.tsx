"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDeepResearchStore } from "@/store/ds";

const formSchema = z.object({
  input: z.string().min(0).max(200),
});

const UseInput = () => {
  const { setQuestions, setTopic, setIsLoading, isLoading } = useDeepResearchStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setTopic(values.input);
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-question", {
        method: "POST",
        body: JSON.stringify({ topic: values.input }),
      });
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col sm:flex-row items-center justify-center gap-4 w-[90vw] sm:w-[80vw] xl:w-[50vw]'>
        <FormField
          control={form.control}
          name='input'
          render={({ field }) => (
            <FormItem className='flex-1 w-full'>
              <FormControl>
                <Input
                  placeholder='Enter your research topic'
                  {...field}
                  className='rounded-full w-full flex-1 p-4 py-4 sm:py-6 placeholder:text-sm bg-white/60 backdrop-blur-sm border-black/10 border-solid shadow-none'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} type='submit' className='rounded-full px-6 cursor-pointer'>
          {isLoading ? "Loading..." : "Start Research"}
        </Button>
      </form>
    </Form>
  );
};

export default UseInput;
