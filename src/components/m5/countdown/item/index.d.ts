import { InferProps } from 'prop-types';
import React from 'react';
import { AtCountdownItemProps } from '../../types/countdown';
export default class AtCountdownItem extends React.Component<AtCountdownItemProps> {
    static defaultProps: AtCountdownItemProps;
    static propTypes: InferProps<AtCountdownItemProps>;
    private formatNum;
    render(): JSX.Element;
}
