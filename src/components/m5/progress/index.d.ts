import { InferProps } from 'prop-types';
import React from 'react';
import { AtProgressProps } from '../types/progress';
export default class AtProgress extends React.Component<AtProgressProps> {
    static propTypes: InferProps<AtProgressProps>;
    render(): JSX.Element;
}
