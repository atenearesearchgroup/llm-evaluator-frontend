import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcdn/ui/form"
import type { FormSchema } from "./CreateInstanceForm"
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
import { ChevronDown, ChevronDownIcon, ChevronUpIcon, ChevronsUp } from "lucide-react"
import { Textarea } from "@/components/shadcdn/ui/textarea"

type ModelSetingsFormProps = {
    control: Control<z.infer<typeof FormSchema>>,
}

export const ModelSetingsForm = ({ control }: ModelSetingsFormProps) => {
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
                        Model Settings
                    </p>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0">
                            {isOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}

                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </legend>

                <CollapsibleContent className="grid gap-2">

                <FormField
                        control={control}
                        name="modelSettings.modelName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Model Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                {/* <FormDescription>
                                    This is your public display name.
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="modelSettings.modelOwner"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Model Owner</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                {/* <FormDescription>
                                    This is your public display name.
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="modelSettings.version"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Model Version</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                {/* <FormDescription>
                                    This is your public display name.
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="modelSettings.systemPrompt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>System Prompt</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                {/* <FormDescription>
                                    This is your public display name.
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="modelSettings.temperature"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Temperature</FormLabel>
                                <FormControl>
                                    <Input placeholder="Default Temperature" {...field} />
                                </FormControl>
                                {/* <FormDescription>
                                    This is your public display name.
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="modelSettings.topP"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Top P</FormLabel>
                                <FormControl>
                                    <Input placeholder="Default Top P" {...field} />
                                </FormControl>
                                {/* <FormDescription>
                                    This is your public display name.
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="modelSettings.maxTokens"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Max Tokens</FormLabel>
                                <FormControl>
                                    <Input placeholder="Default Max Tokens" {...field} />
                                </FormControl>
                                {/* <FormDescription>
                                    This is your public display name.
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="modelSettings.frequencyPenalty"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Frequency Penalty</FormLabel>
                                <FormControl>
                                    <Input placeholder="Default" {...field} />
                                </FormControl>
                                {/* <FormDescription>
                                    This is your public display name.
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="modelSettings.presencePenalty"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Presence Penalty</FormLabel>
                                <FormControl>
                                    <Input placeholder="Default" {...field} />
                                </FormControl>
                                {/* <FormDescription>
                                    This is your public display name.
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CollapsibleContent>
            </fieldset>
        </Collapsible >
    )
}

/*
<fieldset className={`animate-accordion-down grid gap-6 rounded-lg border ${isOpen ? "p-4" : "px-4"}`}>
                <legend className="-ml-1 px-1 text-sm font-medium flex items-center justify-between space-x-2 ">
                    <p className="text-sm font-semibold">
                        Model Settings
                    </p>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0">
                            {isOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </legend>

                <CollapsibleContent className="grid gap-2">

                </CollapsibleContent>
            </fieldset>
*/