import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Teacher } from '../model/Schedule';
interface TeachersState {
  teacherList: Teacher[];
  isTeachersLoading: boolean;
}

const initialState: TeachersState = {
  teacherList: [],
  isTeachersLoading: false,
};

const teachersSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {
    setTeachers(state, action: PayloadAction<Teacher[]>) {
      state.teacherList = action.payload;
    },
    addTeacher(state, action: PayloadAction<Teacher>) {
      state.teacherList.push(action.payload);
    },
    editTeacher(state, action: PayloadAction<Teacher>) {
      const index = state.teacherList.findIndex(
        (teacher) => teacher._id === action.payload._id,
      );
      if (index !== -1) {
        state.teacherList[index] = action.payload;
      }
    },
    deleteTeacher(state, action: PayloadAction<string>) {
      state.teacherList = state.teacherList.filter(
        (teacher) => teacher._id !== action.payload,
      );
    },
    setTeachersLoading(state, action: PayloadAction<boolean>) {
      state.isTeachersLoading = action.payload;
    },
  },
});

export const {
  setTeachers,
  addTeacher,
  editTeacher,
  deleteTeacher,
  setTeachersLoading,
} = teachersSlice.actions;
export default teachersSlice.reducer;
