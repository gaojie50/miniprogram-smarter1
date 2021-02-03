import { InferProps } from 'prop-types';
import React from 'react';
import { AtFloatLayoutProps, AtFloatLayoutState } from '../types/float-layout';
export default class AtFloatLayout extends React.Component<AtFloatLayoutProps, AtFloatLayoutState> {
    static defaultProps: AtFloatLayoutProps;
    static propTypes: InferProps<AtFloatLayoutProps>;
    constructor(props: AtFloatLayoutProps);
    UNSAFE_componentWillReceiveProps(nextProps: AtFloatLayoutProps): void;
    private handleClose;
    private close;
    private handleTouchMove;
    render(): JSX.Element;
}
