import { createTheme } from "@mui/material/styles";

export const muiDarkTheme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: "100%",
        },
        body: {
          height: "100%",
        },
        "#__next": {
          height: "100%",
        },
      },
    },
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
    mode: "dark",
    background: {
      paper: "#161616",
    },
    brandBlue: {
      light: "#839df5",
      main: "#4f6fc2",
      dark: "#0b4491",
      contrastText: "rgba(255, 255, 255)",
    },
    brandYellow: {
      light: "#dfdfdf",
      main: "#adadad",
      dark: "#7e7e7e",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
  },
});

declare module "@mui/material/styles" {
  interface Palette {
    brandYellow: Palette["primary"];
    brandBlue: Palette["primary"];
  }
  interface PaletteOptions {
    brandYellow: PaletteOptions["primary"];
    brandBlue: PaletteOptions["primary"];
  }
}
