import React, {Component} from 'react';
import {Body, ListItem, Text, View} from "native-base";
import {StyleSheet} from "react-native";

class OrderItem extends Component {

    _onPress = () => {
        this.props.onPressItem(this.props.phone);
    };

    render() {

        console.log(">>> Customer: ", this.props);

        return (
            <View style={styles.rowContainer}>
                <View style={styles.itemContainer}>
                    <Text>Customer: {this.props.customerName}</Text>
                    <Text note>Chair: {this.props.chair}</Text>
                    <Text note>Chair Type: {this.props.chairType}</Text>
                </View>
                <View style={styles.itemContainer}>
                    <Text>Amount: {this.props.amount}</Text>
                    <Text>Due: {this.props.dueDate}</Text>
                    <Text note>Order Status: {this.props.orderStatus}</Text>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
    },

    itemContainer: {
        flex: 1,
        padding: 4
    },
});


export default OrderItem;
