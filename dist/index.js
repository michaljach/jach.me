var y=Object.defineProperty;var s=(e,r)=>y(e,"name",{value:r,configurable:!0});var m=s(e=>e.name[0].toLowerCase()+e.name.slice(1,e.name.length).replace(/[A-Z]/g,r=>`-${r.toLowerCase()}`),"a"),p=s((e,r)=>{let i=m(e);customElements.define(i,e);let o=document.createElement(i);r.appendChild(o)},"r");var a=s((e,r,...i)=>{let o=typeof e=="function",t=o?m(e):e;o&&!customElements.get(t)&&customElements.define(t,e);let n=document.createElement(t);return{tagName:t,attrs:r,element:n,children:i}},"i");var g=s(({tagName:e,attrs:r,children:i,element:o})=>{let t=o;for(let[n,l]of Object.entries(r||{}))switch(n){case"click":case"keyup":t.addEventListener(n,l);break;default:customElements.get(e)?t.props[n]=l:t.setAttribute(n,l);break}for(let n of i||[]){let l=c(n);l&&(customElements.get(e)||t.appendChild(l))}return t},"h"),c=s(e=>e===void 0?null:Array.isArray(e)?g({tagName:"span",attrs:{},children:e,element:document.createElement("span")}):typeof e=="string"||typeof e=="number"?document.createTextNode(e.toString()):g(e),"c"),v=s((e,r)=>{let i=[];for(let o=0;o<Math.min(e.length,r.length);o++)i.push([e[o],r[o]]);return i},"a"),x=s((e,r)=>{let i=[];for(let[t,n]of v(e,r))i.push(u(t,n));let o=[];for(let t of r.slice(e.length))o.push(n=>(n.appendChild(c(t)),n));return t=>{for(let[n,l]of v(i,t.childNodes))n(l);for(let n of o)n(t);return t}},"p"),w=s((e,r)=>{let i=[];i.push(o=>{if(o.props){if(JSON.stringify(o.props)!==JSON.stringify(r)){o.props=r;let t=o.render();u(o.__prevTree,t)(o.shadowRoot.firstElementChild)}}else for(let[t,n]of Object.entries(r||{}))t!=="click"&&t!=="keyup"&&o.setAttribute(t,n);return o});for(let o in e)o in r||i.push(t=>(t.removeAttribute(o),t));return o=>{for(let t of i)t(o)}},"m"),u=s((e,r)=>{if(typeof r>"u")return t=>{t.remove()};if(typeof e=="string"||typeof r=="string"||typeof e=="number"||typeof r=="number")return e!==r?t=>{let n=c(r);return t.replaceWith(n),n}:t=>{};if(Array.isArray(e)||Array.isArray(r)){let t=x(e,r);return n=>(t(n),n)}if(e.tagName!==r.tagName)return t=>{let n=c(r);return t.replaceWith(n),n};let i=w(e.attrs,r.attrs),o=x(e.children,r.children);return t=>(i(t),o(t),t)},"f"),h=class extends HTMLElement{static{s(this,"u")}styles;state={};__v;constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){if(this.styles){let r=document.createElement("style");r.innerHTML=this.styles,this.shadowRoot.appendChild(r)}this.__v=this.render();let e=c(this.__v);this.shadowRoot.appendChild(e),this.state=new Proxy(this.state,{set:(r,i,o)=>(r[i]=o,this.diff(),!0)})}diff(){if(this.__v){let e=this.render();u(this.__v,e)(this.shadowRoot.firstElementChild),this.__v=e}}render(){throw`render() in ${this.constructor.name} not implemented.`}};var b=`.container {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
}

a {
  color: var(--text-color);
  text-decoration-color: var(--border-color);
  text-underline-offset: 3px;
  transition: 0.2s;
}

a:hover {
  text-decoration-color: var(--text-color);
}

main {
  display: flex;
  flex-direction: column;
  gap: 34px;
  max-width: 576px;
  padding: 48px;
}

h1 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
}

h2 {
  font-size: 14px;
  font-weight: 450;
  margin: 0;
}

h3 {
  font-size: 14px;
  font-weight: 400;
  margin: 0;
}

span {
  color: var(--subtext-color);
}

.links {
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--subtext-color);
  line-height: 22px;
}

.links a {
  color: var(--subtext-color);
}

.thoughts {
  border-top: 1px solid var(--border-color);
  padding: 24px 0;
}

.items {
  margin: 0;
  padding: 0;
  list-style: none;
  margin-top: 24px;
}

.items a {
  display: block;
  text-decoration: none;
  padding: 12px 0;
}

.item span {
  text-decoration: none;
}

.item h3 {
  text-decoration-line: underline;
  text-decoration-color: var(--border-color);
  text-underline-offset: 3px;
  transition: 0.2s;
  margin-bottom: 4px;
}

.item:hover h3 {
  text-decoration-color: var(--text-color);
}

@media only screen and (max-width: 768px) {
  .container {
    align-items: start;
  }
}

@media (prefers-color-scheme: dark) {
  a {
    color: var(--dark-text-color);
    text-decoration-color: var(--dark-border-color);
  }

  a:hover {
    text-decoration-color: var(--dark-text-color);
  }

  .links a:hover {
    color: var(--dark-text-color);
  }

  .item h3 {
    text-decoration-color: var(--dark-border-color);
  }

  .item:hover h3 {
    text-decoration-color: var(--dark-text-color);
  }

  .thoughts {
    border-top: 1px solid var(--dark-border-color);
  }
}
`;var d=class extends h{static{s(this,"HomePage")}styles=b;render(){return a("div",{class:"container"},a("main",null,a("header",null,a("h1",null,"Michael Jach"),a("span",null,"Software engineer")),a("div",null,"I craft fast and beautiful user interfaces and apps using modern technologies like ",a("a",{href:"https://react.dev/"},"React"),", ",a("a",{href:"https://github.com/michaljach/htm0"},"htm0")," or"," ",a("a",{href:"https://developer.apple.com/xcode/swiftui/"},"SwiftUI")," ","(iOS). I'm a huge believer in open source, you can check my code on"," ",a("a",{href:"https://github.com/michaljach"},"Github"),". I share my thoughts and likes on"," ",a("a",{href:"https://twitter.com/michaeljach/likes"},"Twitter")," and I'm also reachable via email."),a("ul",{class:"links"},a("li",null,a("a",{href:"https://github.com/michaljach"},"Open source")),a("li",null,a("a",{href:"mailto:michaljach@gmail.com?subject=jach.me"},"Contact"))),a("section",{class:"thoughts"},a("h2",null,"Thoughts"),a("ul",{class:"items"},a("li",{class:"item"},a("a",{href:"2023"},a("h3",null,"2023 in review"),a("span",null,"My take on best movies, shows, music, artists and bloopers from this year."))),a("li",{class:"item"},a("a",{href:"items"},a("h3",null,"69 items"),a("span",null," I own 69 items. Here is the list. ")))))))}};var f=class extends h{static{s(this,"AppComponent")}render(){return a(d,null)}};p(f,document.body);
