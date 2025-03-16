
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  function handleChange() {
    setMatches(getMatches(query));
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Add listener for subsequent changes
    if (matchMedia.addEventListener) {
      matchMedia.addEventListener("change", handleChange);
    } else {
      matchMedia.addListener(handleChange); // For older browsers and iOS
    }

    return () => {
      if (matchMedia.removeEventListener) {
        matchMedia.removeEventListener("change", handleChange);
      } else {
        matchMedia.removeListener(handleChange); // For older browsers and iOS
      }
    };
  }, [query]);

  return matches;
}
