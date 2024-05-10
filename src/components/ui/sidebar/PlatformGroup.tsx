import type { IntentInstance } from "@/model/model"
import { IntentInstanceButton } from "./IntentInstanceButton"

type PlatformGroupProps = {
    platform: string,
    instances: IntentInstance[]
}

export const PlatformGroup = ({platform, instances} : PlatformGroupProps) => {
    return (<div>
        <h4 className="font-semibold text-center">{platform}</h4>
        <ul>
            {instances.map((instance) => (
                <IntentInstanceButton instance={instance} key={instance.id.toString()} />
            ))}
        </ul>
    </div>)
}