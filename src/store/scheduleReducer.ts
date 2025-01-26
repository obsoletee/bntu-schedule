import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GroupSchedule } from '../model/Schedule';

export interface Schedule {
  schedule: GroupSchedule | undefined;
  isScheduleLoading: boolean;
}

const initialState: Schedule = {
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
export default scheduleSlice.reducer;
