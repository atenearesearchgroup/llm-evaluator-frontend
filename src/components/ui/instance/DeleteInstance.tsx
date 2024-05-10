import { Button } from "@/components/shadcdn/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/shadcdn/ui/dialog"
import { useToast } from "@/components/shadcdn/ui/use-toast"
import { deleteInstance } from "@/services/instanceService"
import { useState } from "react"


type DeleteInstanceProps = {
    instanceId: number
}

export const DeleteInstance = ({ instanceId }: DeleteInstanceProps) => {
    const [modal, setModal] = useState(false)
    const { toast } = useToast()

    const deleteInst = async () => {

        toast({
            title: "Trying to delete instance"
        })

        const response = await deleteInstance(instanceId)

        console.log("response", response)

        if ('requestError' in response) {
            setModal(false)

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
            {/* <div className={`${modal ? '' : "hidden"} bg-slate-900 backdrop-blur-md bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0`}>
                <div className="bg-slate-700 bg-opacity-70 backdrop-blur-sm px-16 py-14 rounded-md text-center">
                    <h1 className="text-xl mb-4 font-bold ">Confirm Deletion</h1> */}
            {/* <button className="bg-indigo-500 px-4 py-2 rounded-md text-md text-white"
                        onClick={() => setModal(false)}>Cancel</button>
                    <button className="bg-red-500 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold"
                        onClick={deleteInst}>Delete</button> */}
            {/* </div>
            </div> */}
        </Dialog>
    )
}