import type { EvaluationResultResponse } from "@/model/evaluation";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

export interface EvaluationData {
    list: DataInfo[];
}

export interface DataInfo {
    title: string;
    syntax_prompt?: string;
    instances: InstanceInfo[];
}

export interface InstanceInfo {
    id: number;
    status: 'completed' | 'running' | 'failed';
    description: string;
    evaluation?: EvaluationResultResponse;
}

const defaultData: EvaluationData = {
    list: []
};

const LOCAL_STORAGE_KEY = 'evaluationInfo';

const ACTION_TYPES = {
    SET: 'set',
    ADD: 'add',
    UPDATE: 'update'
}

interface Action  {
    type: typeof ACTION_TYPES[keyof typeof ACTION_TYPES];
}

interface SetAction extends Action {
    type: 'set';
    payload: EvaluationData;
}

interface AddAction extends Action {
    type: 'add';
    payload: DataInfo;
}

interface UpdateAction extends Action {
    type: 'update';
    payload: {
        id: number;
        instance: DataInfo;
    }
}

type ActionType = SetAction | AddAction | UpdateAction;

const useEvalReducer = (state: EvaluationData, action: ActionType) => {
    switch(action.type) {
        case 'set':
            return action.payload;
        case 'add':
            state.list.push(action.payload);
            return state;
        case 'update':
            state.list[action.payload.id] = action.payload.instance;
            // return { list: state.list.map((item, index) => index === action.payload.id ? action.payload.instance : item) };
            return state;
        default:
            return state;
    }
}


const getStorageData = () => {
    if(globalThis.localStorage === undefined) return defaultData;

    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localData) {
        return JSON.parse(localData) as EvaluationData;
    }
    return defaultData;
}


// save into local storage
export const useEvaluationData = () => {
    const [state, dispatch] = useReducer(useEvalReducer,getStorageData());
    const updateBroadcast = useMemo(() => new BroadcastChannel('evaluation'),[]);

    useEffect(() => {
        dispatch({ type: 'set', payload: getStorageData() });
    },[])

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
        // ?add broadcast 
    } ,[state])

    const addEvaluation = useCallback((data: DataInfo) => {
        const currentLength = state.list.length;
        dispatch({ type: 'add', payload: data });
        return currentLength;
    }, [state]);

    const listEvaluations = useCallback(() => {
        return state.list.map((item) => item.title);
    },[state])

    const getExecutionData = () => {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
            return JSON.parse(localData) as EvaluationData;
        }
        return defaultData;
    }

    const getExecutionInstance = (id: number) => {
        return getExecutionData().list[id] ?? null
    }

    const updateExecutionInstance = (id: number, instance: DataInfo) => {
        const data = getExecutionData();
        const newList = [...data.list];
        newList[id] = instance;
        if (!deepEqual(newList, data.list)) {
            dispatch({ type: 'update', payload: { id, instance } });
        }
    }


    return {getExecutionData, getExecutionInstance, addEvaluation, listEvaluations, updateExecutionInstance};
}

function deepEqual(obj1 : any, obj2: any) {

    if(obj1 === obj2) // it's just the same object. No need to compare.
        return true;

    if(isPrimitive(obj1) && isPrimitive(obj2)) // compare primitives
        return obj1 === obj2;

    if(Object.keys(obj1).length !== Object.keys(obj2).length)
        return false;

    // compare objects with same number of keys
    for(let key in obj1)
    {
        if(!(key in obj2)) return false; //other object doesn't have this prop
        if(!deepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
}

//check if value is primitive
function isPrimitive(obj : any)
{
    return (obj !== Object(obj));
}