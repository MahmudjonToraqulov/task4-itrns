import React, { Suspense, lazy } from 'react';
import Login from "./components/auth/login";
import Register from "./components/auth/register";

import Header from "./components/header";
// import Home from "./components/home";
import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";
const Home = lazy(() => import('./components/home')); // Lazy load Home component

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      <Header />
      <Suspense fallback={<div>Loading...</div>}> {/* Fallback UI while loading */}
        <div className="w-full h-screen flex flex-col">{routesElement}</div>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
