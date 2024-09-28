import { Button } from "@/components/shadcdn/ui/button"
import type { IntentInstance, IntentModel } from "@/model/model"
import { getInstancesFromModel } from "@/services/intentService"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { PlatformGroup } from "./PlatformGroup"
import { useEvaluationData, type DataInfo } from "@/hooks/useEvaluationData"
import { ExecutionInstanceButton } from "./ExecutionInstanceButton"



export const ExecutionList = () => {
    const [isOpen, setIsOpen] = useState(true)
    const { getExecutionData, listEvaluations } = useEvaluationData()
    const instances = getExecutionData().list ?? []


    return (
        <>
            {
                instances.map((instance: DataInfo, idx) => {
                    return (
                        <ExecutionInstanceButton key={`execution-${idx}`} instance={instance} id={idx} />
                    )
                })
            }
        </>
    )
}