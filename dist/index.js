Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$9 = ".Table-module_Body__yaKgp {\n  box-shadow: 0 12px 20px 6px rgb(104 112 118 / 0.08);\n  display: flex;\n  flex-direction: column;\n  border-radius: 18px;\n  overflow: auto hidden;\n  height: 100%;\n  /* dark-mode */\n  /* background: #1f1e1e; */\n}\n\n.Table-module_DataTable__tSBxJ {\n  position: relative;\n  overflow: hidden;\n}\n\ntable.Table-module_Table__rnUbg {\n  table-layout: fixed;\n  width: 100%;\n  border-radius: 2px 2px 0 0;\n  border-collapse: separate;\n  border-spacing: 0;\n  border-spacing: 0 5px;\n  /* height: 100%; */\n}\n\ntable.Table-module_Table__rnUbg:not(.Table-module_HeaderTable__kMHZY) {\n  padding: 0.75rem;\n}\n\ntable.Table-module_Table__rnUbg.Table-module_HeaderTable__kMHZY {\n  padding: 0.75rem 0.75rem 0 0.75rem;\n}\n\ntable.Table-module_Table__rnUbg td {\n  padding-top: 0.625rem;\n  padding-bottom: 0.625rem;\n  padding-right: 0.625rem;\n  transition: background 0.25s ease 0s, color 0.25s ease 0s,\n    opacity 0.25s ease 0s;\n  /* dark-mode */\n  /* color: rgb(199, 193, 193); */\n}\n\ntable.Table-module_Table__rnUbg td:first-child {\n  padding-left: 1rem;\n  border-radius: 12px 0 0 12px;\n}\n\ntable.Table-module_Table__rnUbg td:last-child {\n  padding-right: 1rem;\n  border-radius: 0 12px 12px 0;\n}\n\ntable.Table-module_Table__rnUbg thead tr th:first-child {\n  padding-left: 1rem;\n  border-top-left-radius: 12px;\n  border-bottom-left-radius: 12px;\n}\n\ntable.Table-module_Table__rnUbg thead tr th:last-child {\n  padding-right: 1rem;\n  border-top-right-radius: 12px;\n  border-bottom-right-radius: 12px;\n}\n\ntable.Table-module_Table__rnUbg thead tr th {\n  height: 2.5rem;\n  cursor: default;\n  background: #f1f3f5;\n  color: #7e868c;\n  font-size: 0.8rem;\n  text-align: left;\n  position: relative;\n  text-transform: uppercase;\n  font-weight: 700;\n  transition: 0.3s ease-in-out background;\n  /* dark-mode */\n  /* background: #4a4f56;\n  color: rgb(199, 193, 193); */\n}\n\ntable.Table-module_Table__rnUbg.Table-module_Hoverable__CzVvM tr:not(.Table-module_Active__AG-bc):hover td {\n  opacity: 1;\n  background-color: #f1f3f5;\n}\n\ntable.Table-module_Table__rnUbg.Table-module_Clickable__1MRHN tr.Table-module_Active__AG-bc td {\n  opacity: 0.8;\n  background-color: var(--color-background);\n}\n\ntable.Table-module_Table__rnUbg.Table-module_Clickable__1MRHN tr {\n  cursor: pointer;\n}\n\ntable.Table-module_Table__rnUbg tr.Table-module_Active__AG-bc {\n  color: var(--color-primary);\n  font-weight: 500;\n}\n\ntable.Table-module_Table__rnUbg .Table-module_Checkbox__-Lglm {\n  cursor: pointer;\n}\n\ntable.Table-module_Table__rnUbg .Table-module_ContextMenuButton__g7MkN {\n  all: unset;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding: 0 5px;\n  position: relative;\n  width: 15px;\n  height: 25px;\n  border-radius: 10px;\n  cursor: pointer;\n  transition: 0.3s ease-in-out background;\n}\ntable.Table-module_Table__rnUbg .Table-module_ContextMenuButton__g7MkN:hover {\n  background: var(--color-background);\n}\n\ntable.Table-module_Table__rnUbg .Table-module_ContextMenuButton__g7MkN:active .Table-module_ContextMenuIcon__ft1j0 {\n  scale: 0.8;\n}\n\ntable.Table-module_Table__rnUbg thead th:not(.Table-module_ContextHeader__XHjv1):hover {\n  background: #eceef0;\n  /* dark-mode */\n  /* background: #4a4f56; */\n}\n\n.Table-module_FilterHeader__uaRrI .Table-module_FilterWrapper__BEUIt .Table-module_SearchButton__jh9u0 .Table-module_SearchIcon__PwjFV {\n  width: 15px;\n}\n\n.Table-module_FilterHeader__uaRrI .Table-module_FilterWrapper__BEUIt .Table-module_SearchButton__jh9u0 .Table-module_SearchIcon__PwjFV.Table-module_Active__AG-bc,\n.Table-module_FilterHeader__uaRrI .Table-module_FilterWrapper__BEUIt .Table-module_SearchButton__jh9u0 .Table-module_SearchIcon__PwjFV.Table-module_Active__AG-bc path {\n  fill: var(--color-primary);\n}\n\n.Table-module_FilterHeader__uaRrI .Table-module_FilterWrapper__BEUIt .Table-module_SearchButton__jh9u0 .Table-module_SearchIcon__PwjFV,\n.Table-module_FilterHeader__uaRrI .Table-module_FilterWrapper__BEUIt .Table-module_SearchButton__jh9u0 .Table-module_SearchIcon__PwjFV path {\n  color: #7e868c;\n  fill: #7e868c;\n}\n\n.Table-module_FilterHeader__uaRrI .Table-module_FilterWrapper__BEUIt .Table-module_SearchButton__jh9u0 {\n  all: unset;\n  cursor: pointer;\n  border-radius: 10px;\n  transition: 0.3s ease-in-out background;\n  width: 25px;\n  height: 25px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.Table-module_FilterHeader__uaRrI .Table-module_FilterWrapper__BEUIt {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  gap: 5px;\n}\n\n.Table-module_FilterHeader__uaRrI .Table-module_FilterWrapper__BEUIt .Table-module_SearchButton__jh9u0:active .Table-module_SearchIcon__PwjFV {\n  scale: 0.9;\n}\n\n.Table-module_FilterHeader__uaRrI .Table-module_FilterWrapper__BEUIt .Table-module_SearchButton__jh9u0:hover {\n  background: var(--color-background);\n}\n\n.Table-module_FilterHeader__uaRrI {\n  position: relative;\n}\n\n.Table-module_Ellipsis__-OdIi {\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  word-break: keep-all;\n  position: relative;\n  overflow-wrap: break-word;\n  user-select: none;\n  overflow: hidden;\n}\n";
var styles$9 = {"Body":"Table-module_Body__yaKgp","DataTable":"Table-module_DataTable__tSBxJ","Table":"Table-module_Table__rnUbg","HeaderTable":"Table-module_HeaderTable__kMHZY","Hoverable":"Table-module_Hoverable__CzVvM","Active":"Table-module_Active__AG-bc","Clickable":"Table-module_Clickable__1MRHN","Checkbox":"Table-module_Checkbox__-Lglm","ContextMenuButton":"Table-module_ContextMenuButton__g7MkN","ContextMenuIcon":"Table-module_ContextMenuIcon__ft1j0","ContextHeader":"Table-module_ContextHeader__XHjv1","FilterHeader":"Table-module_FilterHeader__uaRrI","FilterWrapper":"Table-module_FilterWrapper__BEUIt","SearchButton":"Table-module_SearchButton__jh9u0","SearchIcon":"Table-module_SearchIcon__PwjFV","Ellipsis":"Table-module_Ellipsis__-OdIi"};
styleInject(css_248z$9);

class StringExtensions {
    static Empty = "";
    static WhiteSpace = " ";
    static IsNullOrEmpty = (val) => val === undefined || val === null || val.trim() === this.Empty;
}

const concatStyles = (...args) => args
    .filter((x) => x !== "undefined" && x !== undefined && x !== false)
    .join(StringExtensions.WhiteSpace);

