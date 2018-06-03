import React, {Component} from 'react';
import {
    Button, DrawerLayoutAndroid, FlatList, StyleSheet, Text, TextInput,
    View
} from "react-native";
import {ActionButton} from "react-native-material-ui";
import Modal from 'react-native-modal';
import CustomerItem from "./CustomerItem";


const ACCOUNT_ID = 8;

export default class Customers extends Component{
    static navigationOptions ={
        tabBarLabel: "Customers"
    }

    onActionSelected(position) {
        if (position === 0) { // index of 'Settings'
            showSettings();
        }
    }


    constructor() {
        super();
        this.state = {
            customers: [],
            visibleModal: false,
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            address: "",
            refresh: false
        }
    }


    _addCustomer = () =>{
            let firstName = this.state.firstName;
            if(firstName.length === 0){
                alert("Enter first name");
                return false;
            }

        let lastName = this.state.lastName;
        if(lastName.length === 0){
            alert("Enter last name");
            return false;
        }

        let phone = this.state.phone;
        if(phone.length === 0){
            alert("Enter phone number");
            return false;
        }

        fetch('http://660044e3.ngrok.io/api/customers', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                address: this.state.address,
                created_by: 1,
                account_id: 8,
            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                this.setState({refresh: !this.state.refresh});
                this._getAllCustomers();
                alert(responseJson.message);
                this.setState({ visibleModal: false ,firstName: "",lastName: "",phone: "",address: ""});

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

    _getAllCustomers(){
        return fetch('http://660044e3.ngrok.io/api/get_all_customers?account_id=' + ACCOUNT_ID)
            .then((response) => response.json())
            .then((json) => {
                this.setState({customers: {"rows": json}});
            }).catch((error) => {
            console.error(error);
            alert("Could not connect to the server!");
        });
    }

    componentWillMount() {

        return this._getAllCustomers();

    }

    _keyExtractor = (item, index) => item.id.toString();

    _renderItem = ({item}) => (
        <CustomerItem
            id={item.id.toString()}
            onPressItem={this._onPressItem}
            //selected={!!this.state.selected.get(item.id)}
            firstName={item.first_name}
            lastName={item.last_name}
            phone={item.phone}
            address={item.address}
        />
    );

    _onPressItem = () =>{
        alert("_onPressItem");
    }

    render(){

        console.log(">>> Customers.js: ", this.state.customers);

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

                    <FlatList
                        data={this.state.customers.rows}
                        extraData={this.state.refresh}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}>
                    </FlatList>

                    <ActionButton
                        onPress={this._showDialog}
                    />

                    <Modal isVisible={this.state.visibleModal}>
                        <View style={styles.modalContent}>
                            <Text>Add Customer</Text>
                            <View style={styles.footerContainer}>
                                <View style={styles.buttonContainer}>
                                    <Text>First Name</Text>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <TextInput
                                        onChangeText={(value) => this.setState({firstName: value})}
                                    />
                                </View>
                            </View>

                            <View style={styles.footerContainer}>
                                <View style={styles.buttonContainer}>
                                    <Text>Last Name</Text>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <TextInput
                                        onChangeText={(value) => this.setState({lastName: value})}
                                    />
                                </View>
                            </View>

                            <View style={styles.footerContainer}>
                                <View style={styles.buttonContainer}>
                                    <Text>Phone</Text>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <TextInput
                                        onChangeText={(value) => this.setState({phone: value})}
                                    />
                                </View>
                            </View>

                            <View style={styles.footerContainer}>
                                <View style={styles.buttonContainer}>
                                    <Text>Address</Text>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <TextInput
                                        onChangeText={(value) => this.setState({address: value})}
                                    />
                                </View>
                            </View>

                            <View style={styles.footerContainer}>
                                <View style={styles.buttonContainer}>
                                    <Button onPress={this._addCustomer} title="Add"
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