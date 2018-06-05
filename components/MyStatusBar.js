import React, {Component} from 'react';
import {View} from "native-base";
import {StatusBar} from "react-native";

export default class MyStatusBar extends Component {
    render() {

        return (
            <View>
                <StatusBar backgroundColor="#303F9F"/>
                <View style={{height: 24}}/>
            </View>
        );
    }
}