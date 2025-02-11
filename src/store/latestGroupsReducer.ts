import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  latestGroups: JSON.parse(localStorage.getItem('latestGroups') || '[]') as {
    number: string;
    university: string;
  }[],
};

const latestGroupsSlice = createSlice({
  name: 'latestGroups',
  initialState,
  reducers: {
    addLatestGroup: (
      state,
      action: PayloadAction<{ number: string; university: string }>,
    ) => {
      state.latestGroups.push(action.payload);
      localStorage.setItem('latestGroups', JSON.stringify(state.latestGroups));
    },
    removeLatestGroup: (state, action: PayloadAction<string>) => {
      state.latestGroups = state.latestGroups.filter(
        (group) => group.number !== action.payload,
      );
      localStorage.setItem('latestGroups', JSON.stringify(state.latestGroups));
    },
  },
});

export const { addLatestGroup, removeLatestGroup } = latestGroupsSlice.actions;
export const latestGroupsReducer = latestGroupsSlice.reducer;
