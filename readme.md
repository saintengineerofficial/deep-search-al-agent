技术栈：Next.js 15 + @ai-sdk/react + openRouter + exa-js + TypeScript + zod + Zustand + TailwindCSS

负责内容：

表单 zod 验证参数发起对话，Zustand 管理整体数据状态

页面搭建用 Shadcn/ui 组合活动面板，状态点亮、时间戳、外链跳转。
基于 AI SDK，用 useChat 解析增量消息，分开抽取 sources/report，实时显示研究过程。
接入 exa-js，在 API 层用 searchAndContents 搜索并抓取正文，过滤结果后交给模型抽取/分析，生成来源列表和报告。
报告渲染与导出,remark-gfm + Prism 渲染，Blob 下载报告 report.md，加载态 Skeleton 占位。
