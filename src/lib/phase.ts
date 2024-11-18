import mockData from '@/mock/phases.json'
import type { Action, Decision } from '@/model/diagram'

export const getDefaultSyntaxPrompt = () => {
    // public/assets/files/syntax_prompt.txt
    const value = "Task: Generate a Class Diagram in PlantUML\n\nBased on the instructions and requirements given in the previous messages, please generate a PlantUML class diagram. Ensure the following:\n\n- The class diagram must accurately reflect the details provided in the previous messages (e.g., class names, methods, properties, relationships such as inheritance, composition, and aggregation).\n- The output must be free of syntax errors and fully compliant with PlantUML syntax. The diagram should be renderable by PlantUML without modifications.\n- Use correct PlantUML symbols, such as `-->`, `<|--`, `+`, `-`, and `#` to denote relationships and access modifiers.\n\nHere is an example of valid PlantUML syntax:\n\n\`\`\`\n@startuml\nclass Person {\n}\n\nclass Animal {\n  + name: String\n  + makeSound(): void\n}\n\nclass Dog extends Animal {\n  + bark(): void\n}\n\nclass Cat extends Animal {\n  + meow(): void\n}\n\nPerson \"0..1\" -- \"*\" Animal: pets\n@enduml\n\`\`\`\n\nEnsure that the output is written in a similar structure and follows all previous instructions. No syntax errors should be present in the generated diagram.";

    return value;
}

export const getSyntaxPrompt = (content: string[]) => {
    let result = mockData.syntaxPrompt.pre
    
    content.forEach((line) => {
        result += mockData.syntaxPrompt.error.replace("{0}", line)
    })

    return result + mockData.syntaxPrompt.post
}

export const getNode = (id: string): (Action | Decision) => {
    if (id.startsWith("decision:"))
        return getDecision(id.substring("decision:".length))

    return getAction(id)
}

export const getAction = (id: string): Action => {
    return mockData.actions.find(action => action.id === id) as unknown as Action
}

export const getDecision = (id: string): Decision => {
    return mockData.decisions.find(action => action.id === id) as Decision
}

// export const getAvailableLLms = () => {
//     return mockData.llms
// }

export const getFirstPhase = () => {
    return mockData.startingNode ?? "zero"  
}

const nextLineIfHigherThan = (text: string, chars: number) => {
    let result = ""

    let size = 0

    for (let i = 0; i < text.length; i++) {
        size++
        result += text.charAt(i)
        if (size > chars && text.charAt(i) === ' ' && i !== 0) {
            size = 0
            result += '\n'
        }
    }

    return result
}

export const generateDiagram = (currentPhase: string) => {
    let text = `st=>start: Start${currentPhase == null ? "|current" : ""}\nend=>end: End${currentPhase === "end" ? "|current" : ""}\n`

    text+=`im(align-next=no)=>operation: Ignored step\n`

    mockData.actions.forEach((action) => {
        if(action.id === "end") return
        text += `${action.id}(align-next=no)=>operation: ${action.title}${currentPhase === action.id ? "|current" : ""}\n`
    })

    mockData.decisions.forEach((decision) => {
        text += `${decision.id}(align-next=no)=>condition: ${nextLineIfHigherThan(decision.title, 16)}${currentPhase === decision.id ? "|current" : ""}\n`
    })

    text += `st->zero->classes\n`

    mockData.decisions.forEach((decision) => {
        decision.arrows.forEach((arrow) => {
            // "(right)->"+getAction(arrow.to).to
            // ${!arrow.nextDecision ? "(right)->" + getAction(arrow.to).to : ""}
            text += `${decision.id}(${arrow.label.toLowerCase()})->${arrow.to}${!arrow.nextDecision?"(left)":""}\n`
            if (decision.id === currentPhase) {
                text += `${decision.id}@>${arrow.to.replace("decision:", "")}({"stroke":"Red"})\n`
            }
        })
    })

    mockData.actions.forEach((action) => {
        if(action.id !== "zero" && action.id !== "end")
            text += `${action.id}(right)->im(bottom)\n`
        
        if (action.id !== currentPhase)
            return

        text += `${action.id}@>${action.to?.replace("decision:", "")}({"stroke":"Red"})\n`
    })

    // text+="zero(right)->im\n"

    text+="im(top)->classes\n"

    if(currentPhase == null) {
        text+=`st@>zero({"stroke":"Red"})\n`
    }

    // mockData.actions.forEach((action) => {
    //     text += `${action.id}->${action.to}\n`
    // })

    return text
}