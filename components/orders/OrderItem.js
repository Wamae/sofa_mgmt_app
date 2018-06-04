import React, {Component} from 'react';
import {Body, Button, Icon, Left, ListItem, Right, Text} from "native-base";

class OrderItem extends Component {

    _onPress = () => {
        this.props.onPressItem(this.props.phone);
    };

    render() {

        console.log(">>> Customer: ", this.props);

        const textColor = this.props.selected ? "red" : "black";
        return (
            <ListItem
                divider
            >
                <Body>
                    <Text>Customer: {this.props.customerName}</Text>
                    <Text note>Chair: {this.props.chair}</Text>
                    <Text note>Chair Type: {this.props.chairType}</Text>
                    <Text>Amount: {this.props.amount}</Text>
                    <Text>Due Date: {this.props.dueDate}</Text>
                    <Text note>Order Status: {this.props.orderStatus}</Text>
                </Body>
            </ListItem>

        );
    }
}


export default OrderItem;
