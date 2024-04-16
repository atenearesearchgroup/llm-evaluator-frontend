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