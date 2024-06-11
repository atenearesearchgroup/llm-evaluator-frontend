import type { AIMessage, Chat } from "@/model/chat"
import { Button } from "@design/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@design/ui/collapsible";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import { AITranscript } from "./transcript/AITranscript"
import { UserTranscript } from "./transcript/UserTranscript";

const dateFormat = new Intl.DateTimeFormat("es", {
    dateStyle: "short",
    timeStyle: "short"
});

type DraftTranscriptProps = {
    draft: Chat;
}

export const DraftTranscript = ({ draft }: DraftTranscriptProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const messages = draft.promptIterations.map((prompIteration) => prompIteration.messages).reduce((acc, value) => acc.concat(value), [])
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())


    return (<Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
    >
        <fieldset id={`transcript-${draft.id}`} className={`grid gap-6 bg-card rounded-lg border p-3 ${isOpen ? "p-2" : ""}`}>
            <legend className="-ml-1 px-1 text-sm font-medium flex items-center justify-start space-x-2 ">
                <p className="text font-bold">
                    Transcript
                </p>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="size-6 p-0">
                        {isOpen ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </legend>

            <CollapsibleContent className="grid gap-2">
                
                {
                    draft.promptIterations.map((iteration, idx) => {
                        const messages = iteration.messages
                        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
                        return <div key={`iteration-${iteration.id}`} className="grid gap-2">
                            <p className="font-semibold ms-1">Iteration #{iteration.type}</p>
                            {messages.map((message, idx) => {
                        return message.type === 'user' ?
                            <UserTranscript key={`message-${message.id}`} message={message} dateFormat={dateFormat} idx={idx} /> :
                            <AITranscript key={`message-${message.id}`} message={message as AIMessage} dateFormat={dateFormat} idx={idx} />
                    })}
                            </div>
                    })
                }
                {/* {
                    messages.map((message, idx) => {
                        return message.type === 'user' ?
                            <UserTranscript key={`message-${message.id}`} message={message} dateFormat={dateFormat} idx={idx} /> :
                            <AITranscript key={`message-${message.id}`} message={message as AIMessage} dateFormat={dateFormat} idx={idx} />
                    })
                } */}

            </CollapsibleContent>
        </fieldset>
    </Collapsible>)
}