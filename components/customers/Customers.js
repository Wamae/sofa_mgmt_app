import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from "react-native";
import Modal from 'react-native-modal';
import CustomerItem from "./CustomerItem";
import {
    Body, Button, Drawer, Fab, Form, Header, Input, Item, Label, Left, Right, SwipeRow, Title
} from "native-base";
import SideBar from "../SideBar";
import {Font} from "expo";
import MyStatusBar from "../MyStatusBar";
import LoadingSpinner from "../LoadingSpinner";
import call from "react-native-phone-call";
import {Ionicons} from '@expo/vector-icons';
import MyLoader from "../MyLoader";

export default class Customers extends Component {

    onActionSelected(position) {
        if (position === 0) { // index of 'Settings'
            showSettings();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            ACCOUNT_ID: this.props.navigation.state.params.account_id,
            USER_ID: this.props.navigation.state.params.user_id,
            customers: [],
            visibleModal: false,
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            address: "",
            refresh: false,
            active: true,
            loading: true,
            fontLoaded: false,
        }
    }


    _addCustomer = () => {
        let firstName = this.state.firstName;
        if (firstName.length === 0) {
            alert("Enter chair type");
            return false;
        }

        let lastName = this.state.lastName;
        if (lastName.length === 0) {
            alert("Enter last name");
            return false;
        }

        let phone = this.state.phone;
        if (phone.length === 0) {
            alert("Enter phone number");
            return false;
        }

        fetch(BASE_URL + '/customers', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                email: this.state.email,
                address: this.state.address,
                created_by: this.state.USER_ID,
                account_id: this.state.ACCOUNT_ID,
            }),
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    this.setState({refresh: !this.state.refresh});
                    this._getAllCustomers();
                    alert(json.message);
                    this.setState({visibleModal: false, orderStatus: ""});
                } else {
                    alert(json.message);
                }

            })
            .catch((error) => {
                console.error(error);
            });
        ;

    }

    _deleteCustomer(id) {
        return fetch(BASE_URL + '/customers/' + id, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TOKEN,
            },
            body: JSON.stringify({
                _method: "DELETE"
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(">> deleteCustomer: ", json);
                if (json.status == 1) {
                    this._getAllCustomers();
                    alert(json.message);
                } else {
                    alert(json.message);
                }

            }).catch((error) => {
                console.error(error);
                alert("Could not connect to the server!");
            });
    }

    _closeDialog = () => {
        this.setState({visibleModal: false});
    }

    _showDialog = () => {
        this.setState({visibleModal: true});
    }

    _getAllCustomers() {
        return fetch(BASE_URL + '/get_all_customers?account_id=' + this.state.ACCOUNT_ID)
            .then((response) => response.json())
            .then((json) => {
                this.setState({loading: false});
                if (json.data.length > 0) {
                    this.setState({customers: {"rows": json.data}});
                } else {
                    this.setState({customers: ""});
                    alert(json.message);
                }
            }).catch((error) => {
                this.setState({loading: false});
                console.error(error);
                alert("Could not connect to the server!");
            });
    }

    async componentWillMount() {

        await Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        });

        this._getAllCustomers();

        this.setState({fontLoaded: true});

    }

    _keyExtractor = (item, index) => item.id.toString();

    _renderItem = ({item}) => (

        <SwipeRow
            leftOpenValue={75}
            rightOpenValue={-75}
            left={
                <Button full success onPress={this._showDialog}>
                    <Ionicons active name="md-add" style={{color: 'white'}} size={24}/>
                </Button>
            }
            body={
                <CustomerItem
                    id={item.id.toString()}
                    //onPressItem={this._onPressItem}
                    onMakeCall={this._makeCall.bind(this)}
                    //selected={!!this.state.selected.get(item.id)}
                    firstName={item.first_name}
                    lastName={item.last_name}
                    phone={item.phone}
                    address={item.address}
                />
            }
            right={
                <Button full danger onPress={() => this._deleteCustomer(item.id)}>
                    <Ionicons active name="md-trash" style={{color: 'white'}} size={24}/>
                </Button>
            }
        />
    );

    _onPressItem = (phone) => {
        alert("_onPressItem");
    }

    _makeCall(phone) {
        const args = {
            number: phone,
            prompt: true
        }

        call(args).catch(console.error)
    }

    closeDrawer = () => {
        this.drawer._root.close()
    };

    openDrawer = () => {
        this.drawer._root.open()
    };

    render() {

        if (this.state.loading) {
            return (
                <MyLoader/>
            );
        } else {

            console.log(">>> Customers.js: ", this.state.chairs);

            return (
                <Drawer
                    ref={(ref) => {
                        this.drawer = ref;
                    }}
                    content={<SideBar navigation={this.props.navigation} navigator={this.navigator}/>}
                    onClose={() => this.closeDrawer()}
                >

                    <MyStatusBar/>

                    {
                        this.state.fontLoaded ? (
                            <Header style={{backgroundColor: "#3F51B5"}}>
                                <Left>
                                    <Ionicons onPress={() => this.openDrawer()} name="md-menu" size={24}
                                              style={{color: 'white'}}/>
                                </Left>
                                <Body>
                                <Title>Customers</Title>
                                </Body>
                                <Right/>
                            </Header>) : null
                    }

                    <View style={{flex: 1}}>

                        <FlatList
                            data={this.state.customers.rows}
                            extraData={this.state.refresh}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}>
                        </FlatList>

                        <Fab
                            active={this.state.active}
                            direction="up"
                            containerStyle={{}}
                            style={{backgroundColor: '#FFC107'}}
                            position="bottomRight"
                            onPress={this._showDialog}>
                            <Ionicons name="md-add"/>
                        </Fab>

                        <Modal isVisible={this.state.visibleModal}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalTitle}>
                                    <Text>Add Customer Details</Text>
                                </View>

                                <Form>
                                    <Item floatingLabel>
                                        <Label>First Name</Label>
                                        <Input onChangeText={(value) => this.setState({firstName: value})}/>
                                    </Item>

                                    <Item floatingLabel>
                                        <Label>Last Name</Label>
                                        <Input onChangeText={(value) => this.setState({lastName: value})}/>
                                    </Item>

                                    <Item floatingLabel>
                                        <Label>Phone</Label>
                                        <Input onChangeText={(value) => this.setState({phone: value})}/>
                                    </Item>

                                    <Item floatingLabel>
                                        <Label>Email</Label>
                                        <Input onChangeText={(value) => this.setState({email: value})}/>
                                    </Item>

                                    <Item floatingLabel>
                                        <Label>Address</Label>
                                        <Input onChangeText={(value) => this.setState({address: value})}/>
                                    </Item>
                                </Form>

                                <View style={styles.footerContainer}>
                                    <View style={styles.buttonContainer}>
                                        <Button block primary onPress={this._addCustomer}>
                                            <Text style={{color: 'white'}}>Add</Text>
                                        </Button>
                                    </View>
                                    <View style={styles.buttonContainer}>
                                        <Button block primary onPress={this._closeDialog}>
                                            <Text style={{color: 'white'}}>Close</Text>
                                        </Button>
                                    </View>
                                </View>
                            </View>
                        </Modal>


                    </View>
                </Drawer>);
        }
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
    modalTitle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
});