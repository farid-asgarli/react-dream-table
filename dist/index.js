Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var sortable = require('@dnd-kit/sortable');
var utilities = require('@dnd-kit/utilities');
var dayjs = require('dayjs');
require('dayjs/locale/az');
require('dayjs/locale/en');
require('dayjs/locale/ru');
var customParseFormat = require('dayjs/plugin/customParseFormat');
var core = require('@dnd-kit/core');
var reactDom = require('react-dom');
var Fuse = require('fuse.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var dayjs__default = /*#__PURE__*/_interopDefaultLegacy(dayjs);
var customParseFormat__default = /*#__PURE__*/_interopDefaultLegacy(customParseFormat);
var Fuse__default = /*#__PURE__*/_interopDefaultLegacy(Fuse);

const DataGridStaticContext = React__default["default"].createContext(null);
function useDataGridStaticContext() {
    return React.useContext(DataGridStaticContext);
}

class StringExtensions {
    static Empty = "";
    static WhiteSpace = " ";
    static IsNullOrEmpty = (val) => val === undefined || val === null || val.trim() === this.Empty;
}

const cs = (...args) => args.filter((x) => x !== "undefined" && x !== undefined && x !== false).join(StringExtensions.WhiteSpace);

function Auto({ className, children, visible = true, onAnimationFinish, duration = 200 /** ms */, ...props }) {
    const callTimeout = React.useRef(null);
    const [shouldShow, setShouldShow] = React.useState(visible);
    function clearAnimationTimeout() {
        if (callTimeout.current) {
            clearTimeout(callTimeout.current);
            callTimeout.current = null;
        }
    }
    React.useEffect(() => {
        const handleAnimation = (visible) => {
            if (visible)
                onAnimationFinish?.(visible);
            clearAnimationTimeout();
            callTimeout.current = setTimeout(() => {
                setShouldShow(visible);
                if (!visible)
                    onAnimationFinish?.(visible);
            }, !visible ? duration - duration / 10 : 0);
        };
        handleAnimation(visible);
        return () => {
            clearAnimationTimeout();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [duration, visible]);
    function generateChildren(item, animType) {
        const newClassName = cs(className, item.props.className, animType, !shouldShow && "disabled");
        const elemProps = {
            ...item.props,
            className: newClassName,
            style: { ...item.props.style, animationDuration: `${duration}ms` },
            ...props,
        };
        return React__default["default"].cloneElement(item, elemProps);
    }
    if (React__default["default"].isValidElement(children)) {
        if (visible)
            return React__default["default"].Children.map(children, (item) => generateChildren(item, "fade-in"));
        else if (!visible && shouldShow)
            return React__default["default"].Children.map(children, (item) => generateChildren(item, "fade-out"));
        else
            return null;
    }
    return null;
}

function Manual({ className, children, visible = true, onAnimationFinish, duration = 300, variant = "slide", type, ...props }) {
    const callTimeout = React.useRef(null);
    const [shouldShow, setShouldShow] = React.useState(visible);
    function clearAnimationTimeout() {
        if (callTimeout.current) {
            clearTimeout(callTimeout.current);
            callTimeout.current = null;
        }
    }
    React.useEffect(() => {
        const handleAnimation = (visible) => {
            clearAnimationTimeout();
            callTimeout.current = setTimeout(() => {
                setShouldShow(visible);
                onAnimationFinish?.(visible);
            }, !visible ? duration - duration / 10 : 0);
        };
        handleAnimation(visible);
        return () => {
            clearAnimationTimeout();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [duration, visible]);
    if (React__default["default"].isValidElement(children) && shouldShow) {
        return React__default["default"].Children.map(children, (item) => {
            const newClassName = cs(className, item.props.className, `${variant}-${type}`, !shouldShow && "disabled");
            const elemProps = {
                ...item.props,
                className: newClassName,
                style: { ...item.props.style, animationDuration: `${duration}ms` },
                ...props,
            };
            return React__default["default"].cloneElement(item, elemProps);
        });
    }
    return null;
}

const Animations = {
    Auto,
    Manual,
};

function EmptyDataGrid({ className, visible, style, ...props }) {
    const { localization, icons, dimensions } = useDataGridStaticContext();
    return (jsxRuntime.jsx(Animations.Auto, { visible: visible, children: jsxRuntime.jsx("div", { style: { ...style, bottom: dimensions.defaultScrollbarWidth }, className: cs("empty-data-grid", className), ...props, children: jsxRuntime.jsxs("div", { className: "empty-data-grid-wrapper", children: [jsxRuntime.jsx(icons.Empty, { className: "empty-icon" }), jsxRuntime.jsx("span", { className: "empty-text", children: localization.noResult })] }) }) }));
}

const Spinner = ({ className, children, size = 32, style, ...props }) => {
    const dimensions = {
        width: size,
        height: size,
    };
    return (jsxRuntime.jsx("div", { className: cs("spinner-body", className), style: {
            ...style,
            minWidth: size,
            maxWidth: size,
        }, ...props, children: jsxRuntime.jsx("div", { className: "spinner", style: {
                left: `calc(50vw - calc(${size}px / 2px))`,
                ...dimensions,
            }, children: jsxRuntime.jsx("svg", { className: "spinner-icon", viewBox: "0 0 24 24", style: dimensions, children: jsxRuntime.jsx("path", { d: "M 22.49772,12.000001 A 10.49772,10.497721 0 0 1 12,22.497722 10.49772,10.497721 0 0 1 1.5022797,12.000001 10.49772,10.497721 0 0 1 12,1.5022797 10.49772,10.497721 0 0 1 22.49772,12.000001 Z", fill: "none", strokeLinecap: "round" }) }) }) }));
};

function LoadingOverlay({ visible, style, ...props }) {
    const { localization } = useDataGridStaticContext();
    return (jsxRuntime.jsx(Animations.Auto, { visible: visible, children: jsxRuntime.jsx("div", { className: "loading-overlay", ...props, children: jsxRuntime.jsxs("div", { className: "content", children: [jsxRuntime.jsx(Spinner, {}), jsxRuntime.jsx("span", { className: "title", children: localization.dataLoading })] }) }) }));
}

function ExpandRowWrap({ expandRowProps: { children, isRowExpanded, showSeparatorLine, updateExpandRowHeightCache, rowIndex }, className, style, ...props }) {
    const { animationProps } = useDataGridStaticContext();
    const ref = React.useRef(null);
    //TODO
    function onAnimationFinish(visible) {
        if (updateExpandRowHeightCache && visible)
            setTimeout(() => updateExpandRowHeightCache?.(rowIndex, ref.current?.getBoundingClientRect().height ?? 0), 0);
    }
    return (jsxRuntime.jsx(Animations.Auto, { onAnimationFinish: onAnimationFinish, duration: animationProps.duration, visible: isRowExpanded, children: jsxRuntime.jsx("div", { className: cs("expand-row-wrap", showSeparatorLine && "show-separator", className), ...props, children: jsxRuntime.jsx("div", { ref: ref, className: "expand-row-wrap-inner", children: jsxRuntime.jsx("div", { className: "content", children: children }) }) }) }));
}

function RowCellWrap(props) {
    return jsxRuntime.jsx("div", { className: "row-cell-wrap", ...props });
}

function Row({ className, style, children, isRowSelected, isRowActive, expandRowProps, tabIndex, totalColumnsWidth, onContextMenu, ...props }) {
    const { dimensions, animationProps, isRowClickable } = useDataGridStaticContext();
    const commonStyle = React.useMemo(() => ({
        minWidth: totalColumnsWidth,
        width: totalColumnsWidth,
    }), [totalColumnsWidth]);
    const rowCellWrapStyle = React.useMemo(() => ({
        ...commonStyle,
        height: dimensions.defaultDataRowHeight,
    }), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dimensions.defaultDataRowHeight]);
    return (jsxRuntime.jsxs("div", { className: cs("row", isRowSelected && "selected", isRowActive && "active", isRowClickable && "clickable", className), style: {
            ...style,
            transitionDuration: `${animationProps.duration}ms`,
            ...commonStyle,
        }, ...props, children: [jsxRuntime.jsx(RowCellWrap, { style: rowCellWrapStyle, onContextMenu: onContextMenu, children: children }), expandRowProps?.children !== undefined && jsxRuntime.jsx(ExpandRowWrap, { expandRowProps: expandRowProps })] }));
}

function Skeleton() {
    return jsxRuntime.jsx("div", { className: "skeleton-line" });
}

function LoadingSkeleton({ className, style, containerHeight, visible, ...props }) {
    const { dimensions } = useDataGridStaticContext();
    const rowsToRender = React.useMemo(() => Math.floor((containerHeight > 0 ? containerHeight - 50 : 0) / dimensions.defaultDataRowHeight), [containerHeight, dimensions.defaultDataRowHeight]);
    return (jsxRuntime.jsx(Animations.Auto, { visible: visible, children: jsxRuntime.jsx("div", { className: cs("skeleton-data-grid", className), style: {
                ...style,
            }, ...props, children: rowsToRender &&
                rowsToRender > 0 &&
                [...Array(rowsToRender)].map((_, i) => (jsxRuntime.jsx(Row, { style: {
                        height: dimensions.defaultDataRowHeight,
                    }, totalColumnsWidth: "100%", className: "row-skeleton", children: jsxRuntime.jsx(Skeleton, {}) }, i))) }) }));
}

function useVirtualizedRows(data, expandedRowTools, defaultExpandPanelHeight, isVirtualizationEnabled) {
    const dynamicExpansionHeightPerRow = React.useMemo(() => {
        if (!isVirtualizationEnabled || !data)
            return;
        const { expandRowHeightCache, expandedRowKeys, isDynamicRowExpandHeightEnabled,
        //  __lastExpRowCache
         } = expandedRowTools;
        if (!isDynamicRowExpandHeightEnabled)
            return;
        if (!expandedRowKeys.size)
            return;
        // TODO Prevent further rendering
        // if (!__lastExpRowCache.current || expandRowHeightCache[__lastExpRowCache.current.index] === undefined) return;
        const expansionDictionary = {};
        let lastExpandedRowIndex = undefined;
        let totalExpandHeight = 0;
        for (let index = 0; index < data.length; index++) {
            const __virtual_row_index = data[index].__virtual_row_index;
            const expandHeight = lastExpandedRowIndex !== undefined ? expandRowHeightCache[lastExpandedRowIndex] ?? defaultExpandPanelHeight : 0;
            expansionDictionary[__virtual_row_index] = totalExpandHeight + expandHeight;
            if (expandedRowKeys.has(__virtual_row_index) && expandRowHeightCache[__virtual_row_index]) {
                lastExpandedRowIndex = __virtual_row_index;
                totalExpandHeight += expandHeight;
            }
        }
        return {
            expansionDictionary,
            totalExpandHeight,
        };
    }, [isVirtualizationEnabled, data, expandedRowTools, defaultExpandPanelHeight]);
    const staticExpansionHeightPerRow = React.useMemo(() => {
        if (!isVirtualizationEnabled || !data || !expandedRowTools.expandedRowKeys.size)
            return;
        let totalExpandHeight = 0;
        const expansionDictionary = {};
        for (let index = 0; index < data.length; index++) {
            const __virtual_row_index = data[index].__virtual_row_index;
            expansionDictionary[__virtual_row_index] = totalExpandHeight;
            if (expandedRowTools.expandedRowKeys.has(__virtual_row_index))
                totalExpandHeight += defaultExpandPanelHeight;
        }
        return {
            expansionDictionary,
            totalExpandHeight,
        };
    }, [data, defaultExpandPanelHeight, expandedRowTools.expandedRowKeys, isVirtualizationEnabled]);
    const getRowExpansionHeight = React.useCallback((index) => {
        return expandedRowTools.isDynamicRowExpandHeightEnabled
            ? dynamicExpansionHeightPerRow?.expansionDictionary[index]
            : staticExpansionHeightPerRow?.expansionDictionary[index];
    }, [
        dynamicExpansionHeightPerRow?.expansionDictionary,
        expandedRowTools.isDynamicRowExpandHeightEnabled,
        staticExpansionHeightPerRow?.expansionDictionary,
    ]);
    const getTotalExpansionHeight = React.useMemo(() => {
        return expandedRowTools.isDynamicRowExpandHeightEnabled
            ? dynamicExpansionHeightPerRow?.totalExpandHeight
            : staticExpansionHeightPerRow?.totalExpandHeight;
    }, [
        dynamicExpansionHeightPerRow?.totalExpandHeight,
        expandedRowTools.isDynamicRowExpandHeightEnabled,
        staticExpansionHeightPerRow?.totalExpandHeight,
    ]);
    return {
        getRowExpansionHeight,
        getTotalExpansionHeight,
    };
}

//@ts-nocheck
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
/** Used as the `TypeError` message for "Functions" methods. */
const FUNC_ERROR_TEXT = "Expected a function";
/** Used as references for various `Number` constants. */
const NAN = 0 / 0;
/** `Object#toString` result references. */
const symbolTag = "[object Symbol]";
/** Used to match leading and trailing whitespace. */
const reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */
const reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */
const reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */
const reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */
const freeParseInt = parseInt;
/** Detect free variable `global` from Node.js. */
/** Used for built-in method references. */
const objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
const objectToString = objectProto.toString;
/* Built-in method references for those with the same name as other `lodash` methods. */
const nativeMax = Math.max, nativeMin = Math.min;
/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
const now = function () {
    return Date.now();
};
/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * const debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * const source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
    let lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber(wait) || 0;
    if (isObject(options)) {
        leading = !!options.leading;
        maxing = "maxWait" in options;
        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
        trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    function invokeFunc(time) {
        const args = lastArgs, thisArg = lastThis;
        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
    }
    function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
        const timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, result = wait - timeSinceLastCall;
        return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
    }
    function shouldInvoke(time) {
        const timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (lastCallTime === undefined ||
            timeSinceLastCall >= wait ||
            timeSinceLastCall < 0 ||
            (maxing && timeSinceLastInvoke >= maxWait));
    }
    function timerExpired() {
        const time = now();
        if (shouldInvoke(time)) {
            return trailingEdge(time);
        }
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
        timerId = undefined;
        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) {
            return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
    }
    function cancel() {
        if (timerId !== undefined) {
            clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
    }
    function flush() {
        return timerId === undefined ? result : trailingEdge(now());
    }
    function debounced() {
        const time = now(), isInvoking = shouldInvoke(time);
        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;
        if (isInvoking) {
            if (timerId === undefined) {
                return leadingEdge(lastCallTime);
            }
            if (maxing) {
                // Handle invocations in a tight loop.
                timerId = setTimeout(timerExpired, wait);
                return invokeFunc(lastCallTime);
            }
        }
        if (timerId === undefined) {
            timerId = setTimeout(timerExpired, wait);
        }
        return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
}
/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * const throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
    let leading = true, trailing = true;
    if (typeof func != "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
    }
    if (isObject(options)) {
        leading = "leading" in options ? !!options.leading : leading;
        trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    return debounce(func, wait, {
        leading: leading,
        maxWait: wait,
        trailing: trailing,
    });
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
    const type = typeof value;
    return !!value && (type == "object" || type == "function");
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
    return !!value && typeof value == "object";
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
    return typeof value == "symbol" || (isObjectLike(value) && objectToString.call(value) == symbolTag);
}
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
    if (typeof value == "number") {
        return value;
    }
    if (isSymbol(value)) {
        return NAN;
    }
    if (isObject(value)) {
        const other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject(other) ? other + "" : other;
    }
    if (typeof value != "string") {
        return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, "");
    const isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value)
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : reIsBadHex.test(value)
            ? NAN
            : +value;
}

function Body(props) {
    return jsxRuntime.jsx("div", { className: "body", ...props });
}

function ColumnLayout(props) {
    return jsxRuntime.jsx("div", { className: "column-layout", ...props });
}

function ColumnResizingOverlay() {
    return jsxRuntime.jsx("div", { className: "column-resizing-overlay" });
}

function ButtonPrimary({ className, ...props }) {
    return jsxRuntime.jsx("button", { type: "button", className: cs(className, "button-primary"), ...props });
}

/* eslint-disable react-hooks/exhaustive-deps */
/**
 * A hook that fires when the area outside the current element is clicked.
 * @param refObject A collection of ref objects or a single ref.
 * @param callback Function to execute on click.
 */
function useDetectOutsideClick(elementRef, callback) {
    React.useEffect(() => {
        function fireEvent(ref, event, key) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback?.(event, key);
            }
        }
        function handleClickOutside(event) {
            fireEvent(elementRef, event);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [elementRef]);
}

const Select = ({ options, value, onChange, onOpen, multiple, clearable, loading, attachmentType, }) => {
    const [optionsBodyVisible, setOptionsBodyVisible] = React.useState(false);
    const { localization, icons } = useDataGridStaticContext();
    function handleSelectChange(val) {
        if (!multiple) {
            if (clearable && val === value) {
                onChange?.(undefined);
                setOptionsBodyVisible(false);
            }
            else {
                onChange?.(val);
                setOptionsBodyVisible(false);
            }
        }
        else {
            let stateCopy = [...value];
            if (stateCopy.includes(val))
                stateCopy = stateCopy.filter((x) => x !== val);
            else
                stateCopy.push(val);
            onChange?.(stateCopy);
            return stateCopy;
        }
    }
    function handleVisibility(e) {
        if (!optionsBodyVisible) {
            setOptionsBodyVisible(true);
            onOpen?.();
        }
    }
    const optionBodyRef = React.useRef(null);
    const selectWrapperRef = React.useRef(null);
    useDetectOutsideClick(optionBodyRef, (e, key) => setOptionsBodyVisible(false));
    function joinNodes(args) {
        const isPunctuationActive = typeof args[0] === "string";
        return args.map((arg, index) => (jsxRuntime.jsxs("span", { children: [arg, isPunctuationActive && args.length - 1 !== index && jsxRuntime.jsx("span", { children: ",\u00A0" })] }, index)));
    }
    const renderSelectedValues = React.useMemo(() => {
        const elements = options.filter((x) => (multiple ? value.includes(x.value) : x.value === value)).map((x) => x.children);
        if (elements.length === 0)
            return jsxRuntime.jsx("span", { className: "select-placeholder", children: localization.selectPlaceholder });
        return joinNodes(elements);
    }, [localization.selectPlaceholder, multiple, options, value]);
    return (jsxRuntime.jsxs("div", { ref: selectWrapperRef, className: "select-wrapper", children: [jsxRuntime.jsxs("div", { className: cs("select-header", optionsBodyVisible && "active"), onClick: handleVisibility, children: [jsxRuntime.jsx("div", { className: "selected-value", children: renderSelectedValues }), jsxRuntime.jsx("div", { className: "select-icon-wrapper", children: optionsBodyVisible ? jsxRuntime.jsx(icons.ChevronUp, { className: "select-icon" }) : jsxRuntime.jsx(icons.ChevronDown, { className: "select-icon" }) })] }), jsxRuntime.jsx(Animations.Auto, { visible: optionsBodyVisible, children: jsxRuntime.jsx("div", { ref: optionBodyRef, style: {
                        width: selectWrapperRef.current?.clientWidth,
                    }, className: cs("select-list-wrapper", attachmentType), children: loading === true ? (jsxRuntime.jsxs("div", { className: "loading-wrapper", children: [jsxRuntime.jsx(Spinner, { size: 24 }), jsxRuntime.jsx("span", { children: localization.selectOptionsLoading })] })) : (options.map((opt) => (jsxRuntime.jsx(Select.Option, { ...opt, selected: multiple ? value.includes(opt.value) : opt.value === value, onClick: () => handleSelectChange(opt.value), checkIcon: icons.CheckMark }, opt.value)))) }) })] }));
};
Select.Option = ({ title, value, className, children, selected, checkIcon: CheckIcon, ...props }) => {
    return (jsxRuntime.jsxs("div", { className: cs("select-option", selected && "selected", className), ...props, children: [children, selected && (jsxRuntime.jsx("div", { className: "select-option-icon", children: jsxRuntime.jsx(CheckIcon, { className: "select-option-check-icon" }) }))] }));
};

function Footer({ paginationProps, className, optionsMenu, progressReporters, selectedRows, loading, style, ...props }) {
    const { localization, dimensions, icons } = useDataGridStaticContext();
    const { gridPaginationProps, updateCurrentPagination, paginationDefaults } = paginationProps;
    const DEFAULT_PAGE_SIZES = paginationDefaults?.pageSizes ?? [5, 10, 20, 50, 100];
    const renderPaginationNumbers = React.useMemo(() => renderPaginationButtons({
        paginationProps,
        localization,
        icons,
    }), [icons, localization, paginationProps]);
    const renderPaginationPageSize = React.useMemo(() => (jsxRuntime.jsx(Select, { onChange: (e) => updateCurrentPagination({ currentPage: 1, pageSize: e }), options: DEFAULT_PAGE_SIZES.map((op) => ({
            children: op,
            value: op,
        })), value: gridPaginationProps.pageSize })), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gridPaginationProps.pageSize]);
    const renderDataCount = React.useMemo(() => selectedRows.size > 0 ? (jsxRuntime.jsxs("div", { className: "selected-data-count", children: [jsxRuntime.jsx(Animations.Auto, { children: jsxRuntime.jsxs("span", { className: "data-count", children: [selectedRows.size, "\u00A0"] }) }, selectedRows.size), jsxRuntime.jsx("span", { className: "title", children: localization.rowsSelectedTitle })] })) : (jsxRuntime.jsx("div", { className: "total-data-count", children: loading ? (jsxRuntime.jsx("div", { style: { width: 100 }, children: jsxRuntime.jsx(Skeleton, {}) })) : (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(Animations.Auto, { children: jsxRuntime.jsxs("span", { className: "data-count", children: [gridPaginationProps.dataCount ?? 0, "\u00A0"] }) }, gridPaginationProps.dataCount), jsxRuntime.jsx("span", { className: "title", children: localization.paginationTotalCount })] })) })), [
        selectedRows.size,
        localization.rowsSelectedTitle,
        localization.paginationTotalCount,
        loading,
        gridPaginationProps.dataCount,
    ]);
    return (jsxRuntime.jsx("div", { className: cs("footer", className), style: { ...style, minHeight: dimensions.defaultFooterHeight, maxHeight: dimensions.defaultFooterHeight }, ...props, children: jsxRuntime.jsx(Animations.Auto, { children: jsxRuntime.jsxs("div", { className: "bottom", children: [jsxRuntime.jsxs("div", { className: "pagination-data-count", children: [optionsMenu.enabled && (jsxRuntime.jsx("div", { className: "settings", children: jsxRuntime.jsx(ButtonPrimary, { title: localization.settingsMenuTitle, onClick: (e) => optionsMenu.displayOptionsMenu({
                                        data: {},
                                        identifier: "settings",
                                        position: {
                                            xAxis: e.clientX,
                                            yAxis: e.clientY,
                                        },
                                    }), className: cs("settings-button", optionsMenu.isMenuVisible && "active"), children: jsxRuntime.jsx(icons.Settings, { className: "button-icon" }) }) })), renderDataCount] }), jsxRuntime.jsx("div", { className: "pagination-page-numbers", children: loading ? (jsxRuntime.jsx("div", { style: { width: 300 }, children: jsxRuntime.jsx(Skeleton, {}) })) : (renderPaginationNumbers) }), jsxRuntime.jsx("div", { className: "pagination-page-size", children: loading ? (jsxRuntime.jsx("div", { style: { width: 100 }, children: jsxRuntime.jsx(Skeleton, {}) })) : (renderPaginationPageSize) })] }) }) }));
}
function renderPaginationButtons({ paginationProps: { gridPaginationProps, updateCurrentPagination }, localization, icons, }) {
    function updateCurrentPage(navigateTo) {
        if (gridPaginationProps.dataCount && gridPaginationProps.pageSize) {
            const buttonCount = Math.ceil(gridPaginationProps.dataCount / gridPaginationProps.pageSize);
            if (navigateTo <= buttonCount && navigateTo >= 1)
                updateCurrentPagination({
                    currentPage: navigateTo,
                });
        }
    }
    function renderButton({ navigateTo, component, disabled, title, type, icons }) {
        const isActive = gridPaginationProps.currentPage === navigateTo;
        function handleClick(e) {
            !isActive && updateCurrentPage(navigateTo);
        }
        return (jsxRuntime.jsxs("button", { title: title ?? `${navigateTo}`, type: "button", className: cs(isActive && "active", "pagination-button", type), onClick: handleClick, disabled: isActive || disabled === true, children: [jsxRuntime.jsx("span", { className: "content", children: component ?? navigateTo }), type === "ff-left" ? (jsxRuntime.jsxs("span", { className: "ff-swap", children: [jsxRuntime.jsx(icons.FastForward, { className: "btn-icon" }), " "] })) : type === "ff-right" ? (jsxRuntime.jsxs("span", { className: "ff-swap", children: [jsxRuntime.jsx(icons.FastForward, { className: "btn-icon" }), " "] })) : null] }, component ? navigateTo + "arrow" : navigateTo));
    }
    if (gridPaginationProps.pageSize && gridPaginationProps.dataCount) {
        const buttons = [];
        const buttonCount = Math.ceil(gridPaginationProps.dataCount / gridPaginationProps.pageSize);
        if (gridPaginationProps.currentPage > buttonCount)
            updateCurrentPage(buttonCount);
        const initialPageNumber = 1;
        const threeDotsDistance = 3;
        const threeDotsNavigationStep = 5;
        const prev1 = gridPaginationProps.currentPage - 1;
        const next1 = gridPaginationProps.currentPage + 1;
        buttons.push({
            navigateTo: initialPageNumber,
            type: "numeric",
        });
        if (gridPaginationProps.currentPage - threeDotsDistance >= 1)
            buttons.push({
                navigateTo: prev1 - (threeDotsNavigationStep - 1),
                type: "ff-left",
            });
        if (prev1 !== initialPageNumber && prev1 > 0)
            buttons.push({
                navigateTo: prev1,
                type: "numeric",
            });
        if (gridPaginationProps.currentPage !== buttonCount && gridPaginationProps.currentPage !== initialPageNumber)
            buttons.push({
                navigateTo: gridPaginationProps.currentPage,
                type: "numeric",
            });
        if (buttonCount > next1)
            buttons.push({
                navigateTo: next1,
                type: "numeric",
            });
        if (gridPaginationProps.currentPage + threeDotsDistance <= buttonCount)
            buttons.push({
                navigateTo: next1 + (threeDotsNavigationStep - 1),
                type: "ff-right",
            });
        buttonCount !== initialPageNumber &&
            buttons.push({
                navigateTo: buttonCount,
                type: "numeric",
            });
        return [
            renderButton({
                navigateTo: prev1,
                component: jsxRuntime.jsx(icons.ArrowLeft, { className: "btn-icon" }),
                disabled: prev1 === 0,
                title: localization.paginationPrev,
                icons,
            }),
            ...buttons.map((btn) => renderButton({
                navigateTo: btn.navigateTo,
                component: btn.type === "ff-left" || btn.type === "ff-right" ? jsxRuntime.jsx(icons.ThreeDots, { className: "btn-icon" }) : undefined,
                type: btn.type,
                icons,
            })),
            renderButton({
                navigateTo: next1,
                component: jsxRuntime.jsx(icons.ArrowRight, { className: "btn-icon" }),
                disabled: next1 > buttonCount,
                title: localization.paginationNext,
                icons,
            }),
        ];
    }
}

