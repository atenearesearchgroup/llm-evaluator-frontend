import { useState } from "react";
import { Prompt } from "./Prompt";
import type { Action } from "@/model/diagram";
import { act } from "react-dom/test-utils";

type PromptListProps = {
    action: Action;
    prompts: string[];
}


const generateFullPrompt = (currentText: string, {prePrompt = '', postPrompt = '', fewShot}: Action, useFewShot : boolean) => {
    let result = prePrompt

    if(result.length > 0) result = result.concat('\n')

    result = result.concat(currentText)

    if(currentText.length > 0 && postPrompt.length > 0) result = result.concat('\n')

    result = result.concat(postPrompt)

    if(useFewShot && fewShot) {
        result = fewShot?.concat('\n').concat(result)
    }
    
    return result
}


export const PromptList = ({ prompts, action }: PromptListProps) => {
    const [currentText, setCurrentText] = useState('');
    const [useFewShot, setFewShot] = useState(false)

    const addPrompt = (prompt: string) => {
        setCurrentText((prev) => prev.concat('\n').concat(prompt))
    }

    const resultText = generateFullPrompt(currentText, action, useFewShot);

    return (
        <section className="bg-slate-800 bg-opacity-50 rounded-md p-1">

            <div>

                <h3 className="font-bold mt-5 mx-2">Generation prompts:</h3>

                {prompts.map((prompt, index) => {
                    return (
                        <Prompt key={index} prompt={prompt} addPrompt={addPrompt} />
                    )
                })}

                {prompts.length === 0 && <p className="mx-2">No prompts available</p>}

                <div className="mx-auto bg-slate-400 bg-opacity-30 rounded-lg flex gap-2 justify-center items-center ">
                    <input type="checkbox" id="fewShot" name="fewShot" onChange={() => setFewShot(!useFewShot)} />
                    <label htmlFor="fewShot">Few Shot</label>
                </div>

                <div className="mt-5">
                    <h3 className="font-bold mt-5 mx-2">Resultado:</h3>
                    <p className="mb-5 mx-2 whitespace-pre-line bg-slate-600 bg-opacity-70 rounded-md p-1" >{resultText}</p>

                    <div className="flex flex-row justify-evenly">
                        <button onClick={() => {
                            console.log("currentText", currentText)
                            navigator.clipboard.writeText(resultText);
                            alert('Copied to clipboard')
                        }}
                            className="bg-lime-500 hover:bg-lime-700 bg-opacity-80 text-lg p-1 rounded-md block"
                        >
                            Copy to clipboard
                        </button>

                        <button onClick={() => {
                            setCurrentText('')
                        }}
                            className="bg-orange-500 hover:bg-orange-700 bg-opacity-80 text-lg p-1 rounded-md block"
                        >Reset</button></div>
                </div>
            </div>
        </section>)
}