import { InferProps } from 'prop-types';
import React from 'react';
import { AtMessageProps, AtMessageState } from '../types/message';
export default class AtMessage extends React.Component<AtMessageProps, AtMessageState> {
    static defaultProps: AtMessageProps;
    static propTypes: InferProps<AtMessageProps>;
    private _timer;
    constructor(props: AtMessageProps);
    private bindMessageListener;
    componentDidShow(): void;
    componentDidMount(): void;
    componentDidHide(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
