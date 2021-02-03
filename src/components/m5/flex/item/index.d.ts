import { InferProps } from 'prop-types';
import React from 'react';
import { AtFlexItemProps } from '../../types/flex';
export default class AtFlexItem extends React.Component<AtFlexItemProps> {
    static propTypes: InferProps<AtFlexItemProps>;
    render(): JSX.Element;
}