var css_248z$8 = "@keyframes Fade-module_fade-in__vGtla {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n\n@keyframes Fade-module_fade-out__9TjLL {\n  from {\n    opacity: 1;\n  }\n  to {\n    opacity: 0;\n  }\n}\n\n.Fade-module_FadeIn__qQqrY,\n.Fade-module_FadeOut__9c-Gn {\n  animation-timing-function: ease-in-out;\n  animation-fill-mode: forwards;\n}\n\n.Fade-module_FadeIn__qQqrY {\n  animation-name: Fade-module_fade-in__vGtla;\n}\n.Fade-module_FadeOut__9c-Gn {\n  animation-name: Fade-module_fade-out__9TjLL;\n}\n\n.Fade-module_Disable__R-Y21 {\n  z-index: -1 !important;\n}\n";
var styles$8 = {"FadeIn":"Fade-module_FadeIn__qQqrY","FadeOut":"Fade-module_FadeOut__9c-Gn","fade-in":"Fade-module_fade-in__vGtla","fade-out":"Fade-module_fade-out__9TjLL","Disable":"Fade-module_Disable__R-Y21"};
styleInject(css_248z$8);

const Fade = ({ className, children, visible = true, onAnimationFinish, duration = 300, ...props }) => {
    const [callTimeout, setCallTimeout] = React.useState();
    const [shouldShow, setShouldShow] = React.useState(visible);
    const handleAnimation = (visible) => {
        if (callTimeout !== undefined) {
            clearTimeout(callTimeout);
            setCallTimeout(undefined);
        }
        setCallTimeout(setTimeout(() => {
            setShouldShow(visible);
            onAnimationFinish?.(visible);
        }, !visible ? duration - duration / 10 : 0));
    };
    React.useEffect(() => {
        handleAnimation(visible);
    }, [visible]);
    return (jsxRuntime.jsx("div", { className: concatStyles(styles$8.Body, className, visible ? styles$8.FadeIn : styles$8.FadeOut, !shouldShow && styles$8.Disable), style: {
            animationDuration: `${duration}ms`,
        }, ...props, children: shouldShow && children }));
};

var css_248z$7 = ".ContextMenu-module_ContextAnimator__93xlt {\n  z-index: 99;\n  position: fixed;\n}\n\n.ContextMenu-module_ContextMenuOverlay__aQAwl {\n  box-shadow: 0 12px 20px 6px rgb(104 112 118 / 0.08);\n  z-index: 99;\n  width: 120px;\n  display: flex;\n  flex-direction: column;\n  border-radius: 18px;\n  overflow: hidden;\n  background-color: #fff;\n  padding: 10px;\n  position: fixed;\n}\n\n.ContextMenu-module_ContextMenuOverlay__aQAwl button {\n  all: unset;\n  display: flex;\n  align-items: center;\n  border-radius: 10px;\n  width: 100%;\n  padding: 5px 0;\n  cursor: pointer;\n}\n\n.ContextMenu-module_ContextMenuOverlay__aQAwl button > span {\n  margin-left: 10px;\n}\n.ContextMenu-module_ContextMenuOverlay__aQAwl button:hover {\n  background-color: #f1f3f5;\n}\n";
var styles$7 = {"ContextAnimator":"ContextMenu-module_ContextAnimator__93xlt","ContextMenuOverlay":"ContextMenu-module_ContextMenuOverlay__aQAwl"};
styleInject(css_248z$7);

const ContextMenuOverlay = React__default["default"].forwardRef(({ elements, visible, onHide, className, ...props }, ref) => (jsxRuntime.jsx(Fade, { onAnimationFinish: onHide, className: styles$7.ContextAnimator, visible: visible, children: jsxRuntime.jsx("div", { ref: ref, className: concatStyles(styles$7.ContextMenuOverlay, className), ...props, children: elements
            .filter((x) => x !== undefined)
            .map((elem) => (jsxRuntime.jsx("div", { children: jsxRuntime.jsx("button", { onClick: elem?.onClick, children: jsxRuntime.jsx("span", { children: elem?.content }) }, elem?.key) }, elem?.key))) }) })));

function Close(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }) }));
}

function NoResult(props) {
    return (jsxRuntime.jsxs("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: [jsxRuntime.jsx("path", { d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3 6.08 3 3.28 5.64 3.03 9h2.02C5.3 6.75 7.18 5 9.5 5 11.99 5 14 7.01 14 9.5S11.99 14 9.5 14c-.17 0-.33-.03-.5-.05v2.02c.17.02.33.03.5.03 1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z" }), jsxRuntime.jsx("path", { d: "M6.47 10.82 4 13.29l-2.47-2.47-.71.71L3.29 14 .82 16.47l.71.71L4 14.71l2.47 2.47.71-.71L4.71 14l2.47-2.47z" })] }));
}

var css_248z$6 = ".Spinner-module_Body__YwESQ .Spinner-module_Spinner__5D5fp {\n  bottom: 36px;\n  animation: Spinner-module_preloader-spinner__528de 0.5s linear infinite;\n}\n\n.Spinner-module_Body__YwESQ .Spinner-module_Spinner__5D5fp .Spinner-module_SpinnerIcon__BmWrY {\n  stroke: var(--color-primary);\n  stroke-width: 3px;\n  stroke-dasharray: 314%, 314%;\n  animation: Spinner-module_preloader-spinner-icon-anim__wFX3o 1s linear infinite alternate;\n}\n\n@keyframes Spinner-module_preloader-logo-anim__rVJzn {\n  0% {\n    filter: opacity(0);\n    transform: translateY(-30px);\n  }\n\n  100% {\n    filter: opacity(1);\n    transform: translateY(0);\n  }\n}\n\n@keyframes Spinner-module_preloader-title-anim__OtuR9 {\n  0% {\n    filter: opacity(0);\n  }\n\n  100% {\n    filter: opacity(1);\n  }\n}\n\n@keyframes Spinner-module_preloader-spinner__528de {\n  0% {\n    transform: rotate(0);\n  }\n\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes Spinner-module_preloader-spinner-icon-anim__wFX3o {\n  0% {\n    stroke-dasharray: 0%, 314%;\n  }\n\n  100% {\n    stroke-dasharray: 314%, 314%;\n  }\n}\n";
var styles$6 = {"Body":"Spinner-module_Body__YwESQ","Spinner":"Spinner-module_Spinner__5D5fp","preloader-spinner":"Spinner-module_preloader-spinner__528de","SpinnerIcon":"Spinner-module_SpinnerIcon__BmWrY","preloader-spinner-icon-anim":"Spinner-module_preloader-spinner-icon-anim__wFX3o","preloader-logo-anim":"Spinner-module_preloader-logo-anim__rVJzn","preloader-title-anim":"Spinner-module_preloader-title-anim__OtuR9"};
styleInject(css_248z$6);

const Spinner = ({ className, children, size = 32, ...props }) => {
    const dimensions = {
        width: size,
        height: size,
    };
    return (jsxRuntime.jsx("div", { className: concatStyles(styles$6.Body, className), ...props, children: jsxRuntime.jsx("div", { className: styles$6.Spinner, style: {
                left: `calc(50vw - calc(${32}px / 2px))`,
                ...dimensions,
            }, children: jsxRuntime.jsx("svg", { className: styles$6.SpinnerIcon, viewBox: "0 0 24 24", style: dimensions, children: jsxRuntime.jsx("path", { d: "M 22.49772,12.000001 A 10.49772,10.497721 0 0 1 12,22.497722 10.49772,10.497721 0 0 1 1.5022797,12.000001 10.49772,10.497721 0 0 1 12,1.5022797 10.49772,10.497721 0 0 1 22.49772,12.000001 Z", fill: "none", strokeLinecap: "round" }) }) }) }));
};