function HeaderLayout(props, ref) {
    return jsxRuntime.jsx("div", { className: "header-layout", ...props, ref: ref });
}
var HeaderLayout$1 = React__default["default"].forwardRef(HeaderLayout);

function MenuButton(props) {
    const { icons, localization } = useDataGridStaticContext();
    return (jsxRuntime.jsx("button", { type: "button", title: localization.menuTitle, className: cs("action-button"), ...props, children: jsxRuntime.jsx(icons.ThreeDots, { style: {
                transform: "rotate(90deg)",
            }, className: cs("action-icon") }) }));
}

function SortButton({ sortingDirection, ...buttonProps }) {
    const { localization, icons } = useDataGridStaticContext();
    const renderSortIcon = React.useMemo(() => {
        switch (sortingDirection) {
            case "ascending":
                return jsxRuntime.jsx(icons.ArrowDown, { className: cs("action-icon") });
            case "descending":
                return jsxRuntime.jsx(icons.ClearSorting, { className: cs("action-icon") });
            default:
                return jsxRuntime.jsx(icons.ArrowUp, { className: cs("action-icon") });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortingDirection]);
    const renderSortTitle = React.useMemo(() => {
        switch (sortingDirection) {
            case "ascending":
                return localization.descendingSortTitle;
            case "descending":
                return localization.clearSortTitle;
            default:
                return localization.ascendingSortTitle;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortingDirection]);
    return (jsxRuntime.jsx("button", { type: "button", title: renderSortTitle, className: cs("action-button", sortingDirection !== undefined && "active"), ...buttonProps, children: renderSortIcon }));
}

function Checkbox(props) {
    return (jsxRuntime.jsx("div", { className: "checkbox-wrapper", children: jsxRuntime.jsx("label", { children: jsxRuntime.jsx("input", { type: "checkbox", checked: true, ...props }) }) }));
}

function ColumnHeaderContent(props, ref) {
    return (jsxRuntime.jsx("div", { ref: ref, title: typeof props.children === "string" ? props.children : undefined, className: "column-header-content", ...props }));
}
var ColumnHeaderContent$1 = React__default["default"].forwardRef(ColumnHeaderContent);

const DatePickerContext = React.createContext({});
function useDatePickerContext() {
    return React.useContext(DatePickerContext);
}

function DayPicker({ selectedDate }) {
    const { pickerDateState: { month: pickedMonth, year: pickedYear }, updateCurrentPicker, updatePickedMonth, updatePickedDay, } = useDatePickerContext();
    const { localization, icons, defaultLocale } = useDataGridStaticContext();
    const currentDay = React.useMemo(() => dayjs__default["default"]().toDate(), []);
    const firstDayOfTheMonth = React.useMemo(() => dayjs__default["default"]().month(pickedMonth).year(pickedYear).startOf("month"), [pickedMonth, pickedYear]);
    const firstDayOfFirstWeekOfMonth = React.useMemo(() => dayjs__default["default"](firstDayOfTheMonth).startOf("week"), [firstDayOfTheMonth]);
    const generateFirstDayOfEachWeek = React.useCallback((day) => {
        const dates = [day];
        for (let i = 1; i < 6; i++) {
            const date = day.clone().add(i, "week");
            dates.push(date);
        }
        return dates;
    }, []);
    const generateWeek = React.useCallback((day) => {
        const dates = [];
        for (let i = 1; i < 8; i++) {
            const date = day.clone().add(i, "day").toDate();
            dates.push(date);
        }
        return dates;
    }, []);
    const generateWeeksOfTheMonth = React.useMemo(() => {
        const firstDayOfEachWeek = generateFirstDayOfEachWeek(firstDayOfFirstWeekOfMonth);
        return firstDayOfEachWeek.map(generateWeek);
    }, [generateFirstDayOfEachWeek, firstDayOfFirstWeekOfMonth, generateWeek]);
    const [flow, setFlow] = React.useState();
    const assignDateStatus = React.useCallback(function (day) {
        if (pickedMonth !== day.getMonth())
            return "diff-month";
        else if (dayjs__default["default"](currentDay).isSame(day, "date"))
            return "current-day";
        return StringExtensions.Empty;
    }, [currentDay, pickedMonth]);
    return (jsxRuntime.jsxs("div", { className: "calendar-day-picker", children: [jsxRuntime.jsxs("div", { className: "calendar-header-wrapper", children: [jsxRuntime.jsxs("div", { className: "calendar-header-title", children: [jsxRuntime.jsx("button", { className: "picker-view-update", type: "button", onClick: () => updateCurrentPicker("month"), children: dayjs__default["default"]().year(pickedYear).month(pickedMonth).locale(defaultLocale).format("MMMM") }), jsxRuntime.jsx("button", { className: "picker-view-update", type: "button", onClick: () => updateCurrentPicker("year"), children: dayjs__default["default"]().year(pickedYear).month(pickedMonth).format("YYYY") })] }), jsxRuntime.jsxs("div", { className: "arrows-wrapper", children: [jsxRuntime.jsx(ButtonPrimary, { onClick: () => {
                                    setFlow("left-flow");
                                    updatePickedMonth(pickedMonth - 1);
                                }, title: localization.paginationPrev, children: jsxRuntime.jsx(icons.ArrowLeft, { className: "button-icon" }) }), jsxRuntime.jsx(ButtonPrimary, { onClick: () => {
                                    setFlow("right-flow");
                                    updatePickedMonth(pickedMonth + 1);
                                }, title: localization.paginationNext, children: jsxRuntime.jsx(icons.ArrowRight, { className: "button-icon" }) })] })] }), jsxRuntime.jsx("div", { className: "week-days-wrapper", children: generateWeeksOfTheMonth[0].map((day, index) => (jsxRuntime.jsx("div", { className: "week-day-cell", children: dayjs__default["default"](day).locale(defaultLocale).format("dd") }, `week-day-${index}`))) }), jsxRuntime.jsx("div", { className: "calendar-flow", children: jsxRuntime.jsx("div", { className: cs("calendar-content-wrapper", flow), children: generateWeeksOfTheMonth.map((week, weekIndex) => (jsxRuntime.jsx("div", { className: "calendar-content", children: week.map((day, dayIndex) => (jsxRuntime.jsx("button", { className: cs("calendar-day-cell", assignDateStatus(day), dayjs__default["default"](day).isSame(selectedDate, "date") && "selected"), onClick: () => updatePickedDay(day), children: day.getDate() }, `day-${dayIndex}`))) }, `week-${weekIndex}`))) }, pickedMonth) })] }));
}

function YearPicker() {
    const { pickerDateState: { decade: pickedDecade, year: pickedYear }, updatePickedYear, updatePickedDecadeRange, updateCurrentPicker, } = useDatePickerContext();
    const [flow, setFlow] = React.useState();
    const generateYears = React.useMemo(() => {
        const years = [];
        for (let year = pickedDecade[0]; year <= pickedDecade[1]; year++) {
            years.push(year);
        }
        return years;
    }, [pickedDecade]);
    const { icons, localization } = useDataGridStaticContext();
    function previousRange() {
        setFlow("left-flow");
        updatePickedDecadeRange([pickedDecade[0] - 10, pickedDecade[0]]);
    }
    function nextRange() {
        setFlow("right-flow");
        updatePickedDecadeRange([pickedDecade[1], pickedDecade[1] + 10]);
    }
    function isYearCurrent(year) {
        return pickedYear === year;
    }
    return (jsxRuntime.jsxs("div", { className: "calendar-picker", children: [jsxRuntime.jsxs("div", { className: "arrows-wrapper", children: [jsxRuntime.jsx(ButtonPrimary, { onClick: previousRange, title: localization.paginationPrev, children: jsxRuntime.jsx(icons.ArrowLeft, { className: "button-icon" }) }), jsxRuntime.jsxs("button", { className: "picker-view-update", type: "button", onClick: () => updateCurrentPicker("decade"), children: [pickedDecade[0], " - ", pickedDecade[1]] }), jsxRuntime.jsx(ButtonPrimary, { onClick: nextRange, title: localization.paginationNext, children: jsxRuntime.jsx(icons.ArrowRight, { className: "button-icon" }) })] }), jsxRuntime.jsx("div", { className: cs("calendar-content-wrapper", flow), children: jsxRuntime.jsx("div", { className: "calendar-content", children: generateYears.map((year, index) => (jsxRuntime.jsx("button", { type: "button", onClick: () => {
                            updatePickedYear(year);
                            updateCurrentPicker("month");
                        }, className: cs("calendar-range-cell", isYearCurrent(year) && "current-range"), children: year }, index))) }) }, pickedDecade[0])] }));
}

function DecadePicker() {
    const [flow, setFlow] = React.useState();
    const { pickerDateState: { century: pickedCentury, year: pickedYear }, updatePickedCenturyRange, updatePickedDecadeRange, updateCurrentPicker, } = useDatePickerContext();
    const generateYearRanges = React.useMemo(() => {
        const yearRanges = [];
        for (let index = 1; index <= 10; index++) {
            const rangeStart = pickedCentury[0] + 10 * (index - 1);
            const rangeEnd = pickedCentury[0] + 10 * index;
            yearRanges.push([rangeStart, rangeEnd]);
        }
        return yearRanges;
    }, [pickedCentury]);
    function previousDecade() {
        setFlow("left-flow");
        updatePickedCenturyRange([pickedCentury[0] - 100, pickedCentury[0]]);
    }
    function nextDecade() {
        setFlow("right-flow");
        updatePickedCenturyRange([pickedCentury[1], pickedCentury[1] + 100]);
    }
    const { icons, localization } = useDataGridStaticContext();
    function isRangeCurrent(range) {
        return range[0] < pickedYear && range[1] > pickedYear;
    }
    return (jsxRuntime.jsxs("div", { className: "calendar-picker", children: [jsxRuntime.jsxs("div", { className: "arrows-wrapper", children: [jsxRuntime.jsx(ButtonPrimary, { onClick: previousDecade, title: localization.paginationPrev, children: jsxRuntime.jsx(icons.ArrowLeft, { className: "button-icon" }) }), jsxRuntime.jsxs("button", { className: "picker-view-update", type: "button", children: [pickedCentury[0], " - ", pickedCentury[1]] }), jsxRuntime.jsx(ButtonPrimary, { onClick: nextDecade, title: localization.paginationNext, children: jsxRuntime.jsx(icons.ArrowRight, { className: "button-icon" }) })] }), jsxRuntime.jsx("div", { className: cs("calendar-content-wrapper", flow), children: jsxRuntime.jsx("div", { className: "calendar-content", children: generateYearRanges.map((range, index) => (jsxRuntime.jsxs("button", { type: "button", 
                        // title={`${range[0]}-${range[1]}`}
                        className: cs("calendar-range-cell", isRangeCurrent(range) && "current-range"), onClick: () => {
                            updatePickedDecadeRange(range);
                            updateCurrentPicker("year");
                        }, children: [range[0], "-", range[1]] }, index))) }) }, pickedCentury[0])] }));
}

function MonthPicker() {
    const { pickerDateState: { year: pickedYear }, updatePickedYear, updatePickedMonth, updateCurrentPicker, } = useDatePickerContext();
    const currentDay = React.useMemo(() => dayjs__default["default"](), []);
    const [flow, setFlow] = React.useState();
    const { icons, localization } = useDataGridStaticContext();
    const generateMonths = React.useMemo(() => {
        const monthArray = [];
        for (let index = 0; index < 12; index++) {
            monthArray.push(dayjs__default["default"]().set("year", pickedYear).month(index));
        }
        return monthArray;
    }, [pickedYear]);
    function previousRange() {
        setFlow("left-flow");
        updatePickedYear(pickedYear - 1);
    }
    function nextRange() {
        setFlow("right-flow");
        updatePickedYear(pickedYear + 1);
    }
    function isMonthCurrent(date) {
        return date.month() === currentDay.month() && date.year() === currentDay.year();
    }
    return (jsxRuntime.jsxs("div", { className: "calendar-picker", children: [jsxRuntime.jsxs("div", { className: "arrows-wrapper", children: [jsxRuntime.jsx(ButtonPrimary, { onClick: previousRange, title: localization.paginationPrev, children: jsxRuntime.jsx(icons.ArrowLeft, { className: "button-icon" }) }), jsxRuntime.jsx("button", { className: "picker-view-update", type: "button", onClick: () => updateCurrentPicker("year"), children: pickedYear }), jsxRuntime.jsx(ButtonPrimary, { onClick: nextRange, title: localization.paginationNext, children: jsxRuntime.jsx(icons.ArrowRight, { className: "button-icon" }) })] }), jsxRuntime.jsx("div", { className: cs("calendar-content-wrapper", flow), children: jsxRuntime.jsx("div", { className: "calendar-content", children: generateMonths.map((date, index) => (jsxRuntime.jsx("button", { type: "button", onClick: () => {
                            updatePickedMonth(date.month());
                            updateCurrentPicker("day");
                        }, className: cs("calendar-range-cell", isMonthCurrent(date) && "current-range"), children: date.format("MMM") }, index))) }) }, pickedYear)] }));
}

function Container({ children, className, activeWindowIndex, indexOrder, animationVariant = "slide", ...props }) {
    const [flow, setFlow] = React.useState();
    const [__internalIndex, __setInternalIndex] = React.useState(activeWindowIndex);
    const prevIndex = React.useRef(activeWindowIndex);
    function updateFlow(value) {
        if (flow !== value)
            setFlow(value);
    }
    React.useEffect(() => {
        if (activeWindowIndex === prevIndex.current)
            return;
        if (indexOrder && activeWindowIndex && prevIndex.current) {
            if (indexOrder.indexOf(prevIndex.current) < indexOrder.indexOf(activeWindowIndex))
                updateFlow("in");
            else
                updateFlow("out");
        }
        __setInternalIndex(activeWindowIndex);
        prevIndex.current = activeWindowIndex;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeWindowIndex, indexOrder]);
    return (jsxRuntime.jsx("div", { className: cs("portal-container", className), ...props, children: React__default["default"].Children.map(children, (child) => {
            if (React__default["default"].isValidElement(child) && child.type.displayName === "PortalWindow") {
                return (child.props.index &&
                    __internalIndex === child.props.index &&
                    React__default["default"].cloneElement(child, { ...child.props, "data-id": __internalIndex, animationVariant, animationType: flow }));
            }
            else
                throw new Error("Not a valid element supplied for children.");
        }) }));
}
Container.displayName = "PortalContainer";

function Window({ children, index, className, animationType, animationVariant, onAnimationFinish, ...props }) {
    return (jsxRuntime.jsx(Animations.Manual, { duration: 300, type: animationType, variant: animationVariant, onAnimationFinish: onAnimationFinish, children: jsxRuntime.jsx("div", { id: index, className: cs("portal-window", className), ...props, children: children }) }));
}
Window.displayName = "PortalWindow";

const Portal = {
    Container,
    Window,
};

const portalKeys = {
    century: "century",
    decade: "decade",
    year: "year",
    month: "month",
    day: "day",
};
function DatePicker({ dateAttrs, ...props }, ref) {
    const [currentPicker, setCurrentPicker] = React.useState(portalKeys.day);
    function generateRange(type) {
        return [
            dateAttrs.selectedDate.year() - (dateAttrs.selectedDate.year() % 10),
            dateAttrs.selectedDate.year() - (dateAttrs.selectedDate.year() % 10) + (type === "century" ? 100 : 10),
        ];
    }
    const [pickerDateState, setPickerDateState] = React.useState({
        century: generateRange("century"),
        decade: generateRange("decade"),
        year: dateAttrs.selectedDate.year(),
        month: dateAttrs.selectedDate.month(),
    });
    const updatePickedCenturyRange = (value) => setPickerDateState((prev) => ({ ...prev, century: value }));
    const updatePickedDecadeRange = (value) => setPickerDateState((prev) => ({ ...prev, decade: value }));
    const updatePickedYear = (value) => setPickerDateState((prev) => ({ ...prev, year: value }));
    const updatePickedMonth = (value) => {
        if (value < 0) {
            const year = pickerDateState.year - 1;
            const rangeStart = year - (year % 10);
            setPickerDateState({
                month: value + 12,
                year: year,
                century: [rangeStart, rangeStart + 100],
                decade: [rangeStart, rangeStart + 10],
            });
        }
        else if (value > 11) {
            const year = pickerDateState.year + 1;
            const rangeStart = year - (year % 10);
            setPickerDateState({
                month: value - 12,
                year: year,
                century: [rangeStart, rangeStart + 100],
                decade: [rangeStart, rangeStart + 10],
            });
        }
        else
            setPickerDateState((prev) => ({
                ...prev,
                month: value,
            }));
    };
    const updatePickedDay = (value) => {
        dateAttrs.setSelectedDate(() => dayjs__default["default"](value));
    };
    function updateCurrentPicker(key) {
        setCurrentPicker(key);
    }
    function updateDateEntries() {
        setPickerDateState({
            century: generateRange("century"),
            decade: generateRange("decade"),
            year: dateAttrs.selectedDate.year(),
            month: dateAttrs.selectedDate.month(),
        });
    }
    React.useEffect(() => {
        updateDateEntries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateAttrs.selectedDate]);
    return (jsxRuntime.jsx(DatePickerContext.Provider, { value: {
            updateCurrentPicker,
            updatePickedCenturyRange,
            updatePickedDecadeRange,
            updatePickedYear,
            updatePickedMonth,
            updatePickedDay,
            pickerDateState,
        }, children: jsxRuntime.jsx("div", { className: "data-grid-dp main-wrapper", ref: ref, ...props, children: jsxRuntime.jsxs(Portal.Container, { animationVariant: "zoom", activeWindowIndex: currentPicker, indexOrder: ["century", "decade", "year", "month", "day"], children: [jsxRuntime.jsx(Portal.Window, { index: portalKeys.decade, children: jsxRuntime.jsx(DecadePicker, {}) }), jsxRuntime.jsx(Portal.Window, { index: portalKeys.year, children: jsxRuntime.jsx(YearPicker, {}) }), jsxRuntime.jsx(Portal.Window, { index: portalKeys.month, children: jsxRuntime.jsx(MonthPicker, {}) }), jsxRuntime.jsx(Portal.Window, { index: portalKeys.day, children: jsxRuntime.jsx(DayPicker, { selectedDate: dateAttrs.selectedDate }) })] }) }) }));
}
var Picker = React__default["default"].forwardRef(DatePicker);

const ConstProps = {
    defaultPaginationCurrentPage: 1,
    defaultPaginationPageSize: 10,
    defaultPreRenderedRows: 5,
    defaultLocale: "en",
    defaultActiveFn: "contains",
    defaultActiveDateFn: "equals",
    defaultRangeFns: ["between", "betweenInclusive"],
    defaultFnsNoFilter: ["empty", "notEmpty"],
};
const DefaultDateDelimiter = "/";
const DefaultDateTemplate = `DD${DefaultDateDelimiter}MM${DefaultDateDelimiter}YYYY`;

function dayjsFormatted$1(date) {
    return dayjs__default["default"](date, DefaultDateTemplate);
}
const DateInput = ({ onChange, defaultValue, locale, ...props }) => {
    React.useEffect(() => {
        dayjs__default["default"].extend(customParseFormat__default["default"]);
    }, []);
    const [inputValue, setInputValue] = React.useState(defaultValue
        ? typeof defaultValue === "string"
            ? defaultValue
            : defaultValue.format(DefaultDateTemplate)
        : StringExtensions.Empty);
    const [pickerVisible, setPickerVisible] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    const inputCard = React.useRef(null);
    function matchInput(value) {
        const matchValue = value.replace(/\D/g, StringExtensions.Empty).match(/(\d{0,2})(\d{0,2})(\d{0,4})/);
        if (matchValue) {
            const valueToAssign = !matchValue[2]
                ? matchValue[1]
                : `${matchValue[1]}${DefaultDateDelimiter}${matchValue[2]}${`${matchValue[3] ? `${DefaultDateDelimiter}${matchValue[3]}` : ""}`}`;
            return valueToAssign;
        }
    }
    const handleChange = () => {
        if (inputCard.current) {
            const valueToAssign = matchInput(inputCard.current.value);
            if (valueToAssign !== null && valueToAssign !== undefined) {
                setInputValue(valueToAssign);
                if (valueToAssign.length === 0 && inputValue) {
                    onChange?.(null);
                }
                else if (valueToAssign.length === DefaultDateTemplate.length) {
                    const parsedDate = validateDate(valueToAssign);
                    if (parsedDate)
                        onChange?.(parsedDate);
                }
            }
        }
    };
    const handleBlur = () => {
        if (!(inputValue.length === 0 || (inputValue.length === DefaultDateTemplate.length && validateDate(inputValue)))) {
            setInputValue(StringExtensions.Empty);
            onChange?.(null);
        }
        setFocused(false);
    };
    const handleChangeDate = (fn) => {
        setInputValue((prev) => {
            const dateValue = prev.length > 0 ? dayjsFormatted$1(prev) : dayjs__default["default"]();
            const res = fn(dateValue);
            return res.format(DefaultDateTemplate);
        });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => handleChange(), [inputValue]);
    const validateDate = (val) => {
        const parsedDate = dayjs__default["default"](val, DefaultDateTemplate, true);
        if (parsedDate.isValid())
            return parsedDate;
        return null;
    };
    const dayjsDate = React.useMemo(() => {
        if (inputValue.length === DefaultDateTemplate.length && validateDate(inputValue))
            return dayjsFormatted$1(inputValue);
        return dayjs__default["default"]();
    }, [inputValue]);
    const pickerRef = React.useRef(null);
    useDetectOutsideClick(pickerRef, () => setPickerVisible(false));
    const { dimensions, icons } = useDataGridStaticContext();
    return (jsxRuntime.jsxs("div", { className: cs("input-wrapper ", "date-picker", focused && "focused"), children: [jsxRuntime.jsx("input", { className: "basic-input", type: "text", ref: inputCard, value: inputValue, onFocus: () => setFocused(true), onBlur: handleBlur, ...props, onChange: handleChange }), jsxRuntime.jsx("button", { title: "Picker", className: cs("util-button", pickerVisible && "active"), onClick: () => setPickerVisible((prev) => !prev), children: jsxRuntime.jsx(icons.Date, { className: "input-icon" }) }), jsxRuntime.jsx(Animations.Auto, { className: "data-grid-dp main-wrapper", visible: pickerVisible, children: jsxRuntime.jsx(Picker, { ref: pickerRef, dateAttrs: {
                        setSelectedDate: handleChangeDate,
                        selectedDate: dayjsDate,
                    }, style: {
                        top: dimensions.defaultHeaderFilterHeight - 15,
                    } }) })] }));
};

function Input({ defaultValue, onChange, disableIcon, ...props }) {
    const [currentInputValue, setCurrentInputValue] = React.useState(defaultValue ?? StringExtensions.Empty);
    const [focused, setFocused] = React.useState(false);
    const inputUpdateTimeout = React.useRef(null);
    const { icons } = useDataGridStaticContext();
    function clearUpdateTimeout() {
        if (inputUpdateTimeout.current)
            clearTimeout(inputUpdateTimeout.current);
    }
    function handleInputChange(e) {
        setCurrentInputValue(e.target.value);
        clearUpdateTimeout();
        inputUpdateTimeout.current = setTimeout(() => onChange?.(e.target.value), 600);
    }
    React.useEffect(() => {
        return () => {
            clearUpdateTimeout();
        };
    }, []);
    return (jsxRuntime.jsxs("div", { className: cs("input-wrapper", focused && "focused"), children: [disableIcon === false && (jsxRuntime.jsx("div", { className: "input-icon-wrapper", children: jsxRuntime.jsx(icons.Search, { className: "input-icon" }) })), jsxRuntime.jsx("input", { onFocus: (e) => setFocused(true), onBlur: () => setFocused(false), onChange: handleInputChange, value: currentInputValue, className: "basic-input", ...props })] }));
}

function FilterMenu$1({ filterProps: { getColumnFilterValue, progressReporters, updateFilterValue, fetchFilters, multiple, prefetchedFilters, render, renderCustomInput, filterInputProps, type, isRangeInput, disableInputIcon, }, columnKey, }) {
    const { localization, defaultLocale } = useDataGridStaticContext();
    function handleInputChange(value, index) {
        if (index !== undefined) {
            const currentFilterValue = getColumnFilterValue(columnKey);
            let filterValueToAssign = Array.isArray(currentFilterValue) ? [...currentFilterValue] : [currentFilterValue];
            filterValueToAssign[index] = value;
            updateFilterValue?.(columnKey, filterValueToAssign);
        }
        else {
            updateFilterValue?.(columnKey, value);
        }
    }
    const renderOptions = React.useMemo(() => {
        if (render) {
            return prefetchedFilters?.[columnKey]?.map((x) => ({
                children: render?.(x),
                value: x,
            }));
        }
        return prefetchedFilters?.[columnKey]?.map((x) => ({
            children: x,
            value: x,
        }));
    }, [columnKey, prefetchedFilters, render]);
    const renderInput = (variant, rangeIndex) => {
        const rangeInputProps = {
            ...filterInputProps?.(columnKey),
            onChange: (val) => handleInputChange(val, rangeIndex),
            defaultValue: getColumnFilterValue(columnKey)?.[rangeIndex ?? 0],
        };
        const basicInputProps = {
            ...filterInputProps?.(columnKey),
            onChange: handleInputChange,
            defaultValue: getColumnFilterValue(columnKey),
        };
        const renderProps = rangeIndex !== undefined ? rangeInputProps : basicInputProps;
        switch (variant) {
            case "date":
                return jsxRuntime.jsx(DateInput, { locale: defaultLocale, placeholder: localization.filterDatePlaceholder, ...renderProps });
            case "number":
                return (jsxRuntime.jsx(Input, { type: "number", disableIcon: disableInputIcon, placeholder: localization.filterInputPlaceholder, ...renderProps }));
            case "select":
                return (jsxRuntime.jsx(Select, { loading: progressReporters?.has("filter-fetch"), value: getColumnFilterValue(columnKey) ?? [], multiple: multiple, options: renderOptions ?? [], clearable: true, onChange: (val) => updateFilterValue?.(columnKey, val), onOpen: () => fetchFilters?.(columnKey), attachmentType: "fixed" }));
            default:
                return jsxRuntime.jsx(Input, { disableIcon: disableInputIcon, placeholder: localization.filterInputPlaceholder, ...renderProps });
        }
    };
    return (jsxRuntime.jsx("div", { className: "filter-menu", children: renderCustomInput ? (isRangeInput ? (jsxRuntime.jsxs("div", { className: "range-input", children: [renderCustomInput(updateFilterValue, getColumnFilterValue(columnKey), 0), renderCustomInput(updateFilterValue, getColumnFilterValue(columnKey), 1)] })) : (renderCustomInput(updateFilterValue, getColumnFilterValue(columnKey), 0))) : isRangeInput ? (jsxRuntime.jsx(Animations.Auto, { children: jsxRuntime.jsxs("div", { className: "range-input", children: [renderInput(type, 0), renderInput(type, 1)] }) })) : (renderInput(type)) }));
}

function ColumnHeaderFilter({ filterProps, columnKey, ...props }) {
    return (jsxRuntime.jsx("div", { className: "column-header-filter", ...props, children: filterProps && jsxRuntime.jsx(FilterMenu$1, { columnKey: columnKey, filterProps: filterProps }) }));
}

function ColumnHeaderFilterWrapper({ filterFnsProps, children, columnKey, ...props }) {
    const { icons, localization } = useDataGridStaticContext();
    return (jsxRuntime.jsxs("div", { className: "column-header-filter-wrapper", ...props, children: [filterFnsProps && (jsxRuntime.jsx("button", { className: cs("action-button visible", "filter-functions-menu-button", filterFnsProps.isFilterFnActive(columnKey, filterFnsProps.activeFilterMenuKey) && "active"), title: localization.filterFunctions, type: "button", onClick: (e) => filterFnsProps?.displayFilterFnsMenu({
                    data: {},
                    position: {
                        xAxis: e.clientX + 10,
                        yAxis: e.clientY + 30,
                    },
                    identifier: columnKey,
                }), children: jsxRuntime.jsx(icons.FilterMenu, { className: "action-icon" }) })), children] }));
}

function ColumnHeaderMenuTool(props) {
    return jsxRuntime.jsx("div", { className: "column-header-menu-tool", ...props });
}

function ColumnHeaderUnlocked(props) {
    return jsxRuntime.jsx("div", { className: "column-header-unlocked", ...props });
}

/**
 * Animation-frame based function that reduces number of function calls when UI event occurs.
 * @param callback A callback function to execute.
 * @returns Throttled function that can be cancelled.
 */
function animationThrottle(callback) {
    let requestId = null;
    let cbArgs;
    const later = (context) => () => {
        requestId = null;
        callback.apply(context, cbArgs);
    };
    const throttled = function (...args) {
        cbArgs = args;
        if (requestId === null) {
            requestId = requestAnimationFrame(later(this));
        }
    };
    throttled.cancel = () => {
        if (requestId !== null) {
            cancelAnimationFrame(requestId);
            requestId = null;
        }
    };
    return throttled;
}

/* eslint-disable react-hooks/exhaustive-deps */
const id = (position) => position;
/**
 * Another resizing hook to adjust width and also drag element on x-axis.
 * Calculation is carried out by the tools to whether set the width or not.
 * Performant solution, based on movementX.
 * Does not cause stutter.
 */
// complex logic should be a hook, not a component
const useDraggable = ({ onDrag = id, onDragEnd } = {}) => {
    const initialState = { xAxis: 0 };
    // this state doesn't change often, so it's fine
    const [pressed, setPressed] = React.useState(false);
    // do not store position in useState! even if you useEffect on
    // it and update `transform` CSS property, React still rerenders
    // on every state change, and it LAGS
    const position = React.useRef(initialState);
    // we've moved the code into the hook, and it would be weird to
    // return `ref` and `handleMouseDown` to be set on the same element
    // why not just do the job on our own here and use a function-ref
    // to subscribe to `mousedown` too? it would go like this:
    const ref = React.useRef(null);
    const unsubscribe = React.useRef();
    const legacyRef = React.useCallback((elem) => {
        ref.current = elem;
        if (unsubscribe.current) {
            unsubscribe.current();
        }
        if (elem) {
            elem.addEventListener("mousedown", handleMouseDown);
            unsubscribe.current = () => {
                elem.removeEventListener("mousedown", handleMouseDown);
            };
        }
    }, []);
    // Recalculate element's relative position and update it only when resizing event starts.
    const currentOffset = React.useMemo(() => ref.current?.getBoundingClientRect().left ?? 0, [pressed]);
    // handlers must be wrapped into `useCallback`. even though
    // resubscribing to `mousedown` on every tick is quite cheap
    // due to React's event system, `handleMouseDown` might be used
    // in `deps` argument of another hook, where it would really matter.
    // as you never know where return values of your hook might end up,
    // it's just generally a good idea to ALWAYS use `useCallback`
    const handleMouseDown = React.useCallback(() => setPressed(true), []);
    React.useEffect(() => {
        // subscribe to mousemove only when pressed, otherwise it will lag
        // even when you're not dragging
        if (!pressed)
            return;
        // Updating the page without any throttling is a bad idea
        // requestAnimationFrame-based throttle would probably be fine,
        // but be aware that naive implementation might make element
        // lag 1 frame behind cursor, and it will appear to be lagging
        // even at 60 FPS
        const handleMouseMove = animationThrottle((event) => {
            // needed for TypeScript anyway
            if (!ref.current || !position.current)
                return;
            const pos = position.current;
            // it's important to save it into variable here,
            // otherwise we might capture reference to an element
            // that was long gone. not really sure what's correct
            // behavior for a case when you've been scrolling, and
            // the target element was replaced. probably some formulae
            // needed to handle that case. // TODO
            const elem = ref.current;
            position.current = onDrag({
                // Previous implementation:
                /** xAxis: event.movementX, */
                // MovementX is a better approach (and API is newer) for listening to
                // mouse events. However, DPI and scaling variety across devices
                // can cause loss of tracking of actual mouse location on the screen.
                xAxis: event.clientX - currentOffset,
            });
            elem.style.transform = `translate3d(${pos.xAxis}px, 0px,0px)`;
        });
        const resetPosition = () => {
            position.current = initialState;
            const elem = ref.current;
            if (elem)
                elem.style.transform = `translate3d(0px, 0px,0px)`;
        };
        const handleMouseUp = () => {
            setPressed(false);
            onDragEnd?.(position.current);
            resetPosition();
        };
        // subscribe to mousemove and mouseup on document, otherwise you
        // can escape bounds of element while dragging and get stuck
        // dragging it forever
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        // if `onDrag` wasn't defined with `useCallback`, we'd have to
        // resubscribe to 2 DOM events here.
    }, [pressed, onDrag, onDragEnd]);
    // actually it makes sense to return an array only when
    // you expect that on the caller side all of the fields
    // will be usually renamed
    return [legacyRef, pressed];
    // > seems the best of them all to me
    // this code doesn't look pretty anymore, huh?
};

function ColumnResizer({ className, updateColumnWidth, updateColumnResizingStatus, containerHeight, columnWidth, columnKey, ...props }) {
    const { dimensions } = useDataGridStaticContext();
    const [ref, pressed] = useDraggable({
        onDragEnd: onDragEnd,
        onDrag: onDrag,
    });
    const [outOfBounds, setOutOfBounds] = React.useState(false);
    function updateOutOfBounds(val) {
        if (outOfBounds !== val)
            setOutOfBounds(val);
    }
    const checkResize = React.useCallback((xAxis) => {
        const width = xAxis + columnWidth;
        if (width < dimensions.minColumnResizeWidth || width > dimensions.maxColumnResizeWidth)
            updateOutOfBounds(true);
        else if (width >= dimensions.minColumnResizeWidth && width <= dimensions.maxColumnResizeWidth)
            updateOutOfBounds(false);
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [outOfBounds, columnWidth]);
    function onDragEnd(position) {
        updateColumnWidth(columnKey, position.xAxis);
        setOutOfBounds(false);
    }
    function onDrag(position) {
        checkResize(position.xAxis);
        return position;
    }
    React.useEffect(() => {
        updateColumnResizingStatus(pressed);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pressed]);
    return (jsxRuntime.jsx("div", { className: cs("column-resizer", className), ...props, children: jsxRuntime.jsx("div", { ref: ref, className: cs("column-resize-handle", pressed && "active", outOfBounds && "out-of-bounds"), style: {
                height: pressed ? `calc(100% + ${(containerHeight ?? 0) - dimensions.defaultScrollbarWidth}px)` : undefined,
            } }) }));
}

function ColumnHeader({ resizingProps, columnProps, draggingProps, filterProps, filterFnsProps, children, style, className, toolBoxes, containerHeight, isFilterMenuVisible, ...props }) {
    const { dimensions } = useDataGridStaticContext();
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, active } = sortable.useSortable({
        id: columnProps.key,
    });
    const draggableProps = draggingProps?.isDraggable
        ? {
            ref: setActivatorNodeRef,
            ...attributes,
            ...listeners,
        }
        : undefined;
    function referenceHandler(ref) {
        // if (typeof resizingRef === "function") {
        //   resizingRef(ref);
        // } else if (resizingRef) {
        //   resizingRef.current = ref;
        // }
        setNodeRef(ref);
    }
    return (jsxRuntime.jsxs("div", { ref: referenceHandler, className: cs(className, "column-header", active?.id === columnProps.key && "dragging", draggingProps?.isDraggable && "draggable"), style: { transform: utilities.CSS.Transform.toString(transform), transition, ...style }, ...props, children: [jsxRuntime.jsxs(ColumnHeaderUnlocked, { style: {
                    minHeight: dimensions.defaultHeadRowHeight,
                    maxHeight: dimensions.defaultHeadRowHeight,
                }, children: [jsxRuntime.jsx(ColumnHeaderContent$1, { ...draggableProps, children: children }), toolBoxes && jsxRuntime.jsx(ColumnHeaderMenuTool, { children: toolBoxes })] }), isFilterMenuVisible && (jsxRuntime.jsx(ColumnHeaderFilterWrapper, { style: {
                    height: dimensions.defaultHeaderFilterHeight,
                }, filterFnsProps: filterFnsProps, columnKey: columnProps.key, children: jsxRuntime.jsx(ColumnHeaderFilter, { columnKey: columnProps.key, filterProps: filterProps }) })), resizingProps?.isResizable && (jsxRuntime.jsx(ColumnResizer, { columnWidth: columnProps.width, updateColumnWidth: resizingProps.updateColumnWidth, columnKey: columnProps.key, containerHeight: containerHeight, updateColumnResizingStatus: resizingProps.updateColumnResizingStatus }))] }));
}

function Header(props, ref) {
    return jsxRuntime.jsx("div", { className: "header", ...props, ref: ref });
}
var Header$1 = React__default["default"].forwardRef(Header);

const dropAnimationConfig = {
    sideEffects: core.defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: "0.4",
            },
        },
    }),
};
function SortableOverlay({ children }) {
    return reactDom.createPortal(jsxRuntime.jsx(core.DragOverlay, { dropAnimation: dropAnimationConfig, children: children }), document.getElementById("root"));
}

