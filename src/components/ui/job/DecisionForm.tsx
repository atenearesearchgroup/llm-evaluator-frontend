
import type { Decision } from "@/model/diagram";
import { finalizeDraft, updateDraft } from "@/services/chatService";
import { getAction } from "@/utils/phase";
import { Button } from "@design/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@design/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@design/ui/select";
import { useToast } from "@design/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"

type DecisionFormProps = {
    draftId: number,
    decision: Decision
}

const FormSchema = z.object({
    decision: z.string()
})

export const DecisionForm = ({ draftId, decision }: DecisionFormProps) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    })
    const { toast} = useToast()

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const arrow = decision.arrows.find(arrow => arrow.to === data.decision)

        if (!arrow) {
            console.error("Arrow not found")
            return
        }

        console.log({ arrow })

        const phaseId = (arrow.nextDecision ? "decision:" : "") + arrow.to

        const response = await updateDraft(draftId, { actualNode: phaseId })

        if ('requestError' in  response) {
            toast(
                {
                    title: "Error",
                    description: response.message,
                    variant: "destructive"
                }
            )
        } else {
            toast(
                {
                    title: "Success",
                    description: "Successfully updated draft",
                    className: "bg-lime-600"
                }
            )

            if (!arrow.nextDecision && getAction(arrow.to).to == null) {
                const finalizeResponse = await finalizeDraft(draftId, true)

                if ('requestError' in finalizeResponse) {
                    toast(
                        {
                            title: "Error",
                            description: finalizeResponse.message,
                            variant: "destructive"
                        }
                    )
                } 

            }

            setTimeout(()=> {
                window.location.reload()
            }, 1000)
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
            >
                {/* <FormLabel> */}
                <h3 className="font-bold mt-6 mb-2">Step needed data:</h3>
                {/* </FormLabel> */}
                <FormField
                    control={form.control}
                    name="decision"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Decision output</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger >
                                        <SelectValue placeholder="Select a Decision" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {
                                        decision.arrows
                                            // .sort((a,b)=> a.label.localeCompare(b.label))
                                            .map((arrow) => {
                                                return <SelectItem key={arrow.to} value={arrow.to}>{arrow.label}</SelectItem>;
                                            })
                                    }
                                </SelectContent>
                            </Select>
                            {/* <FormDescription>
                                This is the title for the instance
                            </FormDescription> */}
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <Button type="submit" className="mx-auto"> Save </Button>
            </form>
        </Form>
    )
}