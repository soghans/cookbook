import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Header from "./routes/Header";
import ErrorPage from "./error-page";
import Recipes from "./routes/Recipes";
import Ingredients from "./routes/Ingredients";
import Home from "./routes/Home";

const router = createBrowserRouter([
  {
    element: <Header />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
        index: true,
      },
      {
        path: "/recipes",
        element: <Recipes />,
      },
      {
        path: "/ingredients",
        element: <Ingredients />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