function HeaderOrdering({ columnOrder, columns, setColumnOrder, draggingEnabled, onColumnDragged, children, }) {
    const [active, setActive] = React.useState(null);
    const activeItem = React.useMemo(() => columns.find((item) => item.key === active?.id), [active?.id, columns]);
    const sensors = core.useSensors(core.useSensor(core.PointerSensor));
    function handleDragEnd(event) {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = columnOrder.indexOf(active.id);
            const newIndex = columnOrder.indexOf(over?.id);
            const newArray = sortable.arrayMove(columnOrder, oldIndex, newIndex);
            setColumnOrder(newArray);
            onColumnDragged?.(newArray);
        }
        setActive(null);
    }
    return (jsxRuntime.jsxs(core.DndContext, { sensors: sensors, collisionDetection: core.closestCenter, onDragEnd: handleDragEnd, onDragStart: ({ active }) => setActive(active), onDragCancel: () => setActive(null), children: [jsxRuntime.jsx(sortable.SortableContext, { disabled: !draggingEnabled, items: columnOrder.map((x) => ({ id: x })), strategy: sortable.horizontalListSortingStrategy, children: children }), jsxRuntime.jsx(SortableOverlay, { children: activeItem && (jsxRuntime.jsx(ColumnHeader, { style: { height: "100%", fontWeight: 700 }, className: "column-header-dnd-overlay", columnProps: activeItem, children: activeItem.headerRender ? activeItem.headerRender() : activeItem.title })) })] }));
}

function HeaderWrapperFill(props) {
    return (jsxRuntime.jsx("div", { className: "header-wrapper-fill", ...props, children: jsxRuntime.jsx("div", { className: "header-wrapper-fill-filters" }) }));
}

function LockedEndWrapper({ type, ...props }, ref) {
    return jsxRuntime.jsx("div", { ref: ref, className: cs("locked-end-wrapper", "locked", "type-" + type), ...props });
}
var LockedEndWrapper$1 = React__default["default"].forwardRef(LockedEndWrapper);

function LockedStartWrapper({ type, ...props }, ref) {
    return jsxRuntime.jsx("div", { ref: ref, className: cs("locked-start-wrapper", "locked", "type-" + type), ...props });
}
var LockedStartWrapper$1 = React__default["default"].forwardRef(LockedStartWrapper);

function CollapseAllButton({ isExpanded, ...props }) {
    const { icons, localization } = useDataGridStaticContext();
    return (jsxRuntime.jsx("button", { title: localization.rowShrinkAllTitle, type: "button", className: cs("data-grid-actions-menu-constructor-button collapse-all-button"), ...props, children: jsxRuntime.jsxs("span", { className: "icon-wrapper", children: [jsxRuntime.jsx(icons.ChevronUp, { className: "data-grid-actions-menu-constructor-icon" }), jsxRuntime.jsx(icons.ChevronUp, { className: "data-grid-actions-menu-constructor-icon" })] }) }));
}

function GroupedColumnsWrapper({ groupedColumnHeaders, children }) {
    const { dimensions } = useDataGridStaticContext();
    return groupedColumnHeaders ? (jsxRuntime.jsxs("div", { className: "grouped-columns-wrapper", children: [jsxRuntime.jsx("div", { className: "grouped-headers", children: groupedColumnHeaders.map((groupColHeader, index) => (jsxRuntime.jsx("div", { style: {
                        width: groupColHeader.width,
                        height: dimensions.defaultGroupedColumnHeight,
                    }, className: cs("grouped-column-header", groupColHeader.title && "existing"), children: jsxRuntime.jsx("div", { className: "grouped-column-header-content", children: groupColHeader.title }) }, index))) }), jsxRuntime.jsx("div", { className: "grouped-columns-row", children: children })] })) : children;
}

