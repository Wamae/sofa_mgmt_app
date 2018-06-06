import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {Col, Content, Grid, H1} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

export default class SideBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ACCOUNT_ID: this.props.navigation.state.params.account_id,
            USER_ID: this.props.navigation.state.params.user_id,
        }

        console.log(">>> SideBar: ",this.props);
    }

    render() {

        return (
            <Content style={{backgroundColor: '#FFFFFF'}}>
                <View style={{flex: 1}}>
                    <Grid>
                        <Col style={{backgroundColor: '#5067FF', height: 150, alignItems:'center',justifyContent:'center'}}>
                            <H1 style={{color: 'white'}}>ESMS</H1>
                        </Col>
                    </Grid>
                    <Text onPress={() => this.props.navigation.navigate('Orders', {
                        account_id: this.state.ACCOUNT_ID,
                        user_id: this.state.USER_ID
                    })} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>
                        <Ionicons name="md-cash" size={24}/> Orders
                    </Text>
                    <Text onPress={() => this.props.navigation.navigate('Customers', {
                        account_id: this.state.ACCOUNT_ID,
                        user_id: this.state.USER_ID
                    })} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>
                        <Ionicons name="md-contacts" size={24}/> Customers
                    </Text>
                    <Text onPress={() => this.props.navigation.navigate('Chairs', {
                        account_id: this.state.ACCOUNT_ID,
                        user_id: this.state.USER_ID
                    })} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>
                        <Ionicons name="md-cube" size={24}/> Chairs
                    </Text>
                    <Text onPress={() => this.props.navigation.navigate('ChairTypes', {
                        account_id: this.state.ACCOUNT_ID,
                        user_id: this.state.USER_ID
                    })} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>
                        <Ionicons name="md-contract" size={24}/> Chair Types
                    </Text>
                    <Text onPress={() => this.props.navigation.navigate('OrderStatuses', {
                        account_id: this.state.ACCOUNT_ID,
                        user_id: this.state.USER_ID
                    })} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>
                        <Ionicons name="md-clipboard" size={24}/> Order Statuses
                    </Text>
                </View>
            </Content>
        );
    }
}
