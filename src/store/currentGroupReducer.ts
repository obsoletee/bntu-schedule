interface CurrentGroupAction {
  type: string;
  payload: { currentGroup: string; university: string; subgroup: string };
}

const defaultState = {
  currentGroup: localStorage.getItem('currentGroup') || '',
  university: localStorage.getItem('university') || '',
  subgroup: localStorage.getItem('subgroup') || '',
};

export const currentGroupReducer = (
  state = defaultState,
  action: CurrentGroupAction,
) => {
  switch (action.type) {
    case 'CHANGE_GROUP_NUMBER':
      localStorage.setItem('currentGroup', action.payload.currentGroup);
      localStorage.setItem('university', action.payload.university);
      localStorage.setItem('subgroup', '');
      return {
        ...state,
        currentGroup: action.payload.currentGroup,
        university: action.payload.university,
        subgroup: '',
      };
    case 'CHANGE_SUBGROUP':
      localStorage.setItem('subgroup', action.payload.subgroup);
      return {
        ...state,
        subgroup: action.payload.subgroup,
      };
    default:
      return state;
  }
};
