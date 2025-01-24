import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TeacherImageKeys } from '../assets/images/teacherImages';

export interface Teacher {
  _id: string;
  shortName: string;
  fullName: string;
  avatar: TeacherImageKeys;
}

interface TeachersState {
  teacherList: Teacher[];
  isLoading: boolean;
}

const initialState: TeachersState = {
  teacherList: [],
  isLoading: false,
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
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setTeachers,
  addTeacher,
  editTeacher,
  deleteTeacher,
  setLoading,
} = teachersSlice.actions;
export default teachersSlice.reducer;
