import { InferProps } from 'prop-types';
import React from 'react';
import { AtActivityIndicatorProps } from '../types/activity-indicator';
export default class AtActivityIndicator extends React.Component<AtActivityIndicatorProps> {
    static defaultProps: AtActivityIndicatorProps;
    static propTypes: InferProps<AtActivityIndicatorProps>;
    render(): JSX.Element;
}
