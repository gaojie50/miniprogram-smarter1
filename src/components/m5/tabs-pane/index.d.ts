import { InferProps } from 'prop-types';
import React from 'react';
import { AtTabsPaneProps } from '../types/tabs-pane';
export default class AtTabsPane extends React.Component<AtTabsPaneProps> {
    static defaultProps: AtTabsPaneProps;
    static propTypes: InferProps<AtTabsPaneProps>;
    render(): JSX.Element;
}
