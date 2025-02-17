import { createSlice } from '@reduxjs/toolkit';

export interface CurrentGroupState {
  currentGroup: string;
  university: string;
  subgroup: string;
}

const initialState: CurrentGroupState = {
  currentGroup: localStorage.getItem('currentGroup') || '',
  university: localStorage.getItem('university') || '',
  subgroup: localStorage.getItem('subgroup') || '',
};

const saveToLocalStorage = (key: string, value: string) => {
  setTimeout(() => {
    localStorage.setItem(key, value);
  }, 0);
};

const currentGroupSlice = createSlice({
  name: 'currentGroup',
  initialState,
  reducers: {
    changeGroupNumber: (state, action) => {
      const { currentGroup, university } = action.payload;
      if (
        state.currentGroup !== currentGroup ||
        state.university !== university
      ) {
        state.currentGroup = currentGroup;
        state.university = university;
        state.subgroup = '';
        saveToLocalStorage('currentGroup', currentGroup);
        saveToLocalStorage('university', university);
        saveToLocalStorage('subgroup', '');
      }
    },
    changeSubgroup: (state, action) => {
      if (state.subgroup !== action.payload.subgroup) {
        state.subgroup = action.payload.subgroup;
        saveToLocalStorage('subgroup', action.payload.subgroup);
      }
    },
  },
});

export const { changeGroupNumber, changeSubgroup } = currentGroupSlice.actions;
export const currentGroupReducer = currentGroupSlice.reducer;
