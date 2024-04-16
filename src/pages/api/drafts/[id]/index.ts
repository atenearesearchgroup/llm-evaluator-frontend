import type { APIRoute } from "astro"
import { Draft, Interaction, db, eq } from "astro:db"

export const DELETE: APIRoute = async ({ request, params, redirect }) => {
    const { id } = params

    if (!id) return new Response("Draft ID is required", { status: 400 })

    // delete interactions related to draft
    await db.delete(Interaction).where(eq(Interaction.draftId, parseInt(id)))

    // delete draft
    await db.delete(Draft).where(eq(Draft.id, parseInt(id)))

    return redirect(`/`, 303)
}

export const PUT: APIRoute = async ({ request, params, redirect }) => {
    const { id } = params

    if (!id) return new Response("Draft ID is required", { status: 400 })

    const draft = await db.select().from(Draft).where(eq(Draft.id, parseInt(id))).get()

    if (!draft) return new Response("Draft not found", { status: 404 })

    const data = await request.json() as {
        title: string;

    }

    if (!data) return new Response("Invalid form data", { status: 400 })

    await db.update(Draft).set({ title: data.title }).where(eq(Draft.id, draft.id))

    return new Response("Draft updated", { status: 200 })
}