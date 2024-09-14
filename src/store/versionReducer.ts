import { Action } from './index';

const defaultState = {
  version: 'v1.0.1',
};

export const versionReducer = (state = defaultState, action: Action) => {
  switch (action.type) {
    case 'CHANGE_VERSION':
      return {
        ...state,
        version: action.payload,
      };
    default:
      return state;
  }
};
