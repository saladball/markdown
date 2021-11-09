import "normalize.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ResiftProvider, createDataService, createHttpService } from "resift";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import App from "./App";
import { note, notes } from "./mockApi";

const http = createHttpService({
  proxies: [note, notes]
});

const dataService = createDataService({
  services: { http },
  onError: e => {
    throw e;
  }
});

const theme = createMuiTheme({
  palette: {
    primary: { main: "#60269E" },
    secondary: { main: "#2962FF" }
  }
});

const rootElement = document.getElementById("root");

ReactDOM.render(
  <ResiftProvider dataService={dataService}>
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </BrowserRouter>
  </ResiftProvider>,
  rootElement
);
