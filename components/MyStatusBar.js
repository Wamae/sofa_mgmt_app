import React, {Component} from 'react';
import {View} from "native-base";
import {StatusBar} from "react-native";

export default class MyStatusBar extends Component {
    render() {

        return (
            <View>
                <StatusBar backgroundColor="rgba(0, 0, 0, 0.2)" translucent/>
                <View style={{height: 24}}/>
            </View>
        );
    }
}