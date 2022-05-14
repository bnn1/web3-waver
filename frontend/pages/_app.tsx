import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { createTheme, ThemeProvider, responsiveFontSizes } from "@mui/material/styles";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { AuthProvider } from "../src/layout/Auth";
import { Header } from "../src/layout/Header";
import { Main } from "../src/layout/Main";

export default App;

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={responsiveFontSizes(createTheme({ palette: { mode: "dark" } }))}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          "html,body,#__next": {
            height: "100%",
          },
          "#__next": {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      />
      <AuthProvider>
        <Header />
        <Main>
          <Component {...pageProps} />
        </Main>
      </AuthProvider>
    </ThemeProvider>
  );
}
