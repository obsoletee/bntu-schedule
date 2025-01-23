import { combineReducers, createStore } from 'redux';
import { currentGroupReducer } from './currentGroupReducer';
import { latestGroupsReducer } from './latestGroupsReducer';
import { currentLessonReducer } from './currentLessonReducer';
import { DaySchedule } from '../model/Schedule';

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
  subgroup: string;
}

export interface VersionState {
  version: string;
}

export interface LatestGroupsState {
  latestGroups: LatestGroup[];
}

export interface LessonsState {
  currentLesson?: DaySchedule;
}

export interface State {
  currentGroup: CurrentGroupState;
  latestGroups: LatestGroupsState;
  currentLesson: LessonsState;
}

const rootReducer = combineReducers({
  currentGroup: currentGroupReducer,
  latestGroups: latestGroupsReducer,
  currentLesson: currentLessonReducer,
});

export const store = createStore(rootReducer);
