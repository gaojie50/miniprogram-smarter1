import { InferProps } from 'prop-types';
import React from 'react';
import { AtCountDownProps, AtCountdownState } from '../types/countdown';
export default class AtCountdown extends React.Component<AtCountDownProps, AtCountdownState> {
    static defaultProps: AtCountDownProps;
    static propTypes: InferProps<AtCountDownProps>;
    private seconds;
    private timer;
    constructor(props: AtCountDownProps);
    private setTimer;
    private clearTimer;
    private calculateTime;
    private countdonwn;
    UNSAFE_componentWillReceiveProps(nextProps: AtCountDownProps): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidHide(): void;
    componentDidShow(): void;
    render(): JSX.Element;
}
