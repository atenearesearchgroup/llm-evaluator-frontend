import { Button } from "@/components/shadcdn/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/shadcdn/ui/dialog"
import { useToast } from "@/components/shadcdn/ui/use-toast"
import { deleteInstance } from "@/services/instanceService"

type DeleteInstanceProps = {
    instanceId: number
}

export const DeleteInstance = ({ instanceId }: DeleteInstanceProps) => {
    const { toast } = useToast()

    const deleteInst = async () => {
        toast({
            title: "Trying to delete instance"
        })

        const response = await deleteInstance(instanceId)

        if ('requestError' in response) {
            toast({
                title: "Failed to delete instance",
                description: JSON.stringify(response, null, 2),
                variant: "destructive"
            })
            return
        }

        toast({
            title: "Deleted instance correctly",
            className: "bg-lime-600"
        })

        setTimeout(() => {
            window.location.href = '/'
        }, 1000)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"destructive"} className="">
                    Delete Instance
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[420px]">
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogFooter className="md:justify-between">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button variant={"destructive"} onClick={deleteInst}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}