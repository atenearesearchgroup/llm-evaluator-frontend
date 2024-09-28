import type { PromptIteration } from "@/model/chat";
import { Button } from "@design/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@design/ui/collapsible";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";


export const LastIterationMessage = ({ iteration }: { iteration?: PromptIteration | null }) => {
    const [open, setOpen] = useState(false)

    if (!iteration || iteration.messages.length === 0)
        return <></>

    const lastMessage = iteration.messages[iteration.messages.length - 1]

    return <Collapsible onOpenChange={setOpen}  >
        <CollapsibleTrigger >
            <Button variant={"link"} className="gap-1 p-0">
                See last message from ({lastMessage.type}) {open ? <ChevronUpIcon className="size-6"/> : <ChevronDownIcon className="size-6"/> }
            </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
            <div className="space-y-3">
                <p className="font-semibold whitespace-break-spaces">{lastMessage.content} </p>
            </div>
        </CollapsibleContent>
    </Collapsible>
}