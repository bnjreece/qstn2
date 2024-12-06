import {
  p,
  p2,
  p3,
  r,
  r2
} from "/build/_shared/chunk-2MCSXEAP.js";
import "/build/_shared/chunk-B43JI2TA.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import "/build/_shared/chunk-7M6SC7J5.js";
import {
  createHotContext
} from "/build/_shared/chunk-LYDTJ3QQ.js";
import "/build/_shared/chunk-UWV35TSL.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/_index.jsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/_index.jsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/_index.jsx"
  );
  import.meta.hot.lastModified = "1733445629757.8647";
}
var meta = () => {
  return [{
    title: "Hello World - Remix App"
  }, {
    name: "description",
    content: "Welcome to my Remix application"
  }];
};
function Index() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r2, { size: "3", style: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--gray-1)"
  }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { size: "2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { direction: "column", align: "center", gap: "6", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r, { size: "9", align: "center", style: {
      color: "var(--blue-9)",
      fontWeight: "bold"
    }, children: "Hello World 2" }, void 0, false, {
      fileName: "app/routes/_index.jsx",
      lineNumber: 40,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "5", align: "center", style: {
      color: "var(--slate-11)",
      maxWidth: "500px"
    }, children: "Welcome to my Remix application with Radix UI" }, void 0, false, {
      fileName: "app/routes/_index.jsx",
      lineNumber: 46,
      columnNumber: 11
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_index.jsx",
    lineNumber: 39,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "app/routes/_index.jsx",
    lineNumber: 38,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/_index.jsx",
    lineNumber: 31,
    columnNumber: 10
  }, this);
}
_c = Index;
var _c;
$RefreshReg$(_c, "Index");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Index as default,
  meta
};
//# sourceMappingURL=/build/routes/_index-X35GKZGS.js.map
