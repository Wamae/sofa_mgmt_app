import React, {Component} from 'react';
import {Body, Button, Icon, ListItem, Right, Text} from "native-base";
import call from "react-native-phone-call";

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
                        <Icon name="call" style={{color: 'green'}}/>
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
