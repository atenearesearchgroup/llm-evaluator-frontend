import { Badge } from "@/components/shadcdn/ui/badge"
import { Tooltip, TooltipProvider } from "@/components/shadcdn/ui/tooltip"
import type { DataInfo, InstanceInfo } from "@/hooks/useEvaluationData"
import type { IntentInstance } from "@/model/model"
import { getInstance } from "@/services/instanceService"
import { TooltipArrow, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip"
import { info } from "node_modules/astro/dist/core/logger/core"
import { useEffect, useState } from "react"


type IntentInstanceProps = {
    instance: DataInfo,
    id: number

}

// /bg-slate-600
export const ExecutionInstanceButton = ({ instance, id }: IntentInstanceProps) => {

    const isRunning = instance.instances.every(info => info.status === `running`)
     ? `in progress` : `completed`

    return (
        <li
            id={`list-${id}`}
            data-id={`${id}`}
            className=" draft-cell mx-2 my-2 flex flex-col
              bg-primary-foreground text-primary
            bg-opacity-30 p-3 text-sm rounded-lg justify-between gap-1"
        >
            <a href={`/execution/${id}`} className="font-bold draft-cell">
                {instance.title ?? "Untitled"}
            </a>
            <TooltipProvider>
                <Tooltip delayDuration={400}>
                    <TooltipTrigger  className="place-self-end">
                        <Badge variant="default" data-id={id} className="text-primary-foreground w-fit text-xs place-self-end font-normal">
                            {isRunning}
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent side={"right"} className="">
                        <p className="bg-popover p-2 rounded-md">Status</p>
                    <TooltipArrow className="bg-popover" />
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {/* <p className="text-end">{instance.platform}</p> */}
        </li>
    )
}