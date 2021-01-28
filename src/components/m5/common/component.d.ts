import { Component } from 'react';
export default class AtComponent<P = {}, S = {}> extends Component<P, S> {
    /**
     * 合并 style
     * @param {Object|String} style1
     * @param {Object|String} style2
     * @returns {String}
     */
    mergeStyle(style1: object | string, style2: object | string): object | string;
}
