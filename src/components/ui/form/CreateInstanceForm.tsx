import { getPlatforms } from "@/services/platformService"
import type { CreateInstanceRequest, RequestError } from "@/model/request"
import { useEffect, useState, type FormEvent } from "react"
import type { EvaluationSettings, IntentModel, ModelSettings } from "@/model/model"
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
import { SelectIcon } from "@radix-ui/react-select"
import { ChevronsUpDown } from "lucide-react"

const getAvailablePlatforms = async (): Promise<[string[], IntentModel[]]> => {
    const platforms = await getPlatforms()
    const intentModels = await getModels()

    if ('requestError' in platforms) {
        console.error(platforms)
        return [[], []]
    }


    if ('requestError' in intentModels) {
        console.error(intentModels)
        return [[], []]
    }

    return [platforms, intentModels]
}

type DraftForm = EvaluationSettings & ModelSettings & {
    title: string,
    llm: string
}

export const FormSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    llm: z.string(),
    intentModel: z.string(),

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



export const CreateInstanceForm = ({ }) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "New Instance",
            maxK: 1,
            maxDrafts: 1,
            maxRepeatingPrompt: 1
        },
    })
    const [data, setData] = useState<{ llms: string[], intentModels: IntentModel[] }>({ llms: [], intentModels: [] })
    const { toast } = useToast()

    useEffect(() => {
        const platforms = async () => {
            const [llms, intentModels] = await getAvailablePlatforms()
            setData({
                llms,
                intentModels
            })
        }

        platforms()

    }, [])

    function onSubmit(data: z.infer<typeof FormSchema>) {

        const modelSettings: ModelSettings = addNonUndefined(data.modelSettings) as ModelSettings

        toast({
            title: "Instance submitted",
            description: "Your instance will be created within seconds",
            // className: "bg-lime-600"
        })

        const request: CreateInstanceRequest = {
            platform: data.llm,
            displayName: data.title,
            evaluationSettings: {
                maxDrafts: data.maxDrafts,
                maxK: data.maxK,
                maxRepeatingPrompt: data.maxRepeatingPrompt,
            } as EvaluationSettings,
            modelSettings
        }

        console.log("request", request)

        const requestFunc = async () => {
            const response = await createInstance(data.intentModel, request)

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
                        description: "Instance created",
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
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the title for the instance
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="intentModel"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Intent Model</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger >
                                        <SelectValue placeholder="Select a Intent Model" />
                                        
                                        {/* <SelectIcon asChild>
                                          <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                        </SelectIcon> */}
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {data.intentModels.map((intentModel) => <SelectItem key={intentModel.modelName} value={intentModel.modelName}>{intentModel.displayName}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {/* <FormDescription>
                                This is the platform to be used
                            </FormDescription> */}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="llm"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Platform</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a platform" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {data.llms.map((llm) => <SelectItem key={llm} value={llm}>{llm}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                This is the platform to be used
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <EvaluationSetingsForm control={form.control} />
                <ModelSetingsForm control={form.control} />
                <Button type="submit">Create</Button>
            </form>
        </Form>
    )
}
