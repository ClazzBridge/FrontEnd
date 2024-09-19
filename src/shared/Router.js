import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// 홈 페이지
import Home from "../pages/Home";

// 게시판 페이지
import FreeBoard from "../pages/board/FreeBoard";
import NoticeBoard from "../pages/board/NoticeBoard";
import Board from "../pages/board/Board";

// 레이아웃 페이지
import LayoutWrapper from "../components/layout/layoutWrapper";

// 프로필 페이지
import Profile from "../pages/user/Profile";
import PasswordCheck from "../pages/user/PasswordCheck";

// 강의실 페이지
import LectureRoom from "../pages/lectureRoom/LectureRoom";
import Assignment from "../pages/lectureRoom/Assignment";
import Qna from "../pages/lectureRoom/Qna";
import Vote from "../pages/lectureRoom/Vote";

// 채팅 페이지
import Chat from "../pages/chat/Chat";
import Privatechat from "../pages/chat/Privatechat";

// 캘린더 페이지
import Calendar from "../pages/calendar/Calendar";

const Router = () => {
  return (

    <Routes>
      <Route element={<LayoutWrapper />}>
        <Route path="/" element={<Home />} />
        <Route path="freeboard" element={<FreeBoard />} />
        <Route path="noticeboard" element={<NoticeBoard />} />
        <Route path="board" element={<Board />} />
        <Route path="profile" element={<Profile />} />
        <Route path="PasswordCheck" element={<PasswordCheck />} />
        <Route path="lectureroom" element={<LectureRoom />} />
        <Route path="chat" element={<Chat />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="assignment" element={<Assignment />} />
        <Route path="qna" element={<Qna />} />
        <Route path="vote" element={<Vote />} />
        <Route path="privatechat" element={<Privatechat />} />
      </Route>
    </Routes>

  );
};

export default Router;