var css_248z$5 = ".FilterMenu-module_ContextAnimator__FmW-h {\n  z-index: 99;\n  position: fixed;\n}\n\n.FilterMenu-module_SearchWrapper__Msv8U {\n  z-index: 99;\n  position: fixed;\n  padding: 10px;\n  background: #fff;\n  box-shadow: 0 12px 20px 6px rgb(104 112 118 / 0.08);\n  border-radius: 10px;\n  width: 250px;\n  min-height: 300px;\n  display: flex;\n  flex-direction: column;\n}\n\n.FilterMenu-module_SearchWrapper__Msv8U .FilterMenu-module_SearchInputWrapper__57O47 {\n  /* flex: 1 1 0%; */\n  border-radius: 0.5rem;\n  background: #f1f3f5;\n  display: inline-flex;\n  vertical-align: middle;\n  align-items: center;\n  user-select: none;\n  width: 100%;\n  height: 40px;\n  padding-right: 5px;\n}\n\n.FilterMenu-module_SearchWrapper__Msv8U .FilterMenu-module_SearchInputWrapper__57O47 input {\n  padding: 5px;\n  text-indent: 5px;\n  font-weight: 500;\n  font-size: 14px;\n  background: transparent;\n  border: none;\n  color: #11181c;\n  border-radius: 0px;\n  outline: none;\n  width: 100%;\n  height: 100%;\n  min-width: 0px;\n  appearance: none;\n}\n\n.FilterMenu-module_SearchWrapper__Msv8U .FilterMenu-module_SearchInputWrapper__57O47 .FilterMenu-module_ClearIcon__tOlFx {\n  width: 15px;\n  fill: #fff;\n}\n\n.FilterMenu-module_SearchWrapper__Msv8U .FilterMenu-module_SearchInputWrapper__57O47 .FilterMenu-module_ClearButton__StcWw {\n  all: unset;\n  border-radius: 50%;\n  background-color: #889096;\n  width: 22px;\n  height: 19px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  cursor: pointer;\n  transition: 0.3s ease-in-out opacity;\n  margin-right: 2px;\n  opacity: 0;\n}\n.FilterMenu-module_SearchWrapper__Msv8U .FilterMenu-module_SearchInputWrapper__57O47:hover .FilterMenu-module_ClearButton__StcWw {\n  opacity: 1;\n}\n\n.FilterMenu-module_SearchWrapper__Msv8U .FilterMenu-module_SearchInputWrapper__57O47 .FilterMenu-module_ClearButton__StcWw:active {\n  opacity: 0.7;\n}\n\n.FilterMenu-module_SearchWrapper__Msv8U .FilterMenu-module_FilterContainer__VPvU3 {\n  max-height: 200px;\n  overflow-y: auto;\n  margin-top: 20px;\n  background-color: #f1f3f5;\n  border-radius: 0.5rem;\n}\n\n.FilterMenu-module_FilterContainer__VPvU3 ul {\n  padding: 0 4px;\n}\n\nli.FilterMenu-module_FilterElement__sB5k2 {\n  transition: 0.3s ease-in-out background;\n  list-style: none;\n  border-radius: 6px;\n  overflow: hidden;\n  padding: 2px 2px 2px 15px;\n  margin: 4px 0;\n}\n\nli.FilterMenu-module_FilterElement__sB5k2 button {\n  all: unset;\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n}\n\nli.FilterMenu-module_FilterElement__sB5k2 button span {\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  word-break: keep-all;\n  position: relative;\n  overflow-wrap: break-word;\n  user-select: none;\n  overflow: hidden;\n}\n\nli.FilterMenu-module_FilterElement__sB5k2 .FilterMenu-module_CloseIconWrapper__-CBnH {\n  margin-left: auto;\n  display: flex;\n  align-items: center;\n}\nli.FilterMenu-module_FilterElement__sB5k2 button .FilterMenu-module_CloseIcon__bUsh4 {\n  width: 20px;\n  fill: var(--color-primary);\n}\n\nli.FilterMenu-module_FilterElement__sB5k2:hover {\n  background: var(--color-background);\n}\n\nli.FilterMenu-module_FilterElement__sB5k2.FilterMenu-module_Active__6pLuS {\n  background: var(--color-background);\n  font-weight: 600;\n}\n\nli.FilterMenu-module_NoResult__YUN3A .FilterMenu-module_NoResultIcon__2MPz- {\n  width: 20px;\n  fill: var(--color-primary);\n}\n\nli.FilterMenu-module_NoResult__YUN3A,\nli.FilterMenu-module_LoadingWrapper__ZyAw8 {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-weight: 500;\n  gap: 10px;\n}\n\nli.FilterMenu-module_LoadingWrapper__ZyAw8 {\n  margin-top: 10px;\n}\n\n.FilterMenu-module_Bottom__iBH0i {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin-top: auto;\n}\nbutton.FilterMenu-module_ResetButton__FzFXV {\n  all: unset;\n  cursor: pointer;\n  margin-top: 20px;\n  width: 100%;\n  background: #bc083b;\n  color: #fff;\n  padding: 0 1.25rem;\n  /* box-shadow: 0 4px 14px 0 #f881ab; */\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border-radius: 10px;\n  height: 40px;\n  transition: 0.3s ease-in-out opacity, 0.3s ease-in-out transform;\n}\nbutton.FilterMenu-module_ResetButton__FzFXV:active {\n  transform: scale(0.97);\n}\nbutton.FilterMenu-module_ResetButton__FzFXV:disabled {\n  cursor: not-allowed;\n  opacity: 0.6;\n}\n\n.FilterMenu-module_SearchWrapper__Msv8U .FilterMenu-module_FilterContainer__VPvU3::-webkit-scrollbar {\n  width: 20px;\n}\n\n.FilterMenu-module_SearchWrapper__Msv8U .FilterMenu-module_FilterContainer__VPvU3::-webkit-scrollbar-track {\n  background-color: transparent;\n}\n\n.FilterMenu-module_SearchWrapper__Msv8U .FilterMenu-module_FilterContainer__VPvU3::-webkit-scrollbar-thumb {\n  background-color: #d6dee1;\n  border-radius: 5px;\n  border: 6px solid transparent;\n  background-clip: content-box;\n}\n\n.FilterMenu-module_SearchWrapper__Msv8U .FilterMenu-module_FilterContainer__VPvU3::-webkit-scrollbar-thumb:hover {\n  background-color: #a8bbbf;\n}\n";
var styles$5 = {"ContextAnimator":"FilterMenu-module_ContextAnimator__FmW-h","SearchWrapper":"FilterMenu-module_SearchWrapper__Msv8U","SearchInputWrapper":"FilterMenu-module_SearchInputWrapper__57O47","ClearIcon":"FilterMenu-module_ClearIcon__tOlFx","ClearButton":"FilterMenu-module_ClearButton__StcWw","FilterContainer":"FilterMenu-module_FilterContainer__VPvU3","FilterElement":"FilterMenu-module_FilterElement__sB5k2","CloseIconWrapper":"FilterMenu-module_CloseIconWrapper__-CBnH","CloseIcon":"FilterMenu-module_CloseIcon__bUsh4","Active":"FilterMenu-module_Active__6pLuS","NoResult":"FilterMenu-module_NoResult__YUN3A","NoResultIcon":"FilterMenu-module_NoResultIcon__2MPz-","LoadingWrapper":"FilterMenu-module_LoadingWrapper__ZyAw8","Bottom":"FilterMenu-module_Bottom__iBH0i","ResetButton":"FilterMenu-module_ResetButton__FzFXV"};
styleInject(css_248z$5);

