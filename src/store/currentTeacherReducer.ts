import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Teacher } from '../model/Schedule';

export interface CurrentTeacherState {
  currentTeacher: Teacher;
}

const initialState: CurrentTeacherState = {
  currentTeacher: {
    _id: '',
    fullName: '',
    shortName: '',
    avatar: 'emptyAvatar',
    degree: '',
    university: {
      code: '',
      title: '',
    },
  },
};

const currentTeacherSlice = createSlice({
  name: 'currentTeacher',
  initialState,
  reducers: {
    setCurrentTeacher(state, action: PayloadAction<Teacher>) {
      state.currentTeacher = action.payload;
    },
    clearCurrentTeacher(state) {
      state.currentTeacher = {
        _id: '',
        fullName: '',
        shortName: '',
        avatar: 'emptyAvatar',
        degree: '',
        university: {
          code: '',
          title: '',
        },
      };
    },
  },
});

export const { setCurrentTeacher, clearCurrentTeacher } =
  currentTeacherSlice.actions;
export const currentTeacherReducer = currentTeacherSlice.reducer;
