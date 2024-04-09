// To parse this data:
//
//   const Convert = require("./file");
//
//   const user = Convert.toUser(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
function toUser(json) {
  return cast(JSON.parse(json), r("User"));
}

function userToJson(value) {
  return JSON.stringify(uncast(value, r("User")), null, 2);
}

function invalidValue(typ, val, key, parent = "") {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : "";
  const keyText = key ? ` for key "${key}"` : "";
  throw Error(
    `Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(
      val
    )}`
  );
}

function prettyTypeName(typ) {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ
        .map((a) => {
          return prettyTypeName(a);
        })
        .join(", ")}]`;
    }
  } else if (typeof typ === "object" && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ) {
  if (typ.jsonToJS === undefined) {
    const map = {};
    typ.props.forEach((p) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ) {
  if (typ.jsToJSON === undefined) {
    const map = {};
    typ.props.forEach((p) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val, typ, getProps, key = "", parent = "") {
  function transformPrimitive(typ, val) {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs, val) {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases, val) {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(
      cases.map((a) => {
        return l(a);
      }),
      val,
      key,
      parent
    );
  }

  function transformArray(typ, val) {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val) {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l("Date"), val, key, parent);
    }
    return d;
  }

  function transformObject(props, additional, val) {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue(l(ref || "object"), val, key, parent);
    }
    const result = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref = undefined;
  while (typeof typ === "object" && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers")
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty("props")
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast(val, typ) {
  return transform(val, typ, jsonToJSProps);
}

function uncast(val, typ) {
  return transform(val, typ, jsToJSONProps);
}

function l(typ) {
  return { literal: typ };
}

function a(typ) {
  return { arrayItems: typ };
}

function u(...typs) {
  return { unionMembers: typs };
}

function o(props, additional) {
  return { props, additional };
}

function m(additional) {
  return { props: [], additional };
}

function r(name) {
  return { ref: name };
}

const typeMap = {
  User: o(
    [
      { json: "login", js: "login", typ: u(undefined, "") },
      { json: "id", js: "id", typ: u(undefined, 0) },
      { json: "node_id", js: "node_id", typ: u(undefined, "") },
      { json: "avatar_url", js: "avatar_url", typ: u(undefined, "") },
      { json: "gravatar_id", js: "gravatar_id", typ: u(undefined, "") },
      { json: "url", js: "url", typ: u(undefined, "") },
      { json: "html_url", js: "html_url", typ: u(undefined, "") },
      { json: "followers_url", js: "followers_url", typ: u(undefined, "") },
      { json: "following_url", js: "following_url", typ: u(undefined, "") },
      { json: "gists_url", js: "gists_url", typ: u(undefined, "") },
      { json: "starred_url", js: "starred_url", typ: u(undefined, "") },
      {
        json: "subscriptions_url",
        js: "subscriptions_url",
        typ: u(undefined, ""),
      },
      {
        json: "organizations_url",
        js: "organizations_url",
        typ: u(undefined, ""),
      },
      { json: "repos_url", js: "repos_url", typ: u(undefined, "") },
      { json: "events_url", js: "events_url", typ: u(undefined, "") },
      {
        json: "received_events_url",
        js: "received_events_url",
        typ: u(undefined, ""),
      },
      { json: "type", js: "type", typ: u(undefined, "") },
      { json: "site_admin", js: "site_admin", typ: u(undefined, true) },
      { json: "name", js: "name", typ: u(undefined, null) },
      { json: "company", js: "company", typ: u(undefined, null) },
      { json: "blog", js: "blog", typ: u(undefined, "") },
      { json: "location", js: "location", typ: u(undefined, null) },
      { json: "email", js: "email", typ: u(undefined, null) },
      { json: "hireable", js: "hireable", typ: u(undefined, null) },
      { json: "bio", js: "bio", typ: u(undefined, null) },
      {
        json: "twitter_username",
        js: "twitter_username",
        typ: u(undefined, null),
      },
      { json: "public_repos", js: "public_repos", typ: u(undefined, 0) },
      { json: "public_gists", js: "public_gists", typ: u(undefined, 0) },
      { json: "followers", js: "followers", typ: u(undefined, 0) },
      { json: "following", js: "following", typ: u(undefined, 0) },
      { json: "created_at", js: "created_at", typ: u(undefined, Date) },
      { json: "updated_at", js: "updated_at", typ: u(undefined, Date) },
    ],
    false
  ),
};

export default {
  userToJson: userToJson,
  toUser: toUser,
};
