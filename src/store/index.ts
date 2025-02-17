import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import { currentGroupReducer, CurrentGroupState } from './currentGroupReducer';
import { latestGroupsReducer, LatestGroupsState } from './latestGroupsReducer';
import {
  currentLessonReducer,
  CurrentLessonState,
} from './currentLessonReducer';
import teachersReducer, { TeachersState } from './teachersReducer';
import subjectsReducer, { SubjectsState } from './subjectsReducer';
import {
  activeDayOfWeekReducer,
  ActiveDayOfWeekState,
} from './activeDayOfWeekReducer';
import {
  currentTeacherReducer,
  CurrentTeacherState,
} from './currentTeacherReducer';
import {
  currentSubjectReducer,
  CurrentSubjectState,
} from './currentSubjectReducer';
import { scheduleReducer, ScheduleState } from './scheduleReducer';
import {
  availableGroupsReducer,
  AvailableGroupsState,
} from './availableGroupsReducer';

export interface State {
  currentGroup: CurrentGroupState;
  latestGroups: LatestGroupsState;
  currentLesson: CurrentLessonState;
  teachers: TeachersState;
  subjects: SubjectsState;
  schedule: ScheduleState;
  currentTeacher: CurrentTeacherState;
  currentSubject: CurrentSubjectState;
  activeDayOfWeek: ActiveDayOfWeekState;
  availableGroups: AvailableGroupsState;
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
  availableGroups: availableGroupsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
