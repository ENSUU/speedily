"use client";

import Navbar from "./components/Navbar";
import { useState } from "react";
import TypingTest from "./components/TypingTest";
import "./globals.css";

export default function Home() {
  const [testKey, setTestKey] = useState(0);
  const handleRestartButtonClick = () => {
    console.log("Button clicked.");
    setTestKey((prev) => prev + 1);
  };

  return (
    <>
      <Navbar />
      <TypingTest key={testKey} restartFunction={handleRestartButtonClick} />
    </>
  );
}
