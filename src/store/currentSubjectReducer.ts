import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Subject } from '../model/Schedule';

export interface CurrentSubjectState {
  currentSubject: Subject;
}

const initialState: CurrentSubjectState = {
  currentSubject: { _id: '', fullName: '', shortName: '' },
};

const currentSubjectSlice = createSlice({
  name: 'currentSubject',
  initialState,
  reducers: {
    setCurrentSubject(state, action: PayloadAction<Subject>) {
      state.currentSubject = action.payload;
    },
    clearCurrentSubject(state) {
      state.currentSubject = { _id: '', fullName: '', shortName: '' };
    },
  },
});

export const { setCurrentSubject, clearCurrentSubject } =
  currentSubjectSlice.actions;
export const currentSubjectReducer = currentSubjectSlice.reducer;
