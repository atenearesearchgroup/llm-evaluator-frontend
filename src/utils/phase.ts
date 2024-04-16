import mockData from '@/mock/phases.json'
import type { Action, Decision } from '@/model/diagram'


export const getAction = (id: string) : Action => {
    return mockData.actions.find(action => action.id === id) as Action
}

export const getDecision = (id: string) : Decision => {
    return mockData.decisions.find(action => action.id === id) as Decision
}
