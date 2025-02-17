import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AllowedGroups {
  data: {
    groupNumber: string;
    universityCode: string;
    universityName: string;
    department: string;
  };
  value: string;
  label: string;
}

export interface AvailableGroupsState {
  groupList: AllowedGroups[];
  isGroupsLoading: boolean;
}

export const groups: AllowedGroups[] = [
  {
    data: {
      groupNumber: '11004122',
      universityCode: 'bntu',
      universityName: 'БНТУ',
      department: 'ФЭС',
    },
    value: '11004122',
    label: '11004122',
  },
  {
    data: {
      groupNumber: '11004222',
      universityCode: 'bntu',
      universityName: 'БНТУ',
      department: 'ФЭС',
    },
    value: '11004222',
    label: '11004222',
  },
  {
    data: {
      groupNumber: '11004322',
      universityCode: 'bntu',
      universityName: 'БНТУ',
      department: 'ФЭС',
    },
    value: '11004322',
    label: '11004322',
  },
  {
    data: {
      groupNumber: '11102122',
      universityCode: 'bntu',
      universityName: 'БНТУ',
      department: 'АФ',
    },
    value: '11102122',
    label: '11102122',
  },
  {
    data: {
      groupNumber: '172301',
      universityCode: 'bsuir',
      universityName: 'БГУИР',
      department: 'ИЭФ',
    },
    value: '172301',
    label: '172301',
  },
  {
    data: {
      groupNumber: '172302',
      universityCode: 'bsuir',
      universityName: 'БГУИР',
      department: 'ИЭФ',
    },
    value: '172302',
    label: '172302',
  },
  {
    data: {
      groupNumber: '172303',
      universityCode: 'bsuir',
      universityName: 'БГУИР',
      department: 'ИЭФ',
    },
    value: '172303',
    label: '172303',
  },
];

const initialState: AvailableGroupsState = {
  groupList: groups,
  isGroupsLoading: false,
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroups(state, action: PayloadAction<AllowedGroups[]>) {
      state.groupList = action.payload;
    },
    addGroup(state, action: PayloadAction<AllowedGroups>) {
      state.groupList.push(action.payload);
    },
    editGroup(state, action: PayloadAction<AllowedGroups>) {
      const index = state.groupList.findIndex(
        (group) => group.value === action.payload.value,
      );
      if (index !== -1) {
        state.groupList[index] = action.payload;
      }
    },
    deleteGroup(state, action: PayloadAction<string>) {
      state.groupList = state.groupList.filter(
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
