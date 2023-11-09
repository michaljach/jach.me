var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};

// ../wc/dist/chunks/chunk-7GY3HKDP.js
var o = (e) => e.name[0].toLowerCase() + e.name.slice(1, e.name.length).replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
var r = (e, t) => {
  let n = o(e);
  customElements.define(n, e);
  let a2 = document.createElement(n);
  t.appendChild(a2);
};

// ../wc/dist/h.js
var i = (e, o2, ...r2) => {
  let n = typeof e == "function", t = n ? o(e) : e;
  n && !customElements.get(t) && customElements.define(t, e);
  let s = document.createElement(t);
  return { tagName: t, attrs: o2, element: s, children: r2 };
};

// ../wc/dist/index.js
var h = ({ tagName: r2, attrs: e, children: i2, element: s }) => {
  let t = s;
  for (let [n, o2] of Object.entries(e || {}))
    switch (n) {
      case "click":
      case "keyup":
        t.addEventListener(n, o2);
        break;
      default:
        customElements.get(r2) ? t.props[n] = o2 : t.setAttribute(n, o2);
        break;
    }
  for (let n of i2 || []) {
    let o2 = c(n);
    o2 && (customElements.get(r2) || t.appendChild(o2));
  }
  return t;
};
var c = (r2) => r2 === void 0 ? null : Array.isArray(r2) ? h({ tagName: "span", attrs: {}, children: r2, element: document.createElement("span") }) : typeof r2 == "string" || typeof r2 == "number" ? document.createTextNode(r2.toString()) : h(r2);
var a = (r2, e) => {
  let i2 = [];
  for (let s = 0; s < Math.min(r2.length, e.length); s++)
    i2.push([r2[s], e[s]]);
  return i2;
};
var p = (r2, e) => {
  let i2 = [];
  for (let [t, n] of a(r2, e))
    i2.push(f(t, n));
  let s = [];
  for (let t of e.slice(r2.length))
    s.push((n) => (n.appendChild(c(t)), n));
  return (t) => {
    for (let [n, o2] of a(i2, t.childNodes))
      n(o2);
    for (let n of s)
      n(t);
    return t;
  };
};
var m = (r2, e) => {
  let i2 = [];
  i2.push((s) => {
    if (s.props) {
      if (JSON.stringify(s.props) !== JSON.stringify(e)) {
        s.props = e;
        let t = s.render();
        f(s.__prevTree, t)(s.shadowRoot.firstElementChild);
      }
    } else
      for (let [t, n] of Object.entries(e || {}))
        t !== "click" && t !== "keyup" && s.setAttribute(t, n);
    return s;
  });
  for (let s in r2)
    s in e || i2.push((t) => (t.removeAttribute(s), t));
  return (s) => {
    for (let t of i2)
      t(s);
  };
};
var f = (r2, e) => {
  if (typeof e > "u")
    return (t) => {
      t.remove();
    };
  if (typeof r2 == "string" || typeof e == "string" || typeof r2 == "number" || typeof e == "number")
    return r2 !== e ? (t) => {
      let n = c(e);
      return t.replaceWith(n), n;
    } : (t) => {
    };
  if (Array.isArray(r2) || Array.isArray(e)) {
    let t = p(r2, e);
    return (n) => (t(n), n);
  }
  if (r2.tagName !== e.tagName)
    return (t) => {
      let n = c(e);
      return t.replaceWith(n), n;
    };
  let i2 = m(r2.attrs, e.attrs), s = p(r2.children, e.children);
  return (t) => (i2(t), s(t), t);
};
var u = class extends HTMLElement {
  state = {};
  __v;
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.__v = this.render();
    let e = c(this.__v);
    this.shadowRoot.appendChild(e), this.state = new Proxy(this.state, { set: (i2, s, t) => (i2[s] = t, this.diff(), true) });
  }
  diff() {
    if (this.__v) {
      let e = this.render();
      f(this.__v, e)(this.shadowRoot.firstElementChild), this.__v = e;
    }
  }
  render() {
    throw `render() in ${this.constructor.name} not implemented.`;
  }
};
var l = class {
  data = {};
  targets = [];
  isObserving = false;
  observe() {
    this.data = new Proxy(this.data, { set: (e, i2, s) => {
      e[i2] = s;
      let { targets: t } = this;
      return t.forEach((n) => {
        n.diff();
      }), true;
    } });
  }
};
function A(r2, e) {
  return (i2) => {
    let s = class extends i2 {
      constructor() {
        super(), this[e || r2.constructor.name] = r2.data, r2.targets.push(this), r2.isObserving || (r2.observe(), r2.isObserving = true);
      }
    };
    return Object.defineProperty(s, "name", { value: i2.name }), s;
  };
}

// src/data/UserData.ts
var UserData = class extends l {
  data = {
    userName: "user1"
  };
};
var userData = new UserData();

// src/pages/home.tsx
var HomePage = class extends u {
  state = {
    players: ["kyniu", "michal", "wilku", "dzunior", "rudy", "zolw"],
    randomized: []
  };
  randomize() {
    const temp = ["michal", "rudy"].sort(() => Math.random() - 0.5);
    const randomized = this.state.players.filter((p2) => p2 !== "rudy" && p2 !== "michal").sort(() => Math.random() - 0.5);
    const mangled = [...temp, ...randomized];
    this.state.randomized = mangled;
  }
  change(index, event) {
    const { value } = event.target;
    this.state.players[index] = value;
  }
  render() {
    return /* @__PURE__ */ i("div", { class: "home" }, Array.from(Array(6).keys()).map((key, i2) => /* @__PURE__ */ i("div", null, "Player ", i2 + 1, /* @__PURE__ */ i(
      "input",
      {
        disabled: true,
        type: "text",
        value: this.state.players[i2] || "",
        keyup: (e) => this.change.call(this, i2, e)
      }
    ))), /* @__PURE__ */ i("button", { click: this.randomize.bind(this) }, "GOGO"), this.state.randomized.map((player, i2) => /* @__PURE__ */ i("div", { style: i2 % 2 && "border-bottom:1px solid #000;" }, player)));
  }
};
HomePage = __decorateClass([
  A(userData, "user")
], HomePage);

// src/index.tsx
var AppComponent = class extends u {
  render() {
    return /* @__PURE__ */ i("div", { class: "app" }, /* @__PURE__ */ i(HomePage, null));
  }
};
r(AppComponent, document.body);