function HeaderWrapper({ columnsToRender, totalColumnsWidth, verticalScrollbarWidth, pinnedColumns, gridTools, dataTools, gridProps, onColumnHeaderFocus, headerActionsMenu, filterFnsMenu, containerHeight, headerWrapperRef, groupedColumnHeaders, ...props }) {
    const headerRef = React.useRef(null);
    const lockedStartWrapperRef = React.useRef(null);
    const lockedEndWrapperRef = React.useRef(null);
    function updateTransform(ref, scrollValue) {
        ref.current.style.transform = `translate3d(${scrollValue}px, 0px, 0px)`;
    }
    React.useImperativeHandle(headerWrapperRef, () => ({
        updateHeaderTransform: (scrollValue, verticalScroll) => {
            headerRef.current.style.transform = `translate3d(${-scrollValue}px, 0px, 0px)`;
            if (lockedStartWrapperRef.current)
                lockedStartWrapperRef.current.style.transform = `translate3d(${scrollValue}px, 0px, 0px)`;
            if (lockedEndWrapperRef.current)
                lockedEndWrapperRef.current.style.transform = `translate3d(${scrollValue - verticalScroll}px, 0px, 0px)`;
        },
        updateLockedStartTransform: (val) => updateTransform(lockedStartWrapperRef, val),
        updateLockedEndTransform: (val) => updateTransform(lockedEndWrapperRef, val),
    }), []);
    const createCheckBox = () => {
        function updateSelection(e) {
            if (dataTools.dataWithoutPagination) {
                const selectedRows = !e.target.checked ? [] : dataTools.dataWithoutPagination.map((x) => x[gridProps.uniqueRowKey]);
                gridTools.updateSelectedRowsMultiple(selectedRows);
                gridProps.rowSelection?.onChangePrimarySelection?.(selectedRows, e.target.checked);
            }
        }
        const isChecked = dataTools.currentPagination.dataCount !== 0 &&
            (!!gridProps.serverSide?.enabled
                ? dataTools.data?.length === gridTools.selectedRows.size
                : gridProps.data?.length === gridTools.selectedRows.size);
        return jsxRuntime.jsx(Checkbox, { onChange: updateSelection, checked: isChecked });
    };
    const createHeaderActionMenuButton = (key) => gridTools.isHeaderMenuActive ? (jsxRuntime.jsx(MenuButton, { onClick: (e) => headerActionsMenu.displayHeaderActionsMenu({
            data: { id: key },
            position: {
                xAxis: e.currentTarget.getBoundingClientRect().x,
                yAxis: e.currentTarget.getBoundingClientRect().y + 20,
            },
            identifier: key,
        }) }, `${key}_menu`)) : undefined;
    const createSortButton = (sort, key) => sort ? (jsxRuntime.jsx(SortButton, { sortingDirection: dataTools.currentSorting?.key === key ? dataTools.currentSorting?.direction : undefined, onClick: () => dataTools.updateCurrentSorting(key) }, `${key}_sort`)) : undefined;
    const createExpandButton = () => jsxRuntime.jsx(CollapseAllButton, { onClick: () => gridTools.closeExpandedRows() });
    function renderColumnHeader(col, index) {
        const { key, title, type, filteringProps, filter, sort, headerAlignment, headerRender, pinned } = col;
        const isColumnDefinitionUtil = type !== "data";
        let children;
        let tableHeadCellProps;
        switch (type) {
            case "data":
                const isFilterFnActive = gridTools.isFilterFnIsActive(key);
                children = title;
                tableHeadCellProps = {
                    filterFnsProps: isFilterFnActive
                        ? {
                            ...filterFnsMenu,
                            getColumnFilterFn: dataTools.getColumnFilterFn,
                            isFilterFnActive: dataTools.isFilterFnActive,
                        }
                        : undefined,
                    filterProps: filter
                        ? {
                            updateFilterValue: dataTools.updateCurrentFilterValue,
                            getColumnFilterValue: dataTools.getColumnFilterValue,
                            fetchFilters: dataTools.pipeFetchedFilters,
                            prefetchedFilters: dataTools.prefetchedFilters,
                            type: filteringProps?.type,
                            render: filteringProps?.render,
                            multiple: filteringProps?.multipleSelection,
                            progressReporters: dataTools.progressReporters,
                            filterInputProps: filteringProps?.inputProps,
                            renderCustomInput: filteringProps?.renderCustomInput,
                            isRangeInput: dataTools.isRangeFilterFn(dataTools.getColumnFilterFn(key).current),
                            disableInputIcon: isFilterFnActive,
                        }
                        : undefined,
                    toolBoxes: [createSortButton(sort, key), createHeaderActionMenuButton(key)],
                };
                break;
            case "expand":
                children = createExpandButton();
                break;
            case "select":
                children = createCheckBox();
                break;
        }
        return React__default["default"].createElement((ColumnHeader), {
            columnProps: col,
            resizingProps: {
                isResizable: !isColumnDefinitionUtil && gridTools.isColumnIsResizable(key),
                updateColumnWidth: gridTools.updateColumnWidth,
                updateColumnResizingStatus: gridTools.updateColumnResizingStatus,
            },
            draggingProps: {
                isDraggable: !pinned && !isColumnDefinitionUtil && !!gridTools.isColumnIsDraggable(key),
            },
            tabIndex: !isColumnDefinitionUtil ? index : undefined,
            key: col.key + `__${dataTools.filterResetKey}`,
            onFocus: (e) => onColumnHeaderFocus(e, col.width),
            style: {
                width: col.width,
                minWidth: col.width,
                maxWidth: col.width,
            },
            className: cs(isColumnDefinitionUtil && "tools", gridTools.isHeaderIsActive(col.key) && "hover-active", headerAlignment && `align-${headerAlignment}`),
            containerHeight: containerHeight,
            isFilterMenuVisible: gridTools.isFilterMenuVisible && filter,
            ...(!isColumnDefinitionUtil && tableHeadCellProps),
        }, headerRender ? headerRender() : children);
    }
    return (jsxRuntime.jsxs("div", { className: "header-wrapper", ...props, children: [jsxRuntime.jsxs(Header$1, { ref: headerRef, style: { minWidth: totalColumnsWidth }, children: [!!pinnedColumns?.leftWidth && (jsxRuntime.jsx(LockedStartWrapper$1, { type: "header", ref: lockedStartWrapperRef, children: jsxRuntime.jsx(GroupedColumnsWrapper, { groupedColumnHeaders: groupedColumnHeaders.leftLockedGroupedColumnHeaders, children: pinnedColumns?.leftColumns.map((col, index) => renderColumnHeader(col, index + 1)) }) })), jsxRuntime.jsx(GroupedColumnsWrapper, { groupedColumnHeaders: groupedColumnHeaders.unlockedGroupedColumnHeaders, children: jsxRuntime.jsx(HeaderOrdering, { columnOrder: gridTools.columnOrder, columns: columnsToRender.columns, setColumnOrder: gridTools.updateColumnOrder, onColumnDragged: gridProps.draggableColumns?.onColumnDragged, draggingEnabled: gridProps.draggableColumns?.enabled === true, children: columnsToRender.columns.map((col, index) => renderColumnHeader(col, index + (pinnedColumns?.leftColumns.length ?? 0) + 1)) }) }), !!pinnedColumns?.rightWidth && (jsxRuntime.jsx(LockedEndWrapper$1, { type: "header", ref: lockedEndWrapperRef, children: jsxRuntime.jsx(GroupedColumnsWrapper, { groupedColumnHeaders: groupedColumnHeaders.rightLockedGroupedColumnHeaders, children: pinnedColumns?.rightColumns.map((col, index) => renderColumnHeader(col, index + ((pinnedColumns?.leftColumns.length ?? 0) + columnsToRender.columns.length) + 1)) }) }))] }), !!pinnedColumns?.rightWidth && (jsxRuntime.jsx(HeaderWrapperFill, { style: {
                    width: verticalScrollbarWidth,
                } }))] }));
}

function List(props) {
    return jsxRuntime.jsx("div", { className: "list", ...props });
}

function ScrollContainer(props) {
    return (jsxRuntime.jsx(Animations.Auto, { children: jsxRuntime.jsx("div", { className: "scroll-container", ...props }) }));
}

function Scroller({ minWidth, minHeight, emptySpacerVisible, verticalScrollbarWidth, className, ...props }, ref) {
    const { virtualizationEnabled } = useDataGridStaticContext();
    return (jsxRuntime.jsxs("div", { className: cs("scroller", className), ref: ref, ...props, children: [emptySpacerVisible && (jsxRuntime.jsx("div", { className: "empty-spacer", style: {
                    minWidth: minWidth + verticalScrollbarWidth,
                } })), jsxRuntime.jsx("div", { className: "sticky-scroller", children: jsxRuntime.jsxs("div", { style: {
                        position: "absolute",
                        minWidth: "100%",
                        direction: "ltr",
                    }, children: [props.children, virtualizationEnabled && (jsxRuntime.jsx("div", { style: {
                                minHeight: minHeight,
                                minWidth: minWidth,
                            } }))] }) })] }));
}
var Scroller$1 = React__default["default"].forwardRef(Scroller);

function VirtualList({ rows, rowHeight, expandRowKeys, renderElement, containerHeight, expandPanelHeight, topScrollPosition, isDynamicExpandActive, getRowExpansionHeight, preRenderedRowCount = ConstProps.defaultPreRenderedRows, }) {
    const expandPanelHeightToDeduct = React__default["default"].useMemo(() => {
        if (!expandRowKeys.size)
            return 0;
        if (isDynamicExpandActive) {
            let totalHeight = 0;
            expandRowKeys.forEach((exp) => {
                if (exp < Math.floor(topScrollPosition / rowHeight))
                    totalHeight += getRowExpansionHeight(exp) ?? 0;
            });
            return totalHeight;
        }
        else
            return Array.from(expandRowKeys).filter((x) => x < Math.floor(topScrollPosition / rowHeight)).length * expandPanelHeight;
    }, [expandPanelHeight, expandRowKeys, getRowExpansionHeight, isDynamicExpandActive, rowHeight, topScrollPosition]);
    const extractVirtualizedData = React.useCallback((start, end) => {
        const virtualizedRows = [];
        for (let index = start; index <= end; index++) {
            if (rows[index] !== undefined)
                virtualizedRows.push(renderElement(rows[index], {
                    position: "absolute",
                    top: index * rowHeight + (getRowExpansionHeight(rows[index].__virtual_row_index) ?? 0),
                }));
        }
        return virtualizedRows;
    }, [getRowExpansionHeight, renderElement, rowHeight, rows]);
    return React__default["default"].useMemo(() => {
        const startIndex = Math.max(Math.floor((topScrollPosition - expandPanelHeightToDeduct) / rowHeight) - preRenderedRowCount, 0);
        const endIndex = Math.min(Math.ceil((topScrollPosition + containerHeight) / rowHeight - 1) + preRenderedRowCount, rows.length - 1);
        return extractVirtualizedData(startIndex, endIndex + 3);
    }, [
        topScrollPosition,
        expandPanelHeightToDeduct,
        rowHeight,
        preRenderedRowCount,
        containerHeight,
        rows.length,
        extractVirtualizedData,
    ]);
}

function ActionsMenuButton({ className, ...props }) {
    const { icons, localization } = useDataGridStaticContext();
    return (jsxRuntime.jsx("button", { type: "button", title: localization.menuTitle, className: cs("data-grid-actions-menu-constructor-button", className), ...props, children: jsxRuntime.jsx(icons.MultiDot, { className: "data-grid-actions-menu-constructor-icon" }) }));
}

function ExpandButton({ isExpanded, ...props }) {
    const { icons } = useDataGridStaticContext();
    return (jsxRuntime.jsx("button", { type: "button", className: cs("data-grid-actions-menu-constructor-button expand-button", isExpanded && "active"), ...props, children: jsxRuntime.jsx(icons.ChevronDown, { className: "expand-icon data-grid-actions-menu-constructor-icon" }) }));
}

function Cell({ className, ...props }) {
    return jsxRuntime.jsx("div", { className: cs("cell", className), ...props });
}

function CellContent({ tooltipProps, ...props }) {
    return (jsxRuntime.jsx("div", { className: "cell-content", title: tooltipProps?.enabled && typeof props.children === "string" ? props.children : undefined, ...props }));
}

function RowContainer(props) {
    return jsxRuntime.jsx("div", { className: "row-container", ...props });
}

const ViewContainer = ({ gridProps, dataTools, gridTools, containerHeight, topScrollPosition, columnsToRender, pinnedColumns, totalColumnsWidth, containerWidth, displayActionsMenu, getRowExpansionHeight, viewRef, indexedData, ...props }) => {
    const { dimensions, localization } = useDataGridStaticContext();
    function extractBasicCellProps(col, dat) {
        return {
            colKey: col.key,
            data: dat,
            width: col.width,
            type: col.type,
            dataRender: col.dataRender,
            headCellAlignment: col.headerAlignment,
            dataCellAlignment: col.cellAlignment,
        };
    }
    const rowActionsMenu = React.useCallback((data) => (e) => {
        e.preventDefault();
        gridTools.updateActiveRow(data[gridProps.uniqueRowKey]);
        displayActionsMenu({
            data: data,
            position: {
                xAxis: e.clientX,
                yAxis: e.clientY + 10,
            },
            identifier: data[gridProps.uniqueRowKey],
        });
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayActionsMenu]);
    const createExpandButton = (rowIndex, data) => {
        const isExpanded = gridTools.expandedRowKeys.has(rowIndex);
        return ((!gridProps.expandableRows?.excludeWhen || !gridProps.expandableRows.excludeWhen(data)) && (jsxRuntime.jsx(ExpandButton, { isExpanded: isExpanded, onClick: (e) => {
                e.stopPropagation();
                gridTools.updateRowExpansion(rowIndex);
            }, title: isExpanded ? localization?.rowShrinkTitle : localization?.rowExpandTitle })));
    };
    const createActionsMenuButton = (data) => jsxRuntime.jsx(ActionsMenuButton, { onClick: rowActionsMenu(data) });
    const createCheckBox = (data) => (jsxRuntime.jsx(Checkbox, { onChange: gridProps.rowSelection?.enabled && gridProps.rowSelection.type !== "onRowClick"
            ? (e) => gridTools.updateSelectedRows(data[gridProps.uniqueRowKey])
            : undefined, readOnly: gridProps.rowSelection?.type === "onRowClick", checked: gridTools.selectedRows.has(data[gridProps.uniqueRowKey]) }));
    function renderCell({ width, data, dataRender, type, colKey, dataCellAlignment }, index, rowIndex) {
        const commonDataGridRowCellProps = {
            style: {
                minWidth: width,
                maxWidth: width,
                minHeight: dimensions.defaultDataRowHeight,
                maxHeight: dimensions.defaultDataRowHeight,
            },
            key: index,
        };
        let children;
        switch (type) {
            case "data":
                const dataToRender = data[colKey];
                children = dataRender ? dataRender?.(data) : dataToRender;
                break;
            case "actions":
                children = createActionsMenuButton(data);
                break;
            case "expand":
                children = createExpandButton(rowIndex, data);
                break;
            case "select":
                children = createCheckBox(data);
                break;
        }
        return (jsxRuntime.jsx(Cell, { className: cs(type !== "data" && "tools", dataCellAlignment && `align-${dataCellAlignment}`, index === 0 && "no-border"), ...commonDataGridRowCellProps, children: jsxRuntime.jsx(CellContent, { tooltipProps: gridProps.tooltipOptions, children: children }) }));
    }
    const mapCommonRowProps = React.useCallback((dat, index) => {
        const identifier = dat[gridProps.uniqueRowKey];
        const isExpanded = gridTools.isRowExpanded(index);
        return {
            onClick: (e) => gridTools.onRowClick(e, dat),
            key: index.toString(),
            onContextMenu: gridTools.isRightClickIsActive ? rowActionsMenu(dat) : undefined,
            expandRowProps: {
                children: gridProps.expandableRows?.render?.(dat, containerWidth),
                showSeparatorLine: gridProps.expandableRows?.showSeparatorLine === true,
                isRowExpanded: isExpanded,
                leftOffset: pinnedColumns?.leftWidth,
                updateExpandRowHeightCache: gridTools.isDynamicRowExpandHeightEnabled ? gridTools.updateExpandRowHeightCache : undefined,
                rowIndex: index,
            },
            isRowSelected: gridTools.isRowSelected(identifier),
            isRowActive: gridTools.isRowActive(identifier),
        };
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
        gridTools.isRowExpanded,
        gridProps.uniqueRowKey,
        gridProps.expandableRows,
        gridTools.isRowSelected,
        gridTools.isRowActive,
        pinnedColumns?.leftWidth,
        containerWidth,
    ]);
    const renderCellCollection = (col, d, cellIndex, rowIndex = d.__virtual_row_index) => renderCell(extractBasicCellProps(col, d), cellIndex, rowIndex);
    const renderFullRow = React.useCallback((rowData, style = {}, rowIndex = rowData.__virtual_row_index) => (jsxRuntime.jsxs(Row, { className: rowIndex % 2 === 0 ? undefined : "odd", style: style, totalColumnsWidth: totalColumnsWidth, tabIndex: rowIndex + 1, ...mapCommonRowProps(rowData, rowIndex), children: [!!pinnedColumns?.leftWidth && (jsxRuntime.jsx(LockedStartWrapper$1, { type: "body", children: pinnedColumns.leftColumns.map((col, cellIndex) => renderCellCollection(col, rowData, cellIndex, rowIndex)) })), columnsToRender.columns.map((col, cellIndex) => renderCellCollection(col, rowData, cellIndex, rowIndex)), !!pinnedColumns?.rightWidth && (jsxRuntime.jsx(LockedEndWrapper$1, { type: "body", children: pinnedColumns.rightColumns.map((col, cellIndex) => renderCellCollection(col, rowData, cellIndex, rowIndex)) }))] })), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
        columnsToRender.columns,
        mapCommonRowProps,
        pinnedColumns?.leftWidth,
        pinnedColumns?.rightWidth,
        renderCellCollection,
        totalColumnsWidth,
    ]);
    return (jsxRuntime.jsx("div", { ref: viewRef, className: "view-container", ...props, children: jsxRuntime.jsxs(RowContainer, { children: [gridTools.isVirtualizationIsEnabled && indexedData && (jsxRuntime.jsx(VirtualList, { containerHeight: containerHeight, rowHeight: dimensions.defaultDataRowHeight, expandPanelHeight: dimensions.defaultExpandPanelHeight, getRowExpansionHeight: getRowExpansionHeight, topScrollPosition: topScrollPosition, preRenderedRowCount: gridProps.virtualization?.preRenderedRowCount, expandRowKeys: gridTools.expandedRowKeys, rows: indexedData, isDynamicExpandActive: gridTools.isDynamicRowExpandHeightEnabled, getExpandRowHeightFromCache: gridTools.getExpandRowHeightFromCache, renderElement: renderFullRow })), !gridTools.isVirtualizationIsEnabled && dataTools.data && dataTools.data.map((dat, index) => renderFullRow(dat, undefined, index))] }) }));
};

