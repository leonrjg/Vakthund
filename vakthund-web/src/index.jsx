import * as React from 'react';
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {BrowserRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./redux/store/store";
import {CssVarsProvider as JoyCssVarsProvider} from "@mui/joy/styles";
import {ThemeProvider, createTheme, THEME_ID} from "@mui/material/styles";
import {theme as joyTheme} from "./theme";

// Create Material theme
const materialTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#414141',
        },
        grey: {
            100: '#f5f5f5',
            200: '#eeeeee',
            300: '#e0e0e0',
            400: '#bdbdbd',
            500: '#9e9e9e',
            600: '#757575',
            700: '#616161',
            800: '#424242',
            900: '#212121',
        }
    },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <ThemeProvider theme={{ [THEME_ID]: materialTheme }}>
            <JoyCssVarsProvider theme={joyTheme}>
                <Provider store={store}>
                    <Router>
                        <App/>
                    </Router>
                </Provider>
            </JoyCssVarsProvider>
        </ThemeProvider>
    </React.StrictMode>
);
