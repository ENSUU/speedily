"use client";

import Form from "next/form";
import { useState, useRef, useEffect } from "react";
import "./globals.css";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const userInputRef = useRef(null);
  const [currCharIndex, setCurrCharIndex] = useState(0);
  const [quote, setQuote] = useState(
    // "Hello, my name is David.",
    "I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best.",
  );

  // Global index. Needed for character input validation by user.
  let runningIndex = 0;

  // Grab the indices for each space character in input quote. Used to add spans containing spaces when rendering quote.
  const space_indices: Set<number> = new Set();
  quote.split("").forEach((char, index) => {
    if (char == " ") {
      space_indices.add(index);
    }
  });

  useEffect(() => {
    userInputRef.current.focus();
  }, []);

  const handleKeyDown = (e) => {
    e.preventDefault();
    if (e.key == "Backspace") {
      setUserInput((prev_input) => prev_input.slice(0, -1));
      setCurrCharIndex((prev_index) => Math.max(0, prev_index - 1));
    } else if (e.key.length == 1) {
      const newChar = e.key;
      setUserInput((prev_input) => prev_input + newChar);
      setCurrCharIndex((prev_index) => (prev_index += 1));
    }
  };

  const getCharClass = (char: string, index: number) => {
    console.log(`Inputted char: ${userInput[index]} | Expected char: ${char}`);
    if (index < userInput.length) {
      return char == quote[index] ? "text-green-400" : "text-red-400";
    } else if (index == userInput.length) {
      return "text-yellow-400";
    }
  };

  return (
    <div>
      <div id="navbar" className="flex justify-center items-center my-4">
        <h1 className="text-4xl font-bold">Speedily.</h1>
      </div>
      <div id="quote-container" className="w-full h-full p-12">
        <div className="flex flex-wrap justify-center m-auto text-2xl">
          {quote.split(" ").map((word, word_index) => {
            const word_span = (
              <span key={word_index} className="inline-block whitespace-nowrap">
                {word.split("").map((char, char_index) => {
                  const global_index = runningIndex + char_index;
                  const typed_char = userInput[global_index];
                  const space_span =
                    space_indices.has(global_index + 1) &&
                    word_index < quote.split(" ").length - 1 ? (
                      <span key={`space-${word_index}`}>{"\u00A0"}</span>
                    ) : null;

                  return (
                    <>
                      <span
                        key={char_index}
                        className={getCharClass(typed_char, global_index)}
                      >
                        {char}
                      </span>
                      {space_span}
                    </>
                  );
                })}
              </span>
            );

            runningIndex += word.length + 1;
            return word_span;
          })}
        </div>
      </div>
      <div>
        <Form className="flex justify-center items-center mt-12" action="">
          <input
            className="opacity-0"
            type="text"
            onKeyDown={handleKeyDown}
            ref={userInputRef}
          />
        </Form>
      </div>
    </div>
  );
}
