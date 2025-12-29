"use client";

import React, { ComponentPropsWithRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Download } from "lucide-react";
import {
  Prism as SyntaxHighlighter,
  type SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";

import { useDeepResearchStore } from "@/store/ds";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CodeProps = ComponentPropsWithRef<"code"> & {
  inline?: boolean;
};

const ResearchReport = () => {
  const { report, isCompleted, isLoading, topic } = useDeepResearchStore();

  const handleMarkdownDownload = () => {
    const content = report.split("<report>")[1].split("</report>")[0];
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic}-research-report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isCompleted) return null;

  if (report.length <= 0 && isLoading) {
    return (
      <Card className="p-[4px] max-w-[50vw] bg-white/60 border px-[4px] py-[2px] rounded-xl">
        <div className="flex flex-col items-center justify-center space-y-[4px] p-[8px]">
          <div className="animate-spin rounded-full h-[8px] w-[8px] border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">
            Researching your topic...
          </p>
        </div>
      </Card>
    );
  }

  if (report.length <= 0) return null;

  return (
    <Card
      className="max-w-[90vw] xl:max-w-[60vw] relative px-[4px] py-[6px] rounded-xl border-black/10 border-solid shadow-none p-[6px]
     bg-white/60 backdrop-blur-xl border antialiased
    "
    >
      <div className="flex justify-end gap-[2px] mb-[4px] absolute top-[4px] right-[4px]">
        <Button
          size="sm"
          className="flex items-center gap-[2px] rounded"
          onClick={handleMarkdownDownload}
        >
          <Download className="w-[4px] h-[4px]" /> Download
        </Button>
      </div>

      <div className="prose prose-sm md:prose-base max-w-none prose-pre:p-[2px] overflow-x-scroll">
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, inline, ...props }: CodeProps) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";

              if (!inline && language) {
                const SyntaxHighlighterProps: SyntaxHighlighterProps = {
                  style: nightOwl,
                  language,
                  PreTag: "div",
                  children: String(children).replace(/\n$/, ""),
                };

                return <SyntaxHighlighter {...SyntaxHighlighterProps} />;
              }

              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {report.split("<report>")[1].split("</report>")[0]}
        </Markdown>
      </div>
    </Card>
  );
};

export default ResearchReport;
