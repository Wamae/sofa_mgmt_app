import React, { Component } from 'react';
import {View,Text} from 'react-native';

//import styles from './styles';
import {Content} from 'native-base';

export default class SideBar extends Component {
    render() {
        return (
            <Content style={{backgroundColor:'#FFFFFF'}}>
                <View style={{flex: 1}}>
                    <Text onPress={()=>this.props.navigation.navigate('Orders')} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>Orders</Text>
                    <Text onPress={()=>this.props.navigation.navigate('Customers')} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>Customers</Text>
                    <Text onPress={()=>this.props.navigation.navigate('Chairs')} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>Chairs</Text>
                    <Text onPress={()=>this.props.navigation.navigate('ChairTypes')} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>Chair Types</Text>
                    <Text onPress={()=>this.props.navigation.navigate('OrderStatuses')} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>Order Statuses</Text>
                </View>
            </Content>
        );
    }
}
