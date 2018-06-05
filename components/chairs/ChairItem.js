import React, {Component} from 'react';
import {Body, Left, ListItem, Text, Thumbnail} from "native-base";

class ChairItem extends Component {

    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };

    render() {

        console.log(">>> ChairItem: ", this.props);

        const textColor = this.props.selected ? "red" : "black";
        return (
            <ListItem icon
                      divider
                      onPress={this._showGallery.bind(this, this.props.chair, this.props.chairType, this.props.imageUrl)}
            >
                <Left>
                    <Thumbnail small source={{uri: this.props.imageUrl}}/>
                </Left>
                <Body>
                <Text>{this.props.chair}</Text>
                <Text note>{this.props.chairType}</Text>
                </Body>
            </ListItem>
        );

    }

    _showGallery(chair, chairType, chairImage) {
        this.props.onShowGallery(chair, chairType, chairImage)
    }

}


export default ChairItem;
