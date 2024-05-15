import './styles/App.css';
import Login from "./pages/Login";
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";
import Edit from "./pages/Edit";
import Register from "./pages/Register";
import {
  Outlet,
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

const Layout = () => {
  return(
    <>
      <Navbar/>
      <Outlet/>
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "/edit",
        element: <Edit/>,
      }
    ]
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/register",
    element: <Register/>,
  },
]);

function App() {
  return (
    <div className='App'>
      <div className="container">
        <RouterProvider router={router}/>
      </div>
    </div>
  );
}

export default App;