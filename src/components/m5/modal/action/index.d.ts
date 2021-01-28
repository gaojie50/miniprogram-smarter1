import { InferProps } from 'prop-types';
import React from 'react';
import { AtModalActionProps } from '../../types/modal';
export default class AtModalAction extends React.Component<AtModalActionProps> {
    static defaultProps: AtModalActionProps;
    static propTypes: InferProps<AtModalActionProps>;
    render(): JSX.Element;
}
