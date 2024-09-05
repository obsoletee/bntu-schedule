import { Action } from './index';

const defaultState = {
  currentGroup: localStorage.getItem('currentGroup') || '',
};

export const currentGroupReducer = (state = defaultState, action: Action) => {
  switch (action.type) {
    case 'CHANGE_GROUP_NUMBER':
      localStorage.setItem('currentGroup', action.payload);
      return { ...state, currentGroup: action.payload };
    default:
      return state;
  }
};
