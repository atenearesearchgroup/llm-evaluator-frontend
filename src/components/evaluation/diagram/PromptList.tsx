import { useState } from "react";
import { Prompt } from "./Prompt";
import type { Action } from "@/model/diagram";
import { Button } from "@design/ui/button";
import { useToast } from "@design/ui/use-toast";

type PromptListProps = {
    action: Action;
    prompts: string[];
}


const generateFullPrompt = (currentText: string, { prePrompt = '', postPrompt = '', fewShot }: Action, useFewShot: boolean) => {
    let result = prePrompt

    result = result.concat(currentText)

    if (currentText.length == 0 || postPrompt.length > 0) result = result.concat('\n')

    result = result.concat(postPrompt)

    if (useFewShot && fewShot) {
        result = fewShot?.concat('\n').concat(result)
    }

    return result
}

export const PromptList = ({ prompts, action }: PromptListProps) => {
    const [currentText, setCurrentText] = useState('');
    const [useFewShot, setFewShot] = useState(false)
    const {toast, dismiss} = useToast()
    const [actualToast, setActualToast] = useState<string|null>(null)

    const addPrompt = (prompt: string) => {
        setCurrentText((prev) => prev.concat('\n').concat(prompt))
    }

    const resultText = generateFullPrompt(currentText, action, useFewShot);

    if (prompts.length === 0 && !action.prePrompt && !action.postPrompt && !action.fewShot)
        return <p className="text-accent bg-accent-foreground p-2 text-center rounded-md mx-auto max-w-fit mt-2">No available prompts or shots for this node</p>


    return (
        <section className="border bg-opacity-50 rounded-md mt-2 p-4">

            <div>

                <h3 className="font-bold mb-2 ">Generation prompts:</h3>

                <section className="gap-2 grid">
                    {prompts.map((prompt, index) => {
                        return (
                            <Prompt key={index} prompt={prompt} addPrompt={addPrompt} />
                        )
                    })}
                </section>
                {prompts.length === 0 && <p className="mx-2">No prompts available</p>}

                {/* <div className="mx-auto flex space-x-2 justify-center items-center mt-4 ">
                    <Switch id="fewShot" defaultChecked={useFewShot} onCheckedChange={(result) => setFewShot(result)} />
                    <label htmlFor="fewShot">Few Shot</label>
                </div> */}

                <div className="mt-5">
                    <h3 className="font-bold mt-5 mx-2">Resultado:</h3>
                    <p className="mb-5 mx-2 whitespace-pre-line bg-slate-600 bg-opacity-70 rounded-md p-1" >{resultText}</p>

                    <div className="flex flex-row justify-evenly">
                        <Button variant={"secondary"}
                            onClick={async () => {
                                console.log("resultText", resultText)
                                await navigator.clipboard.writeText(resultText);
                                
                                if(actualToast) dismiss(actualToast)

                                setActualToast(toast({
                                    variant: "default",
                                    title: "Copied to clipboard",
                                    description: "The text has been copied to the clipboard"
                                }).id)
                            }}>

                            Copy to clipboard
                        </Button>

                        <Button variant={"outline"}
                            onClick={() => {
                                setCurrentText('')
                            }}>
                            Reset
                        </Button>
                    </div>
                </div>
            </div>
        </section>)
}