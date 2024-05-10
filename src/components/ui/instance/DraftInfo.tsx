import type { Draft, Message } from "@/model/draft"
import { Button } from "@design/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@design/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@design/ui/collapsible";
import { Separator } from "@design/ui/separator";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { DraftTranscript } from "./DraftTranscript";

type DraftInfoProps = {
    draft: Draft;
    children?: ReactNode
}

export const DraftInfo = ({ draft, children }: DraftInfoProps) => {
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
                    Draft #{draft.draftNumber}
                </p>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="size-6 p-0">
                        {isOpen ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </legend>
            <Card>
                <CardHeader className="py-2">
                    <CardTitle className="text-lg">Current Status</CardTitle>
                    {/* <CardDescription>Card Description</CardDescription> */}
                </CardHeader>
                <div className="flex flex-row justify-center">
                    <Separator className="max-w-[95%]" />
                </div>
                <CardContent className="py-2 items-center">
                    <ol className="flex flex-row justify-around text-sm">
                        <li className="flex flex-col gap-1 justify-center place-items-center">
                            <p className="font-semibold">Actual Step</p>
                            <p className="text-xs">{draft.actualNode ?? "Not in action"}</p>
                        </li>
                        <li className="flex flex-col gap-1 justify-center place-items-center">
                            <p className="font-semibold">Prompts</p>
                            <p className="text-xs">{prompts.length}</p>
                        </li>
                        {/* <li className="flex flex-col gap-1 justify-center place-items-center">
                        <p className="font-semibold">Drafts</p>
                        <p className="">{instance.drafts.length}</p>
                    </li> */}
                    </ol>
                </CardContent>
                {/* <!-- <CardFooter>
      <p>Card Footer</p>
    </CardFooter> --> */}
            </Card>

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