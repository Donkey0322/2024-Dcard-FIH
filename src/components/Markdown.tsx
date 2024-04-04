"use client";

import ReactMarkDown from "react-markdown";
import remarkGfm from "remark-gfm";

const Markdown: typeof ReactMarkDown = (props) => {
  return <ReactMarkDown remarkPlugins={[remarkGfm]} {...props}></ReactMarkDown>;
};

export default Markdown;