const FilterMenu = React__default["default"].forwardRef(({ visible, fetchedFilter, updateSelectedFilters, columnKey, onHide, updateInputValue, value, selectedFilters, isServerSide, loading, localization, className, ...props }, ref) => {
    const [currentInputValue, setCurrentInputValue] = React.useState(value ?? "");
    const inputUpdateTimeout = React.useRef(null);
    function clearUpdateTimeout() {
        if (inputUpdateTimeout.current)
            clearTimeout(inputUpdateTimeout.current);
        inputUpdateTimeout.current = null;
    }
    React.useEffect(() => {
        return () => {
            clearUpdateTimeout();
        };
    }, []);
    function handleInputChange(e) {
        setCurrentInputValue(e.target.value);
        clearUpdateTimeout();
        inputUpdateTimeout.current = setTimeout(async () => {
            updateInputValue(columnKey, e.target.value);
        }, 600);
    }
    function clearInput() {
        setCurrentInputValue("");
        updateInputValue(columnKey, "");
    }
    const displaySelectedFilters = React.useMemo(() => {
        if (!selectedFilters)
            return [];
        return Array.from(selectedFilters).map((x) => (jsxRuntime.jsx("li", { className: concatStyles(styles$5.FilterElement, styles$5.Active), onClick: () => updateSelectedFilters(columnKey, `${x}`), children: jsxRuntime.jsxs("button", { type: "button", title: x, children: [jsxRuntime.jsx("span", { children: x }), jsxRuntime.jsx(Fade, { className: styles$5.CloseIconWrapper, children: jsxRuntime.jsx(Close, { className: styles$5.CloseIcon }) })] }) }, x)));
    }, [selectedFilters]);
    const mapFilters = React.useMemo(() => {
        if (loading)
            return (jsxRuntime.jsx(Fade, { children: jsxRuntime.jsxs("li", { className: styles$5.LoadingWrapper, children: [jsxRuntime.jsx(Spinner, { size: 24 }), jsxRuntime.jsx("span", { children: localization.filterLoading })] }) }));
        const filters = fetchedFilter.get(columnKey)?.filter((x) => {
            if (selectedFilters?.has(x))
                return false;
            if (isServerSide || !value)
                return true;
            let inputValue = `${value}`.toLocaleLowerCase();
            return x.toLowerCase().includes(inputValue);
        });
        if (filters?.length === 0 &&
            (!selectedFilters || selectedFilters?.size === 0))
            return (jsxRuntime.jsx(Fade, { children: jsxRuntime.jsxs("li", { className: styles$5.NoResult, children: [jsxRuntime.jsx(NoResult, { className: styles$5.NoResultIcon }), jsxRuntime.jsx("span", { children: localization.filterEmpty })] }) }));
        return filters?.map((x) => (jsxRuntime.jsx("li", { className: concatStyles(styles$5.FilterElement), onClick: () => updateSelectedFilters(columnKey, `${x}`), children: jsxRuntime.jsx("button", { children: x }) }, x)));
    }, 
    //fetchedFilter added as a result of server rendering
    [value, selectedFilters, fetchedFilter]);
    return (jsxRuntime.jsx(Fade, { onAnimationFinish: onHide, className: styles$5.ContextAnimator, visible: visible, children: jsxRuntime.jsxs("div", { ref: ref, className: concatStyles(styles$5.SearchWrapper, className), ...props, children: [jsxRuntime.jsxs("div", { className: styles$5.SearchInputWrapper, children: [jsxRuntime.jsx("input", { placeholder: localization.filterSearchPlaceholder, onChange: handleInputChange, value: currentInputValue }, columnKey), jsxRuntime.jsx("button", { type: "button", onClick: clearInput, className: styles$5.ClearButton, disabled: !(currentInputValue && currentInputValue.length > 0), children: jsxRuntime.jsx(Close, { className: styles$5.ClearIcon }) })] }), jsxRuntime.jsx("div", { className: styles$5.FilterContainer, children: jsxRuntime.jsxs("ul", { children: [displaySelectedFilters, mapFilters] }) }), jsxRuntime.jsx("div", { className: styles$5.Bottom, children: jsxRuntime.jsx("button", { disabled: !selectedFilters || selectedFilters?.size === 0, onClick: () => updateSelectedFilters(columnKey), className: styles$5.ResetButton, children: jsxRuntime.jsx("span", { children: localization.filterReset }) }) })] }) }));
});

function ArrowLeft(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" }) }));
}

function ArrowRight(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" }) }));
}

var css_248z$4 = "button.PaginationTable-module_PaginationButton__vpYxV.PaginationTable-module_Active__ka3Eu {\n  font-weight: 600;\n  cursor: default;\n  box-shadow: var(--box-shadow-primary);\n  background: var(--color-primary);\n  height: 2.25rem;\n  min-width: 2.25rem;\n}\n\nbutton.PaginationTable-module_PaginationButton__vpYxV.PaginationTable-module_Active__ka3Eu span {\n  color: #fff;\n}\n\nbutton.PaginationTable-module_PaginationButton__vpYxV span {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  top: 0px;\n  left: 0px;\n}\n\nbutton.PaginationTable-module_PaginationButton__vpYxV {\n  border: none;\n  position: relative;\n  display: inline-flex;\n  margin: 0 0;\n  align-items: center;\n  justify-content: center;\n  padding: 0px;\n  box-sizing: border-box;\n  text-transform: capitalize;\n  user-select: none;\n  white-space: nowrap;\n  text-align: center;\n  vertical-align: middle;\n  box-shadow: none;\n  outline: none;\n  height: 2.25rem;\n  min-width: 2.25rem;\n  font-size: inherit;\n  cursor: pointer;\n  border-radius: 10px;\n  color: #11181c;\n  background: #f1f3f5;\n  transition: background 0.3s ease-in-out, box-shadow 0.3s ease-in-out,\n    0.3s ease-in-out transform;\n}\n\nbutton.PaginationTable-module_PaginationButton__vpYxV:not(.PaginationTable-module_Active__ka3Eu):hover {\n  background: #eceef0;\n}\n\nbutton.PaginationTable-module_PaginationButton__vpYxV:disabled {\n  cursor: not-allowed;\n}\nbutton.PaginationTable-module_PaginationButton__vpYxV:active {\n  transform: scale(0.97);\n}\n\nbutton.PaginationTable-module_PaginationButton__vpYxV .PaginationTable-module_ArrowIcon__-UmQq {\n  width: 15px;\n}\n\ntable.PaginationTable-module_PaginationTable__ghGwA {\n  padding: 0.75rem;\n  margin-top: auto;\n}\n\n.PaginationTable-module_Bottom__G3IT6 {\n  display: grid;\n  grid-template-columns: 1fr 5fr 1fr;\n  align-items: center;\n  padding: 0 20px;\n  gap: 20px;\n}\n\n.PaginationTable-module_Bottom__G3IT6 .PaginationTable-module_PaginationPageNumbers__PBz8f {\n  margin: 0px;\n  padding: 0px;\n  display: flex;\n  justify-content: center;\n  position: relative;\n  font-variant: tabular-nums;\n  margin-left: auto;\n  width: 100%;\n}\n\n.PaginationTable-module_Bottom__G3IT6 .PaginationTable-module_PaginationPageSize__keXTD {\n  margin-left: auto;\n}\n.PaginationTable-module_Bottom__G3IT6 .PaginationTable-module_PaginationPageSize__keXTD .PaginationTable-module_PageSizeSelector__gDKit {\n  border: none;\n  outline: none;\n  cursor: pointer;\n  font-size: 16px;\n  background: var(--color-background);\n  color: var(--color-primary);\n  padding-left: 1.25rem;\n  padding-right: 1.25rem;\n  padding-top: 8px;\n  padding-bottom: 8px;\n  border-radius: 10px;\n  transition: 0.3s ease-in-out opacity;\n}\n\n.PaginationTable-module_Bottom__G3IT6 .PaginationTable-module_PaginationPageSize__keXTD .PaginationTable-module_PageSizeSelector__gDKit:active {\n  opacity: 0.7;\n}\n\n.PaginationTable-module_Bottom__G3IT6 .PaginationTable-module_PaginationPageNumbers__PBz8f button {\n  margin: 0 3px;\n}\n\n.PaginationTable-module_Bottom__G3IT6 .PaginationTable-module_PaginationPageNumbers__PBz8f button:first-child {\n  margin-right: 15px;\n}\n\n.PaginationTable-module_Bottom__G3IT6 .PaginationTable-module_PaginationPageNumbers__PBz8f button:last-child {\n  margin-left: 15px;\n}\n\n.PaginationTable-module_Bottom__G3IT6 .PaginationTable-module_PaginationDataCount__sjf82 {\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n  user-select: none;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  word-break: keep-all;\n  position: relative;\n  overflow-wrap: break-word;\n  user-select: none;\n  overflow: hidden;\n}\n\n.PaginationTable-module_Bottom__G3IT6 .PaginationTable-module_PaginationDataCount__sjf82 .PaginationTable-module_Title__YBTL9 {\n  font-weight: 500;\n}\n.PaginationTable-module_Bottom__G3IT6 .PaginationTable-module_PaginationDataCount__sjf82 .PaginationTable-module_DataCount__vrqph {\n  font-weight: 400;\n}\n\n/* .Bottom .LoadingWrapper {\n} */\n";
var styles$4 = {"PaginationButton":"PaginationTable-module_PaginationButton__vpYxV","Active":"PaginationTable-module_Active__ka3Eu","ArrowIcon":"PaginationTable-module_ArrowIcon__-UmQq","PaginationTable":"PaginationTable-module_PaginationTable__ghGwA","Bottom":"PaginationTable-module_Bottom__G3IT6","PaginationPageNumbers":"PaginationTable-module_PaginationPageNumbers__PBz8f","PaginationPageSize":"PaginationTable-module_PaginationPageSize__keXTD","PageSizeSelector":"PaginationTable-module_PageSizeSelector__gDKit","PaginationDataCount":"PaginationTable-module_PaginationDataCount__sjf82","Title":"PaginationTable-module_Title__YBTL9","DataCount":"PaginationTable-module_DataCount__vrqph"};
styleInject(css_248z$4);

