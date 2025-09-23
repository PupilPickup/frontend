import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../Loading/Loading";

interface RouteLoaderProps {
  children: React.ReactNode;
}

function RouteLoader({ children }: RouteLoaderProps) {
  const location = useLocation();
  const [showSpinner, setShowSpinner] = useState(true); // first load
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    let spinnerTimer: NodeJS.Timeout;

    if (isFirstLoad) {
      // First load: show spinner for at least 500ms
      spinnerTimer = setTimeout(() => {
        setShowSpinner(false);
        setIsFirstLoad(false);
      }, 500);
    } else {
      // Route changes: only show spinner if route takes >200ms
      setShowSpinner(false); // start hidden
      spinnerTimer = setTimeout(() => setShowSpinner(true), 200);

      // Hide spinner after 600ms max
      const hideTimer = setTimeout(() => setShowSpinner(false), 600);

      return () => {
        clearTimeout(spinnerTimer);
        clearTimeout(hideTimer);
      };
    }

    return () => clearTimeout(spinnerTimer);
  }, [location, isFirstLoad]);

  return (
    <>
      {showSpinner && <Loading />}
      {children}
    </>
  );
}

export default RouteLoader;