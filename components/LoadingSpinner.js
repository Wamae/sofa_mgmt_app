import React, {Component} from 'react';
import {Container, Content, Header, Spinner} from "native-base";

export default class LoadingSpinner extends Component {
    render() {

        return (

            <Container>
                <Header/>
                <Content>
                    <Spinner color='blue'/>
                </Content>
            </Container>)
    }
}