import { getAction, getDecision } from "@/utils/phase";
import type { APIRoute } from "astro"
import { Draft, Interaction, db, eq } from "astro:db"

type ActionForm = {
    prompt: string;
    response: string;
    score?: number;
}


export const POST: APIRoute = async ({ request, params, redirect }) => {
    const { id } = params

    if (!id) return new Response("Draft ID is required", { status: 400 })

    const draft = await db.select().from(Draft).where(eq(Draft.id, parseInt(id))).get()

    if (!draft) return new Response("Draft not found", { status: 404 })

    const preForm  = await request.formData()

    console.log(preForm)

    const form : ActionForm = {
        prompt: preForm.get('prompt') as string,
        response: preForm.get('response') as string,
        score: parseInt(preForm.get('score') as string)
    } 

    if (!form) return new Response("Invalid form data", { status: 400 })

    const interaction = await db.insert(Interaction).values({
        draftId: draft.id,
        phaseId: draft.currentPhase,
        prompt: form.prompt,
        response: form.response,
        score: form.score || -1,
        date: new Date()
    })

    console.log(interaction)

    const currentPhase = getAction(draft.currentPhase)

    if(currentPhase.to === undefined) return new Response("No next phase", { status: 200 })

    const nextDecision = getDecision(currentPhase.to)

    if(!nextDecision) return new Response("No next decision", { status: 500 })

    draft.currentDecision = nextDecision.id

    await db.update(Draft).set({ currentDecision: nextDecision.id }).where(eq(Draft.id, draft.id))

    // redirect to /drafts/[draftId]

    return redirect(`/drafts/${draft.id}`, 303)
}
