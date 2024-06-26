import React from "react";
import ReactDOM from "react-dom/client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import App from "./App.tsx";
import { CardProvider } from "./hooks/useCards.tsx";
import "./index.css";

const theme = createTheme({
  palette: {
    primary: {
      main: '#ede7f6',
    },
    secondary: {
      main: '#b39ddb',
      dark: '#9575CD',
      light: '#D1C4E9',
    },
    
  },
});
// wrap the whole app in StrictMode to get warnings about antipatterns
// wrap the whole app in context providers so the whole app can consume them
//                                                 V this is the non null assertion operator, which tells typescript that the value will not be nullish
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CardProvider>
        <CssBaseline />
        <App />
      </CardProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
