import { combineReducers } from 'redux';
import { currentGroupReducer } from './currentGroupReducer';
import { latestGroupsReducer } from './latestGroupsReducer';
import { currentLessonReducer } from './currentLessonReducer';
import { DaySchedule, Subject, Teacher } from '../model/Schedule';
import teachersReducer from './teachersReducer';
import subjectsReducer from './subjectsReducer';
import { configureStore } from '@reduxjs/toolkit';
import { activeDayOfWeekReducer } from './activeDayOfWeek';
import { currentTeacherReducer } from './currentTeacherReducer';
import { currentSubjectReducer } from './currentSubjectReducer';
import { scheduleReducer, ScheduleState } from './scheduleReducer';

export interface TeachersState {
  teacherList: Teacher[];
  isTeachersLoading: boolean;
}

export interface SubjectsState {
  subjectList: Subject[];
  isSubjectsLoading: boolean;
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

export interface ActiveDayOfWeekState {
  activeDayOfWeek: string;
}

export interface VersionState {
  version: string;
}

export interface LatestGroupsState {
  latestGroups: LatestGroup[];
}

export interface CurrentLessonsState {
  currentLesson: DaySchedule;
}

export interface CurrentTeacherState {
  currentTeacher: Teacher;
}
export interface CurrentSubjectState {
  currentSubject: Subject;
}

export interface State {
  currentGroup: CurrentGroupState;
  latestGroups: LatestGroupsState;
  currentLesson: CurrentLessonsState;
  teachers: TeachersState;
  subjects: SubjectsState;
  schedule: ScheduleState;
  currentTeacher: CurrentTeacherState;
  currentSubject: CurrentSubjectState;
  activeDayOfWeek: ActiveDayOfWeekState;
}

const rootReducer = combineReducers({
  currentGroup: currentGroupReducer,
  latestGroups: latestGroupsReducer,
  currentLesson: currentLessonReducer,
  teachers: teachersReducer,
  subjects: subjectsReducer,
  schedule: scheduleReducer,
  activeDayOfWeek: activeDayOfWeekReducer,
  currentTeacher: currentTeacherReducer,
  currentSubject: currentSubjectReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
