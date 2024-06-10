import type { AIMessage, UserMessage } from "@/model/chat"
import { Badge } from "@design/ui/badge"
import { Separator } from "@design/ui/separator"


type UserTranscriptProps = {
    message: UserMessage,
    idx: number,
    dateFormat: Intl.DateTimeFormat
}

export const UserTranscript = ({ message, idx, dateFormat }: UserTranscriptProps) => {

    const date = Date.parse(message.timestamp as any as string)
    const formattedDate = dateFormat.format(date)

    return (
        <div key={`message-${message.id}`} className="group border hover:border-accent-foreground p-2 px-4 mx-1 my-2 rounded-lg bg-background 
       
        hover:scale-105 transition-all duration-300">
            <div className="flex flex-row justify-between items-center py-1">
                <h4 className=" font-semibold">
                    {"Input #" + (idx + 1)}
                </h4>
                <div className="gap-2 flex">
                    <Badge variant={"default"} className="py-1 px-2 text-xs items-center align-middle text-center ">
                        {message.type}
                    </Badge>
                    <Badge variant={"secondary"} className="py-1 px-2 text-xs border-accent-foreground/60  items-center align-middle text-center ">
                        {formattedDate}
                    </Badge>
                </div>
            </div>
            <Separator className="group-hover:bg-accent-foreground my-1" />
            <p>
                {message.content}
            </p>
        </div>
    )
}