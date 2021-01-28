import { InferProps } from 'prop-types';
import React from 'react';
interface AtLoadingProps {
    size?: string | number;
    color?: string | number;
}
export default class AtLoading extends React.Component<AtLoadingProps> {
    static defaultProps: AtLoadingProps;
    static propTypes: InferProps<AtLoadingProps>;
    render(): JSX.Element;
}
export {};
