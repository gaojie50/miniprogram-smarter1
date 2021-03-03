import { InferProps } from 'prop-types';
import React from 'react';
import { AtDividerProps } from '../types/divider';
export default class AtDivider extends React.Component<AtDividerProps> {
    static defaultProps: AtDividerProps;
    static propTypes: InferProps<AtDividerProps>;
    render(): JSX.Element;
}
