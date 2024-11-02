import type { InstanceInfo } from "@/hooks/useEvaluationData"
import { InstanceStatus } from "@/lib/execution"
import type { IntentInstance } from "@/model/model"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ScoreRepresentation } from "../score/ScoreRepresentation"
import { TranscriptInstance } from "./buttons/TranscriptButton"


export type LoadingInstanceProps = {
    instance: InstanceInfo
}

export const LoadingInstance = ({  }: LoadingInstanceProps) => {

    // return (
    //     <Skeleton className="w-full h-52" />
    //     )

    const instance = {
        intentModel: {
            displayName: "Intent Model"
        }
    }

    const lastChat = {
        actualNode: undefined
    }

    const colorStatus = "bg-primary"
    const instanceData = {
        status: InstanceStatus.DONE,
        evaluation: {
            maxScore: 10
        }
    }
    const status = instanceData.status

    return (
        <Card className="p-2">
            <Skeleton className="flex justify-between items-center rounded-lg ps-3 pe-4 w-full h-10 bg-primary-foreground">
                <Skeleton className="w-2/5 h-6" />
                <Skeleton className="w-14 h-6 rounded-full" />
            </Skeleton>
            <CardContent className="py-3 px-5 text-sm space-y-1">
                <Skeleton className="w-1/2 h-6" />
                
                <div className="flex flex-row gap-1">
                    <Skeleton className="w-10 h-6" />
                    <Skeleton className="w-14 h-6 rounded-full" />
                    /
                    <Skeleton className="w-14 h-6 rounded-full" />
                </div>
            </CardContent>
            <CardFooter className="py-1 justify-end">
                <Skeleton className="w-32 h-6" />
            </CardFooter>
        </Card>
    )
}