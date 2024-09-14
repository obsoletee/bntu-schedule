import { combineReducers, createStore } from 'redux';
import { currentGroupReducer } from './currentGroupReducer';
import { latestGroupsReducer } from './latestGroupsReducer';

export interface Action {
  type: string;
  payload: string;
}

export interface LatestGroup {
  number: string;
  university: string;
}

export interface CurrentGroupState {
  currentGroup: string;
  university: string;
}

export interface VersionState {
  version: string;
}

export interface LatestGroupsState {
  latestGroups: LatestGroup[];
}

export interface State {
  currentGroup: CurrentGroupState;
  latestGroups: LatestGroupsState;
}

const rootReducer = combineReducers({
  currentGroup: currentGroupReducer,
  latestGroups: latestGroupsReducer,
});

export const store = createStore(rootReducer);
