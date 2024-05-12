import type { IntentInstance } from "@/model/model"
import { IntentInstanceButton } from "./IntentInstanceButton"
import { Separator } from "@design/ui/separator"

type PlatformGroupProps = {
    platform: string,
    instances: IntentInstance[],
    separator: boolean
}

export const PlatformGroup = ({ platform, instances, separator = false }: PlatformGroupProps) => {
    return (
        <>
            {separator && <Separator className="" />}
            <div>
                <h4 className="font-semibold text-center">{platform}</h4>
                <ul>
                    {instances.map((instance) => (
                        <IntentInstanceButton instance={instance} key={instance.id.toString()} />
                    ))}
                </ul>
            </div>
        </>
    )
}