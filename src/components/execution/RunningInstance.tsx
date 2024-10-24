import type { DataInfo, InstanceInfo } from "@/hooks/useEvaluationData"
import type { AIMessage, Message, PromptIteration } from "@/model/chat"
import type { IntentInstance } from "@/model/model"
import { getInstance } from "@/services/instanceService"
import { Card, CardContent, CardFooter, CardTitle } from "@design/ui/card"
import { useEffect, useMemo, useRef, useState } from "react"
import { getAllJSDocTagsOfKind } from "typescript"
import { executeAction, getStatus, InstanceStatus } from "./execution"
import { useToast } from "@design/ui/use-toast"
import type { RequestError } from "@/model/request"
import { Button } from "@design/ui/button"
import { Badge } from "@design/ui/badge"
import { LastIterationMessage } from "./LastIterationMessage"
import { MESSAGE_INVALID_SYNTAX_SCORE } from "@/utils/constants"
import { Star, StarOff } from "lucide-react"
import { Separator } from "@design/ui/separator"

type RunningInstanceProps = {
    instanceData: InstanceInfo,
    updateInstance: (instance: InstanceInfo) => void,
    parent: DataInfo
}

const getLastAiMessage = (messages: (Message | AIMessage)[]): AIMessage | null => {
    let lastMessage = messages[messages.length - 1]

    if (`score` in lastMessage)
        return lastMessage

    if (messages.length < 2)
        return null

    return messages[messages.length - 2] as AIMessage
}

const handleStatus = async (instanceData: InstanceInfo, parent: DataInfo, instance: IntentInstance,
    setInstance: (instance: IntentInstance | undefined) => void,
    setError: (error: RequestError | undefined) => void,
    updateInstance: (instance: InstanceInfo) => void,
    toast: any) => {
    const status = getStatus(instance)

    if (status === InstanceStatus.DONE) {
        if (instanceData.status === "running") {
            console.log("Updating instance status to completed with id", instanceData.id)
            instanceData.status = instanceData?.evaluation?.score ?? -1 >= 0 ? "completed" : "failed"
            updateInstance(instanceData)
        }

        return
    } else if (instanceData.status !== "running") {
        console.log("Updating instance status to running with id", instanceData.id)
        instanceData.status = "running"
        updateInstance(instanceData)
    }

    try {
        const newInstance = await executeAction(instanceData, parent, instance, status)

        if (`requestError` in newInstance) {
            throw newInstance
        }

        updateInstance(instanceData)

        setTimeout(() => {
            setInstance(newInstance)
        }, 1000)

        if (status === getStatus(newInstance))
            setError({
                message: "No changes on instance",
                status: 500,
                statusText: "No changes",
                requestError: true,
                url: ""
            })

    } catch (e: RequestError | any) {
        setError(e)
        console.error(e)

        toast({
            title: "Error on instance " + instance.intentModel?.displayName,
            description: e.message
        })
    }

}

const getScoreRepresentation = (score?: number) => {
    if (score == null || score == -2) return < ><StarOff className={"size-[0.75rem]"} /> <p>N/A</p></>
    if (score === MESSAGE_INVALID_SYNTAX_SCORE) return <><StarOff className={"size-[0.75rem]"} /> <p>Invalid Syntax</p></>
    return <><Star className={"size-[0.75rem]"} /> {score}</>
}

