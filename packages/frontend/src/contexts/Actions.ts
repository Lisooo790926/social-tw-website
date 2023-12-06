import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export enum ActionType {
    Post = 'post',
    Comment = 'comment',
}

export enum ActionStatus {
    Pending = 'pending',
    Success = 'success',
    Failure = 'failure',
}

export interface PostData {
    id: string
    content: string
}

export interface CommentData {
    id: string
    postId: string
    content: string
    epochKey: string
    epoch: number
}

export interface BaseAction<Type, Data> {
    id: string
    type: Type
    status: ActionStatus
    submittedAt: number
    data: Data
}

export type Action =
    | BaseAction<ActionType.Post, PostData>
    | BaseAction<ActionType.Comment, CommentData>

export interface ActionState {
    entities: Record<string, Action>
    list: string[]
    latestId?: string
}

const initialState: ActionState = {
    entities: {},
    list: [],
    latestId: undefined,
}

function partializeStorage(state: ActionState): ActionState {
    const failedIds = Object.values(state.entities)
        .filter((action) => action.status === ActionStatus.Failure)
        .map((action) => action.id)

    return {
        entities: Object.fromEntries(
            failedIds.map((id) => [id, state.entities[id]])
        ),
        list: failedIds,
    }
}

export const useActionStore = create<ActionState>()(
    persist(
        immer(() => initialState),
        {
            name: 'action-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: partializeStorage,
        }
    )
)

export function actionsSelector(state: ActionState) {
    return state.list.map((id) => state.entities[id])
}

export function latestActionSelector(state: ActionState) {
    return state.latestId ? state.entities[state.latestId] : undefined
}

export function commentActionsSelector(state: ActionState) {
    return Object.values(state.entities).filter(
        (action) => action.type === ActionType.Comment
    )
}

export function pendingCommentActionsSelector(state: ActionState) {
    return Object.values(state.entities).filter(
        (action) =>
            action.type === ActionType.Comment &&
            action.status === ActionStatus.Pending
    )
}

export function failedCommentActionsSelector(state: ActionState) {
    return Object.values(state.entities).filter(
        (action) =>
            action.type === ActionType.Comment &&
            action.status === ActionStatus.Failure
    )
}

export function pendingCountSelector(state: ActionState) {
    return Object.values(state.entities).filter(
        (action) => action.status === ActionStatus.Pending
    ).length
}

export function countByTimeRangeSelector(startTime: number, endTime: number) {
    return function (state: ActionState) {
        return Object.values(state.entities).filter(
            (action) =>
                action.submittedAt > startTime && action.submittedAt <= endTime
        ).length
    }
}

export function createAction(
    type: ActionType,
    data: PostData | CommentData
): Action {
    return {
        id: nanoid(),
        type,
        status: ActionStatus.Pending,
        submittedAt: Date.now(),
        data,
    } as Action
}

export function addAction(type: ActionType, data: PostData | CommentData) {
    // TODO: check if it successfully store comment in the localStorage
    const action = createAction(type, data)
    useActionStore.setState((state) => {
        state.entities[action.id] = action
        state.list.push(action.id)
        state.latestId = action.id
    })

    return action.id
}

export function succeedActionById(
    id: string,
    data: Partial<PostData | CommentData> = {}
) {
    console.log(data)
    useActionStore.setState((state) => {
        state.entities[id].status = ActionStatus.Success
        state.entities[id].data = { ...state.entities[id].data, ...data }
        state.latestId = id
    })
}

export function failActionById(
    id: string,
    data: Partial<PostData | CommentData> = {}
) {
    useActionStore.setState((state) => {
        state.entities[id].status = ActionStatus.Failure
        state.entities[id].data = { ...state.entities[id].data, ...data }
        state.latestId = id
    })
}

export function removeActionById(id: string) {
    useActionStore.setState((state) => {
        delete state.entities[id]
        const index = state.list.findIndex((itemId) => itemId === id)
        if (index !== -1) state.list.splice(index, 1)
    })
}

export function removeActionByCommentId(commentId: string) {
    const state = useActionStore.getState()
    const actions = commentActionsSelector(state)
    const action = actions.find((action) => action.data.id === commentId)

    if (!action) return
    removeActionById(action.id)
}
