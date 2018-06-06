import React, {Component} from 'react';
import {
    Button, FlatList, StyleSheet, Text, View
} from "react-native";
import Modal from 'react-native-modal';
import OrderStatusItem from "./OrderStatusItem";
import {
    Body, Drawer, Form, Header, Input, Item, Label, Left, Right, Title
} from "native-base";
import SideBar from "../SideBar";
import {Font} from "expo";
import MyStatusBar from "../MyStatusBar";
import LoadingSpinner from "../LoadingSpinner";
import { Ionicons } from '@expo/vector-icons';
import MyLoader from "../MyLoader";

export default class OrderStatuses extends Component {

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
            orderStatuses: [],
            visibleModal: false,
            orderStatus: "",
            refresh: false,
            active: true,
            loading: true,
            fontLoaded: false,
        }
    }


    _addOrderStatus = () => {
        let orderStatus = this.state.orderStatus;
        if (orderStatus.length === 0) {
            alert("Enter order status");
            return false;
        }

        fetch(BASE_URL + '/order_statuses', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order_status: orderStatus,
                created_by: this.state.USER_ID,
                account_id: this.state.ACCOUNT_ID,
            }),
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    this.setState({refresh: !this.state.refresh});
                    this._getAllOrderStatuses();
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

    _getAllOrderStatuses() {
        return fetch(BASE_URL + '/get_all_order_statuses?account_id=' + this.state.ACCOUNT_ID)
            .then((response) => response.json())
            .then((json) => {
                this.setState({loading: false});
                if (json.data.length > 0) {
                    this.setState({orderStatuses: {"rows": json.data}});
                } else {
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

        this._getAllOrderStatuses();

        this.setState({fontLoaded: true});

    }

    _keyExtractor = (item, index) => item.id.toString();

    _renderItem = ({item}) => (
        <OrderStatusItem
            id={item.id.toString()}
            onPressItem={this._onPressItem}
            //selected={!!this.state.selected.get(item.id)}
            orderStatus={item.order_status}
        />
    );

    _onPressItem = () => {
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
                <MyLoader/>
            );
        } else {

            console.log(">>> OrderStatuses.js: ", this.state.chairs);

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
                                <Title>Order Statuses</Title>
                                </Body>
                                <Right/>
                            </Header>) : null
                    }

                    <View style={{flex: 1}}>

                        <FlatList
                            data={this.state.orderStatuses.rows}
                            extraData={this.state.refresh}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}>
                        </FlatList>

                        {/*<Fab
                            active={this.state.active}
                            direction="up"
                            containerStyle={{}}
                            style={{backgroundColor: '#FFC107'}}
                            position="bottomRight"
                            onPress={this._showDialog}>
                            <Ionicons name="md-add"/>
                        </Fab>*/}

                        <Modal isVisible={this.state.visibleModal}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalTitle}>
                                    <Text>Add Order Status</Text>
                                </View>

                                <Form>
                                    <Item floatingLabel>
                                        <Label>Order Status</Label>
                                        <Input onChangeText={(value) => this.setState({orderStatus: value})}/>
                                    </Item>
                                </Form>

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