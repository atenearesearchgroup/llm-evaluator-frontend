import { getPlatforms } from "@/services/platformService"
import type { CloneInstanceRequest, CreateInstanceRequest, RequestError } from "@/model/request"
import { useEffect, useState, type FormEvent } from "react"
import type { EvaluationSettings, IntentInstance, IntentModel, ModelSettings } from "@/model/model"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/shadcdn/ui/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcdn/ui/form"
import { Input } from "@/components/shadcdn/ui/input"
import { Button } from "@/components/shadcdn/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcdn/ui/select"
import { EvaluationSetingsForm } from "./EvaluationSettingsForm"
import { ModelSetingsForm } from "./ModelSettingsForm"
import { createInstance, getModels } from "@/services/intentService"
import { cloneInstance } from "@/services/instanceService"


export const CloneFormSchema = z.object({
    maxK: z.coerce.number().int().min(1, {
        message: "Max K must be at least 1.",
    }),
    maxDrafts: z.coerce.number().int().min(1, {
        message: "Max drafts must be at least 1.",
    }),
    maxRepeatingPrompt: z.coerce.number().int().min(1, {
        message: "Max repeating prompt must be at least 1.",
    }),

    modelSettings: z.object({
        modelName: z.string(),
        modelOwner: z.string().optional(),
        version: z.string().optional(),
        systemPrompt: z.string().optional(),
        maxTokens: z.coerce.number().int().optional(),
        temperature: z.coerce.number().optional(),
        topP: z.coerce.number().optional(),
        frequencyPenalty: z.coerce.number().optional(),
        presencePenalty: z.coerce.number().optional()
    })
})


const addNonUndefined = (obj: ModelSettings) => {
    const result: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined && value !== null && value !== -1) {
            result[key] = value
        }
    }

    return result
}

const valueOrUndefined = (modelSettings: ModelSettings) => {
    // const result:
    const result = {
        modelName: modelSettings.modelName ?? undefined,
        modelOwner: modelSettings.modelOwner ?? undefined,
        version: modelSettings.version ?? undefined,
        systemPrompt: modelSettings.systemPrompt ?? undefined,
        maxTokens: modelSettings.maxTokens ?? undefined,
        temperature: modelSettings.temperature ?? undefined,
        topP: modelSettings.topP ?? undefined,
        frequencyPenalty: modelSettings.frequencyPenalty ?? undefined,
        presencePenalty: modelSettings.presencePenalty ?? undefined
    }

    return result
}


type CloneInstanceFormProps = {
    instance: IntentInstance
}

export const CloneInstanceForm = ({ instance }: CloneInstanceFormProps) => {
    const form = useForm<z.infer<typeof CloneFormSchema>>({
        resolver: zodResolver(CloneFormSchema),
        defaultValues: {
            modelSettings: valueOrUndefined(instance.modelSettings),
            maxK: instance.maxK,
            maxDrafts: instance.maxDrafts,
            maxRepeatingPrompt: instance.maxRepeatingPrompt
        },
    })
    const { toast } = useToast()

    function onSubmit(data: z.infer<typeof CloneFormSchema>) {

        const modelSettings: ModelSettings = addNonUndefined(data.modelSettings) as ModelSettings

        toast({
            title: "Instance submitted",
            description: "Your instance will be cloned within seconds",
            // className: "bg-lime-600"
        })

        const request: CloneInstanceRequest = {
            evaluationSettings: {
                maxDrafts: data.maxDrafts,
                maxK: data.maxK,
                maxRepeatingPrompt: data.maxRepeatingPrompt,
            } as EvaluationSettings,
            modelSettings
        }

        console.log("request", request)

        const requestFunc = async () => {
            const response = await cloneInstance(instance.id, request)

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
                        description: "Instance cloned",
                        className: "bg-lime-600"
                    }
                )

                // setTimeout(() => {
                window.open(`/instances/${response.id}`, '_blank');
                // },2000)
            }
        }

        requestFunc()
    }

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 mx-auto py-5">
                <EvaluationSetingsForm control={form.control} />
                <ModelSetingsForm control={form.control} />
                <Button type="submit">Create</Button>
            </form>
        </Form>
    )
}
