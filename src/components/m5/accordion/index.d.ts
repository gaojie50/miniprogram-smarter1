import { InferProps } from 'prop-types';
import React from 'react';
import { AtAccordionProps, AtAccordionState } from '../types/accordion';
export default class AtAccordion extends React.Component<AtAccordionProps, AtAccordionState> {
    private isCompleted;
    private startOpen;
    static defaultProps: AtAccordionProps;
    static propTypes: InferProps<AtAccordionProps>;
    constructor(props: AtAccordionProps);
    private handleClick;
    private toggleWithAnimation;
    UNSAFE_componentWillReceiveProps(nextProps: AtAccordionProps): void;
    render(): JSX.Element;
}
