import React, {Component} from 'react';
import {
    Button, FlatList, Image, StyleSheet, Text, TouchableOpacity, View,NativeModules
} from "react-native";
import Modal from 'react-native-modal';
import ChairItem from "./ChairItem";
import {
    Body, Drawer, Fab, Form, Header, Input, Item, Label, Left, Picker, Right, Title
} from "native-base";
import SideBar from "../SideBar";
import {Font} from "expo";
import MyStatusBar from "../MyStatusBar";
import LoadingSpinner from "../LoadingSpinner";
import {ImagePicker} from 'react-native-image-picker';
import { Ionicons } from '@expo/vector-icons';
import MyLoader from "../MyLoader";

export default class Chairs extends Component {

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

        ImagePicker.showImagePicker(options, (response) => {
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
                //let source = { uri: response.uri };

                // You can also display the image using data:
                let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    chairImage: source
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

        let formData = new FormData();

        formData.append("chair", chair);
        formData.append("chair_type_id", this.state.chairTypeId);
        formData.append("created_by", this.state.USER_ID);
        formData.append("account_id", this.state.ACCOUNT_ID);
        formData.append("image_url", {uri: this.state.chairImage, name: 'chair_image',type: 'image/jpeg'});

        fetch(BASE_URL + '/chairs', {
            method: 'POST',
            body: formData,
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    this.setState({refresh: !this.state.refresh});
                    this._getAllChairs();
                    this.setState({visibleModal: false, orderStatus: ""});

                    alert(json.message);

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

    _getAllChairs() {
        return fetch(BASE_URL + '/get_all_chairs?account_id=' + this.state.ACCOUNT_ID)
            .then((response) => response.json())
            .then((json) => {
                this.setState({loading: false});
                if (json.data.length > 0) {
                    this.setState({chairs: {"rows": json.data}});
                } else {
                    alert(json.message);
                }
            }).catch((error) => {
                this.setState({loading: false});
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
        return fetch(BASE_URL + '/get_all_chair_types?account_id=' + this.state.ACCOUNT_ID)
            .then((response) => response.json())
            .then((json) => {
                console.log(">>> Chairs->_getAllChairTypes",json);
                if (json.data.length > 0) {
                    this.setState({chairTypes: {"rows": json.data}});

                    let chairTypeItems = (<Picker
                        selectedValue={this.state.chairTypeId}
                        onValueChange={this.onValueChange.bind(this)}
                    >
                        {json.data.map((chairType) => <Picker.Item key={chairType.id} label={chairType.chair_type}
                                                              value={chairType.id}/>)}
                    </Picker>);

                    this.setState({chairTypeItems: chairTypeItems});
                } else {
                    alert(json.message);
                }

            }).catch((error) => {
                console.error(error);
                alert("Could not connect to the server!");
            });
    }

    componentDidMount() {

        this._getAllChairTypes();

        this._getAllChairs();

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
            //onPressItem={this._onPressItem}
            onShowGallery={this._onShowGallery.bind(this)}
            //selected={!!this.state.selected.get(item.id)}
            chair={item.chair}
            chairType={item.chair_type}
            imageUrl={item.image_url}
        />
    );

    _onShowGallery(chair,chairType,chairImage) {
        //alert();
        this.props.navigation.navigate('ChairGallery', {
            chair:chair,
            chairType:chairType,
            chairImage:chairImage
        })
    }

    _onPressItem = () => {
        alert("_onPressItem");
    }

    closeDrawer = () => {
        this.drawer._root.close()
    };

    openDrawer = () => {
        this.drawer._root.open()
    };

    // When "Choose" is pressed, we show the user's image library
    // so they may show a photo from disk inside the image view.
    _onChoosePic = async () => {
        const {
            cancelled,
            uri,
        } = await Expo.ImagePicker.launchImageLibraryAsync();
        if (!cancelled) {

            this.setState({chairImage: uri});

        }
    }

    render() {

        if (this.state.loading) {
            return (
                <MyLoader/>
            );
        } else {

            //console.log(">>> Chairs.js: ", this.state.chairs);
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
                            <Header style={{backgroundColor: "#3F51B5"}}>
                                <Left>
                                    <Ionicons onPress={() => this.openDrawer()} name="md-menu" size={24}
                                              style={{color: 'white'}}/>
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
                            style={{backgroundColor: '#FFC107'}}
                            position="bottomRight"
                            onPress={this._showDialog}>
                            <Ionicons name="md-add"/>
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

                                   <Item stackedLabel>

                                       <TouchableOpacity
                                           onPress={this._onChoosePic}>
                                           <Text>Choose</Text>
                                       </TouchableOpacity>

                                   </Item>

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