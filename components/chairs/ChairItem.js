import React, {Component} from 'react';
import {TouchableOpacity, View} from "react-native";
import {ListItem} from "react-native-material-ui";

class ChairItem extends Component {

    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };

    render() {

        console.log(">>> ChairItem: ", this.props);

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
                            primaryText: this.props.chair,
                            secondaryText: this.props.chairType,
                        }}
                        onPress={() => {}}
                    />
                </View>
            </TouchableOpacity>


        );
    }

}


export default ChairItem;
