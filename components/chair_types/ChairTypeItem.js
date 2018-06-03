import React, {Component} from 'react';
import {Body, Container, Content, Header, Icon, List, ListItem, Right, Text, Thumbnail} from "native-base";

class ChairTypeItem extends Component {

    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };

    render() {

        console.log(">>> ChairType: ", this.props);

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


export default ChairTypeItem;
