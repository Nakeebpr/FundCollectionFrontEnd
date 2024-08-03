import {
  createBrowserRouter,
  Link,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Root from "./Root";
import "./App.css";
import "./css/style.css";

const router = createBrowserRouter([{ path: "*", element: <Root /> }]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
