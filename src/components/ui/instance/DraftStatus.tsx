import type { Draft, Message } from "@/model/draft"
import { Card, CardContent, CardHeader, CardTitle } from "@design/ui/card"
import { Separator } from "@design/ui/separator"


type DraftStatusProps = {
    draft: Draft
}


export const DraftStatus = ({ draft }: DraftStatusProps) => {
    const prompts = draft.promptIterations.map((iteration) =>
        iteration.messages.filter((messages: Message) => messages.type === "user"))

    return (<Card>
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
    </Card>)
}