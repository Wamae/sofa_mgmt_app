import React, {Component} from 'react';
import {
    FlatList, StyleSheet, Text, View, AsyncStorage
} from "react-native";
import Modal from 'react-native-modal';
import OrderItem from "./OrderItem";
import {
    Body, Button, Content, Drawer, Fab, Form, Header, Input, Item, Label, Left, Picker, Right, Spinner, SwipeRow, Title
} from "native-base";
import SideBar from "../SideBar";
import {Font} from "expo";
import MyStatusBar from "../MyStatusBar";
import LoadingSpinner from "../LoadingSpinner";
import DatePicker from "react-native-datepicker";
import {Ionicons} from '@expo/vector-icons';
import Container from "../Container";
import MyLoader from "../MyLoader";

export default class Orders extends Component {

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
            orders: [],
            chairItems: null,
            customerItems: null,
            visibleModal: false,
            chairId: null,
            customerId: null,
            amount: "",
            dueDate: "",
            refresh: false,
            active: true,
            loading: true,
            fontLoaded: false,
        }
    }

    _addOrder = () => {
        let dueDate = this.state.dueDate;
        if (dueDate.length === 0) {
            alert("Enter due date");
            return false;
        }
        let amount = this.state.amount;
        if (amount.length === 0) {
            alert("Enter amount");
            return false;
        }

        fetch(BASE_URL + '/orders', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TOKEN,
            },
            body: JSON.stringify({
                chair_id: this.state.chairId,
                customer_id: this.state.customerId,
                amount: amount,
                due_date: dueDate,
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

    _closeDialog = () => {
        this.setState({visibleModal: false});
    }

    _showDialog = () => {
        this.setState({visibleModal: true});
    }

    onCustomerChange(value: string) {
        this.setState({
            customerId: value
        });
    }

    _getAllCustomers() {
        return fetch(BASE_URL + '/get_all_customers?account_id=' + this.state.ACCOUNT_ID, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TOKEN,
            }
        })
            .then((response) => response.json())
            .then((json) => {

                if (json.data.length > 0) {
                    this.setState({customers: {"rows": json.data}});

                    let customerItems = (<Picker
                        selectedValue={this.state.customerId}
                        onValueChange={this.onCustomerChange.bind(this)}
                    >
                        {json.data.map((customer) => <Picker.Item key={customer.id}
                                                                  label={customer.first_name + " " + customer.last_name}
                                                                  value={customer.id}/>)}
                    </Picker>);

                    this.setState({customerItems: customerItems});
                } else {
                    alert(json.message);
                }

            }).catch((error) => {
                console.error(error);
                alert("Could not connect to the server!");
            });
    }

    onChairChange(value: string) {
        this.setState({
            chairId: value
        });
    }

    _getAllChairs() {
        return fetch(BASE_URL + '/get_all_chairs?account_id=' + this.state.ACCOUNT_ID, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TOKEN,
            },
        })
            .then((response) => response.json())
            .then((json) => {

                if (json.data.length > 0) {

                    this.setState({chairs: {"rows": json.data}});

                    let chairItems = (<Picker
                        selectedValue={this.state.chairId}
                        onValueChange={this.onChairChange.bind(this)}
                    >
                        {json.data.map((chair) => <Picker.Item key={chair.id} label={chair.chair}
                                                               value={chair.id}/>)}
                    </Picker>);

                    this.setState({chairItems: chairItems});

                } else {
                    alert(json.message);
                }

            }).catch((error) => {
                console.error(error);
                alert("Could not connect to the server!");
            });
    }


    _getAllOrders() {
        return fetch(BASE_URL + '/get_all_orders?account_id=' + this.state.ACCOUNT_ID, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TOKEN,
            },
        })
            .then((response) => response.json())
            .then((json) => {
                this.setState({loading: false});
                if (json.data.length > 0) {
                    this.setState({orders: {"rows": json.data}});
                } else {
                    this.setState({orders: ""});
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

        this._getAllOrders();
        this._getAllCustomers();
        this._getAllChairs();

        this.setState({fontLoaded: true});

    }

    _keyExtractor = (item, index) => item.id.toString();

    _deleteOrder(id) {
        return fetch(BASE_URL + '/orders/' + id, {
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
                console.log(">> deleteOrder: ", json);
                if (json.status == 1) {
                    this._getAllOrders();
                    alert(json.message);
                } else {
                    alert(json.message);
                }

            }).catch((error) => {
                console.error(error);
                alert("Could not connect to the server!");
            });
    }

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
                <OrderItem
                    id={item.id.toString()}
                    //onPressItem={this._onPressItem}
                    //selected={!!this.state.selected.get(item.id)}
                    customerName={item.customer_name}
                    chair={item.chair}
                    chairType={item.chair_type}
                    amount={item.amount}
                    dueDate={item.due_date}
                    orderStatus={item.order_status}
                />
            }
            right={
                <Button full danger onPress={() => this._deleteOrder(item.id)}>
                    <Ionicons active name="md-trash" style={{color: 'white'}} size={24}/>
                </Button>
            }
        />
    );

    _onPressItem = (amount) => {
        alert("_onPressItem");
    }

    closeDrawer = () => {
        this.drawer._root.close()
    };

    openDrawer = () => {
        this.drawer._root.open()
    };

    _deleteRow(data) {
        console.log(">>> deleteRow: ", data);
    }

    render() {

        if (this.state.loading) {
            return (
                <MyLoader/>
            );
        } else {

            console.log(">>> Orders.js: ", this.state.chairs);

            return (
                <Drawer
                    ref={(ref) => {
                        this.drawer = ref;
                    }}
                    content={<SideBar accountId={this.state.ACCOUNT_ID} userId={this.state.USER_ID}
                                      navigation={this.props.navigation} navigator={this.navigator}/>}
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
                                <Title>Orders</Title>
                                </Body>
                                <Right/>
                            </Header>) : null
                    }

                    <View style={{flex: 1}}>

                        <FlatList
                            data={this.state.orders.rows}
                            extraData={this.state.refresh}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                        >
                        </FlatList>

                        <Fab
                            active={this.state.active}
                            direction="up"
                            containerStyle={{}}
                            style={{backgroundColor: '#5067FF'}}
                            position="bottomRight"
                            onPress={this._showDialog}>
                            <Ionicons name="md-add"/>
                        </Fab>

                        <Modal isVisible={this.state.visibleModal}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalTitle}>
                                    <Text>Add First Name</Text>
                                </View>

                                <Form>
                                    <Item inlineLabel>
                                        <Label>Chairs</Label>
                                        {this.state.chairItems}
                                    </Item>

                                    <Item inlineLabel>
                                        <Label>Customers</Label>
                                        {this.state.customerItems}
                                    </Item>

                                    <Item floatingLabel>
                                        <Label>Amount</Label>
                                        <Input
                                            onChangeText={(value) => this.setState({amount: value.replace(/[^0-9]/g, '')})}
                                            keyboardType="numeric"/>
                                    </Item>

                                    <Item fixedLabel>
                                        <Label>Due Date</Label>
                                        <DatePicker
                                            style={{width: 200}}
                                            date={this.state.dueDate}
                                            mode="date"
                                            placeholder="select date"
                                            format="DD-MM-YYYY"
                                            minDate={new Date('DD-MM-YYY')}
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            customStyles={{
                                                dateIcon: {
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 4,
                                                    marginLeft: 0
                                                },
                                                dateInput: {
                                                    marginLeft: 36
                                                }

                                            }}
                                            onDateChange={(date) => {
                                                this.setState({dueDate: date})
                                            }}
                                        />
                                    </Item>

                                </Form>

                                <View style={styles.footerContainer}>
                                    <View style={styles.buttonContainer}>
                                        <Button block primary onPress={this._addOrder}>
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
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
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