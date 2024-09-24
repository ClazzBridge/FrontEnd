import logo from "./logo.svg";
import "./App.css";
import Router from "./shared/Router";
import React, { useEffect, useState, } from "react";
import QuestionList from "./pages/QuestionList";
import QuestionDetail from "./pages/QuestionDetail";
import { Routes, Route, Link } from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<QuestionList />} />
        <Route path="/question/:match" element={<QuestionDetail />} />
      </Routes>
    </div>
  );
}

export default App;
