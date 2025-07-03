"use client";

import Form from "next/form";
import { useState } from "react";
import "./globals.css";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [quote, setQuote] = useState(
    "Hello, my name is David.",
    // "I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best.",
  );
  const quoteSplit = quote.split(" ");
  const quoteLength = quoteSplit.length;
  const [quoteCurrIndex, setQuoteCurrIndex] = useState(0);
  const [incorrect, setIncorrect] = useState(null);

  function validateUserWord() {
    console.log(quoteCurrIndex);
    const userInputSplit = userInput.split(" ");
    if (userInputSplit[quoteCurrIndex] === quoteSplit[quoteCurrIndex]) {
      setIncorrect(false);
      setQuoteCurrIndex((quoteCurrIndex) => quoteCurrIndex + 1);
    } else {
      setIncorrect(true);
    }
  }

  function renderIncorrectCorrectCurrentWords(
    userInput: string,
    quoteSplit: Array<string>,
  ) {
    const userInputSplit = userInput.split(" ");
    console.log(userInputSplit);

    return quoteSplit.map((word, index) => {
      const isCurrentWord = index === userInputSplit.length - 1;
      const isTyped = index < userInputSplit.length;

      let wordClass = "";
      if (isTyped) {
        wordClass =
          quoteSplit[index] == userInputSplit[index]
            ? "border-b-2 border-green-400"
            : "border-b-2 border-red-400";
      } else if (isCurrentWord) {
        wordClass = "border-b-2 border-black";
      }

      return (
        <span key={index} className={"mx-0.5 " + wordClass}>
          {word}
        </span>
      );
    });
  }

  return (
    <div>
      <div id="navbar" className="flex justify-center items-center my-4">
        <h1 className="text-2xl font-bold">Speedily.</h1>
      </div>
      <div id="quote" className="flex justify-center mt-12 mx-auto w-5xl">
        {renderIncorrectCorrectCurrentWords(userInput, quoteSplit)}
      </div>
      <div>
        <Form className="flex justify-center items-center mt-12" action="">
          <input
            type="text"
            value={userInput}
            className={
              "border-2 w-5xl " +
              (incorrect == null
                ? "border-black"
                : incorrect
                  ? "border-red-600"
                  : "border-green-600")
            }
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key == " " || e.code == "Space") {
                validateUserWord();
              }
            }}
            disabled={
              quoteCurrIndex > quoteSplit.length - 1 && !incorrect
                ? true
                : false
            }
          />
        </Form>
        {userInput}
      </div>
    </div>
  );
}
