import React, { useEffect, useCallback, useContext, useState } from "react";

export const konamiContext = React.createContext(undefined);

const KeyMap = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
  65: "a",
  66: "b",
};

const KonamiCode = [
  "up",
  "up",
  "down",
  "down",
  "left",
  "right",
  "left",
  "right",
  "b",
  "a",
];

function KonamiContextProvider(props) {
  const [activated, setActivated] = useState(false);
  const [position, setPosition] = useState(0);

  const handler = useCallback(
    (event) => {
      const key = KeyMap[event.keyCode];
      const requiredKey = KonamiCode[position];
      if (key == requiredKey) {
        setPosition(position + 1);
        if (position + 1 == KonamiCode.length) {
          setActivated(true);
          setPosition(0);
        }
      } else {
        setPosition(0);
      }
    },
    [position, setPosition, setActivated, activated]
  );

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [position, setPosition, setActivated, activated]);

  return (
    <konamiContext.Provider
      value={{ activated }}
      {...props}
    ></konamiContext.Provider>
  );
}

export function useKonami() {
  return useContext(konamiContext);
}

export default KonamiContextProvider;
