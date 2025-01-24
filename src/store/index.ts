import { combineReducers } from 'redux';
import { currentGroupReducer } from './currentGroupReducer';
import { latestGroupsReducer } from './latestGroupsReducer';
import { currentLessonReducer } from './currentLessonReducer';
import { DaySchedule } from '../model/Schedule';
import teachersReducer, { Teacher } from './teachersReducer';
import subjectsReducer, { Subject } from './subjectsReducer';
import scheduleReducer, { Schedule } from './scheduleReducer';
import { configureStore } from '@reduxjs/toolkit';

export interface Action {
  type: string;
  payload: string;
}

export interface TeachersState {
  teacherList: Teacher[];
  isTeachersLoading: boolean;
}

export interface SubjectsState {
  subjectList: Subject[];
  isSubjectsLoading: boolean;
}

export interface ScheduleState {
  schedule: Schedule;
  isScheduleLoading: boolean;
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
  subjects: SubjectsState;
  schedule: ScheduleState;
}

const rootReducer = combineReducers({
  currentGroup: currentGroupReducer,
  latestGroups: latestGroupsReducer,
  currentLesson: currentLessonReducer,
  teachers: teachersReducer,
  subjects: subjectsReducer,
  schedule: scheduleReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