function DataGrid$1({ theme, gridProps, gridTools, dataTools, pinnedColumns, totalColumnsWidth, columnsToRender, initializedColumns, groupedColumnHeaders, children, displayDataActionsMenu, displayHeaderActionsMenu, filterFnsMenu, optionsMenu, ...props }) {
    const { dimensions, virtualizationEnabled, striped } = useDataGridStaticContext();
    const dataGridRef = React.useRef(null);
    const scrollerRef = React.useRef(null);
    const headerWrapperRef = React.useRef(null);
    const viewContainerRef = React.useRef(null);
    const [layoutDimensions, setLayoutDimensions] = React.useState({
        containerWidth: 0,
        containerHeight: 0,
    });
    const [topScrollPosition, setTopScrollPosition] = React.useState(0);
    const containerHeight = React.useMemo(() => layoutDimensions.containerHeight -
        (dimensions.defaultHeadRowHeight +
            (gridTools.isFilterMenuVisible ? dimensions.defaultHeaderFilterHeight : 0) +
            (gridTools.isColumnGroupingEnabled ? dimensions.defaultGroupedColumnHeight : 0) +
            dimensions.defaultFooterHeight), [
        layoutDimensions.containerHeight,
        dimensions.defaultHeadRowHeight,
        dimensions.defaultHeaderFilterHeight,
        dimensions.defaultGroupedColumnHeight,
        dimensions.defaultFooterHeight,
        gridTools.isFilterMenuVisible,
        gridTools.isColumnGroupingEnabled,
    ]);
    function onWindowResize() {
        if (dataGridRef.current?.clientHeight && dataGridRef.current.clientWidth) {
            setLayoutDimensions({
                containerHeight: dataGridRef.current.clientHeight,
                containerWidth: dataGridRef.current.clientWidth -
                    (pinnedColumns?.totalWidth ?? 0) -
                    // padding-left of expand width
                    10 -
                    // padding-left ::before
                    20 -
                    // vertical scrollbar-width),
                    dimensions.defaultScrollbarWidth,
            });
        }
    }
    const updateScrollPositionY = React.useCallback((top) => {
        if (gridTools.isVirtualizationIsEnabled)
            setTopScrollPosition(top);
    }, [gridTools.isVirtualizationIsEnabled]);
    const verticalScrollbarWidth = React.useMemo(() => {
        return scrollerRef.current?.scrollWidth > scrollerRef.current?.clientWidth &&
            scrollerRef.current?.scrollHeight > scrollerRef.current?.clientHeight
            ? dimensions.defaultScrollbarWidth
            : 0;
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scrollerRef.current?.scrollHeight, scrollerRef.current?.scrollWidth]);
    React.useEffect(() => {
        if (gridProps.autoAdjustColWidth?.adjustOnInitialRender) {
            autoAdjustColWidthInitial(gridProps.autoAdjustColWidth.initialBaseWidth);
        }
        onWindowResize();
        window.addEventListener("resize", onWindowResize);
        return () => {
            window.removeEventListener("resize", onWindowResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gridTools.isFullScreenModeEnabled]);
    React.useEffect(() => {
        if (pinnedColumns?.leftWidth)
            headerWrapperRef.current?.updateLockedStartTransform(scrollerRef.current?.scrollLeft ?? 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pinnedColumns?.leftColumns.length, verticalScrollbarWidth]);
    React.useEffect(() => {
        if (pinnedColumns?.rightWidth)
            headerWrapperRef.current?.updateLockedEndTransform((scrollerRef.current?.scrollLeft ?? 0) - verticalScrollbarWidth);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pinnedColumns?.rightColumns.length, verticalScrollbarWidth]);
    React.useEffect(() => {
        if (scrollerRef.current && scrollerRef.current.scrollTop !== 0)
            scrollerRef.current?.scrollTo({
                behavior: "smooth",
                top: 0,
            });
    }, [dataTools.currentPagination.currentPage]);
    React.useEffect(() => {
        if (gridTools.isVirtualizationIsEnabled) {
            scrollerRef.current?.scrollTo({
                behavior: "smooth",
                top: 0,
            });
        }
    }, [gridTools.isVirtualizationIsEnabled]);
    const onBodyScroll = (e) => {
        const topScroll = e.currentTarget.scrollTop;
        headerWrapperRef.current?.updateHeaderTransform(e.currentTarget.scrollLeft, verticalScrollbarWidth);
        if (topScroll !== topScrollPosition && Math.abs(topScroll - topScrollPosition) > 100)
            updateScrollPositionY(topScroll);
    };
    const onColumnHeaderFocus = React.useCallback((e, colWidth) => {
        const colOffset = e.currentTarget.getBoundingClientRect().left;
        const totalWidth = dataGridRef.current?.clientWidth;
        if (colOffset > totalWidth - colWidth - (pinnedColumns?.rightWidth ?? 0))
            scrollerRef.current?.scrollBy({
                left: colWidth,
                behavior: "smooth",
            });
        else if (colOffset - colWidth - (pinnedColumns?.leftWidth ?? 0) < 0)
            scrollerRef.current?.scrollTo({
                left: 0,
                behavior: "smooth",
            });
    }, [pinnedColumns?.leftWidth, pinnedColumns?.rightWidth]);
    function autoAdjustColWidthInitial(initialBaseWidth) {
        const columnsToCalculate = initializedColumns;
        const sum = columnsToCalculate.reduce((width, col) => width + col.width, 0);
        const containerWidth = initialBaseWidth ?? dataGridRef.current?.clientWidth;
        if (containerWidth && containerWidth > sum) {
            const dataColumns = columnsToCalculate.filter((x) => x.type === "data");
            const difference = containerWidth - sum;
            const sharedWidth = difference / dataColumns.length;
            const dimensionsToAssign = {};
            dataColumns.forEach((col) => (dimensionsToAssign[col.key] = col.width + sharedWidth));
            gridTools.updateColumnWidthMultiple(dimensionsToAssign);
        }
    }
    function autoAdjustColWidth() {
        const columnsToCalculate = initializedColumns;
        const containerWidth = dataGridRef.current?.clientWidth;
        if (containerWidth && containerWidth > totalColumnsWidth) {
            const dataColumns = columnsToCalculate.filter((x) => x.type === "data");
            const difference = containerWidth - totalColumnsWidth;
            const sharedWidth = difference / dataColumns.length;
            const dimensionsToAssign = {};
            dataColumns.forEach((col) => (dimensionsToAssign[col.key] = gridTools.getColumnWidth(col.key) + sharedWidth));
            gridTools.updateColumnWidthMultiple(dimensionsToAssign);
        }
    }
    const indexedData = React.useMemo(() => {
        if (gridTools.isVirtualizationIsEnabled)
            return dataTools.data?.map((d, i) => ({
                ...d,
                __virtual_row_index: i,
            }));
    }, [dataTools.data, gridTools.isVirtualizationIsEnabled]);
    const { getRowExpansionHeight, getTotalExpansionHeight } = useVirtualizedRows(indexedData, {
        expandedRowKeys: gridTools.expandedRowKeys,
        expandRowHeightCache: gridTools.expandRowHeightCache,
        getExpandRowHeightFromCache: gridTools.getExpandRowHeightFromCache,
        isDynamicRowExpandHeightEnabled: gridTools.isDynamicRowExpandHeightEnabled,
        __lastExpRowCache: gridTools.__lastExpRowCache,
    }, dimensions.defaultExpandPanelHeight, gridTools.isVirtualizationIsEnabled);
    const reAdjustWidth = React.useMemo(() => throttle(() => autoAdjustColWidth(), 500), []);
    React.useEffect(() => {
        if (!gridProps.autoAdjustColWidth?.adjustOnResize)
            return;
        const element = dataGridRef?.current;
        if (!element)
            return;
        const observer = new ResizeObserver(reAdjustWidth);
        observer.observe(element);
        return () => {
            // Cleanup the observer by unobserving all elements
            observer.disconnect();
        };
    }, [gridProps.autoAdjustColWidth?.adjustOnResize]);
    return (jsxRuntime.jsxs("div", { ref: dataGridRef, "data-theme": gridTools.isDarkModeEnabled ? "dark" : "light", className: cs("data-grid", "data-grid-factory", striped && "striped", gridProps.isHoverable && "hoverable", gridProps.cellBordering?.enableHorizontalBorder !== false && "bordered-horizontal", gridProps.cellBordering?.enableVerticalBorder !== false && "bordered-vertical", virtualizationEnabled && "virtualized", gridProps.className, gridTools.isFullScreenModeEnabled && "full-screen-mode"), ...props, children: [gridTools.isColumnResizing && jsxRuntime.jsx(ColumnResizingOverlay, {}), children, jsxRuntime.jsx(Body, { children: jsxRuntime.jsxs(ColumnLayout, { style: { height: layoutDimensions.containerHeight }, children: [jsxRuntime.jsx(HeaderLayout$1, { children: jsxRuntime.jsx(HeaderWrapper, { onColumnHeaderFocus: onColumnHeaderFocus, pinnedColumns: pinnedColumns, columnsToRender: columnsToRender, totalColumnsWidth: totalColumnsWidth, verticalScrollbarWidth: verticalScrollbarWidth, gridProps: gridProps, gridTools: gridTools, headerWrapperRef: headerWrapperRef, dataTools: dataTools, headerActionsMenu: {
                                    displayHeaderActionsMenu: displayHeaderActionsMenu,
                                }, filterFnsMenu: filterFnsMenu, containerHeight: containerHeight, groupedColumnHeaders: groupedColumnHeaders }) }), jsxRuntime.jsxs(List, { style: {
                                height: containerHeight,
                            }, children: [jsxRuntime.jsx(LoadingOverlay, { visible: dataTools.progressReporters.has("filter-select") ||
                                        dataTools.progressReporters.has("pagination") ||
                                        dataTools.progressReporters.has("sort") }), jsxRuntime.jsx(EmptyDataGrid, { visible: !gridProps.loading && !dataTools.data?.length }), jsxRuntime.jsx(LoadingSkeleton, { visible: !!gridProps.loading && !dataTools.progressReporters.size, containerHeight: containerHeight > 0 ? containerHeight : 0 }), jsxRuntime.jsx(ScrollContainer, { children: jsxRuntime.jsx(Scroller$1, { ref: scrollerRef, onScroll: onBodyScroll, minWidth: totalColumnsWidth, minHeight: (dataTools.data?.length ?? 0) * dimensions.defaultDataRowHeight + (getTotalExpansionHeight ?? 0), verticalScrollbarWidth: verticalScrollbarWidth, emptySpacerVisible: !gridProps.loading && (!dataTools.data || !dataTools.data?.length), children: jsxRuntime.jsx(ViewContainer, { columnsToRender: columnsToRender, pinnedColumns: pinnedColumns, topScrollPosition: topScrollPosition, gridTools: gridTools, dataTools: dataTools, gridProps: gridProps, totalColumnsWidth: totalColumnsWidth, containerHeight: containerHeight, containerWidth: layoutDimensions.containerWidth, viewRef: viewContainerRef, displayActionsMenu: displayDataActionsMenu, indexedData: indexedData, getRowExpansionHeight: getRowExpansionHeight }) }) })] }), jsxRuntime.jsx(Footer, { paginationProps: {
                                updateCurrentPagination: dataTools.updateCurrentPagination,
                                gridPaginationProps: {
                                    ...dataTools.currentPagination,
                                    ...(!gridProps.serverSide?.enabled
                                        ? { dataCount: dataTools.dataWithoutPagination?.length }
                                        : { dataCount: gridProps.serverSide.pagination?.dataCount }),
                                },
                                paginationDefaults: gridProps.pagination?.defaults,
                            }, progressReporters: dataTools.progressReporters, selectedRows: gridTools.selectedRows, optionsMenu: {
                                displayOptionsMenu: optionsMenu.displayOptionsMenu,
                                isMenuVisible: optionsMenu.isVisible,
                                enabled: gridProps.settingsMenu?.enabled !== false,
                            }, loading: gridProps.loading })] }) })] }));
}

const DefaultDataGridDimensions = {
    actionsMenuColumnWidth: 50,
    selectionMenuColumnWidth: 60,
    expandedMenuColumnWidth: 50,
    defaultFooterHeight: 70,
    defaultColumnWidth: 100,
    defaultDataRowHeight: 50,
    defaultHeadRowHeight: 50,
    defaultHeaderFilterHeight: 55,
    defaultScrollbarWidth: 20,
    maxColumnResizeWidth: Infinity,
    minColumnResizeWidth: 100,
    defaultExpandPanelHeight: 300,
    defaultGroupedColumnHeight: 60,
    columnOffsetWidth: 0,
};

function ArrowDown(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M11 5v11.17l-4.88-4.88c-.39-.39-1.03-.39-1.42 0-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0l6.59-6.59c.39-.39.39-1.02 0-1.41a.9959.9959 0 0 0-1.41 0L13 16.17V5c0-.55-.45-1-1-1s-1 .45-1 1z" }) }));
}

function ArrowLeft(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" }) }));
}

function ArrowRight(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" }) }));
}

function ArrowUp(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M13 19V7.83l4.88 4.88c.39.39 1.03.39 1.42 0 .39-.39.39-1.02 0-1.41l-6.59-6.59a.9959.9959 0 0 0-1.41 0l-6.6 6.58c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L11 7.83V19c0 .55.45 1 1 1s1-.45 1-1z" }) }));
}

function CheckMark(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" }) }));
}

function ChevronDown(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" }) }));
}

function ChevronUp(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z" }) }));
}

function ClearFilters(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M10.83 8H21V6H8.83l2 2zm5 5H18v-2h-4.17l2 2zM14 16.83V18h-4v-2h3.17l-3-3H6v-2h2.17l-3-3H3V6h.17L1.39 4.22 2.8 2.81l18.38 18.38-1.41 1.41L14 16.83z" }) }));
}

function ClearSorting(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M13.71 21.3c.39.39 1.02.39 1.41 0L17 19.41l1.89 1.89c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41L18.41 18l1.89-1.89c.39-.39.39-1.02 0-1.41s-1.02-.39-1.41 0L17 16.59l-1.89-1.89c-.39-.39-1.02-.39-1.41 0s-.39 1.02 0 1.41L15.59 18l-1.89 1.89c-.38.38-.38 1.02.01 1.41zM14 11c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1h9c.55 0 1-.45 1-1zm0-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1h9c.55 0 1-.45 1-1zM3 15c0 .55.45 1 1 1h5c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z" }) }));
}

function Close(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }) }));
}

function Date$1(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" }) }));
}

function Drag(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" }) }));
}

function Empty(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 1024 1024", ...props, children: jsxRuntime.jsx("path", { xmlns: "http://www.w3.org/2000/svg", d: "M945.643909 899.025661 767.204891 720.555943c-1.134847-1.136893-2.585895-1.641383-3.815909-2.555196 58.732659-68.858274 94.376461-158.0302 94.376461-255.623935 0-217.74114-176.577624-394.350486-394.350486-394.350486-217.771839 0-394.350486 176.608324-394.350486 394.350486 0 34.792411 4.952802 68.322062 13.406335 100.464109 10.219759-15.58393 36.712133-52.364625 52.549843-59.237149-1.702782-13.532201-2.838651-27.220968-2.838651-41.22696 0-182.917006 148.31493-331.264683 331.264683-331.264683s331.263659 148.346653 331.263659 331.264683c0 143.771451-91.758844 265.811971-219.7284 311.643809-6.088672 25.960255-15.929808 50.720172-29.335119 73.747631 65.640999-14.005992 125.32124-44.097334 174.432775-86.301552 0.914836 1.199315 1.419326 2.648316 2.524496 3.784186l178.468694 178.375573c12.33391 12.396331 32.268938 12.396331 44.601824 0C958.007495 931.355997 958.007495 911.358547 945.643909 899.025661L945.643909 899.025661zM480.417189 541.360701c-45.421492-45.421492-105.827257-70.436212-170.111353-70.436212-64.284095 0-124.657114 25.01472-170.07963 70.436212-45.453215 45.422516-70.466911 105.826234-70.466911 170.109306 0 64.285119 25.013697 124.658138 70.466911 170.111353 45.453215 45.454238 105.857956 70.465888 170.111353 70.465888 0 0 0 0 0.030699 0 64.253396 0 124.659161-25.045419 170.07963-70.465888 45.422516-45.388746 70.437236-105.826234 70.437236-170.111353C550.853401 647.217634 525.837658 586.812893 480.417189 541.360701zM435.815365 836.979536c-33.530674 33.531698-78.100776 51.982932-125.477806 51.982932l0 0c-47.408753 0-92.010577-18.48398-125.509529-51.982932-33.529651-33.529651-51.982932-78.099752-51.982932-125.509529 0-47.408753 18.453281-91.977831 51.982932-125.506459 33.529651-33.532721 78.069053-51.953256 125.477806-51.953256 47.409776 0 91.978854 18.453281 125.509529 51.953256 33.529651 33.529651 51.981908 78.097706 51.981908 125.506459C487.797273 758.911506 469.345016 803.450908 435.815365 836.979536zM420.895561 600.914052c-12.33391-12.335956-32.268938-12.335956-44.601824 0l-65.988924 65.986877-65.9879-65.986877c-12.332886-12.335956-32.267914-12.335956-44.600801 0-12.33391 12.332886-12.33391 32.266891 0 44.601824l65.986877 65.985854-65.986877 65.9879c-12.33391 12.332886-12.33391 32.267914 0 44.601824 6.15007 6.151094 14.226003 9.242502 22.299889 9.242502 8.075933 0 16.150842-3.091408 22.300912-9.242502l65.9879-65.986877 65.988924 65.986877c6.15007 6.151094 14.224979 9.242502 22.299889 9.242502 8.075933 0 16.150842-3.091408 22.300912-9.242502 12.33391-12.33391 12.33391-32.268938 0-44.601824l-65.986877-65.9879 65.986877-65.985854C433.196725 633.212666 433.196725 613.246939 420.895561 600.914052L420.895561 600.914052z" }) }));
}

function FastForward(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M5.59 7.41 10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" }) }));
}

function FilterMenu(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39c.51-.66.04-1.61-.79-1.61H5.04c-.83 0-1.3.95-.79 1.61z" }) }));
}

function Hidden(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" }) }));
}

function Gear(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" }) }));
}

function Menu(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" }) }));
}

function Minus(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M18 13H6c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1s-.45 1-1 1z" }) }));
}

function MultiDot(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" }) }));
}

function NoResult(props) {
    return (jsxRuntime.jsxs("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: [jsxRuntime.jsx("path", { d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3 6.08 3 3.28 5.64 3.03 9h2.02C5.3 6.75 7.18 5 9.5 5 11.99 5 14 7.01 14 9.5S11.99 14 9.5 14c-.17 0-.33-.03-.5-.05v2.02c.17.02.33.03.5.03 1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z" }), jsxRuntime.jsx("path", { d: "M6.47 10.82 4 13.29l-2.47-2.47-.71.71L3.29 14 .82 16.47l.71.71L4 14.71l2.47 2.47.71-.71L4.71 14l2.47-2.47z" })] }));
}

function PinLeft(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", style: {
            transform: "rotate(90deg)",
        }, ...props, children: jsxRuntime.jsx("path", { fillRule: "evenodd", d: "M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" }) }));
}

function PinRight(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", style: {
            transform: "rotate(-90deg)",
        }, ...props, children: jsxRuntime.jsx("path", { fillRule: "evenodd", d: "M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" }) }));
}

function Plus(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z" }) }));
}

function Search(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" }) }));
}

function ThreeDots(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" }) }));
}

function Unpin(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { fillRule: "evenodd", d: "M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" }) }));
}

function FullScreen(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" }) }));
}

function DarkMode(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" }) }));
}

function FilterVisibility(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" }) }));
}

function Columns(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M14.67 5v14H9.33V5h5.34zm1 14H21V5h-5.33v14zm-7.34 0V5H3v14h5.33z" }) }));
}

function Info(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" }) }));
}

function ColumnGroup(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z" }) }));
}

const DefaultDataGridIcons = {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    CheckMark,
    ChevronDown,
    ChevronUp,
    ClearFilters,
    ClearSorting,
    Close,
    Columns,
    ColumnGroup,
    DarkMode,
    Date: Date$1,
    Drag,
    Empty,
    FastForward,
    FilterMenu,
    FilterVisibility,
    FullScreen,
    Hidden,
    Info,
    Menu,
    Minus,
    MultiDot,
    NoResult,
    PinLeft,
    PinRight,
    Plus,
    Search,
    Settings: Gear,
    ThreeDots,
    Unpin,
};

const GridLocalization_AZ = {
    dataLoading: "Yüklənir",
    dataEmpty: "Nəticə tapılmadı",
    noResult: "Nəticə tapılmadı",
    filterLoading: "Axtarış gedir",
    paginationPageSize: "Səhifə ölçüsü",
    paginationNext: "Növbəti",
    paginationPrev: "Əvvəlki",
    paginationTotalCount: "nəticə",
    filterInputPlaceholder: "Axtar",
    filterDatePlaceholder: "gün/ay/il",
    filterButtonTitle: "Filterlə",
    ascendingSortTitle: "Artan sıra",
    descendingSortTitle: "Azalan sıra",
    clearSortTitle: "Təmizlə",
    rowExpandTitle: "Aç",
    rowShrinkTitle: "Bağla",
    rowShrinkAllTitle: "Hamısını bağla",
    settingsMenuTitle: "Tənzimləmələr",
    rowsSelectedTitle: "sətir seçilib",
    selectOptionsLoading: "Seçimlər yüklənir",
    menuTitle: "Seçimlər",
    hideColumn: "Gizlət",
    pinColumnToLeft: "Sola sabitlə",
    pinColumnToRight: "Sağa sabitlə",
    unpinColumn: "Sabitləmədən çıxar",
    clearFilers: "Filterləri təmizlə",
    filterContains: "Daxildir",
    filterBetween: "Aralıqda",
    filterBetweenInclusive: "Aralıqda daxil",
    filterEndsWith: "Bitən",
    filterEquals: "Bərabər",
    filterFuzzy: "Təxmini",
    filterGreaterThan: "Böyük",
    filterGreaterThanOrEqualTo: "Böyük bərabər",
    filterLessThan: "Kiçik",
    filterLessThanOrEqualTo: "Kiçik bərabər",
    filterNotEquals: "Bərabər deyil",
    filterStartsWith: "Başlayan",
    selectPlaceholder: "Seçin",
    fullScreenToggle: "Tam ekran",
    filterEmpty: "Boş",
    filterNotEmpty: "Boş deyil",
    filterFunctions: "Filter funksiyaları",
    columnVisibilityOptions: "Sütun görünüşü",
    darkModeToggle: "Qaranlıq rejimi",
    filterMenuVisibilityToggle: "Filter görünüşü",
    aboutTitle: "Haqqında",
    goBackTitle: "Geri",
    groupedColumnToggle: "Sütun qrupları",
};

const GridLocalization_EN = {
    dataLoading: "Loading",
    filterInputPlaceholder: "Search",
    filterDatePlaceholder: "day/month/year",
    filterLoading: "Loading",
    clearFilers: "Clear filters",
    dataEmpty: "No Data",
    noResult: "No Result",
    paginationPageSize: "Page size",
    paginationNext: "Next",
    paginationPrev: "Previous",
    paginationTotalCount: "result(s)",
    filterButtonTitle: "Filter",
    ascendingSortTitle: "Ascending sort",
    descendingSortTitle: "Descending sort",
    clearSortTitle: "Clear",
    rowExpandTitle: "Expand",
    rowShrinkAllTitle: "Shrink all",
    rowShrinkTitle: "Shrink",
    settingsMenuTitle: "Column visibility",
    rowsSelectedTitle: "rows selected",
    selectOptionsLoading: "Loading options",
    selectPlaceholder: "Select",
    menuTitle: "Menu",
    hideColumn: "Hide",
    pinColumnToLeft: "Pin to left",
    pinColumnToRight: "Pin to right",
    unpinColumn: "Unpin",
    filterContains: "Contains",
    filterBetween: "Between",
    filterBetweenInclusive: "Between inclusive",
    filterEndsWith: "Ends with",
    filterEquals: "Equals",
    filterFuzzy: "Fuzzy",
    filterGreaterThan: "Greater than",
    filterGreaterThanOrEqualTo: "Greater than or equal",
    filterLessThan: "Less than",
    filterLessThanOrEqualTo: "Less than or equal",
    filterNotEquals: "Not equals",
    filterStartsWith: "Starts with",
    fullScreenToggle: "Toggle fullscreen",
    filterEmpty: "Empty",
    filterNotEmpty: "Not empty",
    filterFunctions: "Filter functions",
    columnVisibilityOptions: "Visible headers",
    darkModeToggle: "Dark mode",
    filterMenuVisibilityToggle: "Filter visibility",
    groupedColumnToggle: "Column grouping",
    aboutTitle: "About",
    goBackTitle: "Back",
};

const GridLocalization_RU = {
    dataLoading: "Загрузка",
    filterInputPlaceholder: "Поиск",
    filterDatePlaceholder: "день/месяц/год",
    filterLoading: "Загрузка",
    clearFilers: "Очистить фильтры",
    dataEmpty: "Нет данных",
    noResult: "Нет результата",
    paginationPageSize: "Размер страницы",
    paginationNext: "Далее",
    paginationPrev: "Предыдущий",
    paginationTotalCount: "результат(ы)",
    filterButtonTitle: "Фильтр",
    ascendingSortTitle: "Сортировка по возрастанию",
    descendingSortTitle: "Сортировка по убыванию",
    clearSortTitle: "Очистить",
    rowExpandTitle: "Развернуть",
    rowShrinkAllTitle: "Сжать все",
    rowShrinkTitle: "Уменьшить",
    settingsMenuTitle: "Видимость столбца",
    rowsSelectedTitle: "выбраны строки",
    selectOptionsLoading: "Параметры загрузки",
    selectPlaceholder: "Выбрать",
    menuTitle: "Меню",
    hideColumn: "Скрыть",
    pinColumnToLeft: "Закрепить слева",
    pinColumnToRight: "Закрепить справа",
    unpinColumn: "Открепить",
    filterContains: "Содержит",
    filterBetween: "Между",
    filterBetweenInclusive: "Между включительно",
    filterEndsWith: "Заканчивается на",
    filterEquals: "Равно",
    filterFuzzy: "Нечеткий",
    filterGreaterThan: "Больше чем",
    filterGreaterThanOrEqualTo: "Больше или равно",
    filterLessThan: "Меньше чем",
    filterLessThanOrEqualTo: "Меньше или равно",
    filterNotEquals: "Не равно",
    filterStartsWith: "Начинается с",
    fullScreenToggle: "Включить полноэкранный режим",
    filterEmpty: "Пусто",
    filterNotEmpty: "Не пустой",
    filterFunctions: "Функции фильтра",
    columnVisibilityOptions: "Видимые заголовки",
    darkModeToggle: "Темный режим",
    filterMenuVisibilityToggle: "Фильтр видимости",
    groupedColumnToggle: "Группировка столбцов",
    aboutTitle: "О нас",
    goBackTitle: "Назад",
};

const LocalizationEntries = {
    en: GridLocalization_EN,
    az: GridLocalization_AZ,
    ru: GridLocalization_RU,
};

const DefaultDataGridTheme = {
    primaryColor: "#7828c8",
    borderRadiusLg: "10px",
    borderRadiusMd: "5px",
    borderRadiusSm: "2px",
    boxShadow: "0 12px 20px 6px rgb(104 112 118 / 0.08)",
};

function lightenColor(color) {
    let rgbValue = null;
    if (color.startsWith("#")) {
        rgbValue = hexToRgb(color);
    }
    else if (color.startsWith("rgb")) {
        rgbValue = rgbToObject(color);
    }
    return paletteToString({ ...rgbValue, a: 20 });
}
function paletteToString({ r, g, b, a }) {
    return `rgb(${r} ${g} ${b} / ${a}%)`;
}
function rgbToObject(val) {
    const result = val.match(/\d+/g)?.map(Number);
    return result
        ? {
            r: result[0],
            g: result[1],
            b: result[2],
            a: result[3],
        }
        : null;
}
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            a: 100,
        }
        : null;
}

const assignFilterFns = (columns) => {
    let filterFnsObj = {};
    const fnsColumns = columns.filter((col) => col.filter && col.filteringProps?.type !== "select");
    for (let index = 0; index < fnsColumns.length; index++) {
        const col = fnsColumns[index];
        const defaultFilter = col.filteringProps?.type === "date" ? "equals" : ConstProps.defaultActiveFn;
        filterFnsObj[col.key] = col.filteringProps?.defaultFilterFn ?? defaultFilter;
    }
    return filterFnsObj;
};

