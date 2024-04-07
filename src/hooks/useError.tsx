"use client";

import useMessage from "antd/es/message/useMessage";
import { useEffect, useState } from "react";

export default function useError(handleError?: () => void) {
  const [error, setError] = useState<Error | undefined>(undefined);
  const [message, context] = useMessage();

  useEffect(() => {
    if (error) {
      if (error.message.includes("Resource not accessible by integration"))
        void message.error(
          "Resource not accessible by integration, perhaps aroused by granting issues."
        );
      else void message.error(error.message);
      handleError?.();
    }
  }, [error, handleError, message]);

  return { context, message, setError };
}
