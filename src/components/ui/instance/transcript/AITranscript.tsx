import type { AIMessage } from "@/model/chat"
import { Badge } from "@design/ui/badge"
import { Separator } from "@design/ui/separator"


type AITranscriptProps = {
    message: AIMessage,
    idx: number,
    dateFormat: Intl.DateTimeFormat
}

export const AITranscript = ({ message, idx, dateFormat }: AITranscriptProps) => {

    const date = Date.parse(message.timestamp as any as string)
    const formattedDate = dateFormat.format(date)

    return (
        <div key={`message-${message.id}`} className="group border p-2 px-4 mx-1 my-2 rounded-lg 
        hover:border-secondary-foreground
        bg-secondary 
        hover:scale-105  transition-all duration-300">
            <div className="flex flex-row justify-between items-center py-1">
                <h4 className=" font-semibold">
                    {"Response #" + (idx + 1)}
                </h4>
                <div className="gap-2 flex">
                    <Badge variant={"default"} className="py-1 px-2 text-xs items-center align-middle text-center">
                        {message.type}
                    </Badge>
                    <Badge variant={"outline"} className="py-1 px-2 text-xs border-accent-foreground/60 items-center align-middle text-center">
                        {message.score == -1 ? "Syntax Error" : message.score}
                    </Badge>
                    <Badge variant={"outline"} className="py-1 px-2 text-xs border-accent-foreground/60 items-center align-middle text-center">
                        {formattedDate}
                    </Badge>
                </div>
            </div>
            <Separator className="bg-accent-foreground/60 group-hover:bg-secondary-foreground my-1" />
            <p>
                {message.content}
            </p>
        </div>
    )
}