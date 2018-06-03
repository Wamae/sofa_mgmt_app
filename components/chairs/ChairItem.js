import React, {Component} from 'react';
import {Body, ListItem, Text} from "native-base";

class ChairItem extends Component {

    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };

    render() {

        console.log(">>> ChairItem: ", this.props);

        const textColor = this.props.selected ? "red" : "black";
        return (
            <ListItem
                divider
                onPress={() => {
                }}>
                <Body>
                <Text>{this.props.title}</Text>
                <Text note>{this.props.title}</Text>
                </Body>
            </ListItem>
        );
    }

}


export default ChairItem;
