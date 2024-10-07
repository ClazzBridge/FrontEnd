// hooks/useFabActions.js
import { useState, useEffect } from 'react';

export const useFabActions = () => {
  const [isUnderstand, setUnderstand] = useState(false);
  const [voteVisible, setVoteVisible] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [question, setQuestion] = useState("");
  const [mouseInFabGroup, setMouseInFabGroup] = useState(false);
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      if (mouseX > windowWidth - 112 && mouseY > windowHeight * 0.3 && mouseY < windowHeight * 0.7) {
        setMouseInFabGroup(true);
      } else {
        setMouseInFabGroup(false);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    setShowFab(mouseInFabGroup || chatVisible || voteVisible || questionVisible);
  }, [mouseInFabGroup, chatVisible, voteVisible, questionVisible]);

  return {
    isUnderstand,
    voteVisible,
    questionVisible,
    chatVisible,
    question,
    showFab,
    setUnderstand,
    setVoteVisible,
    setQuestionVisible,
    setChatVisible,
    setQuestion,
    setShowFab,
  };
};