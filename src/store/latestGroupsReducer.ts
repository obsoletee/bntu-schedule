import { Action } from './index';

const defaultState = {
  latestGroups: JSON.parse(localStorage.getItem('latestGroups') || '[]') as {
    number: string;
    university: string;
  }[],
};

export const latestGroupsReducer = (state = defaultState, action: Action) => {
  switch (action.type) {
    case 'ADD_LATEST_GROUPS':
      localStorage.setItem(
        'latestGroups',
        JSON.stringify([...state.latestGroups, action.payload]),
      );
      return {
        ...state,
        latestGroups: [...state.latestGroups, action.payload],
      };
    case 'REMOVE_LATEST_GROUPS':
      localStorage.setItem(
        'latestGroups',
        JSON.stringify(
          state.latestGroups.filter((group) => group.number !== action.payload),
        ),
      );
      return {
        ...state,
        latestGroups: state.latestGroups.filter(
          (group) => group.number !== action.payload,
        ),
      };
    default:
      return state;
  }
};
