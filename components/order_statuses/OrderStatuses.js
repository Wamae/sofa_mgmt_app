import React, {Component} from 'react';
import {
    Button, DrawerLayoutAndroid, FlatList, StyleSheet, Text, TextInput, View
} from "react-native";
import {ActionButton} from "react-native-material-ui";
import Modal from 'react-native-modal';
import OrderStatusItem from "./OrderStatusItem";


const ACCOUNT_ID = 8;

export default class OrderStatuses extends Component{
    static navigationOptions ={
        tabBarLabel: "Order Statuses"
    }

    onActionSelected(position) {
        if (position === 0) { // index of 'Settings'
            showSettings();
        }
    }


    constructor() {
        super();
        this.state = {
            orderStatuses: [],
            visibleModal: false,
            orderStatus: "",
            refresh: false
        }
    }


    _addOrderStatus = () =>{
            let orderStatus = this.state.orderStatus;
            if(orderStatus.length === 0){
                alert("Enter order status");
                return false;
            }

        fetch('http://660044e3.ngrok.io/api/order_statuses', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order_status: orderStatus,
                created_by: 1,
                account_id: 8,
            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                this.setState({refresh: !this.state.refresh});
                this._getAllOrderStatuses();

                alert(responseJson.message);

                this.setState({ visibleModal: false ,orderStatus: ""});

            })
            .catch((error) =>{
                console.error(error);
            });;

    }

    _closeDialog = () =>{
        this.setState({ visibleModal: false });
    }

    _showDialog = () =>{
        this.setState({ visibleModal: true });
    }

    _getAllOrderStatuses(){
        return fetch('http://660044e3.ngrok.io/api/get_all_order_statuses?account_id=' + ACCOUNT_ID)
            .then((response) => response.json())
            .then((json) => {
                this.setState({orderStatuses: json});
            }).catch((error) => {
            console.error(error);
            alert("Could not connect to the server!");
        });
    }

    componentWillMount() {

        return this._getAllOrderStatuses();

    }

    _keyExtractor = (item, index) => item.id.toString();

    _renderItem = ({item}) => (
        <OrderStatusItem
            id={item.id.toString()}
            onPressItem={this._onPressItem}
            //selected={!!this.state.selected.get(item.id)}
            title={item.order_status}
        />
    );

    _onPressItem = () =>{
        alert("_onPressItem");
    }

    render(){

        console.log(">>> OrderStatuses.js: ", this.state.orderStatuses);

        var navigationView = (
            <View style={{flex: 1}}>
                <Text onPress={()=>this.props.navigation.navigate('Orders')} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>Orders</Text>
                <Text onPress={()=>this.props.navigation.navigate('Customers')} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>Customers</Text>
                <Text onPress={()=>this.props.navigation.navigate('Chairs')} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>Chairs</Text>
                <Text onPress={()=>this.props.navigation.navigate('ChairTypes')} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>Chair Types</Text>
                <Text onPress={()=>this.props.navigation.navigate('OrderStatuses')} style={{margin: 10, fontSize: 15, textAlign: 'left'}}>Order Statuses</Text>
            </View>
        );

        return (
            <DrawerLayoutAndroid
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => navigationView}>
                <View style={{flex: 1}}>

                    {/*<StatusBar backgroundColor="rgba(0, 0, 0, 0.2)" translucent/>
                    <View style={{backgroundColor: COLOR.green500, height: 24}}/>
                    <Toolbar
                        leftElement="menu"
                        centerElement="Order Statuses"
                        searchable={{
                            autoFocus: true,
                            placeholder: 'Search',
                        }}
                    />*/}

                    <FlatList
                        data={this.state.orderStatuses}
                        extraData={this.state.refresh}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}>
                    </FlatList>

                    <ActionButton
                        onPress={this._showDialog}
                    />

                    <Modal isVisible={this.state.visibleModal}>
                        <View style={styles.modalContent}>
                            <Text>Add Order Status</Text>
                            <View style={styles.footerContainer}>
                                <View style={styles.buttonContainer}>
                                    <Text>Order Status</Text>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <TextInput
                                        onChangeText={(value) => this.setState({orderStatus: value})}
                                    />
                                </View>
                            </View>

                            <View style={styles.footerContainer}>
                                <View style={styles.buttonContainer}>
                                    <Button onPress={this._addOrderStatus} title="Add"
                                    />
                                </View>
                                <View style={styles.buttonContainer}>
                                    <Button onPress={this._closeDialog} title="Close"
                                    />
                                </View>
                            </View>



                        </View>
                    </Modal>


                </View>
            </DrawerLayoutAndroid>)
    }


}


const styles = StyleSheet.create({
    footerContainer: {
        flexDirection: 'row',
    },

    buttonContainer: {
        flex: 1,
        padding: 10
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'lightblue',
        padding: 12,
        margin: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
});