function PaginationTable({ paginationProps, updatePaginationProps, onPaginationChange, localization, paginationDefaults, className, ...props }) {
    const DEFAULT_PAGE_SIZES = paginationDefaults?.pageSizes ?? [5, 10, 20, 50, 100];
    const renderPaginationNumbers = React.useMemo(() => renderPaginationButtons({
        paginationProps,
        updatePaginationProps,
        onPaginationChange,
        localization,
    }), [paginationProps, updatePaginationProps]);
    const renderPaginationPageSize = React.useMemo(() => (jsxRuntime.jsx("select", { title: localization.paginationPageSize, className: styles$4.PageSizeSelector, defaultValue: paginationProps.pageSize, onChange: (e) => updatePaginationProps({ currentPage: 1, pageSize: +e.target.value }), children: DEFAULT_PAGE_SIZES.map((op) => (jsxRuntime.jsx("option", { value: op, children: op }, op))) })), [paginationProps.pageSize]);
    const renderDataCount = React.useMemo(() => (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsxs("span", { className: styles$4.Title, children: [localization.paginationTotalCount, " :\u00A0"] }), jsxRuntime.jsx("span", { className: styles$4.DataCount, children: paginationProps.dataCount })] })), [paginationProps.dataCount]);
    return (jsxRuntime.jsx("table", { className: concatStyles(styles$4.PaginationTable, className), ...props, children: jsxRuntime.jsx("tfoot", { children: jsxRuntime.jsx("tr", { children: jsxRuntime.jsx("th", { children: jsxRuntime.jsx(Fade, { children: jsxRuntime.jsxs("div", { className: styles$4.Bottom, children: [jsxRuntime.jsx("div", { className: styles$4.PaginationDataCount, children: renderDataCount }), jsxRuntime.jsx("div", { className: styles$4.PaginationPageNumbers, children: renderPaginationNumbers }), jsxRuntime.jsx("div", { className: styles$4.PaginationPageSize, children: renderPaginationPageSize })] }) }) }) }) }) }));
}
function renderPaginationButtons({ paginationProps, updatePaginationProps, onPaginationChange, localization, paginationDefaults, }) {
    function renderButton({ navigateTo, component, disabled, title, }) {
        const isActive = paginationProps.currentPage === navigateTo;
        function handleClick(e) {
            !isActive &&
                updatePaginationProps({
                    currentPage: navigateTo,
                });
        }
        return (jsxRuntime.jsx("button", { title: title ?? `${navigateTo}`, type: "button", className: concatStyles(isActive && styles$4.Active, styles$4.PaginationButton), onClick: handleClick, disabled: isActive || disabled === true, children: jsxRuntime.jsx("span", { children: component ?? navigateTo }) }, component ? navigateTo + "arrow" : navigateTo));
    }
    if (paginationProps.pageSize && paginationProps.dataCount) {
        onPaginationChange?.(paginationProps);
        const buttons = [];
        const buttonCount = Math.ceil(paginationProps.dataCount / paginationProps.pageSize);
        if (paginationProps.currentPage > buttonCount)
            updatePaginationProps({ currentPage: buttonCount }, false);
        const initialPageNumber = 1;
        const prev1 = paginationProps.currentPage - 1;
        const prev2 = paginationProps.currentPage - 2;
        const next1 = paginationProps.currentPage + 1;
        const next2 = paginationProps.currentPage + 2;
        buttons.push(initialPageNumber);
        if (prev2 !== initialPageNumber && prev2 > 0)
            buttons.push(prev2);
        if (prev1 !== initialPageNumber && prev1 > 0)
            buttons.push(prev1);
        if (paginationProps.currentPage !== buttonCount &&
            paginationProps.currentPage !== initialPageNumber)
            buttons.push(paginationProps.currentPage);
        if (buttonCount > next1)
            buttons.push(next1);
        if (buttonCount > next2)
            buttons.push(next2);
        buttonCount !== initialPageNumber && buttons.push(buttonCount);
        return [
            renderButton({
                navigateTo: prev1,
                component: jsxRuntime.jsx(ArrowLeft, { className: styles$4.ArrowIcon }),
                disabled: prev1 === 0,
                title: localization.paginationPrev,
            }),
            ...buttons.map((num) => renderButton({ navigateTo: num })),
            renderButton({
                navigateTo: next1,
                component: jsxRuntime.jsx(ArrowRight, { className: styles$4.ArrowIcon }),
                disabled: next1 > buttonCount,
                title: localization.paginationNext,
            }),
        ];
    }
}

var css_248z$3 = "@keyframes Skeleton-module_shimmer__gcGG7 {\n  0% {\n    background-position: -50vw 0;\n  }\n  100% {\n    background-position: 50vw 0;\n  }\n}\n\n.Skeleton-module_Line__3f-kN {\n  background: #e2e4e7;\n  border-radius: 5px;\n  height: 25px;\n  margin: 10px 0;\n  overflow: hidden;\n  position: relative;\n  width: 100%;\n}\n\n.Skeleton-module_Line__3f-kN::before {\n  position: absolute;\n  content: \"\";\n  height: 100%;\n  width: 100%;\n  background-image: linear-gradient(\n    to right,\n    #e2e4e7 0%,\n    #d4d5d6 20%,\n    #d4d5d6 40%,\n    #e2e4e7 100%\n  );\n  background-repeat: no-repeat;\n  /* background-size: 450px 400px; */\n  animation: Skeleton-module_shimmer__gcGG7 1s linear infinite;\n}\n";
var styles$3 = {"Line":"Skeleton-module_Line__3f-kN","shimmer":"Skeleton-module_shimmer__gcGG7"};
styleInject(css_248z$3);

function Skeleton() {
    return jsxRuntime.jsx("div", { className: concatStyles(styles$3.Line) });
}

var css_248z$2 = ".LoadingTable-module_SkeletonTable__0IbUV {\n  padding: 1rem 0.75rem;\n}\n";
var styles$2 = {"SkeletonTable":"LoadingTable-module_SkeletonTable__0IbUV"};
styleInject(css_248z$2);

function LoadingTable(props) {
    return (jsxRuntime.jsx("table", { className: concatStyles(styles$2.SkeletonTable), ...props, children: jsxRuntime.jsx("tbody", { children: [...Array(10)].map((_, i) => (jsxRuntime.jsx("tr", { children: jsxRuntime.jsx("td", { children: jsxRuntime.jsx(Skeleton, {}) }) }, i))) }) }));
}

function Empty(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 2v9h-3.56c-.36 0-.68.19-.86.5-.52.9-1.47 1.5-2.58 1.5s-2.06-.6-2.58-1.5c-.18-.31-.51-.5-.86-.5H5V5h14z" }) }));
}