dayjs__default["default"].extend(customParseFormat__default["default"]);
const dayjsFormatted = (data) => dayjs__default["default"](data, DefaultDateTemplate);
const equals$1 = (data, filterValue) => filterValue.isSame(dayjsFormatted(data));
const contains$1 = equals$1, startsWith$1 = equals$1, endsWith$1 = equals$1, equalsAlt$1 = equals$1;
const notEquals$1 = (data, filterValue) => !filterValue.isSame(dayjsFormatted(data));
const greaterThan$1 = (data, filterValue) => filterValue.isBefore(dayjsFormatted(data));
const greaterThanOrEqualTo$1 = (data, filterValue) => equals$1(data, filterValue) || greaterThan$1(data, filterValue);
const lessThan$1 = (data, filterValue) => filterValue.isAfter(dayjsFormatted(data));
const lessThanOrEqualTo$1 = (data, filterValue) => equals$1(data, filterValue) || lessThan$1(data, filterValue);
const between$1 = (data, filterValues) => {
    const a = filterValues[0];
    const b = filterValues[1];
    if (!a && !b)
        return true;
    if (!a && b)
        return lessThan$1(data, b);
    else if (a && !b)
        return greaterThan$1(data, a);
    return lessThan$1(data, b) && greaterThan$1(data, a);
};
const betweenInclusive$1 = (data, filterValues) => {
    const a = filterValues[0];
    const b = filterValues[1];
    if (!a && !b)
        return true;
    if (!a && b)
        return lessThanOrEqualTo$1(data, b);
    else if (a && !b)
        return greaterThanOrEqualTo$1(data, a);
    return lessThanOrEqualTo$1(data, b) && greaterThanOrEqualTo$1(data, a);
};
const empty$1 = (data) => !data?.toString()?.trim();
const notEmpty$1 = (data) => !!data?.toString()?.trim();
const RDTDateFilters = {
    contains: contains$1,
    empty: empty$1,
    notEmpty: notEmpty$1,
    startsWith: startsWith$1,
    endsWith: endsWith$1,
    equals: equals$1,
    notEquals: notEquals$1,
    greaterThan: greaterThan$1,
    lessThan: lessThan$1,
    greaterThanOrEqualTo: greaterThanOrEqualTo$1,
    lessThanOrEqualTo: lessThanOrEqualTo$1,
    between: between$1,
    betweenInclusive: betweenInclusive$1,
    equalsAlt: equalsAlt$1,
};

const fuzzy = (collection, id, filterValue) => {
    const searchValue = filterValue.toLowerCase().toString();
    return new Fuse__default["default"](collection, {
        keys: [id],
    })
        .search(searchValue)
        .flatMap((d) => d.item);
};
const contains = (data, id, filterValue) => data[id]?.toString().toLowerCase().trim().includes(filterValue.toString().toLowerCase().trim());
const startsWith = (data, id, filterValue) => data[id]?.toString().toLowerCase().trim().startsWith(filterValue.toString().toLowerCase().trim());
const endsWith = (data, id, filterValue) => data[id]?.toString().toLowerCase().trim().endsWith(filterValue.toString().toLowerCase().trim());
const equals = (data, id, filterValue) => data[id]?.toString().toLowerCase().trim() === filterValue.toString().toLowerCase().trim();
const equalsAlt = (data, id, filterValue) => data[id]?.toString() === filterValue.toString();
const notEquals = (data, id, filterValue) => data[id]?.toString().toLowerCase().trim() !== filterValue.toString().toLowerCase().trim();
const greaterThan = (data, id, filterValue) => !isNaN(+filterValue) && !isNaN(+data[id])
    ? +data[id] > +filterValue
    : data[id]?.toString().toLowerCase().trim() > filterValue.toString().toLowerCase().trim();
const greaterThanOrEqualTo = (data, id, filterValue) => equals(data, id, filterValue) || greaterThan(data, id, filterValue);
const lessThan = (data, id, filterValue) => !isNaN(+filterValue) && !isNaN(+data[id])
    ? +data[id] < +filterValue
    : data[id]?.toString().toLowerCase().trim() < filterValue.toString().toLowerCase().trim();
const lessThanOrEqualTo = (data, id, filterValue) => equals(data, id, filterValue) || lessThan(data, id, filterValue);
const between = (data, id, filterValues) => ([StringExtensions.Empty, undefined].includes(filterValues[0]) || greaterThan(data, id, filterValues[0])) &&
    ((!isNaN(+filterValues[0]) && !isNaN(+filterValues[1]) && +filterValues[0] > +filterValues[1]) ||
        [StringExtensions.Empty, undefined].includes(filterValues[1]) ||
        lessThan(data, id, filterValues[1]));
const betweenInclusive = (data, id, filterValues) => ([StringExtensions.Empty, undefined].includes(filterValues[0]) || greaterThanOrEqualTo(data, id, filterValues[0])) &&
    ((!isNaN(+filterValues[0]) && !isNaN(+filterValues[1]) && +filterValues[0] > +filterValues[1]) ||
        [StringExtensions.Empty, undefined].includes(filterValues[1]) ||
        lessThanOrEqualTo(data, id, filterValues[1]));
const empty = (data, id, _filterValue) => !data[id]?.toString()?.trim();
const notEmpty = (data, id, _filterValue) => !!data[id]?.toString()?.trim();
const containsMultiple = (data, id, filterValue) => filterValue.includes(data[id]);
const RDTFilters = {
    contains,
    containsMultiple,
    startsWith,
    endsWith,
    equals,
    equalsAlt,
    notEquals,
    greaterThan,
    lessThan,
    greaterThanOrEqualTo,
    lessThanOrEqualTo,
    between,
    betweenInclusive,
    fuzzy,
    empty,
    notEmpty,
};

/* eslint-disable react-hooks/exhaustive-deps */
function useClientDataManagement({ columns, data, paginationProps, dataCount, sortingProps, clientEvaluationDisabled, initialDataState, }) {
    /** Collection of already fetched filters. */
    const [prefetchedFilters, setPrefetchedFilters] = React.useState({});
    /** Filters that are currently in use. */
    const [currentFilters, setCurrentFilters] = React.useState(initialDataState?.filters ?? {});
    /** Filter functions that are currently in use. */
    const [currentFilterFns, setCurrentFilterFns] = React.useState(initialDataState?.filterFns ?? assignFilterFns(columns));
    /** Sorting that is currently in use. */
    const [currentSorting, setCurrentSorting] = React.useState(initialDataState?.sortingProps);
    /** Data fetching indicators. */
    const [progressReporters, setProgressReporters] = React.useState(new Set());
    /** DataGrid key to reset filters. */
    const [filterResetKey, setFilterResetKey] = React.useState(0);
    /** Pagination props that are currently active. */
    const currentPagination = React.useRef(initialDataState?.paginationProps ?? {
        currentPage: paginationProps?.defaults?.defaultCurrentPage ?? ConstProps.defaultPaginationCurrentPage,
        dataCount: undefined,
        pageSize: paginationProps?.defaults?.defaultPageSize ?? ConstProps.defaultPaginationPageSize,
    });
    const [, renderState] = React.useState(false);
    const forceRender = () => renderState((prev) => !prev);
    const pipeSorting = (data, filters) => {
        if (clientEvaluationDisabled)
            return data;
        if (!data || data.length === 0)
            return;
        let sortedData = [...data];
        if (filters) {
            const customSortingAlg = getColumn(filters.key)?.sortingProps?.sortingComparer;
            const { key, direction } = filters;
            if (customSortingAlg)
                sortedData = sortedData.sort((a, b) => customSortingAlg(a[key], b[key], direction));
            else
                switch (direction) {
                    case "ascending":
                        sortedData = sortedData.sort((a, b) => (a[key] > b[key] ? -1 : 1));
                        break;
                    case "descending":
                        sortedData = sortedData.sort((a, b) => (a[key] < b[key] ? -1 : 1));
                        break;
                }
        }
        return sortedData;
    };
    const pipeFilters = (filters, filterFns, data) => {
        if (clientEvaluationDisabled)
            return data;
        if (!data || data.length === 0)
            return;
        let dataToFilter = [...data];
        function reFilter(fn) {
            dataToFilter = dataToFilter.filter(fn);
        }
        for (const columnKey in filters) {
            /** Currently based filters of column. */
            const currentColFilter = getColumnFilterValue(columnKey);
            /** Column based filter props, if any added. */
            const colFilterProps = getColumn(columnKey)?.filteringProps;
            /** Column filter functions (RDT Filters). */
            const colFilterFn = getColumnFilterFn(columnKey).current;
            if (!ConstProps.defaultFnsNoFilter.includes(colFilterFn) && (!currentColFilter || currentColFilter?.length === 0))
                continue;
            switch (colFilterProps?.type) {
                case "select":
                    if (colFilterProps?.equalityComparer)
                        reFilter((d) => colFilterProps.equalityComparer(d[columnKey], currentColFilter));
                    else {
                        if (colFilterProps?.multipleSelection)
                            reFilter((d) => RDTFilters.containsMultiple(d, columnKey, currentColFilter));
                        else
                            reFilter((d) => RDTFilters.equalsAlt(d, columnKey, currentColFilter));
                    }
                    break;
                default:
                    if (colFilterProps?.equalityComparer)
                        reFilter((d) => colFilterProps.equalityComparer(currentColFilter, d[columnKey], filterFns[columnKey]));
                    else {
                        if (colFilterProps?.type === "date")
                            reFilter((d) => RDTDateFilters[colFilterFn]?.(d[columnKey], currentColFilter));
                        else {
                            if (colFilterFn === "fuzzy")
                                dataToFilter = RDTFilters.fuzzy(dataToFilter, columnKey, currentColFilter);
                            else
                                reFilter((d) => RDTFilters[colFilterFn](d, columnKey, currentColFilter));
                        }
                    }
                    break;
            }
        }
        return dataToFilter;
    };
    async function pipeFetchedFilters(key, asyncFetchCallback) {
        if (!prefetchedFilters[key]) {
            let mappedFilters;
            const column = getColumn(key);
            if (column?.filteringProps?.type === "select" && column?.filteringProps?.defaultFilters) {
                mappedFilters = column.filteringProps.defaultFilters;
            }
            else {
                if (asyncFetchCallback) {
                    mappedFilters = await asyncFetchCallback?.(key);
                }
                else
                    mappedFilters = data?.flatMap((x) => `${x[key]}`);
            }
            updatePrefetchedFilters(key, 
            // Eliminate duplicate values.
            Array.from(new Set(mappedFilters)));
        }
    }
    const pipePagination = (data, pagination) => {
        if (clientEvaluationDisabled)
            return data;
        return data?.slice(pagination?.pageSize * (pagination?.currentPage - 1), pagination?.pageSize * pagination?.currentPage);
    };
    const filteredData = React.useMemo(() => pipeSorting(pipeFilters(currentFilters, currentFilterFns, data), currentSorting), [data, currentFilters, currentFilterFns, currentSorting]);
    function updatePrefetchedFilters(key, value) {
        return new Promise((res) => setPrefetchedFilters((prev) => {
            const updatedState = { ...prev, [key]: value };
            res(updatedState);
            return updatedState;
        }));
    }
    function updateCurrentPagination(valuesToUpdate) {
        paginationProps?.onPaginationChange?.(valuesToUpdate);
        return new Promise((res) => {
            const updatedState = { ...currentPagination.current, ...valuesToUpdate };
            currentPagination.current = updatedState;
            forceRender();
            res(updatedState);
            return updatedState;
        });
    }
    function updateCurrentFilterFn(key, type) {
        resetPagination();
        if (isRangeFilterFn(type) && !isRangeFilterFn(currentFilterFns[key]))
            setCurrentFilters((prev) => ({ ...prev, [key]: [prev[key]] }));
        else if (!isRangeFilterFn(type) && isRangeFilterFn(currentFilterFns[key]))
            setCurrentFilters((prev) => ({ ...prev, [key]: prev[key]?.[0] }));
        if (ConstProps.defaultFnsNoFilter.includes(type) && currentFilters[key] === undefined)
            setCurrentFilters((prev) => ({ ...prev, [key]: StringExtensions.Empty }));
        resetPagination();
        const stateCopy = { ...currentFilterFns, [key]: type };
        setCurrentFilterFns(stateCopy);
        return Promise.resolve(stateCopy);
    }
    function updateCurrentFilterValue(key, value) {
        return new Promise((res) => {
            resetPagination();
            setCurrentFilters((prev) => {
                const updatedState = {
                    ...prev,
                    [key]: value,
                };
                res(updatedState);
                return updatedState;
            });
        });
    }
    function updateCurrentSorting(key, alg) {
        resetPagination();
        if (alg) {
            const updatedState = {
                key,
                direction: alg,
            };
            setCurrentSorting(updatedState);
            sortingProps?.onSortingChange?.(updatedState);
            return Promise.resolve(updatedState);
        }
        return new Promise((res) => {
            setCurrentSorting((prev) => {
                let updatedState;
                if (prev?.key && prev.key === key) {
                    let sortType;
                    switch (prev.direction) {
                        case "ascending":
                            sortType = "descending";
                            break;
                        case "descending":
                            sortType = undefined;
                            break;
                        default:
                            sortType = "ascending";
                            break;
                    }
                    updatedState = {
                        key,
                        direction: sortType,
                    };
                }
                else
                    updatedState = {
                        key,
                        direction: "ascending",
                    };
                res(updatedState);
                sortingProps?.onSortingChange?.(updatedState);
                return updatedState;
            });
        });
    }
    function resetCurrentFilters() {
        return new Promise((res) => {
            const emptyState = {};
            resetPagination();
            setCurrentFilters(emptyState);
            setFilterResetKey(Date.now());
            res(emptyState);
        });
    }
    function resetFetchedFilters(key) {
        if (key)
            updatePrefetchedFilters(key, []);
    }
    function getColumn(key) {
        return columns.find((x) => x.key === key);
    }
    function getColumnFilterValue(key) {
        return currentFilters[key];
    }
    function getColumnFilterFn(key) {
        const columnFilterProps = getColumn(key)?.filteringProps;
        return {
            current: currentFilterFns[key],
            default: columnFilterProps?.defaultFilterFn,
        };
    }
    function getColumnType(key) {
        return getColumn(key)?.filteringProps?.type ?? "text";
    }
    function isFilterFnActive(colKey, activeKey) {
        const colType = getColumnType(colKey);
        const colFilterFn = getColumnFilterFn(colKey);
        const defaultAssignedFn = colFilterFn.default ?? (colType === "date" ? ConstProps.defaultActiveDateFn : ConstProps.defaultActiveFn);
        return activeKey === colKey || defaultAssignedFn !== colFilterFn.current;
    }
    function isRangeFilterFn(fnsKey) {
        return ConstProps.defaultRangeFns.includes(fnsKey);
    }
    function hydrateSelectInputs() {
        columns.filter((x) => x.filteringProps?.type === "select").forEach((col) => pipeFetchedFilters(col.key));
    }
    const resetPagination = () => {
        let pagPropsToSet = {
            ...currentPagination.current,
            currentPage: paginationProps?.defaults?.defaultCurrentPage ?? ConstProps.defaultPaginationCurrentPage,
        };
        currentPagination.current = pagPropsToSet;
        return pagPropsToSet;
    };
    React.useEffect(() => {
        if (initialDataState)
            hydrateSelectInputs();
    }, []);
    React.useEffect(() => {
        if (filteredData && filteredData.length > 0) {
            currentPagination.current = {
                ...currentPagination.current,
                dataCount: dataCount ?? filteredData.length,
            };
            forceRender();
        }
    }, [dataCount, filteredData]);
    const dataToExport = React.useMemo(() => pipePagination(filteredData, currentPagination.current) ?? [], [currentPagination.current, filteredData]);
    return {
        currentFilterFns,
        currentSorting,
        currentFilters,
        filterResetKey,
        prefetchedFilters,
        progressReporters,
        data: dataToExport,
        currentPagination: currentPagination.current,
        dataWithoutPagination: filteredData,
        getColumnType,
        isRangeFilterFn,
        isFilterFnActive,
        getColumn,
        getColumnFilterFn,
        getColumnFilterValue,
        hydrateSelectInputs,
        pipeFetchedFilters,
        resetCurrentFilters,
        resetFetchedFilters,
        resetPagination,
        setProgressReporters,
        updateCurrentSorting,
        updateCurrentFilterFn,
        updateCurrentPagination,
        updatePrefetchedFilters,
        updateCurrentFilterValue,
    };
}

/* eslint-disable react-hooks/exhaustive-deps */
function useServerDataManagement({ columns, data, dataCount, paginationProps, serverSide, sortingProps, initialDataState, }) {
    const clientTools = useClientDataManagement({
        columns,
        data,
        dataCount,
        paginationProps,
        sortingProps,
        clientEvaluationDisabled: true,
        initialDataState,
    });
    function startFetching(value) {
        clientTools.setProgressReporters((prev) => new Set(prev).add(value));
    }
    function stopFetching(value) {
        clientTools.setProgressReporters((prev) => {
            const stateCopy = new Set(prev);
            stateCopy.delete(value);
            return stateCopy;
        });
    }
    async function updateCurrentFilterValue(key, value) {
        const updatedFilters = await clientTools.updateCurrentFilterValue(key, value);
        if (serverSide?.filtering?.onFilterChangeAsync || serverSide?.onGlobalChangeAsync)
            startFetching("filter-select");
        const currentPagination = clientTools.resetPagination();
        await serverSide?.filtering?.onFilterChangeAsync?.(updatedFilters, clientTools.currentFilterFns, currentPagination, clientTools.currentSorting);
        await serverSide?.onGlobalChangeAsync?.(updatedFilters, clientTools.currentFilterFns, currentPagination, clientTools.currentSorting);
        stopFetching("filter-select");
        return updatedFilters;
    }
    async function updateCurrentFilterFn(key, type) {
        const updatedFilterFn = await clientTools.updateCurrentFilterFn(key, type);
        if (serverSide?.filtering.onFilterFunctionChangeAsync || serverSide?.onGlobalChangeAsync)
            startFetching("filter-select");
        const currentPagination = clientTools.resetPagination();
        await serverSide?.filtering?.onFilterFunctionChangeAsync?.(clientTools.currentFilters, updatedFilterFn, currentPagination, clientTools.currentSorting);
        await serverSide?.onGlobalChangeAsync?.(clientTools.currentFilters, updatedFilterFn, currentPagination, clientTools.currentSorting);
        stopFetching("filter-select");
        return updatedFilterFn;
    }
    async function updateCurrentPagination(valuesToUpdate) {
        const updatedPagination = await clientTools.updateCurrentPagination(valuesToUpdate);
        if (serverSide?.pagination?.onChangeAsync || serverSide?.onGlobalChangeAsync)
            startFetching("pagination");
        await serverSide?.pagination?.onChangeAsync?.(clientTools.currentFilters, clientTools.currentFilterFns, updatedPagination, clientTools.currentSorting);
        await serverSide?.onGlobalChangeAsync?.(clientTools.currentFilters, clientTools.currentFilterFns, updatedPagination, clientTools.currentSorting);
        stopFetching("pagination");
        return updatedPagination;
    }
    async function updateCurrentSorting(key, alg) {
        const updatedSorting = await clientTools.updateCurrentSorting(key, alg);
        if (serverSide?.sorting?.onSortingChangeAsync || serverSide?.onGlobalChangeAsync)
            startFetching("sort");
        const currentPagination = clientTools.resetPagination();
        await serverSide?.sorting?.onSortingChangeAsync?.(clientTools.currentFilters, clientTools.currentFilterFns, currentPagination, updatedSorting);
        await serverSide?.onGlobalChangeAsync?.(clientTools.currentFilters, clientTools.currentFilterFns, currentPagination, updatedSorting);
        stopFetching("sort");
        return updatedSorting;
    }
    async function resetCurrentFilters() {
        const updatedFilters = await clientTools.resetCurrentFilters();
        if (serverSide?.filtering?.onFilterChangeAsync)
            startFetching("filter-select");
        const currentPagination = clientTools.resetPagination();
        await serverSide?.filtering.onFilterChangeAsync?.(updatedFilters, clientTools.currentFilterFns, currentPagination, clientTools.currentSorting);
        await serverSide?.onGlobalChangeAsync?.(updatedFilters, clientTools.currentFilterFns, currentPagination, clientTools.currentSorting);
        stopFetching("filter-select");
        return updatedFilters;
    }
    async function pipeFetchedFilters(key) {
        if (!clientTools.prefetchedFilters[key])
            startFetching("filter-fetch");
        if (serverSide?.filtering?.onDefaultFilterFetchAsync)
            await clientTools.pipeFetchedFilters(key, serverSide?.filtering?.onDefaultFilterFetchAsync);
        else
            await clientTools.pipeFetchedFilters(key);
        stopFetching("filter-fetch");
    }
    const isFetching = React.useMemo(() => clientTools.progressReporters.size !== 0, [clientTools.progressReporters]);
    React.useEffect(() => {
        if (initialDataState) {
            startFetching("filter-select");
            serverSide
                ?.onGlobalChangeAsync?.(clientTools.currentFilters, clientTools.currentFilterFns, clientTools.currentPagination, clientTools.currentSorting)
                .then(clientTools.hydrateSelectInputs)
                .then(() => stopFetching("filter-select"));
        }
    }, []);
    return {
        ...clientTools,
        data,
        isFetching,
        paginationProps: { ...clientTools.currentPagination, dataCount: serverSide?.pagination?.dataCount },
        updateCurrentPagination,
        updateCurrentFilterValue,
        pipeFetchedFilters,
        resetCurrentFilters,
        updateCurrentFilterFn,
        updateCurrentSorting,
    };
}

function useDataManagement(type, props) {
    if (type === "client")
        return useClientDataManagement(props);
    else
        return useServerDataManagement(props);
}

function useActiveHeaders() {
    const [activeHeader, setActiveHeader] = React.useState();
    function updateActiveHeader(key) {
        activeHeader !== key && setActiveHeader(key);
    }
    const isHeaderIsActive = React.useCallback((key) => {
        return activeHeader !== undefined && activeHeader === key;
    }, [activeHeader]);
    return { updateActiveHeader, isHeaderIsActive };
}

function useActiveRow() {
    const [activeRow, setActiveRow] = React.useState();
    function updateActiveRow(uniqueRowKey) {
        if (uniqueRowKey === undefined) {
            console.warn("DataGrid", "Attempted to set 'undefined' as active row");
            return;
        }
        if (uniqueRowKey === null) {
            console.warn("DataGrid", "Attempted to set 'null' as active row");
            return;
        }
        if (activeRow === uniqueRowKey)
            return;
        setActiveRow(uniqueRowKey);
    }
    function clearActiveRow() {
        activeRow !== undefined && setActiveRow(undefined);
    }
    function isRowActive(uniqueRowKey) {
        if (uniqueRowKey === undefined)
            return false;
        return activeRow === uniqueRowKey;
    }
    return {
        updateActiveRow,
        clearActiveRow,
        isRowActive,
        activeRow,
    };
}

/**
 * Converts given array to object.
 * @param arr Array to convert.
 * @param predicate Callback function to convert to object.
 * @returns Converted object.
 */
function arrayToObject(arr, predicate) {
    const colObject = {};
    arr.forEach((col) => {
        colObject[col.key] = predicate(col);
    });
    return colObject;
}

