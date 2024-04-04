import { debounce } from "lodash";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import type { RefObject } from "react";

export function useScrollToEnd(callback: () => void, debounceTime = 200) {
  const element = useRef<HTMLDivElement>(null);

  const scrollToEnd = useMemo(() => {
    const debounceCallback: () => void = debounce(() => {
      if (element.current)
        if (
          Math.abs(
            element.current.scrollHeight -
              element.current.scrollTop -
              element.current.clientHeight
          ) < 1
        )
          callback();
    }, debounceTime);
    return debounceCallback;
  }, [callback, debounceTime]);

  useEffect(() => {
    const target = element.current;
    target?.addEventListener("scroll", scrollToEnd);
    return () => {
      target?.removeEventListener("scroll", scrollToEnd);
    };
  }, [element, scrollToEnd]);

  return element;
}

export function useOverflow(element: RefObject<HTMLDivElement>) {
  const [isOverflow, setIsOverflow] = useState<undefined | boolean>(undefined);

  const handleResizeWindow = useMemo(
    () =>
      debounce(() => {
        if (element.current) {
          setIsOverflow(element.current.clientHeight >= 200);
        }
      }),
    [element]
  );

  useLayoutEffect(() => {
    if (element.current) {
      handleResizeWindow();
    }
  }, [element, handleResizeWindow]);

  useEffect(() => {
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, [handleResizeWindow]);

  return isOverflow;
}
