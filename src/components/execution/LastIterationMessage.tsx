import type { PromptIteration } from "@/model/chat";


export const LastIterationMessage = ({ iteration }: { iteration?: PromptIteration|null }) => {

    if(!iteration || iteration.messages.length === 0) 
        return <></>
    
    const lastMessage = iteration.messages[iteration.messages.length - 1]

    return <div className="space-y-3">
        Last message ({lastMessage.type}) : <p className="font-semibold"> {lastMessage.content} </p>
    </div>
}