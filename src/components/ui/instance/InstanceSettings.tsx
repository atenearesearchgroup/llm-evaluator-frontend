import type { EvaluationSettings, IntentInstance } from "@/model/model"
import { Button } from "@design/ui/button"
import { Separator } from "@design/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@design/ui/sheet"


type InstanceSettingsProps = {
    instance: IntentInstance
}

const valueOrDefault = (value?: number) => {
    if (!value || value === -1)
        return "Default"

    return value.toString()
}

export const InstanceSettings = ({ instance }: InstanceSettingsProps) => {
    const modelSettings = instance.modelSettings
    const evaluationSettings = instance as EvaluationSettings

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={"secondary"}>Instance Settings</Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col gap-3">
                <fieldset id="modelSettings" className="bg-card rounded-lg border p-3" >
                    <legend className="-ml-1 px-1 text-sm font-medium flex items-center justify-start space-x-2 ">
                        <p className="text font-bold">
                            Model Settings
                        </p>
                    </legend>
                    <div className="grid gap-2 ">
                        <div className="grid grid-cols-2">
                            <label className="font-semibold text-center">Model</label>
                            <p>{modelSettings.modelName}</p>
                        </div>
                        <Separator />

                        <div className="grid grid-cols-2">
                            <label className="font-semibold text-center">Model Owner</label>
                            <p>{modelSettings.modelOwner ?? "Unset"}</p>

                        </div>
                        <Separator />

                        <div className="grid grid-cols-2">
                            <label className="font-semibold text-center">Version</label>
                            <p>{modelSettings.version ?? "Unset"}</p>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2">
                            <label className="font-semibold text-center">System Prompt</label>
                            <p className="whitespace-pre-line">{modelSettings.systemPrompt}</p>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2">
                            <label className="font-semibold text-center">Max Tokens</label>
                            <p>{valueOrDefault(modelSettings.maxTokens)}</p>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2">
                            <label className="font-semibold text-center">Temperature</label>
                            <p>{valueOrDefault(modelSettings.temperature)}</p>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2">
                            <label className="font-semibold text-center">Top P</label>
                            <p>{valueOrDefault(modelSettings.topP)}</p>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2">
                            <label className="font-semibold text-center">Presence Penalty</label>
                            <p>{valueOrDefault(modelSettings.presencePenalty)}</p>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2">
                            <label className="font-semibold text-center">Frequency Penalty</label>
                            <p>{valueOrDefault(modelSettings.frequencyPenalty)}</p>
                        </div>

                    </div>
                </fieldset>


                <fieldset id="modelSettings" className="bg-card rounded-lg border p-3 " >
                    <legend className="-ml-1 px-1 text-sm font-medium flex items-center justify-start space-x-2 ">
                        <p className="text font-bold">
                            Evaluation Settings
                        </p>
                    </legend>
                    <div className="grid gap-2 ">

                        <div className="grid grid-cols-2">
                            <label className="font-semibold text-center">Max Drafts</label>
                            <p>{valueOrDefault(evaluationSettings.maxChats)}</p>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2">
                            <label className="font-semibold text-center">Max K</label>
                            <p>{valueOrDefault(evaluationSettings.maxErrors)}</p>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2">
                            <label className="font-semibold text-center">Max Repeating Prompts</label>
                            <p>{valueOrDefault(evaluationSettings.maxRepeatingPrompt)}</p>
                        </div>

                    </div>
                </fieldset>
            </SheetContent>
        </Sheet>
    )

}