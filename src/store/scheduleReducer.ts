import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GroupSchedule } from '../model/Schedule';

export interface ScheduleState {
  schedule: GroupSchedule | undefined;
  isScheduleLoading: boolean;
  cache: Record<string, GroupSchedule>;
}

const initialState: ScheduleState = {
  schedule: undefined,
  isScheduleLoading: false,
  cache: {},
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSchedule(
      state,
      action: PayloadAction<{ group: string; data: GroupSchedule }>,
    ) {
      state.schedule = action.payload.data;
      state.cache[action.payload.group] = action.payload.data;
    },
    setScheduleLoading(state, action: PayloadAction<boolean>) {
      state.isScheduleLoading = action.payload;
    },
    getScheduleFromCache(state, action: PayloadAction<string>) {
      state.schedule = state.cache[action.payload] || undefined;
    },
  },
});

export const { setSchedule, setScheduleLoading, getScheduleFromCache } =
  scheduleSlice.actions;
export const scheduleReducer = scheduleSlice.reducer;
