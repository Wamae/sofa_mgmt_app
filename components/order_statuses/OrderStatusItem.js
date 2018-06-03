import React, {Component} from 'react';
import {TouchableOpacity, View} from "react-native";
import {ListItem} from "react-native-material-ui";

class OrderStatusItem extends Component {

    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };

    render() {

        console.log(">>> Order Status: ", this.props);

        const textColor = this.props.selected ? "red" : "black";
        return (
            <TouchableOpacity onPress={this._onPress}>
                <View>
                   {/* <Text style={{color: textColor}}>
                        {this.props.title}
                    </Text>*/}
                    <ListItem
                        divider
                        centerElement={{
                            primaryText: this.props.title,
                        }}
                        onPress={() => {}}
                    />
                </View>
            </TouchableOpacity>


        );
    }

}


export default OrderStatusItem;
