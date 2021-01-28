import { InferProps } from 'prop-types';
import React from 'react';
import { AtSearchBarProps, AtSearchBarState } from '../types/search-bar';
export default class AtSearchBar extends React.Component<AtSearchBarProps, AtSearchBarState> {
    static defaultProps: AtSearchBarProps;
    static propTypes: InferProps<AtSearchBarProps>;
    constructor(props: AtSearchBarProps);
    private handleFocus;
    private handleBlur;
    private handleChange;
    private handleClear;
    private handleConfirm;
    private handleActionClick;
    render(): JSX.Element;
}
