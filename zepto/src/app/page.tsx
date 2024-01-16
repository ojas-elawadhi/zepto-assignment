"use client";

import React, { useState, useEffect, useRef } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState<string>("");
  const [items, setItems] = useState<string[]>([
    "Pikachu",
    "Bulbasaur",
    "Blastoise",
    "Squirtle",
    "Charizard",
    "JigglyPuff",
    "Mew",
    "Dragonite",
    "Onix",
    "Ditto",
    "Tauras",
    "Magnemite",
  ]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [matchingItems, setMatchingItems] = useState<string[]>([]);
  const [prevKeyPressed, setPrevKeyPressed] = useState<string>("");
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setInputFocus(event.target === document.activeElement);
  };

  const handleFocus = () => {
    if (!inputValue && inputRef.current) {
      setMatchingItems(items);
      setInputFocus(true);
    }
  };

  const handleItemClick = (item: string) => {
    setSelectedItems((prevSelected) => [...prevSelected, item]);
    setItems((prevItems) => prevItems.filter((prevItem) => prevItem !== item));
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleTagRemove = (item: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.filter((selectedItem) => selectedItem !== item)
    );
    setItems((prevItems) => [...prevItems, item.replace("bordered-", "")]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !inputValue) {
      console.log(prevKeyPressed, "prev");
      if (prevKeyPressed === "Backspace") {
        // Pressed twice, remove the last tag
        setPrevKeyPressed("");
        const lastTag = selectedItems[selectedItems?.length - 1];
        handleTagRemove(lastTag);
      } else {
        // Pressed once, add a border to the previous tag
        const lastTagIndex = selectedItems.length - 1;
        const lastTag = selectedItems[lastTagIndex];
        const newSelectedItems = [...selectedItems];

        if (!lastTag.startsWith("bordered-")) {
          newSelectedItems[lastTagIndex] = `bordered-${lastTag}`;
          setSelectedItems(newSelectedItems);
        }

        setPrevKeyPressed("Backspace");
      }
    } else {
      setPrevKeyPressed("");
    }
  };

  useEffect(() => {
    if (!inputValue && inputRef.current) {
      setMatchingItems(items);
    } else {
      const delay = setTimeout(() => {
        setMatchingItems(
          items.filter((item) =>
            item.toLowerCase().includes(inputValue.toLowerCase())
          )
        );
      }, 300);

      return () => clearTimeout(delay);
    }
  }, [inputValue, items]);

  return (
    <div className="flex min-h-screen flex-col items-center">
      <div className="absolute -z-10 block bg-cover overflow-hidden overflow-clip-margin h-[100dvh] w-full">
        <div className="inset-0 z-10">
          <div className="absolute inset-0 bg-[#141414] opacity-75"></div>
        </div>
      </div>
      <div className="relative flex flex-row w-[85vw] lg:w-[50vw] mt-16 border-b-2">
        <div className="flex flex-row flex-wrap ">
          {selectedItems.map((item, index) => (
            <div
              key={item}
              className={`${
                item.startsWith("bordered-") ? "border-2 border-white" : ""
              } text-white pr-2  rounded-full flex items-center mr-2 h-9 mb-3 bg-blue-500`}
            >
              <img
                width="36"
                height="36"
                src="https://img.icons8.com/color/48/pokeball--v1.png"
                alt="pokeball--v1"
              />{" "}
              <span className="mr-2 font-medium">
                {item.replace("bordered-", "")}
              </span>
              <button
                onClick={() => handleTagRemove(item)}
                className="ml-2 font-semibold"
              >
                X
              </button>
            </div>
          ))}

          <div className="w-[30vw] lg:w-[8vw]">
            <input
              type="text"
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              placeholder="I Choose..."
              className="border-none p-2 rounded-md mb-4 w-full bg-[transparent] text-white focus:border-transparent focus:outline-none"
            />
            {inputFocus && matchingItems.length > 0 && (
              <div className="absolute w-[50vw] sm:w-[25vw] lg:w-[15vw] bg-opacity-50 bg-black max-h-60 scroll_bar overflow-scroll  rounded-md shadow-lg mt-2">
                <ul>
                  {matchingItems.map((item) => (
                    <li
                      key={item}
                      className="pl-2 p-1  cursor-pointer hover:bg-gray-200 hover:text-black text-white font-semibold flex items-center gap-2"
                      onClick={() => handleItemClick(item)}
                    >
                      <img
                        width="40"
                        height="40"
                        src="https://img.icons8.com/color/48/pokeball--v1.png"
                        alt="pokeball--v1"
                      />{" "}
                      {item.replace("bordered-", "")}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
