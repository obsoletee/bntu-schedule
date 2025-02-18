import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LatestGroup {
  groupNumber: string;
}

export interface LatestGroupsState {
  latestGroups: LatestGroup[];
}

const initialState: LatestGroupsState = {
  latestGroups: JSON.parse(
    localStorage.getItem('latestGroups') || '[]',
  ) as LatestGroup[],
};

const latestGroupsSlice = createSlice({
  name: 'latestGroups',
  initialState,
  reducers: {
    addLatestGroup: (state, action: PayloadAction<LatestGroup>) => {
      state.latestGroups.push(action.payload);
      localStorage.setItem('latestGroups', JSON.stringify(state.latestGroups));
    },
    removeLatestGroup: (state, action: PayloadAction<string>) => {
      state.latestGroups = state.latestGroups.filter(
        (group: LatestGroup) => group.groupNumber !== action.payload,
      );
      localStorage.setItem('latestGroups', JSON.stringify(state.latestGroups));
    },
  },
});

export const { addLatestGroup, removeLatestGroup } = latestGroupsSlice.actions;
export const latestGroupsReducer = latestGroupsSlice.reducer;
