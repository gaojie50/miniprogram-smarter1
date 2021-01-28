import { InferProps } from 'prop-types';
import React from 'react';
import { AtNavBarProps } from '../types/nav-bar';
export default class AtNavBar extends React.Component<AtNavBarProps> {
    static defaultProps: AtNavBarProps;
    static propTypes: InferProps<AtNavBarProps>;
    private handleClickLeftView;
    private handleClickSt;
    private handleClickNd;
    render(): JSX.Element;
}
