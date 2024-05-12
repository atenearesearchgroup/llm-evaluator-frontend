
import type { Decision } from "@/model/diagram";
import { Button } from "@design/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@design/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@design/ui/select";
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
    console.log({ draftId, decision })


    function onSubmit(data: z.infer<typeof FormSchema>) {

    }

    return (
        <Form {...form}>
            <form
                // action={`/api/drafts/${draftId}/decision`}
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
            >
                {/* <FormLabel> */}
                <h3 className="font-bold mt-6 mb-2">Escriba la respuesta a la decisión:</h3>
                {/* </FormLabel> */}
                <FormField
                    control={form.control}
                    name="decision"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Decision output</FormLabel>
                            <Select name="decision" required>
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