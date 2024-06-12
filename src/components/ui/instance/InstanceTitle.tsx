import { Input } from "@/components/shadcdn/ui/input"
import { useToast } from "@/components/shadcdn/ui/use-toast"
import { updateInstance } from "@/services/instanceService"
import { useEffect, useState } from "react"

interface InstanceTitleProps {
    instanceId: number
    title: string
}

const updateTitle = async (instanceId: number, title: string) => {
    const response = await updateInstance(instanceId, { displayName: title })

    if ('requestError' in response) {
        console.error(response)
        return false
    }

    return true;
}

export const InstanceTitle = ({ instanceId, title }: InstanceTitleProps) => {
    const [tempTitle, setTempTitle] = useState(title)
    const { toast } = useToast()
    let channel = new BroadcastChannel('title_change')

    useEffect(() => {
        const timeout = setTimeout(() => {
            console.log(tempTitle, "value")

            if (!updateTitle(instanceId, tempTitle))
                return

            channel.postMessage({ newTitle: tempTitle, instanceId })

            if(title !== tempTitle)
                toast({
                    title: "Name has been updated",
                    className: "bg-lime-600",

                })

            title = tempTitle

        }, 1000)

        return () => clearTimeout(timeout)
    }, [tempTitle])

    useEffect(() => {
        channel = new BroadcastChannel('title_change')

        return () => channel.close()
    }, [])

    const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempTitle(e.target.value)
    }

    return (
        <div >
            <Input className="text-2xl py-4 font-bold tracking-tight"
                onChange={handleTitleChange}
                defaultValue={tempTitle}
                type="text" />
        </div>
    )
}