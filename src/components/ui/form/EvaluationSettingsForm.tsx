import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcdn/ui/form"
import type { Control } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/shadcdn/ui/input"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/shadcdn/ui/collapsible"
import { useState } from "react"
import { Button } from "@/components/shadcdn/ui/button"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import type { CloneFormSchema } from "./CloneInstanceForm"
import type {FormSchema} from "./CreateInstanceForm"

type EvaluationSetingsFormProps = {
    control: Control<z.infer<typeof CloneFormSchema | typeof FormSchema>>,
}

export const EvaluationSetingsForm = ({ control }: EvaluationSetingsFormProps) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
        // className="w-[350px] space-y-2"
        >
            <fieldset className={`animate-accordion-down grid gap-6 rounded-lg border ${isOpen ? "p-4" : "px-4"}`}>
                <legend className="-ml-1 px-1 text-sm font-medium flex items-center justify-between space-x-2 ">
                    <p className="text-sm font-semibold">
                        Evaluation Settings
                    </p>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0">
                            {isOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}

                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </legend>

                <CollapsibleContent  className="grid gap-2">

                <FormField
                    control={control}
                    name="maxErrors"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Max Errors</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                                How many times syntax errors can be prompted to be fixed
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="maxChats"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Max Chats</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                How many chats are allowed
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="maxRepeatingPrompt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Max Repeating prompts</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                How many times the same prompt can be used
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CollapsibleContent>
        </fieldset>
        </Collapsible >
    )
}