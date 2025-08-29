"use client";

import { useState } from "react";
import TypingTest from "./components/TypingTest";
import "./globals.css";

export default function Home() {
  const [testKey, setTestKey] = useState<number>(0);
  const handleRestartButtonClick: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    setTestKey((prev) => prev + 1);
  };

  return (
    <>
      <TypingTest key={testKey} restartFunction={handleRestartButtonClick} />
    </>
  );
}
