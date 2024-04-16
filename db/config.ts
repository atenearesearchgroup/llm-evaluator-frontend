import { getAvailableLLms } from '@/utils/phase';
import { column, defineDb, defineTable } from 'astro:db';


const Draft = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    title: column.text(),
    llm: column.text({ default: getAvailableLLms()[0]}),

    currentPhase: column.text(),
    currentDecision: column.text({ optional: true }),

    lastDate: column.date()
  },
  indexes: [
    {
      unique: false,
      on: ["llm"]
    }
  ]
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
