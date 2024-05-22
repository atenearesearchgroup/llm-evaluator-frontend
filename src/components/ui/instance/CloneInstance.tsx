import { Button } from "@/components/shadcdn/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/shadcdn/ui/dialog"
import { useToast } from "@/components/shadcdn/ui/use-toast"
import { deleteInstance } from "@/services/instanceService"
import { useState } from "react"
import { CloneInstanceForm } from "../form/CloneInstanceForm"
import type { IntentInstance } from "@/model/model"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { ScrollBar } from "@design/ui/scroll-area"


type CloneInstanceProps = {
    instance: IntentInstance
}

export const CloneInstance = ({ instance }: CloneInstanceProps) => {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"default"} className="">
                    Clone
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[520px]">
                <DialogTitle>Clone instance with new settings</DialogTitle>
                <ScrollArea className="w-max mx-auto">
                    <div className="h-[700px] w-[400px] overflow-y-auto overflow-x-hidden mx-auto">
                        <CloneInstanceForm instance={instance} />
                    </div>
                    <ScrollBar orientation="horizontal" />
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
                {/* <DialogClose asChild>
                        <Button type="button" variant="secondary" className="">
                            Close
                        </Button>
                    </DialogClose> */}
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