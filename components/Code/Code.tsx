import { ReactNode, useEffect } from "react";
import Prism from "prismjs";
import { Box, Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

type Props = {
  children: ReactNode;
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
    Prism.highlightAll();
  }, []);
  return (
    <Box position={"relative"}>
      <Button
        sx={{ position: "absolute", right: 0, m: 0.5 }}
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
