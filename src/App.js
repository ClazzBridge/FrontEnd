import logo from "./logo.svg";
import "./App.css";
import Router from "./shared/Router";
import React, { useEffect, useState } from "react";
import QuestionList from "./pages/QuestionList";

function App() {
  return (
    <QuestionList />
  );
}

export default App;
