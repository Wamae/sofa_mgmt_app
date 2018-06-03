import React, {Component} from 'react';
import {
    Button, FlatList, StyleSheet, Text, TextInput, View
} from "react-native";
import Modal from 'react-native-modal';
import OrderStatusItem from "./OrderStatusItem";
import {Drawer, Fab} from "native-base";
import SideBar from "../SideBar";

const ACCOUNT_ID = 8;

export default class OrderStatuses extends Component{

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

    closeDrawer = () => {
        this.drawer._root.close()
    };

    openDrawer = () => {
        this.drawer._root.open()
    };

    render(){

        console.log(">>> OrderStatuses.js: ", this.state.orderStatuses);

        return (
            <Drawer
                ref={(ref) => { this.drawer = ref; }}
                content={<SideBar navigator={this.navigator} />}
                onClose={() => this.closeDrawer()}
            >
                <View style={{flex: 1}}>

                    <FlatList
                        data={this.state.orderStatuses}
                        extraData={this.state.refresh}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}>
                    </FlatList>

                    <Fab
                        active={this.state.active}
                        direction="up"
                        containerStyle={{}}
                        style={{backgroundColor: '#5067FF'}}
                        position="bottomRight"
                        onPress={this._showDialog}>
                        <Icon name="add"/>
                    </Fab>

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
            </Drawer>)
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