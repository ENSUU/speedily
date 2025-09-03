import { useState, useEffect, useRef } from "react";
import Form from "next/form";
import { supabase } from "../../supabaseClient";

const TypingTest = ({ restartFunction }) => {
  const [userInput, setUserInput] = useState("");
  const userInputRef = useRef<HTMLInputElement>(null);
  const restartButtonRef = useRef<HTMLButtonElement>(null);
  const [currCharIndex, setCurrCharIndex] = useState(0);
  const [numChars, setNumChars] = useState(0);
  const [numIncorrectChars, setNumIncorrectChars] = useState(0);
  const [isTestComplete, setIsTestComplete] = useState(false);

  // Quote state.
  const [quote, setQuote] = useState<string>(
    "",
    // "Hello, my name is David.",
    // "I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best.",
  );
  const [quoteAuthor, setQuoteAuthor] = useState<string>("");

  // Global index. Needed for character input validation by user.
  // let runningIndex: number = 0;
  let globalIndex: number = 0;

  // Timing state. Needed to calculate WPM
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const cleanFetchedQuote = (quote: string): string => {
    const quoteChars = quote.split(" ");
    for (let i = 0; i < quoteChars.length; i++) {
      if (quoteChars[i] == "—") {
        quoteChars[i] = "-";
      }
    }
    return quoteChars.join(" ");
  };

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);
  };

  useEffect(() => {
    const fetchQuote = async (): Promise<void> => {
      try {
        const response = await fetch("http://api.quotable.io/random");
        const data = await response.json();
        setQuote(cleanFetchedQuote(data.content));
        setQuoteAuthor(data.author);
      } catch (err) {
        setQuote("Unable to generate a quote. Please try again later!");
        setQuoteAuthor("ENSUU");
        console.error(err);
      }
    };
    fetchQuote();
    getUser();
  }, []);

  useEffect(() => {
    userInputRef.current?.focus();
    restartButtonRef.current?.focus();
  }, [quote, isTestComplete]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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

  const getCharClass = (char: string, index: number): string => {
    if (index < userInput.length) {
      return char === quote[index] ? "bg-green-400/50" : "bg-red-400/50";
    } else if (index == userInput.length) {
      return "bg-yellow-400/50";
    }
  };

  const checkCorrectChar = (inputChar: string): void => {
    console.log(inputChar, quote.split("")[currCharIndex]);
    if (inputChar != quote.split("")[currCharIndex]) {
      console.log(
        `Expected ${quote.split("")[currCharIndex]} but typed ${inputChar}`,
      );
      setNumIncorrectChars((prev_count) => prev_count + 1);
    }
  };

  const getRawWPM = (startTime: number, endTime: number): number | null => {
    if (!startTime || !endTime) {
      return null;
    }

    const attempt_duration = (endTime - startTime) / 1000;
    console.log((userInput.length / 5 / (attempt_duration / 60)).toFixed(2));
    return Math.round(userInput.length / 5 / (attempt_duration / 60));
  };

  const getNetWPM = (
    startTime: number,
    endTime: number,
    rawWPM: number,
  ): number | null => {
    if (!startTime || !endTime) {
      return null;
    }
    const attempt_duration = (endTime - startTime) / 1000;
    const calculatedNetWPM = rawWPM - numIncorrectChars / attempt_duration;
    return Math.round(calculatedNetWPM);
  };

  const handleRestartBtnClick = (): void => {
    restartFunction();
  };

  const handleEnterPressed = (e: KeyboardEvent) => {
    if (e.key == "Enter") {
      restartFunction();
    }
  };

  // Grab the indices for each space character in input quote. Used to add spans containing spaces when rendering quote.
  const space_indices: Set<number> = new Set();
  const getSpaceIndices = (): void => {
    quote.split("").forEach((char, index) => {
      if (char == " ") {
        space_indices.add(index);
      }
    });
  };

  return (
    <div className="flex flex-col justify-center items-center my-auto">
      <div
        id="quote-container"
        className="w-[75vw] h-[16rem] flex flex-col justify-center items-center"
      >
        <div className="flex flex-wrap justify-center my-auto text-2xl">
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
        <div
          id="quote-author"
          className="flex items-center justify-center my-4"
        >
          <h1> - {quoteAuthor}</h1>
        </div>
      </div>
      <div
        id="user-stats-container"
        className="h-[16rem] flex flex-col flex-wrap items-center my-4"
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
            className="opacity-0 !caret-transparent"
            type="text"
            onKeyDown={handleKeyDown}
            ref={userInputRef}
            disabled={isTestComplete ? true : false}
          />
        </Form>
      </div>
    </div>
  );
};

export default TypingTest;
