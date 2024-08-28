import type { DataInfo } from "@/hooks/useEvaluationData"
import { Card, CardContent } from "@design/ui/card"

type ExecutionInfoProps = {
    instance: DataInfo
}

export const ExecutionInfo = ({instance} : ExecutionInfoProps) => {
    const runningInstances = instance.instances.filter(info => info.status !== `completed`)
    const failedInstances = instance.instances.filter(info => info.status === `failed`)
    const completedInstances = instance.instances.filter(info => info.status === `completed`)
    // const prompts
    
    return (
        <Card>
          <CardContent className="py-3 px-6">
            <ol className="flex flex-row justify-around">
              <li className="flex flex-col gap-1 justify-center place-items-center">
                <p className="font-semibold">Running</p>
                <p className="">{runningInstances.length}</p>
              </li>
              <li className="flex flex-col gap-1 justify-center place-items-center">
                <p className="font-semibold">Failed</p>
                <p className="">{failedInstances.length}</p>
              </li>
              <li className="flex flex-col gap-1 justify-center place-items-center">
                <p className="font-semibold">Completed</p>
                <p className="">{completedInstances.length}</p>
              </li>
            </ol>
          </CardContent>
          {/* <!-- <CardFooter>
              <p>Card Footer</p>
            </CardFooter> --> */}
        </Card>)
}