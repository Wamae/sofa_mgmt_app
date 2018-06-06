import React, {Component} from 'react';
import {Body, Button, ListItem, Right, Text} from "native-base";
import { Ionicons } from '@expo/vector-icons';

class CustomerItem extends Component {

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
                <Text>{this.props.firstName+" "+this.props.lastName}</Text>
                <Text note>{this.props.phone}</Text>
                </Body>
                <Right>
                    <Button iconLeft transparent onPress={this._makeCall.bind(this,this.props.phone)}>
                        <Ionicons name="md-call" style={{color: 'green'}} size={24}/>
                        <Text></Text>
                    </Button>

                </Right>
            </ListItem>

        );
    }

    _makeCall(phone) {
        this.props.onMakeCall(phone)
    }
}


export default CustomerItem;
