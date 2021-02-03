import { InferProps } from 'prop-types';
import React from 'react';
import { AtStepsProps } from '../types/steps';
export default class AtSteps extends React.Component<AtStepsProps> {
    static defaultProps: AtStepsProps;
    static propTypes: InferProps<AtStepsProps>;
    private handleClick;
    render(): JSX.Element;
}
