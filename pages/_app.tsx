import type { AppProps } from "next/app";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import { muiDarkTheme } from "../lib/client/theme";

// Explorer sidebar styles
import "../lib/client/rc-tree-custom.css";

// Code highlight styles
import "../lib/client/prism-one-dark.css";

// Calendar heatmap styles
import "../lib/client/calendar-heatmap.css";

import { WorkspaceProvider } from "../lib/client/context/WorkspaceProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MuiThemeProvider theme={muiDarkTheme}>
      <CssBaseline />
      <WorkspaceProvider>
        <Component {...pageProps} />
      </WorkspaceProvider>
    </MuiThemeProvider>
  );
}
