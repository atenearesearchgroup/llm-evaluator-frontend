import { Button } from "@/components/shadcdn/ui/button"
import type { IntentInstance, IntentModel } from "@/model/model"
import { getInstancesFromModel } from "@/services/intentService"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { IntentInstanceButton } from "./IntentInstanceButton"
import { Separator } from "@radix-ui/react-select"
import { PlatformGroup } from "./PlatformGroup"


type IntentGroupProps = {
    intentModel: IntentModel
}

const groupLlms = (instances: IntentInstance[]) => {
    const groupedLlms: Record<string, IntentInstance[]> = {}

    instances.forEach((instance) => {
        if (!groupedLlms[instance.platform]) {
            groupedLlms[instance.platform] = []
        }

        groupedLlms[instance.platform].push(instance)
    })

    return groupedLlms
}

export const IntentGroup = ({ intentModel }: IntentGroupProps) => {
    const [isOpen, setIsOpen] = useState(true)
    const [instances, setInstances] = useState<Record<string, IntentInstance[]>>({})

    useEffect(() => {
        const fetchApi = async () => {
            const response = await getInstancesFromModel(intentModel.modelName)

            if ('status' in response) {
                console.error(response)
                return
            }

            setInstances(groupLlms(response))
        }

        const interval = setInterval(() => {
            fetchApi()
        }, 10000)
        fetchApi()

        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <fieldset id="sidebar" className={`grid gap-6 rounded-lg border p-3 ${isOpen ? "p-2" : ""}`}>
                <legend className="-ml-1 px-1 text-sm font-medium flex items-center justify-start space-x-2 ">
                    <p className="text font-bold">
                        {intentModel.displayName || intentModel.modelName}
                    </p>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="size-6 p-0">
                            {isOpen ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </legend>

                <CollapsibleContent className="grid gap-2">

                    {Object.entries(instances).map((instance, idx) => {
                        const [key, value] = instance
                        const componentKey = `${key}-${intentModel.modelName}`

                        const shouldHaveSeparator = idx === 0 || <Separator key={`${componentKey}-separator`} className=" border" />

                        return (<> {shouldHaveSeparator}
                            <PlatformGroup instances={value} key={componentKey} platform={key} /></>)
                    })
                    }
                </CollapsibleContent>
            </fieldset>
        </Collapsible>
    )
}