export const RunningInstance = ({ instanceData, parent, updateInstance }: RunningInstanceProps) => {
    const running = useRef(false)
    const [instance, setInstance] = useState<IntentInstance>()
    const [error, setError] = useState<RequestError>()
    const { toast } = useToast()


    const lastChat = instance == null ? null : instance.chats[instance.chats.length - 1] ?? {}
    // get iteration with higher index
    const lastIteration = useMemo(() => {
        return lastChat?.promptIterations?.reduce((prev: PromptIteration | null, curr) => {
            if (prev != null && prev.iteration > curr.iteration)
                return prev
            return curr
        }, null)
    }, [lastChat])

    const messages = useMemo(() => {
        return (lastIteration?.messages ?? []).map(message => ({
            ...message,
            timestamp: new Date(Date.parse(message.timestamp as any as string))
        })).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }, [lastIteration]);

    useEffect(() => {
        const loadInstance = async (delay: number = 100) => {
            const loadedInstance = await getInstance(instanceData.id)

            if ("requestError" in loadedInstance) {

                if (delay >= 4000) {
                    console.error(loadedInstance)
                    return
                }

                setTimeout(() => loadInstance(delay * 2), delay)
                return
            }

            setInstance(loadedInstance)
        }
        loadInstance()
    }, [])

    useEffect(() => {
        if (instance == null || running.current) return

        if (error) return

        //const currentStatus = getStatus(instance)

        running.current = true
        handleStatus(instanceData, parent, instance, setInstance, setError, updateInstance, toast);


        running.current = false
        return
    }, [instance, error]);

    if (instance == null) return (
        <Card className="p-2">
            <CardContent className="py-3 px-6 text-sm">
                Loading instance {instanceData.id}...
            </CardContent>
        </Card>
    )

    const status = getStatus(instance)
    const colorStatus = instanceData.status === "running" ? "bg-yellow-500" : (instanceData.status === "completed" ? "bg-green-500" : "bg-red-500")

    const lastScore = messages.length === 0 ? 0 : getLastAiMessage(messages)?.score

    if (error) {
        return (
            <Card className="p-2">
                <CardTitle className="flex justify-between text-md px-4 py-2 bg-secondary rounded-lg">
                    {instance.intentModel?.displayName}

                    <Badge variant={"outline"} className={`text-foreground ${colorStatus}`} >{instanceData.status.toUpperCase()}</Badge>
                </CardTitle>
                <CardContent className="py-3 px-6 text-sm">
                    <div className="flex gap-2">
                        Current action: <p className="font-semibold"> {status}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <p>
                            Score:
                        </p>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                    border-transparent bg-lime-700 text-primary hover:bg-lime-700/60 gap-1">
                            {getScoreRepresentation(lastScore)}
                        </div>

                        <p className="">
                            /
                        </p>

                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                    border-transparent bg-yellow-300 text-primary-foreground hover:text-primary hover:bg-yellow-300/60 gap-1">
                            {getScoreRepresentation(instanceData.evaluation?.maxScore)}
                        </div>
                    </div>
                    <div className="font-semibold">
                        ERROR : {error.message}
                    </div>
                    <Separator className="mt-2" />
                    <LastIterationMessage iteration={lastIteration} />
                </CardContent>
                <CardFooter className="py-1 justify-end">
                    <Button onClick={() => setError(undefined)}>Retry</Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card className="p-2">
            <CardTitle className="flex justify-between text-md px-4 py-2 bg-secondary rounded-lg">
                {instance.intentModel?.displayName}
                <Badge variant={"outline"} className={`text-foreground ${colorStatus}`} >{instanceData.status.toUpperCase()}</Badge>
            </CardTitle>
            <CardContent className="py-3 px-6 text-sm">
                <div className="flex gap-2">
                    Current action: <p className="font-semibold"> {status}</p>
                </div>
                {
                    status !== InstanceStatus.DONE &&
                    <div>
                        Chat status: {lastChat?.actualNode || "No active Chat"}
                    </div>
                }
                <div className="flex gap-2 items-center">
                    <p>
                        Score:
                    </p>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                    border-transparent bg-lime-700 text-primary hover:bg-lime-700/60 gap-1">
                        {getScoreRepresentation(lastScore)}
                    </div>

                    <p className="">
                        /
                    </p>

                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                    border-transparent bg-yellow-300 text-primary-foreground hover:text-primary hover:bg-yellow-300/60 gap-1">
                        {getScoreRepresentation(instanceData.evaluation?.maxScore)}
                    </div>
                </div>

                {status === InstanceStatus.DONE ?
                    <>
                        <Separator className="mt-2" />
                        <LastIterationMessage iteration={lastIteration} />
                    </> : null}
            </CardContent>
        </Card>)
}