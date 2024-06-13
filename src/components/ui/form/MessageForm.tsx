import type { Action, Phase } from "@/model/diagram"
import type { Chat } from "@/model/chat"
import type { CreateMessageRequest, RequestError } from "@/model/request"
import { finalizeDraft, getChat, sendMessage, updateDraft } from "@/services/chatService"
import { getAction } from "@/utils/phase"
import { Button } from "@design/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@design/ui/form"
import { Input } from "@design/ui/input"
import { Label } from "@design/ui/label"
import { Switch } from "@design/ui/switch"
import { toast } from "@design/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Textarea } from "@design/ui/textarea"
import type { IntentInstance } from "@/model/model"


export const MessageFormSchema = z.object({
    input: z.string().min(1, {
        message: "Input must be at least 1.",
    }),
    response: z.string(),
    score: z.coerce.number().optional().or(z.coerce.number().min(0.0)),
})

type MessageFormProps = {
    instance: IntentInstance,
    draft: Chat,
    phase: Action
}

const sendRequest = async (phase: Action, draft: Chat, validSyntax: boolean, input: string, response?: string, score?: number) => {
    const inputRequest: CreateMessageRequest = {
        content: input,
        promptType: phase.id
    }

    if (!validSyntax)
        score = -1

    // Added just in case response generation is added
    const responseRequest: CreateMessageRequest | undefined = response ? {
        content: response,
        manual: true,
        promptType: phase.id,
        score: score ?? 0
    } : undefined


    let invalid = await createMessage(draft, inputRequest)

    if (invalid) {
        return [false, invalid.message]
    }

    if (responseRequest == null) {
        return [false, "No response provided"]
    } else {
        invalid = await createMessage(draft, responseRequest)

        if (invalid) {
            return [false, invalid.message]
        }
    }

    const updatedChat = await getChat(draft.id)

    if (!('requestError' in updatedChat) && updatedChat.finalized) {
        return [true, "Chat has been finalized, due to maximum errors reached"]
    }

    if (!validSyntax) {
        return [true, "Message has been sent, but the phase has not been updated"]
    }

    const updateRequest = await updateDraft(draft.id, { actualNode: phase.to })

    if ('requestError' in updateRequest) {
        return [false, updateRequest.message]
    }

    const toAction = phase.to == null ? null : getAction(phase.to)

    if (phase.to == null || toAction != null && toAction.to == null) {
        const invalidDraft = await finalizeDraft(draft.id, true)

        if ('requestError' in invalidDraft) {
            return [false, invalidDraft.message]
        }

        return [true, "Chat has been finalized"]
    }

    return [true, "Message has been sent"]

}

const createMessage = async (draft: Chat, request: CreateMessageRequest) => {
    const response = await sendMessage(draft.id, request)

    if ('requestError' in response) {
        return response as RequestError
    }

    return false
}


export const MessageForm = ({  instance,draft, phase }: MessageFormProps) => {
    const form = useForm<z.infer<typeof MessageFormSchema>>({
        resolver: zodResolver(MessageFormSchema),
        defaultValues: {
            score: undefined
        }
    })
    const [manual, setManual] = useState(true)
    const [validSyntax, setValidSyntax] = useState(true)

    const onSubmit = async (data: z.infer<typeof MessageFormSchema>) => {
        const [success, message] = await sendRequest(phase,  draft, validSyntax, data.input, data.response, validSyntax ? data.score : undefined)

        if (!success) {
            toast(
                {
                    title: "Error",
                    description: message,
                    variant: "destructive"
                }
            )
        } else if (message !== "") {
            toast(
                {
                    title: "Success",
                    description: message,
                    className: "bg-lime-600"
                }
            )

            setTimeout(() => {
                window.location.reload()
            }, 2500)
        }
    }


    return (
        <Form {...form} >
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
                                <Textarea placeholder="" {...field} />
                            </FormControl>
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
                                    <Textarea placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />}



                <div className="flex items-center space-x-2 mb-2 justify-center gap-4">
                    <Label htmlFor="valid-syntax">Does the generated diagram have a valid syntax?</Label>
                    <Switch id="valid-syntax" checked={validSyntax}
                        onCheckedChange={setValidSyntax} />
                </div>

                <FormField
                    control={form.control}
                    name="score"
                    render={({ field }) =>
                    (<FormItem>
                        <FormLabel>Score</FormLabel>
                        <FormControl>
                            <Input type="number" inputMode="decimal" min={0} max={100} placeholder="" {...field}
                                disabled={!validSyntax} step={"any"} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>)
                    }
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