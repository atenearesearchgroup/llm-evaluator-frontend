import { column, defineDb, defineTable } from 'astro:db';


const Draft = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    title: column.text(),
    currentPhase: column.text(),
    currentDecision: column.text({ optional: true }),
    lastDate: column.date()
  }
})

const Interaction = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    phaseId: column.text(),
    draftId: column.number({ references: () => Draft.columns.id }),

    prompt: column.text(),
    response: column.text(),

    score: column.number({ optional: true }),
    date: column.date(),
  }
})


// https://astro.build/db/config
export default defineDb({
  tables: { Draft, Interaction }
});
