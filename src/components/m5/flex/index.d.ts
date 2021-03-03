import { InferProps } from 'prop-types';
import React from 'react';
import { AtFlexProps } from '../types/flex';
export default class AtFlex extends React.Component<AtFlexProps> {
    static propTypes: InferProps<AtFlexProps>;
    render(): JSX.Element;
}
