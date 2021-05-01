import React, { useEffect, useContext, useState } from "react";

export const suspenseContext = React.createContext(0);

function SuspenseContextProvider(props) {
  const frames = ["[-----]", "[=----]", "[-=---]", "[--=--]", "[---=-]", "[----=]"];
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((index) => (index + 1) % frames.length);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return <suspenseContext.Provider value={frames[index]} {...props}></suspenseContext.Provider>;
}

export function useSuspense() {
  return useContext(suspenseContext);
}

export default SuspenseContextProvider;
