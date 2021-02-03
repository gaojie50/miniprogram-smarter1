import { InferProps } from 'prop-types';
import React from 'react';
import { AtTabBarProps } from '../types/tab-bar';
export default class AtTabBar extends React.Component<AtTabBarProps> {
    static defaultProps: AtTabBarProps;
    static propTypes: InferProps<AtTabBarProps>;
    private handleClick;
    render(): JSX.Element;
}
