import {
  useLoaderData
} from "/build/_shared/chunk-MSSVDDBF.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import {
  createHotContext
} from "/build/_shared/chunk-LYDTJ3QQ.js";
import "/build/_shared/chunk-UWV35TSL.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import "/build/_shared/chunk-7M6SC7J5.js";
import {
  __commonJS,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// empty-module:@remix-run/node
var require_node = __commonJS({
  "empty-module:@remix-run/node"(exports, module) {
    module.exports = {};
  }
});

// empty-module:../utils/supabase.server
var require_supabase = __commonJS({
  "empty-module:../utils/supabase.server"(exports, module) {
    module.exports = {};
  }
});

// app/routes/_index.tsx
var import_node = __toESM(require_node(), 1);
var import_supabase = __toESM(require_supabase(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/_index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/_index.tsx"
  );
  import.meta.hot.lastModified = "1733448376783.6653";
}
function Index() {
  _s();
  const {
    message,
    error,
    details
  } = useLoaderData();
  if (error) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { style: {
      fontFamily: "system-ui, sans-serif",
      lineHeight: "1.4",
      maxWidth: "800px",
      margin: "0 auto",
      padding: "2rem"
    }, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { children: [
        "Error: ",
        error
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 74,
        columnNumber: 9
      }, this),
      details && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("pre", { style: {
        whiteSpace: "pre-wrap"
      }, children: JSON.stringify(details, null, 2) }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 75,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 67,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { style: {
    fontFamily: "system-ui, sans-serif",
    lineHeight: "1.4",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "2rem"
  }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { children: message }, void 0, false, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 89,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 82,
    columnNumber: 10
  }, this);
}
_s(Index, "AqIohYfFI64OyJdgMBnK2dhUuJA=", false, function() {
  return [useLoaderData];
});
_c = Index;
var _c;
$RefreshReg$(_c, "Index");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Index as default
};
//# sourceMappingURL=/build/routes/_index-GFJTAY6V.js.map
