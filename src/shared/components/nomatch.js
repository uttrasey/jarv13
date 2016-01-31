import React from 'react';
import styles from './nomatch.css';

export default class NoMatch extends React.Component {

    render() {
        return <h3 className={styles.normal}>No Match</h3>;
    }
}
