import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"
import { HOME } from "./routes";
import { Home } from "../containers/Home";


export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={HOME} element={<Home/>}>
      {/* <Route path="dashboard" element={<></>} /> */}
    </Route>
  )
);