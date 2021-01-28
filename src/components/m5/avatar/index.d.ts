import { InferProps } from 'prop-types';
import React from 'react';
import { AtAvatarProps, AtAvatarState } from '../types/avatar';
export default class AtAvatar extends React.Component<AtAvatarProps, AtAvatarState> {
    static defaultProps: AtAvatarProps;
    static propTypes: InferProps<AtAvatarProps>;
    constructor(props: AtAvatarProps);
    render(): JSX.Element;
}
