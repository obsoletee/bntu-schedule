import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AllowedGroups {
  data: {
    groupNumber: string;
    universityCode: string;
    universityName: string;
    departmentCode: string;
    departmentShortName: string;
    departmentFullName: string;
  };
  value: string;
  label: string;
}

export interface AvailableGroupsState {
  availableGroups: AllowedGroups[];
  isGroupsLoading: boolean;
}

export const groups: AllowedGroups[] = [];

const initialState: AvailableGroupsState = {
  availableGroups: groups,
  isGroupsLoading: false,
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroups(state, action: PayloadAction<AllowedGroups[]>) {
      state.availableGroups = action.payload;
    },
    addGroup(state, action: PayloadAction<AllowedGroups>) {
      state.availableGroups.push(action.payload);
    },
    editGroup(state, action: PayloadAction<AllowedGroups>) {
      const index = state.availableGroups.findIndex(
        (group) => group.value === action.payload.value,
      );
      if (index !== -1) {
        state.availableGroups[index] = action.payload;
      }
    },
    deleteGroup(state, action: PayloadAction<string>) {
      state.availableGroups = state.availableGroups.filter(
        (group) => group.value !== action.payload,
      );
    },
    setGroupsLoading(state, action: PayloadAction<boolean>) {
      state.isGroupsLoading = action.payload;
    },
  },
});

export const { setGroups, addGroup, editGroup, deleteGroup, setGroupsLoading } =
  groupsSlice.actions;

export const availableGroupsReducer = groupsSlice.reducer;
