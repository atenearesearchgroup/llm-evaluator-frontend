
import type { Chat } from "@/model/chat";
import type { Decision } from "@/model/diagram";
import type { IntentInstance } from "@/model/model";
import { finalizeDraft, getChat, updateDraft } from "@/services/chatService";
import { getAction } from "@/utils/phase";
import { Button } from "@design/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@design/ui/form";
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
    instance: IntentInstance,
    draftId: number,
    decision: Decision
}

const FormSchema = z.object({
    decision: z.string()
})

const checkExceededMaxRepeatingPrompt = (chat: Chat, instance: IntentInstance, phaseId: string) => {
    const exceededMaxRepeatingPrompt = chat.promptIterations.filter(p => p.type === phaseId).length >= instance.maxRepeatingPrompt;

    if (!exceededMaxRepeatingPrompt)
        return false;

    finalizeDraft(chat.id);    

    return true;
}

export const DecisionForm = ({ instance, draftId, decision }: DecisionFormProps) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    })
    const { toast } = useToast()

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const arrow = decision.arrows.find(arrow => arrow.to === data.decision)

        if (!arrow) {
            console.error("Arrow not found")
            return
        }

        console.log({ arrow })

        if (!arrow.nextDecision) {
            const chat = await getChat(draftId)

            if ('requestError' in chat) {
                toast({
                        title: "Error",
                        description: chat.message,
                        variant: "destructive"
                    })
                return
            }

            if (checkExceededMaxRepeatingPrompt(chat, instance, arrow.to)) {
                toast({
                        title: "Error",
                        description: "Chat has been finalized, due to maximum repeating prompts reached",
                        variant: "destructive"
                    })

                setTimeout(() => {
                    window.location.reload()
                }, 2500)
                return
            }

        }

        const phaseId = (arrow.nextDecision ? "decision:" : "") + arrow.to

        const response = await updateDraft(draftId, { actualNode: phaseId })

        if ('requestError' in response) {
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
                    description: "Successfully updated chat",
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

            setTimeout(() => {
                window.location.reload()
            }, 800)
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
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <Button type="submit" className="mx-auto"> Save </Button>
            </form>
        </Form>
    )
}