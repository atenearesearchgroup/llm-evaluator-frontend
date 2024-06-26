import type { IntentInstance } from "@/model/model"
import { createChat as createChat } from "@/services/instanceService"
import { Button } from "@design/ui/button"
import { useToast } from "@design/ui/use-toast"


type CreateChatProps = {
    instance: IntentInstance
}

export const CreateChat = ({ instance }: CreateChatProps) => {
    const { toast } = useToast()

    const fetchApi = async () => {
        const response = await createChat(instance.id)

        if ('requestError' in response) {
            toast({
                variant: "destructive",
                title: "Couldn't create new chat",
                description: `${response.message}`
            })
            return
        }

        toast({
            title: "Created new chat",
            className: "bg-lime-600"
        })

        setTimeout(() => {
            window.location.reload()
            // window.location.href = `/instances/${instance.id}`
        }, 1000)
    }

    const lastChatSuccess = instance.chats.length > 0 && instance.chats[instance.chats.length - 1].actualNode === "end"
    const lastChatNotFinalized = instance.chats.length > 0 && !instance.chats[instance.chats.length - 1].finalized

    return (<>
        <Button onClick={fetchApi} variant={"outline"} className="mx-auto justify-self-center my-2" disabled={instance.chats.length >= instance.maxChats || lastChatSuccess || lastChatNotFinalized}>New chat</Button>
    </>)
}