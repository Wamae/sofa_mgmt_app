import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {Col, Content, Grid, H1, Icon} from 'native-base';

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
                        <Col style={{backgroundColor: '#FFC107', height: 150, alignItems:'center',justifyContent:'center'}}>
                            <H1 style={{color: '#303F9F'}}>ESMS</H1>
                        </Col>
                    </Grid>
                    <Text onPress={() => this.props.navigation.navigate('Orders', {
                        account_id: this.state.accountId,
                        user_id: this.props.userId
                    })} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>
                        <Icon name="md-cash"/> Orders
                    </Text>
                    <Text onPress={() => this.props.navigation.navigate('Customers', {
                        account_id: this.props.accountId,
                        user_id: this.props.userId
                    })} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>
                        <Icon name="md-contacts"/> Customers
                    </Text>
                    <Text onPress={() => this.props.navigation.navigate('Chairs', {
                        account_id: this.props.accountId,
                        user_id: this.props.userId
                    })} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>
                        <Icon name="md-cube"/> Chairs
                    </Text>
                    <Text onPress={() => this.props.navigation.navigate('ChairTypes', {
                        account_id: this.props.accountId,
                        user_id: this.props.userId
                    })} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>
                        <Icon name="md-contract"/> Chair Types
                    </Text>
                    <Text onPress={() => this.props.navigation.navigate('OrderStatuses', {
                        account_id: this.props.accountId,
                        user_id: this.props.userId
                    })} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>
                        <Icon name="md-clipboard"/> Order Statuses
                    </Text>
                </View>
            </Content>
        );
    }
}
