import type { InstanceInfo } from "@/hooks/useEvaluationData"
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

type RunningInstanceProps = {
    instanceData: InstanceInfo,
    updateInstance: (instance: InstanceInfo) => void
}

const getLastAiMessage = (messages: (Message | AIMessage)[]): AIMessage | null => {
    let lastMessage = messages[messages.length - 1]

    if (`score` in lastMessage)
        return lastMessage

    if (messages.length < 2)
        return null

    return messages[messages.length - 2] as AIMessage
}

const handleStatus = async (instanceData: InstanceInfo, instance: IntentInstance,
    setInstance: React.Dispatch<React.SetStateAction<IntentInstance | undefined>>,
    setError: React.Dispatch<React.SetStateAction<RequestError | undefined>>,
    updateInstance: (instance: InstanceInfo) => void,
    toast: any) => {
    const status = getStatus(instance)

    console.log("status", instance.id, status)

    if (status === InstanceStatus.DONE) {
        console.log("DONE")
        return
    }

    try {
        const newInstance = await executeAction(instanceData, instance, status)

        console.log("newInstance", instance.id, newInstance)

        if (`requestError` in newInstance) {
            throw newInstance
        }

        updateInstance(instanceData)

        setTimeout(() => {
            console.log("x0000")
            setInstance(newInstance)
        }, 1000)
    } catch (e: RequestError | any) {
        setError(e)
        console.error(e)

        toast({
            title: "Error on instance " + instance.intentModel?.displayName,
            description: e.message
        })
    }

}

export const RunningInstance = ({ instanceData, updateInstance }: RunningInstanceProps) => {
    const running = useRef(false)
    const [instance, setInstance] = useState<IntentInstance>()
    const [error, setError] = useState<RequestError>()
    const { toast } = useToast()


    const lastChat = instance == null ? null : instance.chats[instance.chats.length - 1] ?? {}
    // get iteration with higher index
    const lastIteration = useMemo(() => {
        return lastChat?.promptIterations?.reduce((prev: PromptIteration | null, curr) => {
            if (prev != null && prev.iteration < curr.iteration)
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

        running.current = true
        handleStatus(instanceData, instance, setInstance, setError, updateInstance, toast);
        running.current = false
    }, [instance]);

    if (instance == null) return (
        <Card className="p-2">
            <CardContent className="py-3 px-6 text-sm">
                Loading instance {instanceData.id}...
            </CardContent>
        </Card>
    )

    const status = getStatus(instance)
    const colorStatus = instanceData.status === "running" ? "bg-yellow-500" : (instanceData.status === "completed" ? "bg-green-500" : "bg-red-500")

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
                    <div className="font-semibold">
                        ERROR : {error.message}
                    </div>
                    <LastIterationMessage iteration={lastIteration} />
                </CardContent>
                <CardFooter className="py-1 justify-end">
                    <Button onClick={() => setError(undefined)}>Retry</Button>
                </CardFooter>
            </Card>
        )
    }

    const lastScore = messages.length === 0 ? 0 : getLastAiMessage(messages)?.score

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
                <div>
                    Last Score: {lastScore} / {instanceData.evaluation?.maxScore}
                </div>
            </CardContent>
        </Card>)
}