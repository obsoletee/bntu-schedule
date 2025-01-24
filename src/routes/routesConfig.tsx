import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import {
  EDIT_PAGE,
  HOME,
  SUBJECTS_PAGE,
  TEACHERS_PAGE,
  VERSIONS_LIST,
} from './routes';
import { Home } from '../containers/Home';
import { VersionsList } from '../containers/VersionsList';
import ScheduleEditPage from '../containers/ScheduleEditPage';
import Teachers from '../containers/Teachers';
import Subjects from '../containers/Subjects';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path={HOME} element={<Home />} />
      <Route path={VERSIONS_LIST} element={<VersionsList />} />
      <Route path={EDIT_PAGE} element={<ScheduleEditPage />} />
      <Route path={TEACHERS_PAGE} element={<Teachers />} />
      <Route path={SUBJECTS_PAGE} element={<Subjects />} />
    </>,
  ),
);
