// credit to  ACat for the tip system

import React from 'react';
import {defineMessages, FormattedMessage, intlShape, injectIntl} from 'react-intl';
import classNames from 'classnames';
import styles from './loader.css';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import { tip } from '../../lib/randomUnhelpfulTip';
import snail from './snail.svg'

import * as progressMonitor from './tw-progress-monitor';

// tw:
// we make some rather large changes here:
//  - remove random message, replaced with message dependent on what is actually being loaded
//  - add a progress bar
//  - bring in intl so that we can translate everything
// The way of doing this is extremely unusual and weird compared to how things are typically done for performance.
// This is because react updates are too performance crippling to handle the progress bar rapidly updating.

const mainMessages = {
    'gui.loader.headline': (
        <FormattedMessage
            defaultMessage="Cool mod"
            description="Main loading message"
            id="gui.loader.headline"
        />
    ),
    'gui.loader.creating': (
        <FormattedMessage
            defaultMessage="O no cringe"
            description="Main creating message"
            id="gui.loader.creating"
        />
    ),
    'gui.loader.playground': (
        <FormattedMessage
            defaultMessage="I slipped on a peal"
            description="Playground load message"
            id="gui.loader.playground"
        />
    )
};

const messages = defineMessages({
    generic: {
        defaultMessage: 'Cringe alert',
        description: 'Initial generic loading message',
        id: 'tw.loader.generic'
    },
    projectData: {
        defaultMessage: 'salami',
        description: 'Appears when loading project data',
        id: 'tw.loader.data'
    },
    assetsKnown: {
        defaultMessage: 'gopgopgop',
        description: 'Appears when loading project assets and amount of assets is known',
        id: 'tw.loader.assets.known'
    },
    assetsUnknown: {
        defaultMessage: 'susmesage',
        description: 'Appears when loading project assets but amount of assets is unknown',
        id: 'tw.loader.assets.unknown'
    }
});

class LoaderComponent extends React.Component {
    constructor (props) {
        super(props);
        this._state = 0;
        this.progress = 0;
        this.complete = 0;
        this.total = 0;
        this.unhelpfulTip = tip[Math.round(Math.random() * tip.length)];
        bindAll(this, [
            'barInnerRef',
            'handleProgressChange',
            'messageRef'
        ]);
    }
    componentDidMount () {
        progressMonitor.setProgressHandler(this.handleProgressChange);
        this.updateMessage();
    }
    componentDidUpdate () {
        this.update();
    }
    componentWillUnmount () {
        progressMonitor.setProgressHandler(() => {});
    }
    handleProgressChange (state, progress, complete, total) {
        if (state !== this._state) {
            this._state = state;
            this.updateMessage();
        }
        this.progress = progress;
        this.complete = complete;
        this.total = total;
        this.update();
    }
    update () {
        this.barInner.style.width = `${this.progress * 100}%`;
        if (this._state === 2) {
            this.updateMessage();
        }
    }
    updateMessage () {
        if (this._state === 0) {
            this.message.textContent = this.props.intl.formatMessage(messages.generic);
        } else if (this._state === 1) {
            this.message.textContent = this.props.intl.formatMessage(messages.projectData);
        } else if (this.total > 0) {
            this.message.textContent = this.props.intl.formatMessage(messages.assetsKnown, {
                complete: this.complete,
                total: this.total
            });
        } else {
            this.message.textContent = this.props.intl.formatMessage(messages.assetsUnknown);
        }
    }
    barInnerRef (element) {
        this.barInner = element;
    }
    messageRef (element) {
        this.message = element;
    }
    render () {
        return (
            <div
                className={classNames(styles.background, {
                    [styles.fullscreen]: this.props.isFullScreen
                })}
            >
                <div className={styles.container}>
                    <div className={styles.blockAnimation}>
                        <img src={snail} />
                    </div>
                    <div className={styles.title}>
                        {mainMessages[this.props.messageId]}
                    </div>
                    <p dangerouslySetInnerHTML={{__html: this.unhelpfulTip}}/>
                    <div className={styles.messageContainerOuter}>
                        <div
                            className={styles.messageContainerInner}
                            ref={this.messageRef}
                        />
                    </div>
                    <div className={styles.twProgressOuter}>
                        <div
                            className={styles.twProgressInner}
                            ref={this.barInnerRef}
                        />
                    </div>

                </div>
            </div>
        );
    }
}

LoaderComponent.propTypes = {
    isFullScreen: PropTypes.bool,
    intl: intlShape.isRequired,
    messageId: PropTypes.string
};
LoaderComponent.defaultProps = {
    isFullScreen: false,
    messageId: 'gui.loader.headline'
};

export default injectIntl(LoaderComponent);
