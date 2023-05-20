import { Event } from 'ethers';
export interface MainState {
    historyVotings: Event[]; 
    currentHistoryVotings: Event[]; 
    processVotings: Event[]; 
}
export enum MainActionTypes {
    SET_HISTORY_VOTINGS = 'SET_HISTORY_VOTINGS',
    SET_CURRENT_HISTORY_VOTINGS = 'SET_CURRENT_HISTORY_VOTINGS',
    SET_PROCESS_VOTINGS = 'SET_PROCESS_VOTINGS'
} 
interface SetHistoryVotingsAction {
    type: MainActionTypes.SET_HISTORY_VOTINGS;
    payload: Event[];
}
interface SetCurrentHistoryVotingsAction {
    type: MainActionTypes.SET_CURRENT_HISTORY_VOTINGS;
    payload: Event[];
}
interface SetProcessVotingsAction {
    type: MainActionTypes.SET_PROCESS_VOTINGS;
    payload: Event[];
}
export type MainAction = 
    SetHistoryVotingsAction |
    SetProcessVotingsAction |
    SetCurrentHistoryVotingsAction;