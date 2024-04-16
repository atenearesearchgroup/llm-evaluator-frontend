import { getPlaceholders } from "@/utils/placeholder";
import { useRef, useState } from "react";

interface PromptProps {
    prompt: string;
    addPrompt: (prompt: string) => void;
}

const generatePrompt = (prompt: string, placeholders: Record<string, string>) => {
    const keys = Object.keys(placeholders);

    let newPrompt = prompt;

    keys.forEach(key => {
        newPrompt = newPrompt.replace(`<${key}>`, placeholders[key])
    })

    return newPrompt
}


export const Prompt = ({ prompt, addPrompt }: PromptProps) => {
    const [toggle, setToggle] = useState(false);
    const promptRef = useRef()
    const placeholders = getPlaceholders(prompt);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = new FormData(form);

        const placeholders = Object.fromEntries(data.entries());

        const newPrompt = generatePrompt(prompt, placeholders as Record<string, string>);

        addPrompt(newPrompt)
    }

    const onToggle = () => {
        setToggle(!toggle)
    }

    return (
        <section className="m-2 p-2 bg-slate-600 bg-opacity-30 rounded-md gap-2" >

            <div className="flex bg-slate-600 bg-opacity-60 p-1 rounded-md flex-row gap-2 items-center ">
                <p>{prompt}</p>
                <button onClick={onToggle} className={`${toggle ? 'bg-red-500 hover:bg-red-700 ' : 'bg-green-500 hover:bg-green-700'} bg-opacity-70 rounded-md px-1`}>x</button>
            </div>

            <form
                onSubmit={onSubmit}
                className={`mt-5 gap-5 ${toggle ? 'block' : 'hidden'}`}
            >

                {
                    placeholders.map((placeholder, _) => {
                        const id = `${promptRef}-${placeholder}`
                        return (<div key={id} className="my-2 flex flex-col">
                            <label htmlFor={id}>{placeholder}</label>
                            <input id={id} name={placeholder} type="text" required />
                        </div>)
                    })
                }

                <input type="submit" className="bg-green-600 bg-opacity-60 text-lg p-1 rounded-md block mt-3" value={"Add"} />
            </form>
        </section>)
}