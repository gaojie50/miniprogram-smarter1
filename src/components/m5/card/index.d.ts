import { InferProps } from 'prop-types';
import React from 'react';
import { AtCardProps } from '../types/card';
export default class AtCard extends React.Component<AtCardProps> {
    static defaultProps: AtCardProps;
    static propTypes: InferProps<AtCardProps>;
    private handleClick;
    render(): JSX.Element;
}
