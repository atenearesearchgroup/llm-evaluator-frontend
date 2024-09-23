import { getPlatforms } from "@/services/platformService"
import type { CreateInstanceRequest } from "@/model/request"
import { useEffect, useState } from "react"
import type { EvaluationSettings, IntentInstance, IntentModel, ModelSettings } from "@/model/model"
import { z } from "zod"
import { useForm, type Control } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/shadcdn/ui/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcdn/ui/form"
import { Input } from "@/components/shadcdn/ui/input"
import { Button } from "@/components/shadcdn/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcdn/ui/select"
import { createInstance, createModel, getModels } from "@/services/intentService"
import { CloneFormSchema } from "../instance/form/CloneInstanceForm"
import { EvaluationSettingsForm } from "../instance/form/EvaluationSettingsForm"
import { ModelSettingsForm } from "../instance/form/ModelSettingsForm"
import { loadZipModels } from "./execution"
import { useEvaluationData } from "@/hooks/useEvaluationData"
import { deleteInstance, getInstance, getInstances } from "@/services/instanceService"
import { uploadFile } from "@/services/fileService"
import { Textarea } from "@design/ui/textarea"

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

const ZIP_MIME = "application/zip"

const ZipSchema = z
    .any()
// .instanceof(File)
// .refine((file) => file.type === ZIP_MIME, `File must be a zip file`)

export const FormSchema = CloneFormSchema.extend({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    zip: ZipSchema,
    llm: z.string(),
    syntax_prompt: z.string().optional(),   
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


export const CreateExecutionForm = ({ }) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "New Instance",
            maxErrors: 0,
            maxChats: 1,
            maxRepeatingPrompt: 1
        },
    })
    const [data, setData] = useState<{ llms: string[], intentModels: IntentModel[] }>({ llms: [], intentModels: [] })
    const { addEvaluation, saveExecutionData } = useEvaluationData()

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

    async function onSubmit(formData: z.infer<typeof FormSchema>) {
        const modelSettings: ModelSettings = addNonUndefined(formData.modelSettings) as ModelSettings
        const intentModels = await getModels()

        const oldInstance = await getInstances(formData.title)

        if ('requestError' in intentModels) {
            toast(
                {
                    title: "Error creating instance",
                    description: intentModels.message,
                    className: "bg-red-600"
                }
            )
            return
        }

        if ('requestError' in oldInstance) {
            toast(
                {
                    title: "Error creating instance",
                    description: oldInstance.message,
                    className: "bg-red-600"
                }
            )
            return
        }

        if (oldInstance.length > 0) {
            toast(
                {
                    title: "Error creating instance",
                    description: "An instance with the same title already exists",
                    className: "bg-red-600"
                }
            )
            return
        }

        const models = await loadZipModels(formData.zip)

        const request: CreateInstanceRequest = {
            platform: formData.llm,
            displayName: formData.title,
            evaluationSettings: {
                maxChats: formData.maxChats,
                maxErrors: formData.maxErrors,
                maxRepeatingPrompt: formData.maxRepeatingPrompt,
            } as EvaluationSettings,
            modelSettings
        }

        const createdInstances: (IntentInstance & {})[] = []

        for (const model of models) {
            if (!intentModels.find(intent => intent.modelName === model.id)) {
                await createModel({ displayName: model.id, model: model.id })
            }

            const response = await createInstance(model.id, request)

            if ('requestError' in response) {
                toast(
                    {
                        title: "Error creating instance for model " + model.id,
                        description: response.message,
                        className: "bg-red-600"
                    }
                )

                createdInstances.forEach(async (instance) => {
                    await deleteInstance(instance.id)
                })

                return
            }

            createdInstances.push(response)
        }

        if (createdInstances.length === 0) {
            toast(
                {
                    title: "No instances created",
                    description: "No instances were created",
                    className: "bg-red-600"
                }
            )
            return
        }

        for (const model of models) {
            uploadFile(model.graderModel, model.id)
        }

        console.log("models", models)
        console.log("createdInstances", createdInstances)

        addEvaluation({
            title: formData.title,
            syntax_prompt: formData.syntax_prompt,
            instances: createdInstances.map(instance => {
                console.log(models.find(model => {
                    console.log(model.id, instance.intentModel?.displayName ?? "null")

                    return model.id === instance.intentModel?.displayName
                })?.modelDescription ?? "", "DESCRIPTION")
                return {
                    id: instance.id,
                    status: "running",
                    description: models.find(model => model.id === instance.intentModel?.displayName)?.modelDescription ?? ""
                }
            })
        })

        toast({
            title: "Instances submitted",
            description: "The execution will start within seconds",
            // className: "bg-lime-600"
        })


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
                    name="zip"
                    render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                            <FormLabel>Intent Model zip</FormLabel>
                            <FormControl>
                                <Input type="file" accept={ZIP_MIME}

                                    // value={value?.name}
                                    onChange={(event) => {
                                        const file = event.target.files ? event.target.files[0] : null;
                                        console.log(file)
                                        onChange(file);
                                    }} {...field} />
                            </FormControl>
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
                
                <FormField
                    control={form.control}
                    name="syntax_prompt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the prompt to be used in case there are syntax errors
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <EvaluationSettingsForm control={form.control as any as Control<z.infer<typeof CloneFormSchema>>} />
                <ModelSettingsForm control={form.control as any as Control<z.infer<typeof CloneFormSchema>>} />
                <Button type="submit">Create</Button>
            </form>
        </Form>
    )
}