function useColumnDimensions(gridProps, dimensions) {
    /** Set of column dimensions (e.g. width). */
    const [columnDimensions, setColumnDimensions] = React.useState(initateColumnWidth());
    const [isColumnResizing, setIsColumnResizing] = React.useState(false);
    function initateColumnWidth() {
        return arrayToObject(gridProps.columns, (col) => col.width ?? dimensions.defaultColumnWidth);
    }
    function updateColumnWidth(key, newWidth) {
        const width = columnDimensions[key] + newWidth;
        let newColDimensions = columnDimensions;
        if (width >= dimensions.minColumnResizeWidth && dimensions.maxColumnResizeWidth >= width) {
            newColDimensions = { ...columnDimensions, [key]: Math.round(width) };
        }
        else if (width > dimensions.maxColumnResizeWidth)
            newColDimensions = { ...columnDimensions, [key]: dimensions.maxColumnResizeWidth };
        else if (width < dimensions.minColumnResizeWidth)
            newColDimensions = { ...columnDimensions, [key]: dimensions.minColumnResizeWidth };
        setColumnDimensions(newColDimensions);
        gridProps.resizableColumns?.onColumnResize?.(newColDimensions);
    }
    function updateColumnWidthMultiple(collection) {
        setColumnDimensions(collection);
    }
    function updateColumnResizingStatus(val) {
        if (isColumnResizing !== val)
            setIsColumnResizing(val);
    }
    function getColumnWidth(colKey) {
        switch (colKey) {
            case "select":
                return dimensions.selectionMenuColumnWidth;
            case "expand":
                return dimensions.expandedMenuColumnWidth;
            case "actions":
                return dimensions.actionsMenuColumnWidth;
            default:
                return columnDimensions[colKey];
        }
    }
    return {
        isColumnResizing,
        columnDimensions,
        getColumnWidth,
        updateColumnWidth,
        updateColumnWidthMultiple,
        updateColumnResizingStatus,
    };
}

function useColumnOrder(gridProps) {
    const [columnOrder, setColumnOrder] = React.useState(gridProps.draggableColumns?.enabled && gridProps.draggableColumns?.defaultColumnOrder
        ? gridProps.draggableColumns.defaultColumnOrder
        : gridProps.columns.map(({ key }) => key));
    function updateColumnOrder(collection) {
        setColumnOrder(collection);
    }
    return {
        columnOrder,
        updateColumnOrder,
    };
}

function useExpandedRows(gridProps) {
    const [expandedRowKeys, setExpandedRowKeys] = React.useState(new Set());
    const [expandRowHeightCache, setExpandRowHeightCache] = React.useState({});
    const __lastExpRowCache = React.useRef(null);
    function updateRowExpansion(index) {
        setExpandedRowKeys((prev) => {
            const stateCopy = new Set(prev);
            if (prev.has(index)) {
                stateCopy.delete(index);
                gridProps.expandableRows?.onRowShrink?.(index);
                __lastExpRowCache.current = { index, isOpen: false };
            }
            else {
                stateCopy.add(index);
                gridProps.expandableRows?.onRowExpand?.(index);
                __lastExpRowCache.current = { index, isOpen: true };
            }
            return stateCopy;
        });
    }
    function closeExpandedRows() {
        if (expandedRowKeys.size > 0)
            setExpandedRowKeys(new Set());
    }
    function isRowExpanded(uniqueRowKey) {
        return expandedRowKeys.has(uniqueRowKey);
    }
    function updateExpandRowHeightCache(index, height, forceUpdate = false) {
        if (forceUpdate || expandRowHeightCache[index] === undefined)
            setExpandRowHeightCache((prev) => ({ ...prev, [index]: height }));
    }
    function clearExpandRowHeightCache() {
        setExpandRowHeightCache({});
    }
    function getExpandRowHeightFromCache(index) {
        return expandRowHeightCache[index];
    }
    const isDynamicRowExpandHeightEnabled = React.useMemo(() => gridProps.virtualization?.dynamicExpandRowHeight === true, [gridProps.virtualization?.dynamicExpandRowHeight]);
    return {
        expandedRowKeys,
        expandRowHeightCache,
        updateRowExpansion,
        closeExpandedRows,
        isRowExpanded,
        updateExpandRowHeightCache,
        clearExpandRowHeightCache,
        getExpandRowHeightFromCache,
        isDynamicRowExpandHeightEnabled,
        __lastExpRowCache,
    };
}

/* eslint-disable react-hooks/exhaustive-deps */
function useDetectKeyPress(callback) {
    function handleKeyPress(e) {
        callback(e.key, e);
    }
    React.useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, []);
}

function useGridFeatures(gridProps) {
    const [isDarkModeEnabled, setDarkModeEnabled] = React.useState(gridProps.theme === "dark");
    const [isFullScreenModeEnabled, setFullScreenModeEnabled] = React.useState(false);
    const [isFilterMenuVisible, setFilterMenuVisible] = React.useState(gridProps.columns.some((x) => x.filter));
    const [isColumnGroupingEnabled, setGroupedHeadersVisible] = React.useState(!!gridProps.groupedColumns?.enabled &&
        !!gridProps.groupedColumns.groups &&
        gridProps.groupedColumns.groups.length > 0);
    function updateFullScreenMode() {
        gridProps.settingsMenu?.fullScreenToggle?.onChange?.(!isFullScreenModeEnabled);
        setFullScreenModeEnabled((prev) => !prev);
    }
    function updateDarkMode() {
        gridProps.settingsMenu?.darkModeToggle?.onChange?.(isDarkModeEnabled ? "light" : "dark");
        setDarkModeEnabled((prev) => !prev);
    }
    function updateFilterMenuVisibility() {
        gridProps.settingsMenu?.filterMenuToggle?.onChange?.(!isFilterMenuVisible);
        setFilterMenuVisible((prev) => !prev);
    }
    function updateColumnGrouping() {
        gridProps.settingsMenu?.groupedColumnToggle?.onChange?.(!isColumnGroupingEnabled);
        setGroupedHeadersVisible((prev) => !prev);
    }
    useDetectKeyPress((key) => key === "Escape" && setFullScreenModeEnabled(false));
    return {
        updateDarkMode,
        updateFullScreenMode,
        updateFilterMenuVisibility,
        updateColumnGrouping,
        isDarkModeEnabled,
        isFullScreenModeEnabled,
        isFilterMenuVisible,
        isColumnGroupingEnabled,
    };
}

function usePinnedColumns(gridProps) {
    const [pinnedColumns, setPinnedColumns] = React.useState({ left: gridProps.pinnedColumns?.left ?? [], right: gridProps.pinnedColumns?.right ?? [] });
    function updatePinnedColumns(colKey, position) {
        let newState = { ...pinnedColumns };
        const currentPosition = pinnedColumns["left"].includes(colKey) ? "left" : pinnedColumns["right"].includes(colKey) ? "right" : undefined;
        if (currentPosition === position) {
            newState[position] = [...newState[position].filter((x) => x !== colKey)];
        }
        else if (currentPosition === undefined) {
            newState[position] = [...newState[position], colKey];
        }
        else {
            newState[currentPosition] = [...newState[currentPosition].filter((x) => x !== colKey)];
            newState[position] = [...newState[position], colKey];
        }
        gridProps.pinnedColumns?.onColumnPin?.(newState);
        setPinnedColumns(newState);
    }
    return {
        pinnedColumns,
        updatePinnedColumns,
    };
}

function useSelectedRows(gridProps) {
    /** List of checked items in the data-grid. */
    const [selectedRows, setSelectedRows] = React.useState(gridProps.rowSelection?.defaultValues ? new Set(gridProps.rowSelection?.defaultValues) : new Set());
    function updateSelectedRows(value) {
        if (value === undefined) {
            console.warn("DataGrid", "Attempted to set 'undefined' as selected row");
            return;
        }
        if (value === null) {
            console.warn("DataGrid", "Attempted to set 'null' as selected row");
            return;
        }
        setSelectedRows((prev) => {
            const copiedRows = new Set(prev);
            if (copiedRows.has(value))
                copiedRows.delete(value);
            else
                copiedRows.add(value);
            gridProps.rowSelection?.onChange?.(Array.from(copiedRows));
            return copiedRows;
        });
    }
    function updateSelectedRowsMultiple(collection) {
        const uniqueIds = collection.filter((x) => x !== undefined);
        setSelectedRows(new Set(uniqueIds));
        gridProps.rowSelection?.onChange?.(uniqueIds);
    }
    function isRowSelected(uniqueRowKey) {
        return selectedRows.has(uniqueRowKey);
    }
    function clearSelectedRows() {
        updateSelectedRowsMultiple([]);
    }
    return {
        selectedRows,
        updateSelectedRows,
        updateSelectedRowsMultiple,
        isRowSelected,
        clearSelectedRows,
    };
}

function useVisibleColumns(gridProps) {
    const [visibleColumns, setVisibleColumns] = React.useState(gridProps.columnVisibilityOptions?.enabled && gridProps.columnVisibilityOptions?.defaultVisibleHeaders
        ? new Set(gridProps.columnVisibilityOptions.defaultVisibleHeaders)
        : new Set(gridProps.columns.map((x) => x.key)));
    function updateColumnVisibility(key) {
        const visibleColumnsCopy = new Set(visibleColumns);
        if (visibleColumnsCopy.size > 1 && visibleColumnsCopy.has(key)) {
            visibleColumnsCopy.delete(key);
        }
        else
            visibleColumnsCopy.add(key);
        gridProps.columnVisibilityOptions?.onVisibilityChange?.(Array.from(visibleColumnsCopy));
        setVisibleColumns(visibleColumnsCopy);
        return visibleColumnsCopy;
    }
    return {
        visibleColumns,
        updateColumnVisibility,
    };
}

function useDataGridTools({ tableProps: gridProps, dimensions, }) {
    const isColumnIsResizable = React.useCallback((columnKey) => {
        if (!gridProps.resizableColumns?.enabled)
            return false;
        else if (!gridProps.resizableColumns.columnsToExclude?.includes(columnKey))
            return true;
    }, [gridProps.resizableColumns]);
    const isColumnIsDraggable = React.useCallback((columnKey) => {
        if (!gridProps.draggableColumns?.enabled)
            return false;
        else if (!gridProps.draggableColumns.columnsToExclude?.includes(columnKey))
            return true;
    }, [gridProps.draggableColumns]);
    const isFilterFnIsActive = React.useCallback((columnKey) => {
        if (gridProps.filterFnsMenu?.enabled === false)
            return false;
        const column = gridProps.columns.find((col) => col.key === columnKey);
        return (column?.filter &&
            (!column?.filteringProps?.type || ["text", "date", "number"].includes(column?.filteringProps?.type)) &&
            column?.enableFilterFns !== false);
    }, [gridProps.columns, gridProps.filterFnsMenu?.enabled]);
    const isVirtualizationIsEnabled = React.useMemo(() => gridProps.virtualization?.enabled === true, [gridProps.virtualization?.enabled]);
    const isColumnFilteringEnabled = React.useMemo(() => gridProps.columns.some((x) => x.filter), [gridProps.columns]);
    const isHeaderMenuActive = React.useMemo(() => gridProps.headerActionsMenu?.enabled === undefined || gridProps.headerActionsMenu?.enabled === true, [gridProps.headerActionsMenu]);
    const selectedRowProps = useSelectedRows(gridProps);
    const activeRowProps = useActiveRow();
    const onRowClick = React.useCallback((e, cellData) => {
        e.stopPropagation();
        if (gridProps.rowSelection?.enabled && gridProps.rowSelection?.type === "onRowClick")
            selectedRowProps.updateSelectedRows(cellData[gridProps.uniqueRowKey]);
        else if (gridProps.onRowClick) {
            activeRowProps.updateActiveRow(cellData[gridProps.uniqueRowKey]);
            gridProps.onRowClick?.(e, cellData);
        }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gridProps.rowSelection]);
    const isRightClickIsActive = React.useMemo(() => gridProps.rowActionsMenu?.enabled && gridProps.rowActionsMenu?.displayOnRightClick !== false, [gridProps.rowActionsMenu?.enabled, gridProps.rowActionsMenu?.displayOnRightClick]);
    return {
        isColumnIsDraggable,
        isColumnIsResizable,
        isFilterFnIsActive,
        isRightClickIsActive,
        isHeaderMenuActive,
        isVirtualizationIsEnabled,
        isColumnFilteringEnabled,
        onRowClick,
        ...useColumnDimensions(gridProps, dimensions),
        ...useColumnOrder(gridProps),
        ...useExpandedRows(gridProps),
        ...usePinnedColumns(gridProps),
        ...useVisibleColumns(gridProps),
        ...useGridFeatures(gridProps),
        ...useActiveHeaders(),
        ...activeRowProps,
        ...selectedRowProps,
    };
}

function useGridFactory(gridProps) {
    const dimensions = React.useMemo(() => ({
        ...DefaultDataGridDimensions,
        ...gridProps.dimensions,
    }), [gridProps.dimensions]);
    const localization = React.useMemo(() => {
        if (gridProps.localization?.defaultLocale) {
            return {
                ...LocalizationEntries[gridProps.localization?.defaultLocale],
                ...gridProps.localization?.customLocaleProps,
            };
        }
        return { ...LocalizationEntries[ConstProps.defaultLocale], ...gridProps.localization?.customLocaleProps };
    }, [gridProps.localization]);
    const styling = React.useMemo(() => {
        const stylingToInitialize = { ...DefaultDataGridTheme, ...gridProps.styling };
        return {
            ...stylingToInitialize,
            hoverColor: lightenColor(stylingToInitialize.primaryColor),
        };
    }, [gridProps.styling]);
    const icons = React.useMemo(() => ({ ...DefaultDataGridIcons, ...gridProps.icons }), [gridProps.icons]);
    const defaultStyling = React.useMemo(() => ({
        "--grid-color-primary": styling.primaryColor,
        "--grid-border-radius-lg": styling.borderRadiusLg,
        "--grid-border-radius-md": styling.borderRadiusMd,
        "--grid-border-radius-sm": styling.borderRadiusSm,
        "--grid-box-shadow-main": styling.boxShadow,
        "--grid-color-hover": styling.hoverColor,
        "--grid-scrollbar-width": `${dimensions.defaultScrollbarWidth}px`,
        ...gridProps.style,
    }), [
        dimensions.defaultScrollbarWidth,
        styling.borderRadiusLg,
        styling.borderRadiusMd,
        styling.borderRadiusSm,
        styling.boxShadow,
        styling.hoverColor,
        styling.primaryColor,
        gridProps.style,
    ]);
    const gridTools = useDataGridTools({
        tableProps: gridProps,
        dimensions,
    });
    const dataTools = useDataManagement(gridProps.serverSide?.enabled === true ? "server" : "client", {
        columns: gridProps.columns,
        data: gridProps.data,
        dataCount: gridProps.serverSide?.pagination?.dataCount,
        paginationProps: gridProps.pagination,
        serverSide: gridProps.serverSide,
        sortingProps: gridProps.sorting,
        initialDataState: gridProps.initialDataState,
    });
    const arePinnedColumnsInUse = React.useMemo(() => {
        return (gridProps.pinnedColumns?.enabled &&
            (gridTools.pinnedColumns.left.length > 0 || gridTools.pinnedColumns?.right.length > 0));
    }, [gridTools.pinnedColumns.left.length, gridTools.pinnedColumns?.right.length, gridProps.pinnedColumns?.enabled]);
    const initializedColumns = React.useMemo(() => {
        const columnsAggregated = [];
        if (gridProps.rowSelection?.enabled) {
            columnsAggregated.push({
                key: "select",
                type: "select",
                width: dimensions.selectionMenuColumnWidth,
            });
        }
        if (gridProps.expandableRows?.enabled) {
            columnsAggregated.push({
                key: "expand",
                type: "expand",
                width: dimensions.expandedMenuColumnWidth,
            });
        }
        const visibleColumns = gridProps.columns
            .filter((col) => gridTools.visibleColumns.has(col.key))
            .sort((a, b) => gridTools.columnOrder.indexOf(a.key) - gridTools.columnOrder.indexOf(b.key));
        const perColOffset = dimensions.columnOffsetWidth / visibleColumns.length;
        const dataColumns = visibleColumns.map((col) => ({
            ...col,
            width: (gridTools.columnDimensions[col.key] ?? dimensions.defaultColumnWidth) + perColOffset,
            type: "data",
        }));
        columnsAggregated.push(...dataColumns);
        if (gridProps.rowActionsMenu?.enabled) {
            columnsAggregated.push({
                key: "actions",
                type: "actions",
                width: dimensions.actionsMenuColumnWidth,
            });
        }
        return columnsAggregated;
    }, [
        gridTools.columnDimensions,
        gridTools.columnOrder,
        gridTools.visibleColumns,
        dimensions.actionsMenuColumnWidth,
        dimensions.defaultColumnWidth,
        dimensions.expandedMenuColumnWidth,
        dimensions.selectionMenuColumnWidth,
        gridProps.columns,
        gridProps.expandableRows?.enabled,
        gridProps.rowActionsMenu?.enabled,
        gridProps.rowSelection?.enabled,
    ]);
    const totalColumns = React.useMemo(() => {
        if (!arePinnedColumnsInUse)
            return initializedColumns;
        return initializedColumns.map((col) => ({
            ...col,
            pinned: gridTools.pinnedColumns.left.includes(col.key)
                ? "left"
                : gridTools.pinnedColumns.right.includes(col.key)
                    ? "right"
                    : undefined,
        }));
    }, [initializedColumns, arePinnedColumnsInUse, gridTools.pinnedColumns.left, gridTools.pinnedColumns.right]);
    const columnsToRender = React.useMemo(() => {
        let columns;
        if (!arePinnedColumnsInUse)
            columns = totalColumns;
        else
            columns = totalColumns.filter((col) => !col.pinned);
        return {
            columns,
            totalWidth: columns.reduce((prev, curr) => prev + curr.width, 0),
        };
    }, [arePinnedColumnsInUse, totalColumns]);
    const pinnedColumnsToRender = React.useMemo(() => {
        if (!arePinnedColumnsInUse)
            return;
        const leftColumns = totalColumns.filter((x) => x.pinned === "left");
        const rightColumns = totalColumns.filter((x) => x.pinned === "right");
        const leftWidth = leftColumns.reduce((prev, curr) => prev + curr.width, 0);
        const rightWidth = rightColumns.filter((x) => x.pinned === "right").reduce((prev, curr) => prev + curr.width, 0);
        return {
            leftColumns,
            rightColumns,
            leftWidth: leftWidth,
            rightWidth: rightWidth,
            totalWidth: leftWidth + rightWidth,
        };
    }, [arePinnedColumnsInUse, totalColumns]);
    const totalColumnsWidth = React.useMemo(() => totalColumns.reduce((prev, curr) => prev + curr.width, 0), [totalColumns]);
    const colKeysMappedToGroup = React.useMemo(() => {
        if (!gridTools.isColumnGroupingEnabled)
            return;
        const colGroupDictionary = {};
        for (let index = 0; index < gridProps.columns.length; index++) {
            const column = gridProps.columns[index];
            colGroupDictionary[column.key] = gridProps.groupedColumns?.groups?.find((x) => x.columnKeys.includes(column.key))?.title;
        }
        return colGroupDictionary;
    }, [gridTools.isColumnGroupingEnabled, gridProps.columns, gridProps.groupedColumns?.groups]);
    const groupColumnHeaders = React.useCallback((columns) => {
        if (!gridTools.isColumnGroupingEnabled)
            return;
        const groupedColumns = [];
        for (let index = 0; index < columns.length; index++) {
            const col = columns[index];
            const groupTitle = colKeysMappedToGroup[col.key];
            const previousItem = groupedColumns[groupedColumns.length - 1];
            if (previousItem && previousItem.title === groupTitle) {
                previousItem.keys.push(col.key);
                previousItem.width += col.width;
            }
            else
                groupedColumns.push({
                    keys: [col.key],
                    title: groupTitle,
                    width: col.width,
                });
        }
        return groupedColumns;
    }, [colKeysMappedToGroup, gridTools.isColumnGroupingEnabled]);
    const leftLockedGroupedColumnHeaders = React.useMemo(() => pinnedColumnsToRender?.leftColumns && groupColumnHeaders(pinnedColumnsToRender?.leftColumns), [groupColumnHeaders, pinnedColumnsToRender?.leftColumns]);
    const rightLockedGroupedColumnHeaders = React.useMemo(() => pinnedColumnsToRender?.rightColumns && groupColumnHeaders(pinnedColumnsToRender?.rightColumns), [groupColumnHeaders, pinnedColumnsToRender?.rightColumns]);
    const unlockedGroupedColumnHeaders = React.useMemo(() => groupColumnHeaders(columnsToRender.columns), [columnsToRender.columns, groupColumnHeaders]);
    function getColumnByKey(key) {
        for (let index = 0; index < totalColumns.length; index++) {
            if (totalColumns[index].key === key)
                return totalColumns[index];
        }
    }
    gridTools.getColumnByKey = getColumnByKey;
    const dataGridProps = {
        icons,
        styling,
        localization,
        dimensions,
    };
    return {
        columnsToRender,
        groupedColumnHeaders: {
            unlockedGroupedColumnHeaders,
            leftLockedGroupedColumnHeaders,
            rightLockedGroupedColumnHeaders,
        },
        pinnedColumnsToRender,
        gridTools,
        dataTools,
        defaultStyling,
        dataGridProps,
        totalColumnsWidth,
        totalColumns,
        initializedColumns,
    };
}

function Toggle({ checked, name, onChange, size = 50 }) {
    return (jsxRuntime.jsxs("div", { style: {
            "--toggle-switch-size": `${size}px`,
        }, className: "toggle-switch", children: [jsxRuntime.jsx("input", { className: "toggle-switch-input", type: "checkbox", onChange: (e) => {
                    onChange?.(e.target.value);
                }, id: name, checked: checked }), jsxRuntime.jsx("label", { style: {
                    width: size,
                    height: size / 1.7,
                }, className: "toggle-switch-label", htmlFor: name })] }));
}

