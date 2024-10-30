import { Button } from "@design/ui/button";

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