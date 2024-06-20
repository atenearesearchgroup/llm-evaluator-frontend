import type { Chat } from "@/model/chat"
import { Button } from "@design/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@design/ui/collapsible";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { ChatTranscript } from "./ChatTranscript";
import { ChatStatus } from "./ChatStatus";

type ChatInfoProps = {
    intentInstanceId: number;
    chat: Chat;
    children?: ReactNode
}

export const ChatInfo = ({ intentInstanceId, chat, children }: ChatInfoProps) => {
    const [isOpen, setIsOpen] = useState(!chat.finalized)

    chat.promptIterations.forEach((iteration) => iteration.messages
        .forEach((message) => {
            message.timestamp = new Date(Date.parse(message.timestamp as any as string))
        }))

    const buttonText = chat.finalized ? "Finalized" : (chat.actualNode == null ? "Start to evaluate" : "Continue evaluation")

    return (<Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="transition-all duration-300"
    >
        <fieldset id="sidebar" className={`grid gap-3 bg-primary-foreground rounded-lg border p-3 ${isOpen ? "p-2" : ""}`}>
            <legend className="-ml-1 px-1 text-sm font-medium flex items-center justify-start space-x-2 ">
                <p className="text font-bold">
                    Chat #{chat.draftNumber}
                </p>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="size-6 p-0">
                        {isOpen ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </legend>

            <ChatStatus chat={chat} />

            <a href={`/instances/${intentInstanceId}/chats/${chat.draftNumber}`}
                className={"mx-auto" + (chat.finalized ? " pointer-events-none" : " ")} >
                <Button variant="link" size="sm" className="bg-lime-600/60 border mx-auto" disabled={chat.finalized}>
                    {buttonText}
                </Button>
            </a>

            {children}

            <CollapsibleContent className="grid gap-2">

                <ChatTranscript chat={chat} />

            </CollapsibleContent>
        </fieldset>
    </Collapsible>)
}