var css_248z$1 = ".EmptyTable-module_EmptyWrapper__CjOq1 {\n  display: flex;\n  justify-content: center;\n  flex-direction: column;\n  align-items: center;\n  gap: 10px;\n  min-height: 100px;\n}\n\n.EmptyTable-module_EmptyWrapper__CjOq1 .EmptyTable-module_Icon__arISJ {\n  width: 30px;\n  fill: #7e868c;\n}\n.EmptyTable-module_EmptyWrapper__CjOq1 .EmptyTable-module_Text__C7aoz {\n  font-size: 12px;\n  font-weight: 700;\n  color: #7e868c;\n  text-transform: uppercase;\n}\n\n.EmptyTable-module_EmptyTable__7Az9o {\n  width: 100%;\n}\n";
var styles$1 = {"EmptyWrapper":"EmptyTable-module_EmptyWrapper__CjOq1","Icon":"EmptyTable-module_Icon__arISJ","Text":"EmptyTable-module_Text__C7aoz","EmptyTable":"EmptyTable-module_EmptyTable__7Az9o"};
styleInject(css_248z$1);

function EmptyTable({ localization, ...props }) {
    return (jsxRuntime.jsx("table", { className: concatStyles(styles$1.EmptyTable), ...props, children: jsxRuntime.jsx("tbody", { children: jsxRuntime.jsx("tr", { children: jsxRuntime.jsx("td", { children: jsxRuntime.jsxs("div", { className: styles$1.EmptyWrapper, children: [jsxRuntime.jsx(Empty, { className: styles$1.Icon }), jsxRuntime.jsx("span", { className: styles$1.Text, children: localization.filterEmpty })] }) }) }) }) }));
}

var css_248z = ".LoadingOverlay-module_LoadingOverlay__CYXdt {\n  position: absolute;\n  z-index: 9;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  backdrop-filter: saturate(180%) blur(10px);\n  background: hsla(0, 0%, 100%, 0.4);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border-radius: 20px;\n}\n.LoadingOverlay-module_LoadingOverlay__CYXdt .LoadingOverlay-module_Content__zbouy {\n  display: flex;\n  justify-content: center;\n  flex-direction: column;\n  align-items: center;\n}\n\n.LoadingOverlay-module_LoadingOverlay__CYXdt .LoadingOverlay-module_Content__zbouy .LoadingOverlay-module_Title__WR1ev {\n  font-weight: 600;\n  margin-top: 10px;\n  font-size: 18px;\n}\n";
var styles = {"LoadingOverlay":"LoadingOverlay-module_LoadingOverlay__CYXdt","Content":"LoadingOverlay-module_Content__zbouy","Title":"LoadingOverlay-module_Title__WR1ev"};
styleInject(css_248z);

function LoadingOverlay({ visible, localization, ...props }) {
    return (jsxRuntime.jsx(Fade, { className: styles.LoadingOverlay, visible: visible, ...props, children: jsxRuntime.jsxs("div", { className: styles.Content, children: [jsxRuntime.jsx(Spinner, {}), jsxRuntime.jsx("span", { className: styles.Title, children: localization.dataLoading })] }) }));
}

const TableLocalization = {
    dataLoading: "Loading",
    filterSearchPlaceholder: "Type here to search",
    filterReset: "Reset filter",
    filterLoading: "Loading",
    dataEmpty: "No Data",
    filterEmpty: "No Result",
    paginationPageSize: "Page size",
    paginationNext: "Next",
    paginationPrev: "Previous",
    paginationTotalCount: "Total",
};

const DefaultTheme = {
    backgroundColor: "#eadcf8",
    primaryColor: "#7828c8",
};

function MultiDot(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" }) }));
}

