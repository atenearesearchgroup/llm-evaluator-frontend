import type { AIMessage } from "@/model/chat"
import { Badge } from "@design/ui/badge"
import { ScrollArea, ScrollBar } from "@design/ui/scroll-area"
import { Separator } from "@design/ui/separator"
import { useToast } from "@design/ui/use-toast"


type AITranscriptProps = {
    message: AIMessage,
    idx: number,
    dateFormat: Intl.DateTimeFormat
}

export const AITranscript = ({ message, idx, dateFormat }: AITranscriptProps) => {
    const {toast} = useToast()
    const date = Date.parse(message.timestamp as any as string)
    const formattedDate = dateFormat.format(date)

    return (
        <div key={`message-${message.id}`} className="group border p-2 px-4 mx-1 my-2 rounded-lg 
        hover:border-secondary-foreground
        bg-secondary 
        hover:scale-105  transition-all duration-300 hover:cursor-pointer"
            onClick={() => {
                navigator.clipboard.writeText(message.content)
                toast({
                    title: "Copied to clipboard",
                    className: "bg-lime-600"
                })
            }}
        >
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
            <ScrollArea className="mx-auto h-[min(60dvh,100%)]">
                <p className="whitespace-pre-line text-pretty break-before-page">
                    {message.content}
                </p>
                <ScrollBar orientation="vertical" className="bg-secondary-foreground/10" />
            </ScrollArea>
        </div>
    )
}