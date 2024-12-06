import {
  o,
  o2,
  p,
  p2,
  p3,
  p4,
  r,
  r2
} from "/build/_shared/chunk-S6N3OE7E.js";
import "/build/_shared/chunk-B43JI2TA.js";
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

// app/routes/_index.tsx
var import_node = __toESM(require_node(), 1);
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
  import.meta.hot.lastModified = "1733449523089.2346";
}
function Index() {
  _s();
  const {
    message
  } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { p: "6", style: {
    minHeight: "100vh"
  }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p4, { size: "3", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { direction: "column", gap: "6", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o, { size: "4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { justify: "between", align: "center", gap: "4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r, { size: "8", mb: "1", children: "Personal Plan" }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 45,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "2", color: "gray", children: [
        "Last Updated: ",
        (/* @__PURE__ */ new Date()).toLocaleDateString()
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 46,
        columnNumber: 15
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 44,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 43,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o, { size: "4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r, { size: "4", mb: "3", children: "Core Values" }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 52,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "2", color: "gray", mb: "4", children: "(Fill in up to 5 of your strongest core values)" }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 53,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o2, { columns: "5", gap: "3", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { placeholder: `Value ${i}`, className: "rt-TextFieldInput rt-r-size-2", style: {
        width: "100%"
      } }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 56,
        columnNumber: 19
      }, this) }, i, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 55,
        columnNumber: 41
      }, this)) }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 54,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 51,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o, { size: "4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r, { size: "4", mb: "4", children: "Long-term Aspirations (10-25 years)" }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 65,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o2, { columns: "4", gap: "4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r, { size: "3", mb: "2", children: "Relationships" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 69,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r2, { placeholder: "Your relationship aspirations...", size: "3", style: {
            minHeight: "120px"
          } }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 70,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 68,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r, { size: "3", mb: "2", children: "Achievements" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 77,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r2, { placeholder: "Your achievement aspirations...", size: "3", style: {
            minHeight: "120px"
          } }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 78,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 76,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r, { size: "3", mb: "2", children: "Rituals" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 85,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r2, { placeholder: "Your ritual aspirations...", size: "3", style: {
            minHeight: "120px"
          } }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 86,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 84,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r, { size: "3", mb: "2", children: "Wealth (Experiences)" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 93,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r2, { placeholder: "Your wealth/experience aspirations...", size: "3", style: {
            minHeight: "120px"
          } }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 94,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 92,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 66,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 64,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o, { size: "4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r, { size: "4", mb: "2", children: "1 Year Activities" }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 103,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "2", color: "gray", mb: "4", children: "(5 or less)" }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 104,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { direction: "column", gap: "3", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { placeholder: `Activity ${i}`, className: "rt-TextFieldInput rt-r-size-2", style: {
        width: "100%"
      } }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 107,
        columnNumber: 19
      }, this) }, i, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 106,
        columnNumber: 41
      }, this)) }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 105,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 102,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o2, { columns: "2", gap: "4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o, { size: "4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r, { size: "4", mb: "2", children: "90 Day Activities - START" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 118,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "2", color: "gray", mb: "4", children: "(5 or less)" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 119,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { direction: "column", gap: "3", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { placeholder: `Start Activity ${i}`, className: "rt-TextFieldInput rt-r-size-2", style: {
          width: "100%"
        } }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 122,
          columnNumber: 21
        }, this) }, i, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 121,
          columnNumber: 43
        }, this)) }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 120,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 117,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o, { size: "4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r, { size: "4", mb: "2", children: "90 Day Activities - STOP" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 131,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "2", color: "gray", mb: "4", children: "(5 or less)" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 132,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { direction: "column", gap: "3", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { placeholder: `Stop Activity ${i}`, className: "rt-TextFieldInput rt-r-size-2", style: {
          width: "100%"
        } }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 135,
          columnNumber: 21
        }, this) }, i, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 134,
          columnNumber: 43
        }, this)) }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 133,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 130,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 115,
      columnNumber: 11
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 41,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 40,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 37,
    columnNumber: 10
  }, this);
}
_s(Index, "KVVfPjqcmY1AL6EJPM/pBsM8uKc=", false, function() {
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
//# sourceMappingURL=/build/routes/_index-AYUILA6L.js.map
