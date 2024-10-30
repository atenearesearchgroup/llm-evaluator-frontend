import { useEvaluationData } from "@/hooks/useEvaluationData";
import { deleteInstance } from "@/services/instanceService";
import { Button } from "@design/ui/button";
import { Dialog, DialogDescription, DialogTrigger, DialogContent, DialogFooter, DialogClose } from "@design/ui/dialog";
import { useToast } from "@design/ui/use-toast";

type TranscriptInstanceProps = {
    id: number;
}

export const TranscriptInstance = ({ id }: TranscriptInstanceProps) => {
    return (
        <Button
            variant={"link"}
            onClick={() => {
                window.open(`/instances/${id}/transcript`, '_blank')
            }}
            >
            Open Transcript
        </Button>
    )

}