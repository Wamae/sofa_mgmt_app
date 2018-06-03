import React, {Component} from 'react';
import PropTypes from 'prop-types';

const contextTypes = {
    uiTheme: PropTypes.object.isRequired,
};

export default class MyButton extends Component {
    render() {

        const { primaryColor } = this.context.uiTheme.palette;
        return (
            <Button primary text="Primary" />
        );

}
}