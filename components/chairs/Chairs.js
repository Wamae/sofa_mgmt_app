import React, {Component} from 'react';
import {
    Button, FlatList, Image, StyleSheet, Text, View
} from "react-native";
import Modal from 'react-native-modal';
import ChairItem from "./ChairItem";
import {
    Body, Drawer, Fab, Form, Header, Icon, Input, Item, Label, Left, Picker, Right, Title
} from "native-base";
import SideBar from "../SideBar";
import {Font} from "expo";
import MyStatusBar from "../MyStatusBar";
import LoadingSpinner from "../LoadingSpinner";

export default class Chairs extends Component {

    //ImagePicker = require('react-native-image-picker');

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
            chairTypeItems: null,
            visibleModal: false,
            chair: "",
            refresh: false,
            active: true,
            loading: true,
            fontLoaded: false,
            chairTypeId: "",
            chairImage: null,
        }

        this.makeImagePicker();

    }

    makeImagePicker() {
        // More info on all the options is below in the README...just some common use cases shown here
        /*var options = {
            title: 'Select Avatar',
            customButtons: [
                {name: 'fb', title: 'Choose Photo from Facebook'},
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        this.ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: source
                });
            }
        });*/
    }


    addChair = () => {
        let chair = this.state.chair;
        if (chair.length === 0) {
            alert("Enter chair");
            return false;
        }

        fetch(BASE_URL + '/chairs', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chair: chair,
                chair_type_id: this.state.chairTypeId,
                created_by: USER_ID,
                account_id: ACCOUNT_ID,
            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                this.setState({refresh: !this.state.refresh});
                this._getAllChairs();
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

    _getAllChairs() {
        return fetch(BASE_URL + '/get_all_chairs?account_id=' + ACCOUNT_ID)
            .then((response) => response.json())
            .then((json) => {
                this.setState({chairs: {"rows": json}});
            }).catch((error) => {
                console.error(error);
                alert("Could not connect to the server!");
            });
    }

    onValueChange(value: string) {
        this.setState({
            chairTypeId: value
        });
    }

    _getAllChairTypes() {
        return fetch(BASE_URL + '/get_all_chair_types?account_id=' + ACCOUNT_ID)
            .then((response) => response.json())
            .then((json) => {

                this.setState({chairTypes: {"rows": json}});

                let chairTypeItems = (<Picker
                    selectedValue={this.state.chairTypeId}
                    onValueChange={this.onValueChange.bind(this)}
                >
                    {json.map((chairType) => <Picker.Item key={chairType.id} label={chairType.chair_type}
                                                                value={chairType.id}/>)}
                </Picker>);

                this.setState({chairTypeItems:chairTypeItems});

            }).catch((error) => {
                console.error(error);
                alert("Could not connect to the server!");
            });
    }

    componentDidMount() {

        this._getAllChairTypes();

        this._getAllChairs();
        this.setState({loading: false});
    }

    async componentWillMount() {

        await Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        });

        this.setState({fontLoaded: true});
    }

    _keyExtractor = (item, index) => item.id.toString();

    _renderItem = ({item}) => (
        <ChairItem
            id={item.id.toString()}
            onPressItem={this._onPressItem}
            //selected={!!this.state.selected.get(item.id)}
            chair={item.chair}
            chairType={item.chair_type}
            imageUrl={item.image_url}
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

    getChairTypes = () => {
        let chairTypes = this.state.chairTypes.rows;
        console.log(">>> getChairTypes: ", chairTypes);
        if (chairTypes.length > 0) {
            return (
                <Picker
                    selectedValue={this.state.chairTypeId}
                >
                    <Picker.Item key={0} label={'Tipo de evento'} value={''}/>
                    {chairTypes.map((chairType) => <Picker.Item key={chairType.id} label={chairType.chair_type}
                                                                value={chairType.id}/>)}
                </Picker>
            );
        }
        return null;
    }

    render() {

        if (this.state.loading) {
            return (
                <LoadingSpinner/>
            );
        } else {

            console.log(">>> Chairs.js: ", this.state.chairs);
            console.log(">>> ChairTypes.js: ", this.state.chairTypes);

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
                            <Header>
                                <Left>
                                    <Icon onPress={() => this.openDrawer()} name="menu" style={{color: 'white'}}/>
                                </Left>
                                <Body>
                                <Title>Chairs</Title>
                                </Body>
                                <Right/>
                            </Header>) : null
                    }

                    <View style={{flex: 1}}>

                        <FlatList
                            data={this.state.chairs.rows}
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
                                    <Text>Add Chair</Text>
                                </View>

                                <Form>
                                    <Item floatingLabel>
                                        <Label>Chair</Label>
                                        <Input onChangeText={(value) => this.setState({chair: value})}/>
                                    </Item>

                                    <Item inlineLabel>
                                        <Label>Chair Types</Label>
                                        {this.state.chairTypeItems}
                                    </Item>

                                    <Image source={this.state.chairImage} />

                                </Form>

                                <View style={styles.footerContainer}>
                                    <View style={styles.buttonContainer}>
                                        <Button onPress={this.addChair} title="Add"
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