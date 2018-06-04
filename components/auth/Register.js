import React, {Component} from 'react';
import {Container, Content, Form, Header, Input, Item, Label, View} from "native-base";
import {Button} from "react-native";

export default class Register extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            address: "",
            companyName: "",
            companyPhone: "",
            companyAddress: "",
            password: "",
            confirmPassword: "",
        }
    }

    _signUp = () => {
        alert(this.state.name);
        let username = this.state.name;
        let firstName = this.state.firstName;
        let lastName = this.state.lastName;
        let phone = this.state.phone;
        let email = this.state.email;
        let address = this.state.address;
        let companyName = this.state.companyName;
        let companyPhone = this.state.companyPhone;
        let companyAddress = this.state.companyAddress;
        let password = this.state.password;
        let confirmPassword = this.state.confirmPassword;

        fetch(BASE_URL + '/accounts', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: username,
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                email: email,
                address: address,
                company_name: companyName,
                company_phone: companyPhone,
                company_address: companyAddress,
                password: password,
            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                this.setState(
                    {
                        name: null
                    },
                    {
                        firstName: null
                    },
                    {
                        lastName: null
                    },
                    {
                        phone: null
                    },
                    {
                        email: null
                    },
                    {
                        address: null
                    },
                    {
                        companyName: null
                    },
                    {
                        companyPhone: null
                    },
                    {
                        companyAddress: null
                    },
                    {
                        password: null
                    },
                    {
                        confirmPassword: null
                    }
                );

                alert(responseJson.message);
                console.log(">>> Register: ", responseJson.data);

                this.props.navigation.goBack();

            })
            .catch((error) => {
                console.error(error);
            });
        ;
    }

    render() {
        return (
            <Container>
                <Header/>
                <Content>
                    <Form>

                        <Item floatingLabel>
                            <Label>Username</Label>
                            <Input onChangeText={(value) => this.setState({name: value})}/>
                        </Item>

                        <Item floatingLabel>
                            <Label>First Name</Label>
                            <Input onChangeText={(value) => this.setState({firstName: value})}/>
                        </Item>

                        <Item floatingLabel>
                            <Label>Last Name</Label>
                            <Input onChangeText={(value) => this.setState({lastName: value})}/>
                        </Item>

                        <Item floatingLabel>
                            <Label>Email</Label>
                            <Input onChangeText={(value) => this.setState({email: value})}/>
                        </Item>

                        <Item floatingLabel>
                            <Label>Phone</Label>
                            <Input onChangeText={(value) => this.setState({phone: value})}/>
                        </Item>

                        <Item floatingLabel>
                            <Label>Company Name</Label>
                            <Input onChangeText={(value) => this.setState({companyName: value})}/>
                        </Item>

                        <Item floatingLabel>
                            <Label>Company Address</Label>
                            <Input onChangeText={(value) => this.setState({companyAddress: value})}/>
                        </Item>

                        <Item floatingLabel>
                            <Label>Company Phone</Label>
                            <Input onChangeText={(value) => this.setState({companyPhone: value})}/>
                        </Item>

                        <Item floatingLabel>
                            <Label>Password</Label>
                            <Input onChangeText={(value) => this.setState({password: value})}/>
                        </Item>

                        <Item floatingLabel>
                            <Label>Confirm Password</Label>
                            <Input onChangeText={(value) => this.setState({confirmPassword: value})}/>
                        </Item>

                        <View style={{marginTop: 32, marginBottom: 16, marginLeft: 16, marginRight: 16}}>
                            <Button onPress={this._signUp} title="SIGN IN"
                            />
                        </View>

                    </Form>
                </Content>
            </Container>
        );
    }
}