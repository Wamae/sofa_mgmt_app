import React, {Component} from 'react';
import {Body, ListItem, Text} from "native-base";

class OrderStatusItem extends Component {

    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };

    render() {

        console.log(">>> Order Status: ", this.props);

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


export default OrderStatusItem;
