"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core2 = require("@keystone-6/core");

// schema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var lists = {
  User: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      prints: (0, import_fields.relationship)({
        ref: "Print.user",
        many: true,
        ui: {
          labelField: "code"
        }
      }),
      code: (0, import_fields.relationship)({
        ref: "Code.user",
        many: false,
        ui: {
          labelField: "code"
        }
      }),
      tag: (0, import_fields.relationship)({
        ref: "Tag.user",
        many: false,
        ui: {
          labelField: "code"
        }
      }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" },
        ui: {
          createView: {
            fieldMode: "hidden"
          }
        }
      })
    }
  }),
  Print: (0, import_core.list)({
    access: import_access.allowAll,
    ui: {
      labelField: "code"
    },
    fields: {
      code: (0, import_fields.text)({ isIndexed: "unique", validation: { isRequired: true } }),
      user: (0, import_fields.relationship)({
        ref: "User.prints",
        ui: { createView: { fieldMode: "hidden" } }
      })
    }
  }),
  Code: (0, import_core.list)({
    access: import_access.allowAll,
    ui: {
      labelField: "code"
    },
    fields: {
      code: (0, import_fields.text)({ isIndexed: "unique", validation: { isRequired: true } }),
      user: (0, import_fields.relationship)({
        ref: "User.code",
        ui: { createView: { fieldMode: "hidden" } }
      })
    }
  }),
  Tag: (0, import_core.list)({
    access: import_access.allowAll,
    ui: {
      labelField: "code"
    },
    fields: {
      code: (0, import_fields.text)({ isIndexed: "unique", validation: { isRequired: true } }),
      user: (0, import_fields.relationship)({
        ref: "User.tag",
        ui: { createView: { fieldMode: "hidden" } }
      })
    }
  })
};

// keystone.ts
var keystone_default = (0, import_core2.config)({
  db: {
    provider: "sqlite",
    url: "file:./keystone.db"
  },
  lists,
  telemetry: false
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
