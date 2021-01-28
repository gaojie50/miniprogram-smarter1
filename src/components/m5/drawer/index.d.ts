import { InferProps } from 'prop-types';
import React from 'react';
import { AtDrawerProps, AtDrawerState } from '../types/drawer';
export default class AtDrawer extends React.Component<AtDrawerProps, AtDrawerState> {
    static defaultProps: AtDrawerProps;
    static propTypes: InferProps<AtDrawerProps>;
    constructor(props: AtDrawerProps);
    componentDidMount(): void;
    private onItemClick;
    private onHide;
    private animHide;
    private animShow;
    private onMaskClick;
    UNSAFE_componentWillReceiveProps(nextProps: AtDrawerProps): void;
    render(): JSX.Element;
}
