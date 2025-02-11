import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  activeDayOfWeek: localStorage.getItem('activeDayOfWeek') || '1',
};

const activeDayOfWeekSlice = createSlice({
  name: 'activeDayOfWeek',
  initialState,
  reducers: {
    changeActiveDayOfWeek: (state, action: PayloadAction<string>) => {
      state.activeDayOfWeek = action.payload;
      localStorage.setItem('activeDayOfWeek', action.payload);
    },
  },
});

export const { changeActiveDayOfWeek } = activeDayOfWeekSlice.actions;
export const activeDayOfWeekReducer = activeDayOfWeekSlice.reducer;
