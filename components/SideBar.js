import React, { Component } from 'react';
import {View,Text} from 'react-native';
import {Col, Content, Grid, Icon} from 'native-base';

export default class SideBar extends Component {

    render() {
        return (
            <Content style={{backgroundColor:'#FFFFFF'}}>
                <View style={{flex: 1}}>
                    <Grid>
                        <Col style={{ backgroundColor: '#00CE9F', height: 150 }}></Col>
                    </Grid>
                    <Text onPress={()=>this.props.navigation.navigate('Orders')} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>
                        <Icon name="md-cash"/>  Orders
                    </Text>
                    <Text onPress={()=>this.props.navigation.navigate('Customers')} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>
                        <Icon name="md-contacts"/>  Customers
                    </Text>
                    <Text onPress={()=>this.props.navigation.navigate('Chairs')} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>
                        <Icon name="md-cube"/>  Chairs
                    </Text>
                    <Text onPress={()=>this.props.navigation.navigate('ChairTypes')} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>
                        <Icon name="md-contract"/>  Chair Types
                    </Text>
                    <Text onPress={()=>this.props.navigation.navigate('OrderStatuses')} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>
                        <Icon name="md-clipboard"/>  Order Statuses
                    </Text>
                </View>
            </Content>
        );
    }
}
