import React, {Component} from 'react';
import { TouchableOpacity, View} from "react-native";
import {ListItem} from "react-native-material-ui";

class CustomerItem extends Component {

    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };

    render() {

        console.log(">>> Customer: ", this.props);

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
                            primaryText: this.props.firstName+" "+this.props.lastName,
                            secondaryText:this.props.address
                        }}
                        onPress={() => {}}
                    />
                </View>
            </TouchableOpacity>


        );
    }

}


export default CustomerItem;
