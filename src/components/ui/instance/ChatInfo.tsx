import type { Chat, Message } from "@/model/chat"
import { Button, buttonVariants } from "@design/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@design/ui/collapsible";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { DraftTranscript } from "./DraftTranscript";
import { DraftStatus } from "./DraftStatus";

type DraftInfoProps = {
    intentInstanceId: number;
    draft: Chat;
    children?: ReactNode
}

export const ChatInfo = ({ intentInstanceId, draft, children }: DraftInfoProps) => {
    const [isOpen, setIsOpen] = useState(!draft.finalized)
    const prompts = draft.promptIterations.map((iteration) =>
        iteration.messages.filter((messages: Message) => messages.type === "user"))

    draft.promptIterations.forEach((iteration) => iteration.messages
        .forEach((message) => {
            message.timestamp = new Date(Date.parse(message.timestamp as any as string))
        }))

    return (<Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="transition-all duration-300"
    >
        <fieldset id="sidebar" className={`grid gap-3 bg-primary-foreground rounded-lg border p-3 ${isOpen ? "p-2" : ""}`}>
            <legend className="-ml-1 px-1 text-sm font-medium flex items-center justify-start space-x-2 ">
                <p className="text font-bold">
                    Session #{draft.draftNumber}
                </p>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="size-6 p-0">
                        {isOpen ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </legend>
            <DraftStatus draft={draft} />

            {
                !draft.finalized &&
                <a href={`/instances/${intentInstanceId}/chats/${draft.draftNumber}`}
                    className={buttonVariants({ variant: "link" }) + " bg-lime-600/60 border mx-auto"} > {draft.actualNode == null ? "Start to evaluate":"Continue evaluation"} </a>
            }
            {children}

            <CollapsibleContent className="grid gap-2">


                {/* {Object.entries(instances).map((instance, idx) => {
                        const [key, value] = instance

                        const shouldHaveSeparator = idx === 0 || <Separator className=" border" />

                        return (<> {shouldHaveSeparator}
                            <PlatformGroup instances={value} key={key} platform={key} /></>)
                    })
                    } */}

                <DraftTranscript draft={draft} />

            </CollapsibleContent>
        </fieldset>
    </Collapsible>)
}