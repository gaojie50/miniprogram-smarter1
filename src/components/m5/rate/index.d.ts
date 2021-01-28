import { InferProps } from 'prop-types';
import React from 'react';
import { AtRateProps } from '../types/rate';
export default class AtRate extends React.Component<AtRateProps> {
    static defaultProps: AtRateProps;
    static propTypes: InferProps<AtRateProps>;
    private handleClick;
    render(): JSX.Element;
}
