import { InferProps } from 'prop-types';
import React from 'react';
import { AtBadgeProps } from '../types/badge';
export default class AtBadge extends React.Component<AtBadgeProps> {
    static defaultProps: AtBadgeProps;
    static propTypes: InferProps<AtBadgeProps>;
    constructor(props: AtBadgeProps);
    private formatValue;
    render(): JSX.Element;
}
