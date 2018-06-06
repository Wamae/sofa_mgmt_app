import React, {Component} from 'react';
import {Col, Container, Content, Form, Grid, Header, Input, Item, Label, Text, View} from "native-base";
import {Button} from "react-native";

export default class Login extends Component {

    constructor() {
        super();
        this.state = {
            user_name: "Brian",
            password: "tenten"
        }
    }

    _redirect(accountId,userId){
        console.log(">>> redirect: "+accountId+"|"+userId);
        this.props.navigation.navigate("Orders",{
                account_id: accountId,
                user_id: userId
            }
        );
    }

    _login = () => {
        let userName = this.state.user_name;
        let password = this.state.password

        fetch(BASE_URL + '/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TOKEN,
            },
            body: JSON.stringify({
                user_name: userName,
                password: password,
            }),
        }).then((response) => response.json())
            .then(async (responseJson) => {

                console.log(responseJson);

                    if (responseJson.status == 1) {

                        let userId = responseJson.data.user_id.toString();
                        let accountId = responseJson.data.account_id.toString();

                        console.log(">>> b4 redirect: "+accountId+"|"+userId);
                        this._redirect(accountId,userId);
                    }else if(responseJson.status == 0){
                        alert("Wrong username/password!");
                    }

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
                        <Grid>
                            <Col style={{height: 100, alignItems: 'center', justifyContent: 'center'}}>
                                <Text>LOGIN</Text>
                            </Col>
                        </Grid>
                        <Item floatingLabel>
                            <Label>Username</Label>
                            <Input onChangeText={(value) => this.setState({user_name: value})}/>
                        </Item>
                        <Item floatingLabel>
                            <Label>Password</Label>
                            <Input onChangeText={(value) => this.setState({password: value})} secureTextEntry={true}/>
                        </Item>

                        <View style={{marginTop: 32, marginBottom: 16, marginLeft: 16, marginRight: 16}}>
                            <Button onPress={this._login} title="SIGN IN"
                            />
                        </View>

                        <View style={{marginTop: 16, marginBottom: 16, marginLeft: 16, marginRight: 16}}>
                            <Button onPress={() => this.props.navigation.navigate('Register')} title="SIGN UP"
                            />
                        </View>

                        <View style={{marginLeft: 16}}>
                            <Text style={{color: 'blue'}}>Forgot password?</Text>
                        </View>
                    </Form>
                </Content>
            </Container>
        );
    }
}