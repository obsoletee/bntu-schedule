interface CurrentGroupAction {
  type: string;
  payload: { currentGroup: string; university: string };
}

const defaultState = {
  currentGroup: localStorage.getItem('currentGroup') || '',
  university: localStorage.getItem('university') || '',
  weekCounter: localStorage.getItem('weekCounter') || '',
};

export const currentGroupReducer = (
  state = defaultState,
  action: CurrentGroupAction,
) => {
  switch (action.type) {
    case 'CHANGE_GROUP_NUMBER':
      localStorage.setItem('currentGroup', action.payload.currentGroup);
      localStorage.setItem('university', action.payload.university);
      return {
        ...state,
        currentGroup: action.payload.currentGroup,
        university: action.payload.university,
      };
    default:
      return state;
  }
};
