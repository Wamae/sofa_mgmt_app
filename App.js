import React, {Component} from 'react';
import * as COLOR from "react-native-material-ui";
import {AdNav} from "./Routes";
import {ThemeProvider} from "react-native-material-ui";

const uiTheme = {
    palette: {
        primaryColor: COLOR.green500,
    },
    toolbar: {
        container: {
            height: 50,
        },
    },
};

class App extends Component {

    render() {

        return (
            <ThemeProvider uiTheme={uiTheme}>
                <AdNav/>
            </ThemeProvider>
        );
    }
}

export default App;
