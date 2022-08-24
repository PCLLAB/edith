import { createTheme } from "@mui/material/styles";

export const styledDarkTheme = {
  colors: {
    highlight: "#878164",
  },
};

export const muiDarkTheme = createTheme({
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
    mode: "dark",
    background: {
      paper: "#161616",
    },
  },
  styled: styledDarkTheme,
});

type StyledTheme = typeof styledDarkTheme;

declare module "@emotion/react" {
  export interface Theme extends StyledTheme {}
}

declare module "@mui/material/styles" {
  export interface Theme {
    styled: StyledTheme;
  }
  // allow configuration using `createTheme`
  export interface ThemeOptions {
    styled?: StyledTheme;
  }
}
