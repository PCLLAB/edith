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

// Make __next div display: flex
import "../lib/client/global.css";

import { WorkspaceProvider } from "../lib/client/context/WorkspaceProvider";
import { AuthContextProvider } from "../lib/client/context/AuthProvider";
import { SiteWideAppBar } from "../components/SiteWideAppBar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MuiThemeProvider theme={muiDarkTheme}>
      <CssBaseline />
      <AuthContextProvider>
        <WorkspaceProvider>
          <SiteWideAppBar />
          <Component {...pageProps} />
        </WorkspaceProvider>
      </AuthContextProvider>
    </MuiThemeProvider>
  );
}
