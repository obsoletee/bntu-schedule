interface ActiveDayOfWeekAction {
  type: string;
  payload: string;
}

const defaultState = {
  activeDayOfWeek: localStorage.getItem('activeDayOfWeek') || '',
};

export const activeDayOfWeekReducer = (
  state = defaultState,
  action: ActiveDayOfWeekAction,
) => {
  switch (action.type) {
    case 'CHANGE_ACTIVE_DAY_OF_WEEK':
      localStorage.setItem('activeDayOfWeek', action.payload);
      return {
        ...state,
        activeDayOfWeek: action.payload,
      };
    default:
      return state;
  }
};
