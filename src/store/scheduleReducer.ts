import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GroupSchedule } from '../model/Schedule';

export interface Schedule {
  schedule: GroupSchedule | undefined;
  isLoading: boolean;
}

const initialState: Schedule = {
  schedule: undefined,
  isLoading: false,
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSchedule(state, action: PayloadAction<GroupSchedule>) {
      state.schedule = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setSchedule, setLoading } = scheduleSlice.actions;
export default scheduleSlice.reducer;
