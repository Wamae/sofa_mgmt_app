import React, {Component} from 'react';
import {Body, ListItem, Text, View} from "native-base";

class OrderStatusItem extends Component {

    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };

    render() {

        console.log(">>> Order Status: ", this.props);

        return (
            <View style={{margin: 4}}>
                <Text>{this.props.orderStatus}</Text>
                <Text note>{this.props.orderStatus}</Text>
            </View>
        );
    }

}


export default OrderStatusItem;
