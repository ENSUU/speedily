import { useState, useEffect, useRef } from "react";
import Form from "next/form";

const TypingTest = ({ restartFunction }) => {
  const [userInput, setUserInput] = useState("");
  const userInputRef = useRef<HTMLInputElement>(null);
  const restartButtonRef = useRef<HTMLButtonElement>(null);
  const [currCharIndex, setCurrCharIndex] = useState(0);
  const [numChars, setNumChars] = useState(0);
  const [numIncorrectChars, setNumIncorrectChars] = useState(0);
  const [isTestComplete, setIsTestComplete] = useState(false);

  // Quote state.
  const [quote, setQuote] = useState(
    "",
    // "Hello, my name is David.",
    // "I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best.",
  );
  const [quoteAuthor, setQuoteAuthor] = useState("");

  // Global index. Needed for character input validation by user.
  let runningIndex = 0;
  let globalIndex = 0;

  // Timing state. Needed to calculate WPM
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const cleanFetchedQuote = (quote) => {
    const quoteChars = quote.split(" ");
    for (let i = 0; i < quoteChars.length; i++) {
      if (quoteChars[i] == "—") {
        quoteChars[i] = "-";
      }
    }
    return quoteChars.join(" ");
  };

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch("https://api.quotable.io/quotes/random");
        const json = await response.json();
        setQuote(cleanFetchedQuote(json[0].content));
        setQuoteAuthor(json[0].author);
      } catch (err) {
        setQuote("Unable to generate a quote. Please try again later!");
        setQuoteAuthor("ENSUU");
        console.error(err);
      }
    };
    fetchQuote();
  }, []);

  useEffect(() => {
    userInputRef.current?.focus();
    restartButtonRef.current?.focus();
  }, [quote, isTestComplete]);

  const handleKeyDown = (e) => {
    e.preventDefault();

    if (!startTime) {
      setStartTime(Date.now());
      console.log("Timer started. ");
    }

    if (e.key == "Backspace") {
      setUserInput((prev_input) => prev_input.slice(0, -1));
      setCurrCharIndex((prev_index) => Math.max(0, prev_index - 1));
    } else if (e.key.length == 1) {
      const newChar = e.key;
      setNumChars((prev_count) => prev_count + 1);
      checkCorrectChar(newChar);
      setUserInput((prev_input) => prev_input + newChar);
      setCurrCharIndex((prev_index) => (prev_index += 1));
    }

    // Need to do this because userInput is not updated because state is updated in batches; Can't use it to check equality with quote.
    const newUserInput = userInput + e.key;

    if (newUserInput == quote) {
      const recorded_end_time = Date.now();
      console.log(recorded_end_time);
      console.log("Finished.");
      setEndTime(recorded_end_time);
      setIsTestComplete(true);
      restartButtonRef.current?.focus();
    }
  };

  const getCharClass = (char: string, index: number) => {
    if (index < userInput.length) {
      console.log(char, quote[index]);
      return char === quote[index] ? "bg-green-400/50" : "bg-red-400/50";
    } else if (index == userInput.length) {
      return "bg-yellow-400/50";
    }
  };

  const checkCorrectChar = (inputChar) => {
    console.log(inputChar, quote.split("")[currCharIndex]);
    if (inputChar != quote.split("")[currCharIndex]) {
      console.log(
        `Expected ${quote.split("")[currCharIndex]} but typed ${inputChar}`,
      );
      setNumIncorrectChars((prev_count) => prev_count + 1);
    }
  };

  const getRawWPM = (startTime, endTime) => {
    if (!startTime || !endTime) {
      return null;
    }
    const attempt_duration = (endTime - startTime) / 1000;
    console.log((userInput.length / 5 / (attempt_duration / 60)).toFixed(2));
    return Math.round(userInput.length / 5 / (attempt_duration / 60));
  };

  const getNetWPM = (startTime, endTime, rawWPM) => {
    if (!startTime || !endTime) {
      return null;
    }
    const attempt_duration = (endTime - startTime) / 1000;
    const calculatedNetWPM = rawWPM - numIncorrectChars / attempt_duration;
    return Math.round(calculatedNetWPM);
  };

  const handleRestartBtnClick = () => {
    restartFunction();
  };

  const handleEnterPressed = (e) => {
    if (e.key == "Enter") {
      restartFunction();
    }
  };

  // Grab the indices for each space character in input quote. Used to add spans containing spaces when rendering quote.
  const space_indices: Set<number> = new Set();
  const getSpaceIndices = () => {
    quote.split("").forEach((char, index) => {
      if (char == " ") {
        space_indices.add(index);
      }
    });
  };

  return (
    <>
      <div
        id="quote-container"
        className="h-[16rem] flex flex-col justify-center items-center"
      >
        {/* <div className="w-[800px] flex flex-wrap justify-center items-center m-auto text-2xl">
          {quote != "" &&
            quote.split(" ").map((word, word_index) => {
              getSpaceIndices();
              const word_span = (
                <span
                  key={word_index}
                  className="inline-block whitespace-nowrap"
                >
                  {word.split("").map((char, char_index) => {
                    const global_index = runningIndex + char_index;
                    const typed_char = userInput[global_index];
                    const space_span =
                      space_indices.has(global_index + 1) &&
                      word_index < quote.split(" ").length - 1 ? (
                        <span
                          key={`space-${char_index}`}
                          className={getCharClass(typed_char, global_index)}
                        >
                          {"\u00A0"}
                        </span>
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
        </div> */}
        <div className="w-[900px] flex flex-wrap justify-center m-auto text-2xl">
          {quote !== "" &&
            quote.split(" ").map((word, wordIndex) => (
              <div key={wordIndex} className="text-[30px]">
                <span key={wordIndex}>
                  {word.split("").map((letter, letterIndex) => {
                    const currentIndex = globalIndex++;
                    return (
                      <span
                        key={`${wordIndex}-${letterIndex}`}
                        className={getCharClass(
                          userInput[currentIndex],
                          currentIndex,
                        )}
                      >
                        {letter}
                      </span>
                    );
                  })}
                </span>
                {wordIndex < quote.split(" ").length - 1 && (
                  <span
                    key={`space-${wordIndex}`}
                    className={getCharClass(
                      userInput[globalIndex],
                      globalIndex++,
                    )}
                  >
                    {"\u00A0"}
                  </span>
                )}
              </div>
            ))}
        </div>
        <div id="quote-author" className="flex items-center justify-center">
          <h1> - {quoteAuthor}</h1>
        </div>
      </div>
      <div
        id="user-stats-container"
        className="h-[16rem] flex flex-col flex-wrap items-center"
      >
        <div className="flex flex-wrap items-center justify-center gap-2 my-4">
          <h1>
            Accuracy:
            {"\u00A0" +
              (numChars <= 0
                ? 0
                : Math.round(
                    ((numChars - numIncorrectChars) / numChars) * 100,
                  ))}
            %
          </h1>
          {userInput == quote && <h1>|</h1>}
          {isTestComplete && (
            <>
              <h1>{"Your raw WPM is: " + getRawWPM(startTime, endTime)} </h1>
              <h1> | </h1>
              <h1>
                {"Your net WPM is: " +
                  getNetWPM(startTime, endTime, getRawWPM(startTime, endTime))}
              </h1>
            </>
          )}
        </div>
        {isTestComplete && (
          <button
            type="button"
            className="w-[12rem] text-white font-bold bg-black px-6 py-2 rounded-md hover:scale-[1.1]"
            onClick={handleRestartBtnClick}
            onKeyDown={handleEnterPressed}
            ref={restartButtonRef}
          >
            Next
          </button>
        )}
      </div>
      {/* <div
        id="debugging-div"
        className="flex flex-col justify-center items-center mt-4 border-2 border-black"
      >
        <h1>Current Char Index: {currCharIndex} </h1>
        <p>Expecting the character {quote[currCharIndex]} to be typed.</p>
      </div> */}
      <div>
        <Form className="flex justify-center items-center mt-12" action="">
          <input
            className="opacity-0"
            type="text"
            onKeyDown={handleKeyDown}
            ref={userInputRef}
            disabled={isTestComplete ? true : false}
          />
        </Form>
      </div>
    </>
  );
};

export default TypingTest;
