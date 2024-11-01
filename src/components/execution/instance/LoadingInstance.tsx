import type { InstanceInfo } from "@/hooks/useEvaluationData"
import type { IntentInstance } from "@/model/model"
import { Card } from "@design/ui/card"
import { Skeleton } from "@design/ui/skeleton"


export type LoadingInstanceProps = {
    instance: InstanceInfo
}

// <Card className="p-2">
// <CardContent className="py-3 px-6 text-sm">
//     Loading instance {instanceData.id}...
// </CardContent>
// </Card>
export const LoadingInstance = ({ instance }: LoadingInstanceProps) => {

    return (
        <Card>
            <Skeleton className="w-max h-52" />
        </Card>)

}