import { MainAction, MainActionTypes } from "../../types/main";
import { Event } from 'ethers';

export function SetHistoryVotings(votings: Event[]): MainAction {
    return {type: MainActionTypes.SET_HISTORY_VOTINGS, payload: votings}
}
export function SetProcessVotings(votings: Event[]): MainAction {
    return {type: MainActionTypes.SET_PROCESS_VOTINGS, payload: votings}
}
export function SetCurrentHistoryVotings(votings: Event[]): MainAction {
    return {type: MainActionTypes.SET_CURRENT_HISTORY_VOTINGS, payload: votings}
}