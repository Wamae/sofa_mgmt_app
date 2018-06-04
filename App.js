import React, {Component} from 'react';
import {AdNav} from "./Routes";

global.BASE_URL = 'http://660044e3.ngrok.io/api';
global.ACCOUNT_ID = 8;
global.USER_ID = 1;

class App extends Component {

    render() {

        return (
                <AdNav/>
        );
    }
}

export default App;
