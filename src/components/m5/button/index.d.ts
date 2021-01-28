import { InferProps } from 'prop-types';
import React from 'react';
import { AtButtonProps, AtButtonState } from '../types/button';
export default class AtButton extends React.Component<AtButtonProps, AtButtonState> {
    static defaultProps: AtButtonProps;
    static propTypes: InferProps<AtButtonProps>;
    constructor(props: AtButtonProps);
    private onClick;
    private onGetUserInfo;
    private onContact;
    private onGetPhoneNumber;
    private onError;
    private onOpenSetting;
    render(): JSX.Element;
}
