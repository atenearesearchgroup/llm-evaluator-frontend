
import type { CreateModelRequest } from "@/model/request"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/shadcdn/ui/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcdn/ui/form"
import { Input } from "@/components/shadcdn/ui/input"
import { Button } from "@/components/shadcdn/ui/button"
import { createModel } from "@/services/intentService"

export const FormSchema = z.object({
    id: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    displayName: z.string()
})



export const CreateModelForm = ({ }) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    })
    const { toast } = useToast()

    function onSubmit(data: z.infer<typeof FormSchema>) {

        const request: CreateModelRequest = {
            model: data.id,
            displayName: data.displayName
        }

        const requestFunc = async () => {
            const response = await createModel(request)

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
                        description: "Model created",
                        className: "bg-lime-600"
                    }
                )

                setTimeout(() => {
                    window.location.reload()
                    // window.open(`/instances/${response.id}`, '_blank');
                }, 2000)
            }
        }

        requestFunc()
    }

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 mx-auto py-5">
                <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Identifier</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the id for the model
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>DisplayName</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the displayName for the model
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Create</Button>
            </form>
        </Form>
    )
}
