import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { EDIT_PAGE, HOME, VERSIONS_LIST } from './routes';
import { Home } from '../containers/Home';
import { VersionsList } from '../containers/VersionsList';
import ScheduleEditPage from '../containers/ScheduleEditPage';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path={HOME} element={<Home />} />
      <Route path={VERSIONS_LIST} element={<VersionsList />} />
      <Route path={EDIT_PAGE} element={<ScheduleEditPage />} />
    </>,
  ),
);
