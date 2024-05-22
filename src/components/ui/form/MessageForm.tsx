import type { Action, Phase } from "@/model/diagram"
import type { Draft } from "@/model/draft"
import type { CreateMessageRequest } from "@/model/request"
import { finalizeDraft, sendMessage, updateDraft } from "@/services/draftService"
import { Button } from "@design/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@design/ui/form"
import { Input } from "@design/ui/input"
import { Label } from "@design/ui/label"
import { Switch } from "@design/ui/switch"
import { Textarea } from "@design/ui/textarea"
import { toast } from "@design/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"


export const MessageFormSchema = z.object({
    input: z.string().min(1, {
        message: "Input must be at least 1.",
    }),
    response: z.string().optional(),
    score: z.coerce.number().optional(),
})

type MessageFormProps = {
    draft: Draft,
    phase: Action
}


export const MessageForm = ({ draft, phase }: MessageFormProps) => {
    const form = useForm<z.infer<typeof MessageFormSchema>>({
        resolver: zodResolver(MessageFormSchema)
    })
    const [manual, setManual] = useState(false)


    function onSubmit(data: z.infer<typeof MessageFormSchema>) {

        const inputRequest: CreateMessageRequest = {
            content: data.input,
            promptType: phase.id
        }

        const responseRequest: CreateMessageRequest | undefined = manual ? {
            content: data.response ?? "",
            promptType: phase.id,
            score: data.score ?? 0,
            manual: true
        } : undefined

        console.log("inputRequest", inputRequest)

        const requestFunc = async () => {
            let success = true
            const response = await sendMessage(draft.id, inputRequest)

            if ('requestError' in response) {
                toast(
                    {
                        title: "Error",
                        description: response.message,
                        variant: "destructive"
                    }
                )
                success = false
            } else {

                if (responseRequest) {
                    const responseResponse = await sendMessage(draft.id, responseRequest)
                    if ('requestError' in responseResponse) {
                        toast(
                            {
                                title: "Error",
                                description: responseResponse.message,
                                variant: "destructive"
                            }
                        )
                        success = false
                    }
                }

                toast(
                    {
                        title: "Success",
                        description: "Message has been sent",
                        className: "bg-lime-600"
                    }
                )
            }

            if(success) {

                if(phase.to === undefined)  {
                    const finalizeRequest = await finalizeDraft(draft.id, true)

                    if ('requestError' in finalizeRequest) {
                        toast(
                            {
                                title: "Error",
                                description: finalizeRequest.message,
                                variant: "destructive"
                            }
                        )
                    } else {
                        toast(
                            {
                                title: "Success",
                                description: "Draft has been finalized",
                                className: "bg-lime-600"
                            }
                        )
                    }
                    return
                }

                const phaseRequest = await updateDraft(draft.id, { actualNode: phase.to })

                if ('requestError' in phaseRequest) {
                    toast(
                        {
                            title: "Error",
                            description: phaseRequest.message,
                            variant: "destructive"
                        }
                    )
                } else {
                    toast(
                        {
                            title: "Success",
                            description: "Draft has been updated",
                            className: "bg-lime-600"
                        }
                    )

                    window.location.reload()
                }

            }

        }

        requestFunc()
    }

    return (
        <Form {...form} >
            <div className="flex items-center space-x-2 mb-2 justify-end">
                <Switch id="manual-mode" checked={manual}
                    onCheckedChange={setManual} />
                <Label htmlFor="manual-mode">Manual Response</Label>
            </div>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5 border rounded-lg p-3"
            >

                <FormField
                    control={form.control}
                    name="input"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Prompt</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            {/* <FormDescription>
                                This is the title for the instance
                            </FormDescription> */}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {manual &&
                    <FormField
                        control={form.control}
                        name="response"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Response</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                {/* <FormDescription>
                                This is the title for the instance
                            </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />}

                <FormField
                    control={form.control}
                    name="score"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Score</FormLabel>
                            <FormControl>
                                <Input type="number" min={0} max={100} placeholder="" {...field} />
                            </FormControl>
                            {/* <FormDescription>
                                This is the title for the instance
                            </FormDescription> */}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* {
                true === true && (
                    <div className="w-full">
                        <p>Score:</p>
                        <Input name="score" required type="number" min="0" />
                    </div>
                )
            } */}
                {/* <!-- 
                className="bg-green-500 hover:bg-green-700 bg-opacity-80 p-2 rounded-lg mx-auto" --> */}
                <Button type="submit" className="mx-auto"> Save </Button>
            </form>
        </Form>
    )
}