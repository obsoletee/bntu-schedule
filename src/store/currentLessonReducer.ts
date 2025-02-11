import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DaySchedule } from '../model/Schedule';

interface CurrentLessonState {
  currentLesson: DaySchedule;
}

const initialState: CurrentLessonState = {
  currentLesson: {
    id: '',
    startTime: '',
    endTime: '',
    subject: { _id: '', shortName: '', fullName: '' },
    teacher: {
      _id: '',
      shortName: '',
      fullName: '',
      avatar: 'emptyAvatar',
    },

    type: '',
    class: '',
    korpus: '',
    subgroup: '0',
    week: ['1'],
  },
};

const currentLessonSlice = createSlice({
  name: 'currentLesson',
  initialState,
  reducers: {
    setCurrentLesson(state, action: PayloadAction<DaySchedule>) {
      state.currentLesson = action.payload;
    },
    clearCurrentLesson(state) {
      state.currentLesson = {
        id: '',
        startTime: '',
        endTime: '',
        subject: { _id: '', shortName: '', fullName: '' },
        teacher: {
          _id: '',
          shortName: '',
          fullName: '',
          avatar: 'emptyAvatar',
        },

        type: '',
        class: '',
        korpus: '',
        subgroup: '0',
        week: ['1'],
      };
    },
  },
});

export const { setCurrentLesson, clearCurrentLesson } =
  currentLessonSlice.actions;
export const currentLessonReducer = currentLessonSlice.reducer;