function OptionsMenu({ visibleColumnKeys, className, optionsMenuProps, isDarkModeEnabled, isFullScreenModeEnabled, isFilterMenuVisible, isColumnGroupingEnabled, isColumnVisibilityEnabled, isColumnFilteringEnabled, updateDarkMode, updateActiveHeader, updateFullScreenMode, updateColumnVisibility, updateFilterMenuVisibility, updateColumnGrouping, updatePosition, ...props }) {
    const { columnVisibilityProps, localization, icons } = useDataGridStaticContext();
    const [activeWindowIndex, setActiveWindowIndex] = React.useState("0");
    function updateActiveWindow(index) {
        setActiveWindowIndex(index);
    }
    return (jsxRuntime.jsx(React__default["default"].Fragment, { children: jsxRuntime.jsx("div", { className: cs("data-grid-options-menu-body", className), ...props, children: jsxRuntime.jsxs(Portal.Container, { indexOrder: ["0", "1"], activeWindowIndex: activeWindowIndex, children: [jsxRuntime.jsxs(Portal.Window, { index: "0", onAnimationFinish: (val) => val && updatePosition(), children: [jsxRuntime.jsx("div", { className: "data-grid-options-menu-header", children: jsxRuntime.jsx("h4", { className: "data-grid-options-menu-title", children: localization.settingsMenuTitle }) }), jsxRuntime.jsxs("div", { className: "data-grid-options-menu-toggles", children: [optionsMenuProps?.fullScreenToggle?.enabled !== false && (jsxRuntime.jsxs("div", { className: "menu-toggle", children: [jsxRuntime.jsxs("label", { htmlFor: "full-screen-toggle", className: "menu-toggle-title", children: [jsxRuntime.jsx(icons.FullScreen, { className: "menu-toggle-icon" }), " ", jsxRuntime.jsx("span", { children: localization.fullScreenToggle })] }), jsxRuntime.jsx(Toggle, { onChange: updateFullScreenMode, name: "full-screen-toggle", checked: isFullScreenModeEnabled, size: 40 })] })), optionsMenuProps?.filterMenuToggle?.enabled !== false && isColumnFilteringEnabled && (jsxRuntime.jsxs("div", { className: "menu-toggle", children: [jsxRuntime.jsxs("label", { htmlFor: "filter-menu-toggle", className: "menu-toggle-title", children: [jsxRuntime.jsx(icons.FilterVisibility, { className: "menu-toggle-icon" }), " ", jsxRuntime.jsx("span", { children: localization.filterMenuVisibilityToggle })] }), jsxRuntime.jsx(Toggle, { onChange: updateFilterMenuVisibility, name: "filter-menu-toggle", checked: isFilterMenuVisible, size: 40 })] })), optionsMenuProps?.groupedColumnToggle?.enabled !== false && (jsxRuntime.jsxs("div", { className: "menu-toggle", children: [jsxRuntime.jsxs("label", { htmlFor: "group-menu-toggle", className: "menu-toggle-title", children: [jsxRuntime.jsx(icons.ColumnGroup, { className: "menu-toggle-icon" }), " ", jsxRuntime.jsx("span", { children: localization.groupedColumnToggle })] }), jsxRuntime.jsx(Toggle, { onChange: updateColumnGrouping, name: "group-menu-toggle", checked: isColumnGroupingEnabled, size: 40 })] })), optionsMenuProps?.darkModeToggle?.enabled !== false && (jsxRuntime.jsxs("div", { className: "menu-toggle", children: [jsxRuntime.jsxs("label", { htmlFor: "dark-mode-toggle", className: "menu-toggle-title", children: [jsxRuntime.jsx(icons.DarkMode, { className: "menu-toggle-icon" }), " ", jsxRuntime.jsxs("span", { children: [" ", localization.darkModeToggle] })] }), jsxRuntime.jsx(Toggle, { onChange: updateDarkMode, name: "dark-mode-toggle", checked: isDarkModeEnabled, size: 40 })] })), jsxRuntime.jsx("div", { className: "menu-divider" }), isColumnVisibilityEnabled && (jsxRuntime.jsxs("div", { onClick: () => updateActiveWindow("1"), className: "menu-toggle", children: [jsxRuntime.jsxs("label", { className: "menu-toggle-title", children: [jsxRuntime.jsx(icons.Columns, { className: "menu-toggle-icon" }), " ", jsxRuntime.jsx("span", { children: localization.columnVisibilityOptions })] }), jsxRuntime.jsx(icons.ArrowRight, { className: "menu-toggle-icon" })] }))] })] }), jsxRuntime.jsxs(Portal.Window, { index: "1", onAnimationFinish: (val) => val && updatePosition(), children: [jsxRuntime.jsxs("div", { className: "columns-list-wrapper", children: [jsxRuntime.jsx("div", { className: "data-grid-options-menu-header", children: jsxRuntime.jsx("h4", { className: "data-grid-options-menu-title", children: localization.columnVisibilityOptions }) }), jsxRuntime.jsx("ul", { children: columnVisibilityProps.map(({ key, title }) => {
                                            const isSelectionActive = visibleColumnKeys.has(key);
                                            return (jsxRuntime.jsx("li", { className: cs("filter-element", isSelectionActive && "active"), onClick: () => updateColumnVisibility(key), onMouseEnter: () => updateActiveHeader(key), onMouseLeave: () => updateActiveHeader(undefined), children: jsxRuntime.jsxs("div", { className: cs("select-button", isSelectionActive && visibleColumnKeys.size === 1 && "disabled"), title: title, children: [jsxRuntime.jsx("span", { className: "content", children: title ?? `[${key}]` }), jsxRuntime.jsx(Animations.Auto, { duration: 200, visible: isSelectionActive, children: jsxRuntime.jsx("div", { className: "check-button", children: jsxRuntime.jsx(icons.CheckMark, { className: "check-icon" }) }) })] }) }, key));
                                        }) })] }), jsxRuntime.jsx("div", { className: "bottom-utility", children: jsxRuntime.jsxs(ButtonPrimary, { className: "back-button", onClick: () => updateActiveWindow("0"), children: [jsxRuntime.jsx(icons.ArrowLeft, { className: "button-icon" }), jsxRuntime.jsx("span", { children: localization.goBackTitle })] }) })] })] }) }) }));
}

const renderFilterFnsActionsMenu = (key, hideMenu, dataTools, localization) => {
    const activeColFilterFn = dataTools.getColumnFilterFn(key).current;
    const currentColumn = dataTools.getColumn(key);
    const columnType = currentColumn?.filteringProps?.type;
    let baseFns = [
        {
            key: "equals",
            symbol: "=",
            label: localization.filterEquals,
        },
        {
            key: "notEquals",
            symbol: "≠",
            label: localization.filterNotEquals,
        },
        {},
        {
            key: "between",
            symbol: "⇿",
            label: localization.filterBetween,
        },
        {
            key: "betweenInclusive",
            symbol: "⬌",
            label: localization.filterBetweenInclusive,
        },
        {},
        {
            key: "greaterThan",
            symbol: ">",
            label: localization.filterGreaterThan,
        },
        {
            key: "greaterThanOrEqualTo",
            symbol: "≥",
            label: localization.filterGreaterThanOrEqualTo,
        },
        {
            key: "lessThan",
            symbol: "<",
            label: localization.filterLessThan,
        },
        {
            key: "lessThanOrEqualTo",
            symbol: "≤",
            label: localization.filterLessThanOrEqualTo,
        },
        {},
        {
            key: "empty",
            symbol: "∅",
            label: localization.filterEmpty,
        },
        {
            key: "notEmpty",
            symbol: "!∅",
            label: localization.filterNotEmpty,
        },
    ];
    const restrictedFns = [
        {
            key: "contains",
            symbol: "*",
            label: localization.filterContains,
        },
        {
            key: "fuzzy",
            symbol: "≈",
            label: localization.filterFuzzy,
        },
        {
            key: "startsWith",
            symbol: "a",
            label: localization.filterStartsWith,
        },
        {
            key: "endsWith",
            symbol: "z",
            label: localization.filterEndsWith,
        },
        {},
    ];
    if (columnType !== "date" && columnType !== "select")
        baseFns = [...restrictedFns, ...baseFns];
    const isEmpty = (obj) => !obj.key;
    function applyDefaultFilterFns(values) {
        const defaultFilterFnOptions = currentColumn?.filteringProps?.defaultFilterFnOptions;
        if (defaultFilterFnOptions) {
            const valuesToApply = [];
            for (let index = 0; index < values.length; index++) {
                const currItem = values[index];
                if ((isEmpty(currItem) && valuesToApply[valuesToApply.length - 1]?.key) ||
                    defaultFilterFnOptions.includes(currItem.key))
                    valuesToApply.push(currItem);
            }
            const lastItem = valuesToApply[valuesToApply.length - 1];
            if (isEmpty(lastItem))
                valuesToApply.pop();
            return valuesToApply;
        }
        return values;
    }
    return applyDefaultFilterFns(baseFns).map((it) => {
        if (it.key)
            return {
                content: (jsxRuntime.jsxs("div", { className: "content-wrapper", children: [jsxRuntime.jsx("span", { className: "symbol", children: it.symbol }), jsxRuntime.jsx("span", { children: it.label })] })),
                isSelected: it.key === activeColFilterFn,
                onClick: () => {
                    dataTools.updateCurrentFilterFn(key, it.key);
                    hideMenu();
                },
            };
        return {};
    });
};

const renderHeaderActionsMenu = (key, hideMenu, gridTools, dataTools, gridProps, localization, icons) => {
    return [
        ...(gridProps.pinnedColumns?.enabled === true
            ? [
                {
                    symbol: gridTools.pinnedColumns.left.includes(key) ? icons.Unpin : icons.PinLeft,
                    label: gridTools.pinnedColumns.left.includes(key) ? localization.unpinColumn : localization.pinColumnToLeft,
                    key: "pin-left",
                    onClick: () => {
                        gridTools.updatePinnedColumns(key, "left");
                        hideMenu();
                    },
                },
                {
                    symbol: gridTools.pinnedColumns.right.includes(key) ? icons.Unpin : icons.PinRight,
                    label: gridTools.pinnedColumns.right.includes(key) ? localization.unpinColumn : localization.pinColumnToRight,
                    key: "pin-right",
                    onClick: () => {
                        gridTools.updatePinnedColumns(key, "right");
                        hideMenu();
                    },
                },
            ]
            : []),
        gridProps.columnVisibilityOptions?.enabled && gridProps.pinnedColumns?.enabled ? {} : undefined,
        ...(gridProps.columnVisibilityOptions?.enabled === true
            ? [
                {
                    symbol: icons.Hidden,
                    label: localization.hideColumn,
                    key: "hide",
                    onClick: () => {
                        gridTools.updateColumnVisibility(key);
                        hideMenu();
                    },
                },
            ]
            : []),
        gridProps.columnVisibilityOptions?.enabled || gridProps.pinnedColumns?.enabled ? {} : undefined,
        {
            symbol: icons.ClearFilters,
            label: localization.clearFilers,
            key: "clear-filters",
            onClick: () => {
                dataTools.resetCurrentFilters();
                hideMenu();
            },
        },
    ].map((it) => {
        if (it && Object.keys(it).length > 0) {
            return {
                ...it,
                content: (jsxRuntime.jsxs("div", { className: "content-wrapper", children: [it.symbol && jsxRuntime.jsx(it.symbol, { className: "symbol-icon" }), jsxRuntime.jsx("span", { children: it.label })] })),
            };
        }
        return it;
    });
};

const ActionsMenuConstructor = React__default["default"].forwardRef(({ children, visible, onHide, className, updatePosition, ...props }, ref) => {
    const MAIN_INDEX = "__action_base";
    const { icons, localization } = useDataGridStaticContext();
    const [activeWindowIndex, setActiveWindowIndex] = React.useState(MAIN_INDEX);
    const isValidActionMenu = (children) => !React__default["default"].isValidElement(children) && Array.isArray(children);
    function generateKey(index) {
        return index + "__action_menu_key";
    }
    function updateActiveWindow(index) {
        setActiveWindowIndex(index);
    }
    const renderChildren = (children, isSubMenu = false) => {
        let childrenCopy = children;
        if (isSubMenu) {
            childrenCopy = [
                {
                    renderCustomComponent: (jsxRuntime.jsxs(ButtonPrimary, { onClick: () => updateActiveWindow(MAIN_INDEX), className: "back-button", children: [jsxRuntime.jsx(icons.ArrowLeft, { className: "button-icon" }), jsxRuntime.jsx("span", { children: localization.goBackTitle })] })),
                    onClick: () => updateActiveWindow(MAIN_INDEX),
                    className: "back-button-wrapper",
                },
                ...children,
            ];
        }
        return childrenCopy
            .filter((x) => x !== undefined)
            .map((listItem, i) => {
            if (Object.keys(listItem).length === 0)
                return jsxRuntime.jsx("div", { className: "divider" }, i + "_actions_divider");
            const key = generateKey(i);
            return (jsxRuntime.jsx("div", { tabIndex: i, className: cs("button-wrapper", listItem.className), children: listItem.renderCustomComponent ? (listItem.renderCustomComponent) : (jsxRuntime.jsxs("button", { className: cs(listItem?.isSelected && "selected"), onClick: listItem?.subMenu ? () => updateActiveWindow(key) : listItem.onClick, type: "button", children: [jsxRuntime.jsx("span", { className: "button-content", children: listItem?.content }), listItem.isSelected && jsxRuntime.jsx(icons.CheckMark, { className: "selected-icon" })] })) }, key));
        });
    };
    const generateActionsPortal = React.useMemo(() => {
        if (isValidActionMenu(children)) {
            const availableSubMenus = [];
            const subMenuIndexes = [];
            for (let index = 0; index < children.length; index++) {
                const listItem = children[index];
                if (listItem && listItem.subMenu) {
                    const key = generateKey(index);
                    subMenuIndexes.push(key);
                    availableSubMenus.push(jsxRuntime.jsx(Portal.Window, { index: key, children: renderChildren(listItem.subMenu.items, true) }, key));
                }
            }
            if (subMenuIndexes.length > 0) {
                availableSubMenus.push(jsxRuntime.jsx(Portal.Window, { index: MAIN_INDEX, children: renderChildren(children) }, MAIN_INDEX));
                return (jsxRuntime.jsx(Portal.Container, { indexOrder: [MAIN_INDEX, ...subMenuIndexes], activeWindowIndex: activeWindowIndex, children: availableSubMenus }));
            }
            return renderChildren(children);
        }
        return children;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeWindowIndex, children]);
    function onMenuHide(visible) {
        if (MAIN_INDEX !== activeWindowIndex)
            updateActiveWindow(MAIN_INDEX);
        onHide?.(visible);
    }
    return (jsxRuntime.jsx(Animations.Auto, { onAnimationFinish: onMenuHide, duration: 200, visible: visible, children: jsxRuntime.jsx("div", { ref: ref, className: cs("data-grid-actions-menu-constructor", className), ...props, children: jsxRuntime.jsx("div", { className: "actions-menu-list", children: generateActionsPortal }) }) }));
});

function useActionsMenuFactory(factory, bodyProps, onOpen, onHide) {
    const emptyState = {
        data: undefined,
        visible: false,
        identifier: undefined,
        position: undefined,
    };
    const [actionsMenuProps, setActionsMenuProps] = React.useState(emptyState);
    const actionsMenuRef = React.useRef(null);
    function displayActionsMenu({ identifier, position, data }) {
        onOpen?.(data);
        setActionsMenuProps((prev) => ({
            data,
            position: position,
            visible: prev.identifier !== identifier || !prev?.visible,
            identifier,
        }));
    }
    function hideActionsMenu(destroyOnClose = false) {
        setActionsMenuProps((prev) => (!destroyOnClose ? { ...prev, visible: false } : emptyState));
        onHide?.();
    }
    useDetectOutsideClick(actionsMenuRef, () => hideActionsMenu());
    useDetectKeyPress((key) => key === "Escape" && hideActionsMenu());
    function handleAnimation(visible) {
        if (!visible)
            hideActionsMenu(true);
        else
            updatePosition();
    }
    function adjustPosition(position, width = 300, height = 300) {
        if (!position)
            return { xAxis: 0, yAxis: 0 };
        const widthSpacing = window.innerWidth - position.xAxis;
        const heightSpacing = window.innerHeight - position.yAxis;
        let positionToUpdate = { ...position };
        if (widthSpacing < width) {
            positionToUpdate.xAxis = window.innerWidth - (width + 20);
        }
        if (heightSpacing < height) {
            positionToUpdate.yAxis = window.innerHeight - (height + 20 + (actionsMenuProps?.identifier === "settings" ? 20 : 0));
        }
        return positionToUpdate;
    }
    function updatePosition() {
        const boundingClientProps = actionsMenuRef.current?.getBoundingClientRect();
        if (boundingClientProps) {
            setActionsMenuProps((prev) => {
                return { ...prev, position: adjustPosition(prev.position, boundingClientProps.width, boundingClientProps.height) };
            });
        }
    }
    const renderMenu = React.useMemo(() => actionsMenuProps.data &&
        React__default["default"].createElement(ActionsMenuConstructor, {
            visible: actionsMenuProps.visible && !!actionsMenuProps.position?.xAxis && !!actionsMenuProps.position?.yAxis,
            style: {
                left: actionsMenuProps.position?.xAxis,
                top: actionsMenuProps.position?.yAxis,
            },
            ref: actionsMenuRef,
            onHide: handleAnimation,
            children: factory(actionsMenuProps, hideActionsMenu, updatePosition),
            updatePosition,
            ...bodyProps,
        }), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actionsMenuProps, factory]);
    return [renderMenu, actionsMenuProps, displayActionsMenu, hideActionsMenu];
}

/* eslint-disable @typescript-eslint/no-unused-vars */
function useMenuFactory({ dataTools, gridTools, gridProps, localization, icons, }) {
    const filterFnsMenuContent = React.useCallback((key, hideMenu) => renderFilterFnsActionsMenu(key, hideMenu, dataTools, localization), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataTools.currentFilterFns, localization]);
    const headerMenuContent = React.useCallback((key, hideMenu) => renderHeaderActionsMenu(key, hideMenu, gridTools, dataTools, gridProps, localization, icons), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
        gridTools.pinnedColumns,
        gridTools.updateColumnVisibility,
        gridTools.updatePinnedColumns,
        gridProps.columnVisibilityOptions?.enabled,
        gridProps.pinnedColumns?.enabled,
    ]);
    const [dataActionsMenu, _, displayDataActionsMenu] = useActionsMenuFactory((props, hide) => gridProps.rowActionsMenu?.render?.(props.data, hide) ?? [], undefined, gridProps.rowActionsMenu?.onOpen, () => {
        gridProps.rowActionsMenu?.onHide?.();
        gridTools.clearActiveRow();
    });
    const [headerActionsMenu, __, displayHeaderActionsMenu] = useActionsMenuFactory((props, hide) => headerMenuContent(props.identifier, hide));
    const [filterFnsMenu, filterFnsMenuProps, displayFilterFnsMenu] = useActionsMenuFactory((props, hide) => filterFnsMenuContent(props.identifier, hide), {
        className: "filter-fns-menu",
    });
    const [optionsMenu, optionsMenuProps, displayOptionsMenu] = useActionsMenuFactory((prop, hide, updatePosition) => React__default["default"].createElement(OptionsMenu, {
        updateColumnVisibility: gridTools.updateColumnVisibility,
        visibleColumnKeys: gridTools.visibleColumns,
        isDarkModeEnabled: gridTools.isDarkModeEnabled,
        isFullScreenModeEnabled: gridTools.isFullScreenModeEnabled,
        isFilterMenuVisible: gridTools.isFilterMenuVisible,
        isColumnGroupingEnabled: gridTools.isColumnGroupingEnabled,
        updateDarkMode: gridTools.updateDarkMode,
        updateFullScreenMode: gridTools.updateFullScreenMode,
        updateActiveHeader: gridTools.updateActiveHeader,
        updateFilterMenuVisibility: gridTools.updateFilterMenuVisibility,
        updateColumnGrouping: gridTools.updateColumnGrouping,
        optionsMenuProps: gridProps.settingsMenu,
        isColumnVisibilityEnabled: !!gridProps.columnVisibilityOptions?.enabled,
        isColumnFilteringEnabled: gridTools.isColumnFilteringEnabled,
        updatePosition: updatePosition,
    }), {
        className: "data-grid-options-menu",
    });
    return {
        dataActionsMenu,
        displayDataActionsMenu,
        headerActionsMenu,
        displayHeaderActionsMenu,
        filterFnsMenu,
        filterFnsMenuProps,
        displayFilterFnsMenu,
        settingsMenu: {
            optionsMenu,
            optionsMenuProps,
            displayOptionsMenu,
        },
    };
}

function DataGrid(gridProps) {
    const { columnsToRender, dataGridProps, dataTools, defaultStyling, pinnedColumnsToRender, gridTools, totalColumnsWidth, totalColumns, initializedColumns, groupedColumnHeaders, } = useGridFactory(gridProps);
    const { dataActionsMenu, displayDataActionsMenu, displayFilterFnsMenu, displayHeaderActionsMenu, filterFnsMenu, filterFnsMenuProps, headerActionsMenu, settingsMenu, } = useMenuFactory({
        ...dataGridProps,
        gridProps,
        dataTools,
        gridTools,
    });
    React.useImperativeHandle(gridProps.dataGridApiRef, () => ({
        getCurrentData: () => dataTools.dataWithoutPagination,
        getCurrentColumns: () => totalColumns,
        getCurrentFilters: () => dataTools.currentFilters,
        getCurrentPagination: () => dataTools.currentPagination,
        resetCurrentFilters: dataTools.resetCurrentFilters,
        getSelectedRows: () => gridTools.selectedRows,
        clearSelectedRows: () => gridTools.clearSelectedRows(),
        updateSelectedRows: (value) => Array.isArray(value) ? gridTools.updateSelectedRowsMultiple(value) : gridTools.updateSelectedRows(value),
    }), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
        dataTools.currentFilters,
        dataTools.currentPagination,
        dataTools.dataWithoutPagination,
        dataTools.resetCurrentFilters,
        gridTools.selectedRows,
        totalColumns,
    ]);
    function renderContextOverlay() {
        const contextOverlayElements = (jsxRuntime.jsxs(React__default["default"].Fragment, { children: [gridProps.rowActionsMenu?.enabled && dataActionsMenu, gridProps.headerActionsMenu?.enabled !== false && headerActionsMenu, gridProps.settingsMenu?.enabled !== false && settingsMenu.optionsMenu, filterFnsMenu] }));
        if (gridProps.contextMenuRenderRoot)
            return reactDom.createPortal(jsxRuntime.jsx("div", { className: "data-grid", "data-theme": gridTools.isDarkModeEnabled ? "dark" : "light", style: defaultStyling, children: contextOverlayElements }), gridProps.contextMenuRenderRoot);
        return contextOverlayElements;
    }
    React.useEffect(() => {
        if (gridTools.expandedRowKeys.size > 0)
            gridTools.closeExpandedRows();
        gridTools.clearExpandRowHeightCache();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataTools.data]);
    return (jsxRuntime.jsx(DataGridStaticContext.Provider, { value: {
            ...dataGridProps,
            columnVisibilityProps: gridProps.columnVisibilityOptions?.defaultValues ?? gridProps.columns,
            striped: gridProps.striped !== false,
            animationProps: {
                duration: 300,
            },
            isRowClickable: !!gridProps.onRowClick,
            virtualizationEnabled: gridTools.isVirtualizationIsEnabled,
            groupingHeaderEnabled: gridTools.isColumnGroupingEnabled,
            defaultLocale: gridProps.localization?.defaultLocale ?? ConstProps.defaultLocale,
        }, children: jsxRuntime.jsx(DataGrid$1, { theme: gridProps.theme ?? "light", columnsToRender: columnsToRender, groupedColumnHeaders: groupedColumnHeaders, pinnedColumns: pinnedColumnsToRender, totalColumnsWidth: totalColumnsWidth, gridProps: gridProps, style: defaultStyling, initializedColumns: initializedColumns, dataTools: dataTools, gridTools: gridTools, displayDataActionsMenu: displayDataActionsMenu, displayHeaderActionsMenu: displayHeaderActionsMenu, filterFnsMenu: {
                displayFilterFnsMenu,
                activeFilterMenuKey: filterFnsMenuProps.identifier,
            }, optionsMenu: {
                displayOptionsMenu: settingsMenu.displayOptionsMenu,
                isVisible: settingsMenu.optionsMenuProps.visible,
            }, children: renderContextOverlay() }) }));
}

exports["default"] = DataGrid;
