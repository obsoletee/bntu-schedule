import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';

import { router } from './routes/routesConfig';

import './styles/null.scss';
import { createStore } from 'redux';

interface Action {
  type: string;
  payload: string;
}
const defaultState = {
  groupNumber: '11004122',
};
const reducer = (state = defaultState, action: Action) => {
  switch (action.type) {
    case 'CHANGE_GROUP_NUMBER':
      return { ...state, groupNumber: action.payload };
    default:
      return state;
  }
};
const store = createStore(reducer);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);
