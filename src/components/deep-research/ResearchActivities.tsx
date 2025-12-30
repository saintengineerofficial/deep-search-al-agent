'use client'
import { useDeepResearchStore } from '@/store/ds'
import React, { useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from '../ui/button'
import { ChevronDown } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import Link from 'next/link'
import { cn } from '@/lib/utils'

const ResearchActivities = () => {
  const { activities, sources } = useDeepResearchStore();
  const [isOpen, setIsOpen] = useState(true)

  if (activities.length === 0) return;

  return (
    <div className='w-[90vw] sm:w-[400px] fixed top-[4px] right-[4px] z-20'>
      <Collapsible className='w-full' open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex justify-end mb-[2px]">
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-[9px] p-0">
              <ChevronDown className={`h-[4px] w-[4px] ${isOpen ? 'rotate-180' : ''}`} />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className='h-[50vh]'>
          <Tabs defaultValue="activities" className="w-full h-full shadow-md">
            <TabsList className='w-full px-[2px] py-[6px]'>
              <TabsTrigger value="activities" className='flex-1 shadow-none border-black/10 border-solid'>Activities</TabsTrigger>
              {
                sources.length > 0 && <TabsTrigger value="sources">Sources</TabsTrigger>
              }
            </TabsList>
            <TabsContent value="activities" className='h-[calc(100%-60px)] overflow-y-auto border-black/10 border-solid shadow-none bg-white/60 backdrop-blur-sm border rounded-xl '>
              <ul className='space-y-[4px] p-[4px]'>
                {
                  activities.map((activity, index) => <li key={index} className='flex flex-col gap-[2px] border-b p-[2px] text-sm'>
                    <div className='flex items-center gap-[2px]'>
                      <span
                        className={cn("min-w-[2px] min-h-[2px] h-[2px] block rounded-full",
                          activity.status === "complete" ?
                            "bg-green-500" : activity.status === "error" ? "bg-red-500" : "bg-yellow-500"
                        )}
                      >
                        &nbsp;
                      </span>


                      <p>
                        {activity.message.includes("https://") ? activity.message.split("https://")[0] +
                          activity.message.split("https://")[1].split("/")[0] : activity.message
                        }
                      </p>
                    </div>
                    {
                      activity.timestamp &&
                      <span className='text-xs text-muted-foreground'>
                        {format(activity.timestamp, 'HH:mm:ss')}
                      </span>
                    }
                  </li>
                  )
                }
              </ul>
            </TabsContent>
            {
              sources.length > 0 &&

              <TabsContent value="sources" className='h-[calc(100%-60px)] overflow-y-auto shadow-none bg-white/60 backdrop-blur-sm border rounded-xl border-black/10 border-solid'>
                <ul className='space-y-[4px] p-[4px]'>
                  {
                    sources.map((source, index) => {
                      return <li key={index} className='flex flex-col gap-[2px] border-b p-[2px]'>
                        <Link href={source.url} target='_blank' className='text-sm text-blue-600 hover:underline'>
                          {source.title}
                        </Link>

                      </li>
                    })
                  }
                </ul>
              </TabsContent>
            }
          </Tabs>
        </CollapsibleContent>
      </Collapsible>

    </div>
  )
}

export default ResearchActivities