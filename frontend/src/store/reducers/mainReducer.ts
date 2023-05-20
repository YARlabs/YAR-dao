import { MainState, MainAction, MainActionTypes } from "../../types/main"

const initialState: MainState = {
    historyVotings: [],
    currentHistoryVotings: [],
    processVotings: []
}

export const mainReducer = (state: MainState = initialState, action: MainAction): MainState => {
    switch (action.type) {
        case MainActionTypes.SET_HISTORY_VOTINGS:
            return {...state, historyVotings: action.payload}
        case MainActionTypes.SET_PROCESS_VOTINGS:
            return {...state, processVotings: action.payload}
        case MainActionTypes.SET_CURRENT_HISTORY_VOTINGS:
            return {...state, currentHistoryVotings: action.payload}
        default:
            return state
    }
}