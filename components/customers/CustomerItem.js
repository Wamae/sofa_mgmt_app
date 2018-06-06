import React, {Component} from 'react';
import {Body, Button, Left, ListItem, Right, Text, View} from "native-base";
import {Ionicons} from '@expo/vector-icons';
import {StyleSheet} from "react-native";

class CustomerItem extends Component {

    _onPress = () => {
        this.props.onPressItem(this.props.phone);
    };

    render() {

        console.log(">>> Customer: ", this.props);

        return (
            <View style={styles.rowContainer}>
                <View style={styles.leftView}>
                    <Text>{this.props.firstName + " " + this.props.lastName}</Text>
                    <Text note>{this.props.phone}</Text>
                </View>
                <View style={styles.rightView}>
                    <Button iconLeft transparent onPress={this._makeCall.bind(this, this.props.phone)}>
                        <Ionicons name="md-call" style={{color: 'green'}} size={24}/>
                        <Text></Text>
                    </Button>
                </View>
            </View>

        );
    }

    _makeCall(phone) {
        this.props.onMakeCall(phone)
    }
}

const styles = StyleSheet.create({
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
    },

    leftView: {
        padding: 4,
        alignItems: 'flex-start'
    },
    rightView: {
        padding: 4,
        //marginLeft: 210,
        position: "absolute", bottom: 0, right: 0,
        alignItems: 'flex-end'
    },

});



export default CustomerItem;
