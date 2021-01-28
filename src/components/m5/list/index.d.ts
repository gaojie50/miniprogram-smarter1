import { InferProps } from 'prop-types';
import React from 'react';
import { AtListProps } from '../types/list';
export default class AtList extends React.Component<AtListProps> {
    static defaultProps: AtListProps;
    static propTypes: InferProps<AtListProps>;
    render(): JSX.Element;
}
