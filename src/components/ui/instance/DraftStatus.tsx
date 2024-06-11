import type { Chat, Message } from "@/model/chat"
import { getFirstPhase } from "@/utils/phase"
import { Card, CardContent, CardHeader, CardTitle } from "@design/ui/card"
import { Separator } from "@design/ui/separator"

type DraftStatusProps = {
    draft: Chat
}

export const DraftStatus = ({ draft }: DraftStatusProps) => {
    const prompts = draft.promptIterations.map((iteration) =>
        iteration.messages.filter((messages: Message) => messages.type === "user")).reduce((acc, val) => acc.concat(val), [])
    const currentPhase = draft.actualNode ?? getFirstPhase()
    const currentPhaseId = currentPhase.startsWith("decision:") ? currentPhase.substring("decision:".length): currentPhase
    const capitalizedPhaseId = currentPhaseId.charAt(0).toUpperCase() + currentPhaseId.slice(1)

    return (<Card>
        <CardHeader className="py-2">
            <CardTitle className="text-lg">Current Status</CardTitle>
        </CardHeader>
        <div className="flex flex-row justify-center">
            <Separator className="max-w-[95%]" />
        </div>
        <CardContent className="py-2 items-center">
            <ol className="flex flex-row justify-around text-sm">
                <li className="flex flex-col gap-1 justify-center place-items-center">
                    <p className="font-semibold">Actual Step</p>
                    <p className="text-xs">{capitalizedPhaseId}</p>
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
    </Card>)
}