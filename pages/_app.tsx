import type { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Disable always uppercase
          textTransform: "none",
        },
      },
    },
  },
  palette: {
    // mode: "dark",
  },
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
