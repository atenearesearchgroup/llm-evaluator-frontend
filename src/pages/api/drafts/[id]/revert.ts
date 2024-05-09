import { getAction, getDecision } from "@/utils/phase";
import type { APIRoute } from "astro"
import { Draft, Interaction, db, eq } from "astro:db"


export const GET: APIRoute = async ({ request, params, redirect }) => {
    const { id } = params

    if (!id) return new Response("Draft ID is required", { status: 400 })

    const draft = await db.select().from(Draft).where(eq(Draft.id, parseInt(id))).get()

    if (!draft) return new Response("Draft not found", { status: 404 })

    if (!draft.currentDecision) return new Response("No current decision", { status: 500 })
    const preForm = await request.formData()

    console.log(preForm)

    const form: ActionForm = {
        decision: preForm.get('decision') as string,
    }

    if (!form) return new Response("Invalid form data", { status: 400 })

    const actualDecision = getDecision(draft.currentDecision)

    const decided = actualDecision.arrows.find(arrow => arrow.to === form.decision)

    if (!decided) return new Response("Invalid decision", { status: 400 })

    if (decided.nextDecision) {
        const nextDecision = getDecision(decided.to)

        draft.currentDecision = nextDecision.id

        await db.update(Draft).set({ currentDecision: nextDecision.id }).where(eq(Draft.id, draft.id))
    } else {
        draft.currentDecision = null
        const nextAction = getAction(decided.to)

        draft.currentPhase = nextAction.id

        await db.update(Draft).set({ currentDecision: null, currentPhase: nextAction.id }).where(eq(Draft.id, draft.id))
    }

    return redirect(`/drafts/${draft.id}`, 303)
}
