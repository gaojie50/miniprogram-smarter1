import { InferProps } from 'prop-types';
import React from 'react';
import { AtCurtainProps } from '../types/curtain';
export default class AtCurtain extends React.Component<AtCurtainProps> {
    static defaultProps: AtCurtainProps;
    static propTypes: InferProps<AtCurtainProps>;
    private onClose;
    private _stopPropagation;
    render(): JSX.Element;
}
