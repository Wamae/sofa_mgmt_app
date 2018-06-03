import React, {Component} from 'react';
import {
    Button, FlatList, StyleSheet, Text, View
} from "react-native";
import Modal from 'react-native-modal';
import ChairTypeItem from "./ChairTypeItem";
import {
    Body, Container, Content, Drawer, Fab, Form, Header, Icon, Input, Item, Label, Left, Right, Spinner,
    Title
} from "native-base";
import SideBar from "../SideBar";
import {Font, AppLoading} from "expo";
import MyStatusBar from "../MyStatusBar";
import LoadingSpinner from "../LoadingSpinner";

const ACCOUNT_ID = 8;

export default class ChairTypes extends Component {

    onActionSelected(position) {
        if (position === 0) { // index of 'Settings'
            showSettings();
        }
    }

    constructor() {
        super();
        this.state = {
            chairTypes: [],
            visibleModal: false,
            chairType: "",
            refresh: false,
            active: true,
            loading: true,
            fontLoaded: false,
        }
    }


    _addChairType = () => {
        let chairType = this.state.chairType;
        if (chairType.length === 0) {
            alert("Enter chair type");
            return false;
        }

        fetch('http://660044e3.ngrok.io/api/chair_types', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chair_type: chairType,
                created_by: 1,
                account_id: 8,
            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                this.setState({refresh: !this.state.refresh});
                this._getAllChairTypes();
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

    _getAllChairTypes() {
        return fetch('http://660044e3.ngrok.io/api/get_all_chair_types?account_id=' + ACCOUNT_ID)
            .then((response) => response.json())
            .then((json) => {
                this.setState({chairTypes: {"rows": json}});
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

        this._getAllChairTypes();

        this.setState({fontLoaded: true});
        this.setState({loading: false});
    }

    _keyExtractor = (item, index) => item.id.toString();

    _renderItem = ({item}) => (
        <ChairTypeItem
            id={item.id.toString()}
            onPressItem={this._onPressItem}
            //selected={!!this.state.selected.get(item.id)}
            title={item.chair_type}
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
                <LoadingSpinner/>
            );
        } else {

            console.log(">>> ChairTypes.js: ", this.state.chairs);

            return (
                <Drawer
                    ref={(ref) => {
                        this.drawer = ref;
                    }}
                    content={<SideBar navigator={this.navigator}/>}
                    onClose={() => this.closeDrawer()}
                >

                    <MyStatusBar/>

                    {
                        this.state.fontLoaded ? (
                            <Header>
                                <Left>
                                    <Icon onPress={() => this.openDrawer()} name="menu"/>
                                </Left>
                                <Body>
                                <Title>Chair Types</Title>
                                </Body>
                                <Right/>
                            </Header>) : null
                    }

                    <View style={{flex: 1}}>

                        <FlatList
                            data={this.state.chairTypes.rows}
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
                                    <Text>Add Chair Type</Text>
                                </View>

                                <Form>
                                    <Item floatingLabel>
                                        <Label>Chair Type</Label>
                                        <Input onChangeText={(value) => this.setState({chairType: value})}/>
                                    </Item>
                                </Form>

                                <View style={styles.footerContainer}>
                                    <View style={styles.buttonContainer}>
                                        <Button onPress={this._addChairType} title="Add"
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