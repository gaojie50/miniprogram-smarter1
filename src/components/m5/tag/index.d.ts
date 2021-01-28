import { InferProps } from 'prop-types';
import React from 'react';
import { AtTagProps } from '../types/tag';
export default class AtTag extends React.Component<AtTagProps> {
    static defaultProps: AtTagProps;
    static propTypes: InferProps<AtTagProps>;
    private onClick;
    render(): JSX.Element;
}
