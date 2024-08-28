import type { InstanceInfo } from "@/hooks/useEvaluationData"
import type { AIMessage, Message, PromptIteration } from "@/model/chat"
import type { IntentInstance } from "@/model/model"
import { getInstance } from "@/services/instanceService"
import { Card, CardContent, CardFooter, CardTitle } from "@design/ui/card"
import { useEffect, useState } from "react"
import { getAllJSDocTagsOfKind } from "typescript"
import { executeAction, getStatus, InstanceStatus } from "./execution"
import { useToast } from "@design/ui/use-toast"
import type { RequestError } from "@/model/request"
import { Button } from "@design/ui/button"

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

    if(status === InstanceStatus.DONE) {
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
    const [executionData, setExecutionData] = useState<InstanceInfo>(instanceData)
    const [instance, setInstance] = useState<IntentInstance>()
    const [error, setError] = useState<RequestError>()
    const { toast } = useToast()

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

    if (instance == null) return <></>
    if (error) {
        return (<Card className="p-2 rounded-md space-y-2">
            <CardTitle>
                {instance.intentModel?.displayName}
            </CardTitle>
            <CardContent className="py-3 px-6 bg-secondary rounded-md">
                ERROR : {error.message}
                <ol className="flex flex-row justify-around">
                </ol>
            </CardContent>

            <CardFooter className="py-1 justify-end">
                <Button onClick={() => setError(undefined)}>Retry</Button>
            </CardFooter>
        </Card>)
    }

    const lastChat = instance.chats[instance.chats.length - 1] ?? {}
    // get iteration with higher index
    const lastIteration = lastChat.promptIterations?.reduce((prev: PromptIteration | null, curr) => {
        if (prev != null && prev.iteration < curr.iteration)
            return prev
        return curr
    }, null)

    const messages = lastIteration?.messages ?? []
    messages.forEach((a) => a.timestamp = new Date(Date.parse(a.timestamp as any as string)))

    const sortedMessages = messages
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const lastScore = sortedMessages.length === 0 ? 0 : getLastAiMessage(sortedMessages)?.score

    handleStatus(instanceData, instance, setInstance, setError, updateInstance, toast)

    return (
        <Card>
            <CardContent className="py-3 px-6">
                {instance.intentModel?.displayName}  - {lastChat?.actualNode || "No active Chat"} - {lastScore}
                <ol className="flex flex-row justify-around">
                </ol>
            </CardContent>
            {/* <!-- <CardFooter>
              <p>Card Footer</p>
            </CardFooter> --> */}
        </Card>)
}