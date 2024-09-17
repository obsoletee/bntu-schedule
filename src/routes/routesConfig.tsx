import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { HOME, VERSIONS_LIST } from './routes';
import { Home } from '../containers/Home';
import { VersionsList } from '../containers/VersionsList';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path={HOME} element={<Home />} />
      <Route path={VERSIONS_LIST} element={<VersionsList />} />
    </>,
  ),
);
