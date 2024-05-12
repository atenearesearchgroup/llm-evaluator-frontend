import { generateDiagram } from "@/utils/phase"
import { Button } from "@design/ui/button"
import { ScrollArea, ScrollBar } from "@design/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@design/ui/sheet"
import { useEffect, useMemo, useState } from "react"

type DiagramStatusProps = {
    currentPhase: string,
}

export const DiagramStatus = ({ currentPhase }: DiagramStatusProps) => {
    const [actualPhase, setActualPhase] = useState(currentPhase)
    const diagram = useMemo(() => {
        let text = generateDiagram(actualPhase)

        return text
    }, [actualPhase])
    const diagramChannel = useMemo(() => {
        return new BroadcastChannel('diagram')
    }, [])

    const updateDiagram = () => {
        diagramChannel.postMessage({
            action: "update",
            diagram
        })
    }

    useEffect(() => {
        updateDiagram()
    }, [diagram])

    console.log("outputDiagram", diagram)

    return (<>
        <Sheet
            onOpenChange={(open) => {
                if (open)
                    updateDiagram()
            }}
        >
            <SheetTrigger asChild>
                <Button variant={"secondary"}>
                    See flow diagram status
                </Button>
            </SheetTrigger>
            <SheetContent
                className="sm:max-w-md"
            >
                <SheetTitle>
                    Diagram Status
                </SheetTitle>
                <SheetDescription>
                    <ScrollArea className=" h-[90dvh] w-90 rounded-md border bg-foreground ">
                        <div id="diagram" className="p-2 rounded-lg w-max"></div>

                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </SheetDescription>
            </SheetContent>
        </Sheet>

    </>)
}