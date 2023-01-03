import Prism from "prismjs";
import { useEffect } from "react";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Box, Button } from "@mui/material";

type Props = {
  children: string;
  language?: string;
};

export const CodeInline = ({ children, language = "markdown" }: Props) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);
  return <code className={`language-${language}`}>{children}</code>;
};

export const CodeBlock = ({ children, language = "markdown" }: Props) => {
  useEffect(() => {
    if (!children) return;
    Prism.highlightAll();
  }, [children]);

  const onClick = () => navigator.clipboard.writeText(children);

  return (
    <Box position={"relative"}>
      <Button
        sx={{ position: "absolute", right: 0, m: 0.5 }}
        onClick={onClick}
        // variant="outlined"
        endIcon={<ContentCopyIcon />}
        size="small"
      >
        Copy
      </Button>

      <pre>
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </Box>
  );
};
