import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";

import FreeBoard from "../pages/board/FreeBoard";
import NoticeBoard from "../pages/board/NoticeBoard";
import LayoutWrapper from "../components/layout/layoutWrapper";
import Profile from "../pages/user/Profile";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutWrapper />}>
          <Route path="/" element={<Home />} />
          <Route path="freeboard" element={<FreeBoard />} />
          <Route path="noticeboard" element={<NoticeBoard />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