function Search(props) {
    return (jsxRuntime.jsx("svg", { focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", ...props, children: jsxRuntime.jsx("path", { d: "M7 9H2V7h5v2zm0 3H2v2h5v-2zm13.59 7-3.83-3.83c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L22 17.59 20.59 19zM17 11c0-1.65-1.35-3-3-3s-3 1.35-3 3 1.35 3 3 3 3-1.35 3-3zM2 19h10v-2H2v2z" }) }));
}

function useFilterManagement(columns, data, serverSide, paginationDefaults) {
    const PAGINATION_CURRENT_PAGE = paginationDefaults?.defaultCurrentPage ?? 1;
    const PAGINATION_PAGE_SIZE = paginationDefaults?.defaultPageSize ?? 10;
    /**
     * Indicates if data is being fetched.
     */
    const [fetching, setFetching] = React.useState(new Set());
    /**
     * Collection of already fetched filters.
     */
    const [fetchedFilters, setFetchedFilters] = React.useState(new Map());
    /**
     * Collection of user selected filters.
     */
    const [selectedFilters, setSelectedFilters] = React.useState({});
    // Refs are used in place of state when performing callbacks, as they keep the up-to-date value.
    const selectedFilterRef = React.useRef({});
    const fetchedFilterRef = React.useRef(new Map());
    const paginationPropsRef = React.useRef({});
    selectedFilterRef.current = selectedFilters;
    fetchedFilterRef.current = fetchedFilters;
    const [inputValue, setInputValue] = React.useState();
    const pipeFilters = React.useCallback((data, filters) => {
        if (!data || data.length === 0)
            return;
        let filteredData = [...data];
        if (filters) {
            for (const key in filters) {
                filteredData = filteredData.filter((item) => {
                    const currentItemFilters = filters?.[key];
                    // If filter array contains no items, stop execution.
                    if (currentItemFilters.size === 0)
                        return true;
                    // Convert object to string and compare.
                    for (const f of currentItemFilters.keys()) {
                        if (f?.toLowerCase() === `${item[key]}`?.toLowerCase())
                            return true;
                    }
                    return false;
                });
            }
        }
        return filteredData;
    }, [data, selectedFilters]);
    const filteredData = serverSide?.filters?.onFilterSelect
        ? data
        : pipeFilters(data, selectedFilters);
    const [paginationProps, setPaginationProps] = React.useState({
        currentPage: PAGINATION_CURRENT_PAGE,
        dataCount: serverSide?.pagination?.dataCount ?? filteredData?.length,
        pageSize: PAGINATION_PAGE_SIZE,
    });
    paginationPropsRef.current = paginationProps;
    async function updateInputValue(key, value) {
        if (key) {
            setInputValue((prev) => ({ ...prev, [key]: value }));
            if (serverSide?.filters?.onFilterSearch) {
                startFetching("filter-fetch");
                const filters = await serverSide?.filters?.onFilterSearch?.(key, value);
                updateFetchedFilters(key, filters);
                stopFetching("filter-fetch");
            }
        }
    }
    function updateFetchedFilters(key, value) {
        setFetchedFilters((prev) => new Map(prev).set(key, value));
    }
    async function updateSelectedFilters(key, value) {
        let filtersToDisplay;
        //Reset pagination's current page to one on filters' change
        if (paginationPropsRef.current.currentPage !== 1)
            updatePaginationProps({ currentPage: 1 }, false);
        setSelectedFilters((prev) => {
            if (!value) {
                filtersToDisplay = { ...prev, [key]: new Set() };
                return filtersToDisplay;
            }
            if (Array.isArray(value)) {
                filtersToDisplay = { ...prev, [key]: new Set(value) };
            }
            else {
                const prevFiltersOfSameKey = new Set(prev[key]);
                if (prevFiltersOfSameKey.has(value))
                    prevFiltersOfSameKey.delete(value);
                else
                    prevFiltersOfSameKey.add(value);
                filtersToDisplay = {
                    ...prev,
                    [key]: prevFiltersOfSameKey,
                };
            }
            return filtersToDisplay;
        });
    }
    const pipePagination = React.useCallback((data, pagination) => {
        return serverSide?.pagination
            ? data
            : data?.slice(pagination?.pageSize * (pagination?.currentPage - 1), pagination?.pageSize * pagination?.currentPage);
    }, [data, paginationProps]);
    async function pipeFetchedFilters(key) {
        if (!fetchedFilterRef.current.has(key)) {
            let mappedFilters;
            const column = columns.find((x) => x.key === key);
            const columnFilterType = column?.filter;
            if (column?.defaultFilters) {
                mappedFilters = column.defaultFilters;
            }
            else {
                if (serverSide?.filters?.onFilterSearch) {
                    startFetching("filter-fetch");
                    mappedFilters = await serverSide?.filters?.onFilterSearch?.(key);
                    stopFetching("filter-fetch");
                }
                else {
                    mappedFilters = data?.flatMap((x) => `${x[key]}`);
                }
            }
            if (columnFilterType && typeof columnFilterType === "function")
                mappedFilters = mappedFilters?.map(columnFilterType);
            // Eliminate duplicate values.
            updateFetchedFilters(key, Array.from(new Set(mappedFilters)));
        }
    }
    function resetFetchedFilters(key) {
        if (key)
            updateFetchedFilters(key, []);
    }
    function updatePaginationProps(valuesToUpdate, shouldTriggerServerUpdate = true) {
        setPaginationProps((prev) => {
            const updatedPagination = { ...prev, ...valuesToUpdate };
            if (shouldTriggerServerUpdate && serverSide?.pagination?.onChange) {
                startFetching("pagination");
                serverSide?.pagination
                    ?.onChange(updatedPagination, selectedFilterRef.current)
                    .then(() => stopFetching("pagination"));
            }
            return updatedPagination;
        });
    }
    function startFetching(value) {
        setFetching((prev) => new Set(prev).add(value));
    }
    function stopFetching(value) {
        setFetching((prev) => {
            const stateCopy = new Set(prev);
            stateCopy.delete(value);
            return stateCopy;
        });
    }
    React.useEffect(() => {
        if (filteredData && filteredData.length > 0)
            setPaginationProps((prev) => ({
                ...prev,
                dataCount: serverSide?.pagination?.dataCount ?? filteredData.length,
            }));
    }, [data, fetchedFilters, selectedFilters]);
    React.useEffect(() => {
        if (serverSide?.filters?.onFilterSelect &&
            Object.keys(selectedFilters).length > 0) {
            startFetching("filter-select");
            serverSide?.filters
                ?.onFilterSelect?.(selectedFilterRef.current, paginationPropsRef.current)
                .then(() => stopFetching("filter-select"));
        }
    }, [selectedFilters]);
    return {
        fetchedFilters,
        selectedFilters,
        inputValue,
        updateInputValue,
        updateSelectedFilters,
        paginationProps,
        updatePaginationProps,
        pipeFetchedFilters,
        resetFetchedFilters,
        fetching,
        data: pipePagination(filteredData, paginationProps),
    };
}

const CONTEXT_MENU_KEY = "_context-menu-key";
const SELECTION_KEY = "_selection-key";
function useTableTools({ tableProps, styles, }) {
    const { columns, data: apiData, isRowClickable, selectionMode, renderContextMenu, onRowClick, uniqueRowKey, serverSide, paginationDefaults, } = tableProps;
    const { inputValue, updateInputValue, data, paginationProps, updatePaginationProps, selectedFilters, fetchedFilters, pipeFetchedFilters, updateSelectedFilters, fetching, } = useFilterManagement(columns, apiData, serverSide, paginationDefaults);
    const [activeRow, setActiveRow] = React.useState();
    const [selectedRows, setSelectedRows] = React.useState(new Set());
    const [filterMenu, setFilterMenu] = React.useState();
    const [contextMenu, setContextMenu] = React.useState();
    function determineEllipsis(column, propKey) {
        if (typeof column.ellipsis === "boolean")
            return column.ellipsis === true;
        else if (propKey)
            return column.ellipsis?.[propKey] === true;
        return false;
    }
    function handleUpdateSelection(value, event) {
        if (event === false)
            setSelectedRows((rows) => {
                const updatedRows = new Set(rows);
                updatedRows.delete(value);
                return updatedRows;
            });
        else
            setSelectedRows((rows) => new Set(rows).add(value));
    }
    async function handleDisplayFilterMenu(prop, visibility = "visible") {
        if (prop) {
            const { key, position } = prop;
            if (position) {
                setFilterMenu((prev) => ({
                    key,
                    visible: true,
                    position: prev?.key === key
                        ? prev.position
                        : {
                            xAxis: position.xAxis - 50,
                            yAxis: position.yAxis + 20,
                        },
                }));
            }
            await pipeFetchedFilters(key);
            return;
        }
        switch (visibility) {
            case "hidden":
                setFilterMenu((prev) => ({ ...prev, visible: false }));
                break;
            case "destroy-on-close":
                setFilterMenu(undefined);
        }
    }
    function handleDisplayContextMenu(prop, visibility = "visible") {
        if (prop && visibility === "visible") {
            const { data, position } = prop;
            if (position) {
                setContextMenu((prev) => {
                    const prevId = prev?.data?.[uniqueRowKey];
                    const currentId = data[uniqueRowKey];
                    return {
                        data,
                        position: prevId === currentId
                            ? prev?.position
                            : {
                                xAxis: position.xAxis,
                                yAxis: position.yAxis,
                            },
                        visible: prevId !== currentId || !prev?.visible,
                    };
                });
            }
            return;
        }
        switch (visibility) {
            case "hidden":
                setContextMenu((prev) => ({ ...prev, visible: false }));
                break;
            case "destroy-on-close":
                setContextMenu(undefined);
        }
    }
    const handleMapRow = React.useCallback((data, isRowActive) => {
        const mappedRows = columns.map((col) => (jsxRuntime.jsx("td", { className: concatStyles(determineEllipsis(col, "rowData") && styles.Ellipsis), children: col.dataRender ? col.dataRender(data) : data[col.key] }, col.key)));
        if (renderContextMenu) {
            const contextMenuShortcut = (jsxRuntime.jsx("td", { className: styles.ContextMenuContainer, children: jsxRuntime.jsx("button", { type: "button", title: "Menu", className: styles.ContextMenuButton, onClick: (e) => {
                        e.stopPropagation();
                        handleDisplayContextMenu({
                            data,
                            position: {
                                xAxis: e.clientX,
                                yAxis: e.clientY,
                            },
                        });
                    }, children: jsxRuntime.jsx(MultiDot, { className: styles.ContextMenuIcon }) }) }, CONTEXT_MENU_KEY));
            mappedRows.push(contextMenuShortcut);
        }
        if (selectionMode === "multiple") {
            const selectionColumn = (jsxRuntime.jsx("td", { children: jsxRuntime.jsx("input", { className: styles.Checkbox, onChange: (e) => handleUpdateSelection(data[uniqueRowKey], e.target.checked), checked: isRowActive, type: "checkbox" }) }, SELECTION_KEY));
            return [selectionColumn, ...mappedRows];
        }
        return mappedRows;
    }, [
        columns,
        renderContextMenu,
        selectedRows,
        selectionMode,
        contextMenu,
        uniqueRowKey,
    ]);
    const handleMapColGroups = React.useMemo(() => {
        const columnsToMap = columns.map(({ key, width }) => (jsxRuntime.jsx("col", { style: { width } }, key)));
        if (renderContextMenu)
            columnsToMap.push(jsxRuntime.jsx("col", { style: { width: "5%" } }, CONTEXT_MENU_KEY));
        if (selectionMode === "multiple") {
            const selectionCol = jsxRuntime.jsx("col", {}, SELECTION_KEY);
            return [selectionCol, ...columnsToMap];
        }
        return columnsToMap;
    }, [columns, selectionMode, renderContextMenu]);
    const handleMapTableHead = React.useMemo(() => {
        const columnsToRender = columns.map((x) => (jsxRuntime.jsx("th", { className: concatStyles(styles.FilterHeader, determineEllipsis(x, "columnHead") && styles.Ellipsis), children: jsxRuntime.jsxs("div", { className: concatStyles(x.filter && styles.FilterWrapper), children: [jsxRuntime.jsx("div", { className: styles.Content, children: x.columnRender ? x.columnRender() : x.title }), x.filter && (jsxRuntime.jsx("button", { onClick: (e) => {
                            e.stopPropagation();
                            handleDisplayFilterMenu({
                                key: x.key,
                                position: {
                                    xAxis: e.clientX,
                                    yAxis: e.clientY,
                                },
                            });
                        }, className: styles.SearchButton, children: jsxRuntime.jsx(Search, { className: concatStyles(styles.SearchIcon, selectedFilters[x.key]?.size > 0 && styles.Active) }) }))] }) }, x.key)));
        if (renderContextMenu)
            columnsToRender.push(jsxRuntime.jsx("th", { className: styles.ContextHeader }, CONTEXT_MENU_KEY));
        if (selectionMode === "multiple") {
            const selectionColumn = (jsxRuntime.jsx("th", { children: jsxRuntime.jsx("input", { className: styles.Checkbox, onChange: (e) => setSelectedRows(!e.target.checked
                        ? new Set()
                        : new Set(data.map((x) => x[uniqueRowKey]))), checked: data?.length === selectedRows.size, type: "checkbox" }) }, SELECTION_KEY));
            return [selectionColumn, ...columnsToRender];
        }
        return columnsToRender;
    }, [columns, data, selectionMode, selectedRows, renderContextMenu]);
    const handleRowClick = React.useCallback((e, rowKey) => {
        if (isRowClickable) {
            if (selectionMode !== "multiple")
                setActiveRow((prev) => (prev === rowKey ? undefined : rowKey));
            onRowClick?.(e, rowKey);
        }
    }, [isRowClickable, selectionMode, onRowClick]);
    const handleMapData = React.useMemo(() => data?.map((x, i) => {
        const isRowActive = selectedRows.has(x[uniqueRowKey]);
        return (jsxRuntime.jsx("tr", { className: concatStyles((activeRow === x[uniqueRowKey] || isRowActive) && styles.Active), onClick: (e) => handleRowClick(e, x[uniqueRowKey]), children: handleMapRow(x, isRowActive) }, i));
    }), [activeRow, data, handleMapRow]);
    return {
        handleMapColGroups,
        handleMapData,
        handleMapTableHead,
        handleDisplayContextMenu,
        handleDisplayFilterMenu,
        contextMenu,
        filterMenu,
        paginationProps,
        selectedFilters,
        selectedRows,
        updateInputValue,
        updateSelectedFilters,
        updatePaginationProps,
        fetchedFilters,
        inputValue,
        fetching,
        data,
    };
}

/**
 * A hook that fires when the area outside the current element is clicked.
 * @param refObject A collection of ref objects or a single ref.
 * @param callback Function to execute on click.
 */
function useDetectOutsideClick(refObject, callback) {
    React.useEffect(() => {
        function fireEvent(ref, event, key) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback?.(event, key);
            }
        }
        function handleClickOutside(event) {
            !Array.isArray(refObject)
                ? fireEvent(refObject, event)
                : refObject.forEach((refObject) => fireEvent(refObject.ref, event, refObject.key));
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [refObject]);
}

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

function Table(tableProps) {
    const { isHoverable, isRowClickable, renderContextMenu, loading, onPaginationChange, serverSide, localization, tableHeight = "static", themeProperties = DefaultTheme, paginationDefaults, className, style, elementStylings, } = tableProps;
    const localizationRef = React.useRef(TableLocalization);
    localizationRef.current = localization
        ? localization(TableLocalization)
        : TableLocalization;
    const contextMenuRef = React.useRef(null);
    const filterMenuRef = React.useRef(null);
    const { handleDisplayContextMenu, handleDisplayFilterMenu, handleMapColGroups, handleMapData, handleMapTableHead, contextMenu, filterMenu, paginationProps, selectedFilters, selectedRows, fetchedFilters, fetching, inputValue, data, updateInputValue, updateSelectedFilters, updatePaginationProps, } = useTableTools({
        styles: styles$9,
        tableProps,
    });
    const contextMenuElement = renderContextMenu && contextMenu && (jsxRuntime.jsx(ContextMenuOverlay, { ref: contextMenuRef, elements: renderContextMenu(contextMenu.data, selectedRows, paginationProps, selectedFilters), style: {
            left: contextMenu.position?.xAxis,
            top: contextMenu.position?.yAxis,
            ...elementStylings?.contextMenu?.style,
        }, className: elementStylings?.contextMenu?.className, visible: contextMenu.visible === true, onHide: (visible) => {
            !visible && handleDisplayContextMenu(undefined, "destroy-on-close");
        } }));
    const filterMenuElement = filterMenu?.key && (jsxRuntime.jsx(FilterMenu, { columnKey: filterMenu.key, visible: filterMenu.visible === true, style: {
            left: filterMenu.position?.xAxis,
            top: filterMenu.position?.yAxis,
            ...elementStylings?.filterMenu?.style,
        }, fetchedFilter: fetchedFilters, updateSelectedFilters: updateSelectedFilters, updateInputValue: updateInputValue, value: inputValue?.[filterMenu.key], ref: filterMenuRef, selectedFilters: selectedFilters[filterMenu.key], isServerSide: !!serverSide?.filters?.onFilterSearch, loading: fetching.has("filter-fetch"), localization: localizationRef.current, className: elementStylings?.filterMenu?.className }, filterMenu.key));
    const tableHeading = (jsxRuntime.jsxs("table", { className: concatStyles(styles$9.Table, styles$9.HeaderTable, isHoverable && styles$9.Hoverable, isRowClickable && styles$9.Clickable, elementStylings?.tableHead?.className), style: {
            ...elementStylings?.tableHead?.style,
        }, children: [jsxRuntime.jsx("colgroup", { children: handleMapColGroups }), jsxRuntime.jsx("thead", { children: jsxRuntime.jsx("tr", { children: handleMapTableHead }) })] }));
    const dataTable = (jsxRuntime.jsxs("div", { className: concatStyles(styles$9.DataTable), style: {
            height: tableHeight === "static" && paginationProps.pageSize
                ? paginationProps.pageSize * 45 + 42 * 2
                : "auto",
        }, children: [jsxRuntime.jsx(LoadingOverlay, { visible: fetching.has("filter-select") || fetching.has("pagination"), localization: localizationRef.current }), jsxRuntime.jsxs("table", { className: concatStyles(styles$9.Table, isHoverable && styles$9.Hoverable, isRowClickable && styles$9.Clickable, elementStylings?.tableBody?.className), style: {
                    ...elementStylings?.tableBody?.style,
                }, children: [jsxRuntime.jsx("colgroup", { children: handleMapColGroups }), jsxRuntime.jsx("tbody", { children: handleMapData })] })] }));
    const defaultStyling = {
        cursor: fetching.size > 0 ? "wait" : undefined,
        "--color-background": themeProperties.backgroundColor,
        "--color-primary": themeProperties.primaryColor,
    };
    useDetectOutsideClick([
        { key: "context", ref: contextMenuRef },
        { key: "filter", ref: filterMenuRef },
    ], (_, key) => {
        switch (key) {
            case "context":
                handleDisplayContextMenu(undefined, "hidden");
                break;
            case "filter":
                handleDisplayFilterMenu(undefined, "hidden");
                break;
        }
    });
    useDetectKeyPress((key) => {
        if (key === "Escape") {
            handleDisplayFilterMenu(undefined, "hidden");
            handleDisplayContextMenu(undefined, "hidden");
        }
    });
    return (jsxRuntime.jsxs("div", { style: defaultStyling, className: styles$9.Wrapper, children: [contextMenuElement, filterMenuElement, jsxRuntime.jsxs("div", { className: concatStyles(styles$9.Body, className), style: style, children: [tableHeading, loading ? (jsxRuntime.jsx(LoadingTable, {})) : data && data.length > 0 ? (dataTable) : (jsxRuntime.jsx(EmptyTable, { localization: localizationRef.current })), data && (jsxRuntime.jsx(PaginationTable, { paginationProps: paginationProps, updatePaginationProps: updatePaginationProps, onPaginationChange: onPaginationChange, fetching: fetching, localization: localizationRef.current, paginationDefaults: paginationDefaults, className: elementStylings?.tableFoot?.className, style: elementStylings?.tableFoot?.style }))] })] }));
}

exports["default"] = Table;
//# sourceMappingURL=index.js.map
