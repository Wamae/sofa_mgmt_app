import React, {Component} from 'react';
import {Image} from 'react-native';
import {Container, Header, View, DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Body, Icon} from 'native-base';


export default class ChairGallery extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chair: this.props.navigation.state.params.chair,
            chairType: this.props.navigation.state.params.chairType,
            chairImage: this.props.navigation.state.params.chairImage,
        }
    }

render(){

        cards = [
                {
                    text: this.state.chair,
                    name: this.state.chairType,
                    image: this.state.chairImage,
                }
            ]
        ;

        return (

            <Container>
                <Header />
                <View>
                    <DeckSwiper
                        dataSource={cards}
                        renderItem={item =>
                            <Card style={{ elevation: 3 }}>
                                <CardItem>
                                    <Left>
                                        <Thumbnail source={this.state.image} />
                                        <Body>
                                        <Text>{item.text}</Text>
                                        <Text note>Classic</Text>
                                        </Body>
                                    </Left>
                                </CardItem>
                                <CardItem cardBody>
                                    <Image style={{ height: 300, flex: 1 }} source={{uri: item.image}} />
                                </CardItem>
                                <CardItem>
                                    <Icon name="heart" style={{ color: '#ED4A6A' }} />
                                    <Text>{item.name}</Text>
                                </CardItem>
                            </Card>
                        }
                    />
                </View>
            </Container>

        );
    }
}