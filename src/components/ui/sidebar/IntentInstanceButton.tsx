import { Badge } from "@/components/shadcdn/ui/badge"
import { Tooltip, TooltipProvider } from "@/components/shadcdn/ui/tooltip"
import type { IntentInstance } from "@/model/model"
import { getInstance } from "@/services/instanceService"
import { TooltipArrow, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip"
import { useEffect, useMemo, useState } from "react"


type IntentInstanceProps = {
    instance: IntentInstance

}

// /bg-slate-600
export const IntentInstanceButton = ({ instance }: IntentInstanceProps) => {
    const [fullInstance, setInstance] = useState<IntentInstance | null>(null)

    useEffect(() => {
        const fetchApi = async () => {
            const response = await getInstance(instance.id)

            if ('requestError' in response) {
                console.error(response)
                return
            }

            setInstance(response)
        }

        fetchApi()
    }, [])

    if (!fullInstance) return null

    return (
        <li
            id={`list-${instance.id}`}
            data-id={`${instance.id}`}
            className=" draft-cell mx-2 my-2 flex flex-col
              bg-primary-foreground text-primary
            bg-opacity-30 p-3 text-sm rounded-lg justify-between gap-1"
        >
            <a href={`/instances/${instance.id}`} className="font-bold draft-cell">
                {instance.displayName ?? "Untitled"}
            </a>
            <TooltipProvider>
                <Tooltip delayDuration={400}>
                    <TooltipTrigger  className="place-self-end">
                        <Badge variant="default" data-id={instance.id} className="text-primary-foreground w-fit text-xs place-self-end font-normal">
                            {fullInstance.modelSettings.modelName ?? "unknown"}
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent side={"right"} className="">
                        <p className="bg-popover p-2 rounded-md">Model name</p>
                    <TooltipArrow className="bg-popover" />
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {/* <p className="text-end">{instance.platform}</p> */}
        </li>
    )
}