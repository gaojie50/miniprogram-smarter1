declare function delay(delayTime?: number): Promise<null>;
declare function delayQuerySelector(selectorStr: string, delayTime?: number): Promise<any[]>;
declare function delayGetScrollOffset({ delayTime }: {
    delayTime?: number | undefined;
}): Promise<any[]>;
declare function delayGetClientRect({ selectorStr, delayTime }: {
    selectorStr: any;
    delayTime?: number | undefined;
}): Promise<any[]>;
declare function uuid(len?: number, radix?: number): string;
interface EventDetail {
    pageX: number;
    pageY: number;
    clientX: number;
    clientY: number;
    offsetX: number;
    offsetY: number;
    x: number;
    y: number;
}
declare function getEventDetail(event: any): EventDetail;
declare function initTestEnv(): void;
declare function isTest(): boolean;
declare function handleTouchScroll(flag: any): void;
declare function pxTransform(size: number): string;
/**
 * 合并 style
 * @param {Object|String} style1
 * @param {Object|String} style2
 * @returns {String}
 */
declare function mergeStyle(style1: object | string, style2: object | string): object | string;
export { delay, delayQuerySelector, uuid, getEventDetail, initTestEnv, isTest, pxTransform, handleTouchScroll, delayGetClientRect, delayGetScrollOffset, mergeStyle };
