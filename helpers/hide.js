import React, { useEffect, useContext, useState, useCallback } from "react";

export const hideContext = React.createContext({});

function HideContextProvider(props) {
  const [hide, setHide] = useState(0);
  const toggle = useCallback(() => setHide(!hide), [hide, setHide]);

  return <hideContext.Provider value={{ hide, toggle }} {...props}></hideContext.Provider>;
}

export function useHide() {
  return useContext(hideContext);
}

export default HideContextProvider;
