import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Subject {
  _id: string;
  shortName: string;
  fullName: string;
}

interface SubjectState {
  subjectList: Subject[];
  isLoading: boolean;
}

const initialState: SubjectState = {
  subjectList: [],
  isLoading: false,
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
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setSubjects,
  addSubject,
  editSubject,
  deleteSubject,
  setLoading,
} = subjectsSlice.actions;
export default subjectsSlice.reducer;
