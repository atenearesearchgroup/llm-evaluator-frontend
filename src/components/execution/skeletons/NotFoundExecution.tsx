import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useEvaluationData } from "@/hooks/useEvaluationData";

export type NotFoundExecutionProps = {
    id: number;
}

export const NotFoundExecution = ({ id }: NotFoundExecutionProps) => {
    const { getExecutionInstance, delEvaluation } = useEvaluationData()
    const { toast } = useToast()
    return (
        <Card>
            <CardTitle className="p-10 text-center">Couldn't find instances related to execution with id #{id}</CardTitle>
            <CardContent className="flex items-center flex-col gap-4">
                <p className="text-center">Please try again later or...</p>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive">Delete local data</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Do you really want to delete all the local data?</DialogTitle>
                        <p className="text-primary">This action cannot be undone.</p>
                        <div className="flex justify-end gap-2">
                            <Button variant="destructive" onClick={() => {
                                const dataInfo = getExecutionInstance(id)

                                if (!dataInfo) return;

                                delEvaluation(id)

                                toast(
                                    {
                                        variant: "default",
                                        description: "Execution deleted",
                                    }
                                )

                                setTimeout(() => {
                                    window.location.href = "/"
                                }, 2000)
                            }}>Yes</Button>
                            <DialogClose asChild>
                                <Button variant="secondary">No</Button>
                            </DialogClose>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}

