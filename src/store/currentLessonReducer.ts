// Пример редьюсера
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DaySchedule } from '../model/Schedule';

interface CurrentLessonState {
  currentLesson?: DaySchedule;
}

const initialState: CurrentLessonState = {
  currentLesson: undefined,
};

const currentLessonSlice = createSlice({
  name: 'currentLesson',
  initialState,
  reducers: {
    setLesson(state, action: PayloadAction<DaySchedule | undefined>) {
      state.currentLesson = action.payload;
    },
    clearLesson(state) {
      state.currentLesson = undefined;
    },
  },
});

export const { setLesson, clearLesson } = currentLessonSlice.actions;
export const currentLessonReducer = currentLessonSlice.reducer;
