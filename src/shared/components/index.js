import React from 'react';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import Nav from './nav';

/**
 * Entry point to the application, renders child views inside of it.
 */
export default class AppView extends React.Component {

    render() {
        return (
            <div>
                <Jumbotron>
                    <h1>Jarv13</h1>
                    <p>Making me better</p>
                </Jumbotron>
                <Nav />
                {this.props.children}
           </div>
    );
  }
}

AppView.propTypes = {
    children: React.PropTypes.any
}
