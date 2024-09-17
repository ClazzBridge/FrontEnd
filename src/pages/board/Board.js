import React from "react";
import { Link } from "react-router-dom";

const Board = () => {
  return (
    <div>
      <h1>Board Page</h1>
      <ul>
        <li>
          <Link to="/freeboard">Free Board</Link>
        </li>
        <li>
          <Link to="/noticeboard">Notice Board</Link>
        </li>
      </ul>
    </div>
  );
};

export default Board;
