import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/Home";
import MainLayout from "../layouts/main-layout/MainLayout";
import ErrorPage from "../pages/ErrorPage";

import CategoryPage from "../pages/category-page";

function Router() {
  const routes = [
    {
      path: "/",
      element: <Home />,
    },
  ];
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {routes?.map(({ path, element }) => {
              return <Route path={path} element={element} key={path} />;
            })}
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default Router;
