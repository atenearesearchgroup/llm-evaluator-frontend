import type { IntentInstance } from "@/model/model"
import { createDraft } from "@/services/instanceService"
import { Button } from "@design/ui/button"
import { useToast } from "@design/ui/use-toast"


type CreateDraftProps = {
    instance: IntentInstance
}

export const CreateDraft = ({ instance }: CreateDraftProps) => {
    const { toast } = useToast()

    const fetchApi = async () => {
        const response = await createDraft(instance.id)

        console.log(response)

        if ('requestError' in response) {
            toast({
                variant: "destructive",
                title: "Couldn't create new draft",
                description: `${response.message}`
            })
            return
        }

        toast({
            title: "Created new draft",
            className: "bg-lime-600"
        })

        setTimeout(() => {
            // window.location.href = `/instances/${instance.id}`
        }, 1000)
    }

    return (<>
        <Button onClick={fetchApi} variant={"outline"} className="mx-auto justify-self-center my-2">New draft</Button>
    </>)
}