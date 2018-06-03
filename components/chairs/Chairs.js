import React, {Component} from 'react';
import {
    Button, DrawerLayoutAndroid, FlatList, StyleSheet, Text, TextInput,
    View
} from "react-native";
import {ActionButton} from "react-native-material-ui";
import Modal from 'react-native-modal';
import ChairItem from "./ChairItem";


const ACCOUNT_ID = 8;

export default class Chairs extends Component{
    static navigationOptions ={
        tabBarLabel: "Chairs"
    }

    onActionSelected(position) {
        if (position === 0) { // index of 'Settings'
            showSettings();
        }
    }


    constructor() {
        super();
        this.state = {
            chairs: [],
            chairTypes: [],
            visibleModal: false,
            chair: "",
            refresh: false
        }
    }

    _addChair = () =>{
            let chair = this.state.orderStatus;
            if(chair.length === 0){
                alert("Enter chair");
                return false;
            }

        fetch('http://660044e3.ngrok.io/api/chairs', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chair: chair,
                created_by: 1,
                account_id: 8,
            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                this.setState({refresh: !this.state.refresh});
                this._getAllChairs();
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

    _getAllChairs(){
        return fetch('http://660044e3.ngrok.io/api/get_all_chairs?account_id=' + ACCOUNT_ID)
            .then((response) => response.json())
            .then((json) => {
                this.setState({chairs: {"rows": json}});
            }).catch((error) => {
            console.error(error);
            alert("Could not connect to the server!");
        });
    }

    _getAllChairTypes(){
        return fetch('http://660044e3.ngrok.io/api/get_all_chair_types?account_id=' + ACCOUNT_ID)
            .then((response) => response.json())
            .then((json) => {
                this.setState({chairTypes: {"rows": json}});
            }).catch((error) => {
                console.error(error);
                alert("Could not connect to the server!");
            });
    }

    componentWillMount() {

        this._getAllChairTypes();
        this._getAllChairs();

    }

    _keyExtractor = (item, index) => item.id.toString();

    _renderItem = ({item}) => (
        <ChairItem
            id={item.id.toString()}
            onPressItem={this._onPressItem}
            //selected={!!this.state.selected.get(item.id)}
            chair={item.chair}
            chairType={item.chair_type}
        />
    );

    _onPressItem = () =>{
        alert("_onPressItem");
    }

    render(){

        console.log(">>> Chairs.js: ", this.state.chairs);

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
                        data={this.state.chairs.rows}
                        extraData={this.state.refresh}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}>
                    </FlatList>

                    <ActionButton
                        onPress={this._showDialog}
                    />

                    <Modal isVisible={this.state.visibleModal}>
                        <View style={styles.modalContent}>
                            <Text>Add Chair</Text>
                            <View style={styles.footerContainer}>
                                <View style={styles.buttonContainer}>
                                    <Text>Chair</Text>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <TextInput
                                        onChangeText={(value) => this.setState({chair: value})}
                                    />
                                </View>
                            </View>

                            <View style={styles.footerContainer}>
                                <View style={styles.buttonContainer}>
                                    <Button onPress={this._addChair} title="Add"
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