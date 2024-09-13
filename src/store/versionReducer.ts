import { Action } from './index';

const defaultState = {
  version: localStorage.getItem('version') || 'v.1.0.1',
};

export const versionReducer = (state = defaultState, action: Action) => {
  switch (action.type) {
    case 'CHANGE_GROUP_NUMBER':
      localStorage.setItem('version', action.payload);
      return {
        ...state,
        version: action.payload,
      };
    default:
      return state;
  }
};
