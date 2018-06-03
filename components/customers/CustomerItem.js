import React, {Component} from 'react';
import {Body, Icon, ListItem, Right, Text} from "native-base";

class CustomerItem extends Component {

    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };

    render() {

        console.log(">>> Customer: ", this.props);

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
                <Right>
                    <Icon name="call"/>
                </Right>
            </ListItem>

        );
    }

}


export default CustomerItem;
