import type { AppProps } from "next/app";
// Explorer sidebar styles
import "../lib/client/rc-tree-custom.css";
// Code highlight styles
import "../lib/client/prism-one-dark.css";
// Calendar heatmap styles
import "../lib/client/calendar-heatmap.css";
// Make __next div display: flex
import "../lib/client/global.css";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import { AuthContextProvider } from "../lib/client/context/AuthProvider";
import { WorkspaceProvider } from "../lib/client/context/WorkspaceProvider";
import { muiDarkTheme } from "../lib/client/theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MuiThemeProvider theme={muiDarkTheme}>
      <CssBaseline />
      <AuthContextProvider>
        <WorkspaceProvider>
          <Component {...pageProps} />
        </WorkspaceProvider>
      </AuthContextProvider>
    </MuiThemeProvider>
  );
}
