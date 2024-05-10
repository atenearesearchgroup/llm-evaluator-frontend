import type { Draft } from "@/model/draft"
import { Badge } from "@design/ui/badge";
import { Button } from "@design/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@design/ui/collapsible";
import { Separator } from "@design/ui/separator";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

const dateFormat = new Intl.DateTimeFormat("en", {
    dateStyle: "short",
    timeStyle: "short"
});

type DraftTranscriptProps = {
    draft: Draft;
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

                {messages.map((message, idx) => {
                    const date = Date.parse(message.timestamp as any as string)
                    const formattedDate = dateFormat.format(date)

                    return message.type === 'user' ?
                        <div key={`message-${message.id}`} className="group border p-2 px-4 mx-1 my-2 rounded-lg bg-background hover:bg-accent">
                            <div className="flex flex-row justify-between items-center py-1">
                                <h4 className=" font-semibold">
                                    {"Input #" + (idx + 1)}
                                </h4>
                                <div className="gap-2 flex">
                                    <Badge variant={"default"} className="py-1 px-2 text-xs items-center align-middle text-center 
                            group-hover:bg-muted-foreground/60 group-hover:text-accent-foreground">
                                        {message.type}
                                    </Badge>
                                    <Badge variant={"secondary"} className="py-1 px-2 text-xs items-center align-middle text-center 
                            group-hover:bg-accent-foreground group-hover:text-accent">
                                        {formattedDate}
                                    </Badge>
                                </div>
                            </div>
                            <Separator className="group-hover:bg-accent-foreground my-1" />
                            <p>
                                {message.content}
                            </p>
                        </div> :
                        <div key={`message-${message.id}`} className="border p-2 px-4 mx-1 my-2 rounded-lg hover:bg-accent bg-muted">
                            <div className="flex flex-row justify-between items-center py-1">
                                <h4 className=" font-semibold">
                                    {"Response #" + (idx + 1)}
                                </h4>
                                <div className="gap-2 flex">
                                    <Badge variant={"default"} className="py-1 px-2 text-xs items-center align-middle text-center 
                        group-hover:bg-muted-foreground/60 group-hover:text-accent-foreground">
                                        {message.type}
                                    </Badge>
                                    <Badge variant={"secondary"} className="py-1 px-2 text-xs items-center align-middle text-center 
                        bg-accent-foreground text-accent">
                                        {formattedDate}
                                    </Badge>
                                </div>
                            </div>
                            <Separator className="bg-accent-foreground my-1" />
                            <p>
                                {message.content}
                            </p>
                        </div>
                })}

            </CollapsibleContent>
        </fieldset>
    </Collapsible>)
}