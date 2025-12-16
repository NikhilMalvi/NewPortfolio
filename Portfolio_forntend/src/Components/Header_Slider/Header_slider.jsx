import React, { useEffect, useState } from "react";
import "./Header_slider.css";

const words = [
  "Html",
  "Css",
  "Tailwind Css",
  "Java Script",
  "React Js",
  "Wordpress",
  "Node Js",
  "Express Js",
  "Mongo Db",
];

const Header_slider = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState("in"); // 'in' | 'out'
  const [showLetters, setShowLetters] = useState(true);

  useEffect(() => {
    if (phase === "in") {
      const inTimer = setTimeout(() => {
        setPhase("out");
      }, 2500); // stay visible for 2.5s
      return () => clearTimeout(inTimer);
    }

    if (phase === "out") {
      const outTimer = setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length);
        setPhase("in");
      }, 500); // fade-out duration
      return () => clearTimeout(outTimer);
    }
  }, [phase]);

  return (
    <h2 className="hero-title">
      <span className={`split-word ${phase === "out" ? "fade-out" : ""}`}>
        {phase === "in" ? (
          words[wordIndex].split("").map((char, index) => (
            <span
              className="letter"
              style={{ animationDelay: `${index * 0.05}s` }}
              key={index}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))
        ) : (
          <span> {words[wordIndex]}</span> // fade out as full word
        )}
      </span>
    </h2>
  );
};

export default Header_slider;
