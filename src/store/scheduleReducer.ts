import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GroupSchedule } from '../model/Schedule';

export interface ScheduleState {
  schedule: GroupSchedule | undefined;
  isScheduleLoading: boolean;
}

const initialState: ScheduleState = {
  schedule: undefined,
  isScheduleLoading: false,
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSchedule(state, action: PayloadAction<GroupSchedule>) {
      state.schedule = action.payload;
    },
    setScheduleLoading(state, action: PayloadAction<boolean>) {
      state.isScheduleLoading = action.payload;
    },
  },
});

export const { setSchedule, setScheduleLoading } = scheduleSlice.actions;
export const scheduleReducer = scheduleSlice.reducer;
