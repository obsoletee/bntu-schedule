import { combineReducers, createStore } from 'redux';
import { currentGroupReducer } from './currentGroupReducer';
import { latestGroupsReducer } from './latestGroupsReducer';
import { currentLessonReducer } from './currentLessonReducer';
import { DaySchedule } from '../model/Schedule';
import teachersReducer, { Teacher } from './teachersReducer';

export interface Action {
  type: string;
  payload: string;
}

export interface TeachersState {
  teacherList: Teacher[];
  isLoading: boolean;
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
  teachers: TeachersState;
}

const rootReducer = combineReducers({
  currentGroup: currentGroupReducer,
  latestGroups: latestGroupsReducer,
  currentLesson: currentLessonReducer,
  teachers: teachersReducer,
});

export const store = createStore(rootReducer);
