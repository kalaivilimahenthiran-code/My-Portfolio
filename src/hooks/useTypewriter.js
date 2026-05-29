"use client";
import { useState, useEffect } from "react";

export function useTypewriter(words, speed = 100, deleteSpeed = 50, delay = 2000) {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    const i = loopNum % words.length;
    const fullText = words[i];

    let typeSpeed = isDeleting ? deleteSpeed : speed;

    const timeout = setTimeout(() => {
      setText((current) => {
        if (isDeleting) {
          return fullText.substring(0, current.length - 1);
        }
        return fullText.substring(0, current.length + 1);
      });

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), delay);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, loopNum, words, speed, deleteSpeed, delay]);

  return text;
}
