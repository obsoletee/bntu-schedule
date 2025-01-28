import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Subject } from '../model/Schedule';

interface SubjectState {
  subjectList: Subject[];
  isSubjectsLoading: boolean;
}

const initialState: SubjectState = {
  subjectList: [],
  isSubjectsLoading: false,
};

const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    setSubjects(state, action: PayloadAction<Subject[]>) {
      state.subjectList = action.payload;
    },
    addSubject(state, action: PayloadAction<Subject>) {
      state.subjectList.push(action.payload);
    },
    editSubject(state, action: PayloadAction<Subject>) {
      const index = state.subjectList.findIndex(
        (subject) => subject._id === action.payload._id,
      );
      if (index !== -1) {
        state.subjectList[index] = action.payload;
      }
    },
    deleteSubject(state, action: PayloadAction<string>) {
      state.subjectList = state.subjectList.filter(
        (subject) => subject._id !== action.payload,
      );
    },
    setSubjectsLoading(state, action: PayloadAction<boolean>) {
      state.isSubjectsLoading = action.payload;
    },
  },
});

export const {
  setSubjects,
  addSubject,
  editSubject,
  deleteSubject,
  setSubjectsLoading,
} = subjectsSlice.actions;
export default subjectsSlice.reducer;
