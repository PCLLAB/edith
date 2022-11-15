import type { AppProps } from "next/app";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import { muiDarkTheme } from "../lib/client/theme";

import "../lib/client/rc-tree-custom.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MuiThemeProvider theme={muiDarkTheme}>
      <CssBaseline />
      <Component {...pageProps} />
    </MuiThemeProvider>
  );
}
