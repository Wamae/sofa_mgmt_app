import React, {Component} from 'react';
import {
    Button, FlatList, StyleSheet, Text, View, AsyncStorage
} from "react-native";
import Modal from 'react-native-modal';
import OrderItem from "./OrderItem";
import {
    Body, Drawer, Fab, Form, Header, Icon, Input, Item, Label, Left, Picker, Right, Title
} from "native-base";
import SideBar from "../SideBar";
import {Font} from "expo";
import MyStatusBar from "../MyStatusBar";
import LoadingSpinner from "../LoadingSpinner";

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
            amount: null,
            dueDate: null,
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
                chair_id: chairId,
                customer_id: customerId,
                amount: amount,
                dueDate: dueDate,
                created_by: this.state.USER_ID,
                account_id: this.state.ACCOUNT_ID,
            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                this.setState({refresh: !this.state.refresh});
                this._getAllCustomers();
                alert(responseJson.message);
                this.setState({visibleModal: false, orderStatus: ""});

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
                if (json.data.length > 0) {
                    this.setState({orders: {"rows": json.data}});
                } else {
                    alert(json.message);
                }

            }).catch((error) => {
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
        this.setState({loading: false});
    }

    _keyExtractor = (item, index) => item.id.toString();

    _renderItem = ({item}) => (
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

    render() {

        if (this.state.loading) {
            return (
                <LoadingSpinner/>
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
                            <Header>
                                <Left>
                                    <Icon onPress={() => this.openDrawer()} name="menu" style={{color: 'white'}}/>
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
                                        <Input onChangeText={(value) => this.setState({amount: value})}/>
                                    </Item>

                                    <Item floatingLabel>
                                        <Label>Due Date</Label>
                                        <Input onChangeText={(value) => this.setState({dueDate: value})}/>
                                    </Item>

                                </Form>

                                <View style={styles.footerContainer}>
                                    <View style={styles.buttonContainer}>
                                        <Button onPress={this._addOrder} title="Add"
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