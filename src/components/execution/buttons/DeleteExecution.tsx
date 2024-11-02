import { useEvaluationData } from "@/hooks/useEvaluationData";
import { deleteInstance } from "@/services/instanceService";
import { Button } from "@/components/ui/button";
import { Dialog, DialogDescription, DialogTrigger, DialogContent, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

type DeleteExecutionProps = {
    id: number;
}

export const DeleteExecution = ({ id }: DeleteExecutionProps) => {
    const { getExecutionInstance, delEvaluation } = useEvaluationData()
    const { toast} = useToast()

    const handleDelete = async () => {
        console.log(`Delete execution with id: ${id}`)

        const dataInfo = getExecutionInstance(id)

        if (!dataInfo) return;

        await Promise.all(dataInfo.instances.map(async (instance) => {
            console.log(`Deleting instance ${instance.id}`)
            return deleteInstance(instance.id)
        }))

        delEvaluation(id)

        toast(
            {
                variant: "default",
                description: "Execution deleted",
            }
        )

        
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={"destructive"} >
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogDescription>
                    <p className="text-primary">
                        Do you really want to delete all these instances?
                    </p>
                </DialogDescription>
                <DialogFooter>
                    <Button variant={"destructive"} onClick={handleDelete}>Yes</Button>
                    <DialogClose asChild>
                        <Button variant={"secondary"}>No</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}