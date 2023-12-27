var _=Object.defineProperty;var l=(i,s)=>_(i,"name",{value:s,configurable:!0});var A=Object.defineProperty,d=l((i,s)=>A(i,"name",{value:s,configurable:!0}),"t"),u=d(i=>i.name[0].toLowerCase()+i.name.slice(1,i.name.length).replace(/[A-Z]/g,s=>`-${s.toLowerCase()}`),"getComponentName"),f=d((i,s)=>{let r=u(i);customElements.define(r,i);let a=document.createElement(r);s.appendChild(a)},"render");var e=d((i,s,...r)=>{let a=typeof i=="function",t=a?u(i):i;a&&!customElements.get(t)&&customElements.define(t,i);let n=document.createElement(t);return{tagName:t,attrs:s,element:n,children:r}},"h");var w=d(({tagName:i,attrs:s,children:r,element:a})=>{let t=a;for(let[n,o]of Object.entries(s||{}))switch(n){case"click":case"keyup":t.addEventListener(n,o);break;default:customElements.get(i)?t.props[n]=o:t.setAttribute(n,o);break}for(let n of r||[]){let o=c(n);o&&(customElements.get(i)||t.appendChild(o))}return t},"renderElement"),c=d(i=>i===void 0?null:Array.isArray(i)?w({tagName:"span",attrs:{},children:i,element:document.createElement("span")}):typeof i=="string"||typeof i=="number"?document.createTextNode(i.toString()):w(i),"render"),y=d((i,s)=>{let r=[];for(let a=0;a<Math.min(i.length,s.length);a++)r.push([i[a],s[a]]);return r},"zip"),k=d((i,s)=>{let r=[];for(let[t,n]of y(i,s))r.push(b(t,n));let a=[];for(let t of s.slice(i.length))a.push(n=>(n.appendChild(c(t)),n));return t=>{for(let[n,o]of y(r,t.childNodes))n(o);for(let n of a)n(t);return t}},"diffChildren"),T=d((i,s)=>{let r=[];r.push(a=>{if(a.props){if(JSON.stringify(a.props)!==JSON.stringify(s)){a.props=s;let t=a.render();b(a.__prevTree,t)(a.shadowRoot.firstElementChild)}}else for(let[t,n]of Object.entries(s||{}))t!=="click"&&t!=="keyup"&&a.setAttribute(t,n);return a});for(let a in i)a in s||r.push(t=>(t.removeAttribute(a),t));return a=>{for(let t of r)t(a)}},"diffAttrs"),b=d((i,s)=>{if(typeof s>"u")return t=>{t.remove()};if(typeof i=="string"||typeof s=="string"||typeof i=="number"||typeof s=="number")return i!==s?t=>{let n=c(s);return t.replaceWith(n),n}:t=>{};if(Array.isArray(i)||Array.isArray(s)){let t=k(i,s);return n=>(t(n),n)}if(i.tagName!==s.tagName)return t=>{let n=c(s);return t.replaceWith(n),n};let r=T(i.attrs,s.attrs),a=k(i.children,s.children);return t=>(r(t),a(t),t)},"diff"),m=class extends HTMLElement{static{l(this,"p")}static{d(this,"Component")}styles;props={};state={};__v;constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.__v=this.render();let i=c(this.__v);if(this.shadowRoot.replaceChildren(i),this.styles){let s=document.createElement("style");s.innerHTML=this.styles,this.shadowRoot.appendChild(s)}this.state=new Proxy(this.state,{set:(s,r,a)=>(s[r]=a,this.diff(),!0)})}diff(){if(this.__v){let i=this.render();b(this.__v,i)(this.shadowRoot.firstElementChild),this.__v=i}}render(){throw`render() in ${this.constructor.name} not implemented.`}},D=class{static{l(this,"y")}static{d(this,"Data")}data={};targets=[];isObserving=!1;observe(){this.data=new Proxy(this.data,{set:(i,s,r)=>{i[s]=r;let{targets:a}=this;return a.forEach(t=>{t.diff()}),!0}})}};function L(i,s){return r=>{let a=class extends r{static{l(this,"s")}static{d(this,"NewClass")}constructor(){super(),this[s||i.constructor.name]=i.data,i.targets.push(this),i.isObserving||(i.observe(),i.isObserving=!0)}};return Object.defineProperty(a,"name",{value:r.name}),a}}l(L,"S");d(L,"data");var h=class extends m{static{l(this,"u")}static{d(this,"RouterComponent")}currentRoute=this.getLocation();constructor(){super(),window.history.pushState=new Proxy(window.history.pushState,{apply:(i,s,r)=>(this.currentRoute=r[2].replace("#","/"),this.diff(),i.apply(s,r))}),window.addEventListener("popstate",()=>{this.currentRoute=this.getLocation(),this.diff()})}getLocation(){return`/${window.location.hash.slice(1)}`||"/"}render(){return e("div",null,this.props.routes[this.currentRoute])}};var C=`.container {
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
`;var g=class extends m{static{l(this,"HomePage")}styles=C;render(){return e("div",{class:"container"},e("main",null,e("header",null,e("h1",null,"Michael Jach"),e("span",null,"Software engineer")),e("div",null,"I craft fast and beautiful user interfaces and apps using modern technologies like ",e("a",{href:"https://react.dev/"},"React"),","," ",e("a",{href:"https://github.com/michaljach/htm0"},"htm0")," or"," ",e("a",{href:"https://developer.apple.com/xcode/swiftui/"},"SwiftUI")," ","(iOS). I'm a huge believer in open source, you can check my code on"," ",e("a",{href:"https://github.com/michaljach"},"Github"),". I share my thoughts and likes on"," ",e("a",{href:"https://twitter.com/michaeljach/likes"},"Twitter")," and I'm also reachable via email."),e("ul",{class:"links"},e("li",null,e("a",{href:"https://github.com/michaljach"},"Open source")),e("li",null,e("a",{href:"mailto:michaljach@gmail.com?subject=jach.me"},"Contact"))),e("section",{class:"thoughts"},e("h2",null,"Thoughts"),e("ul",{class:"items"},e("li",{class:"item"},e("a",{href:"#2023"},e("h3",null,"2023 in review"),e("span",null,"My take on best movies, shows, music, artists and bloopers from this year."))),e("li",{class:"item"},e("a",{href:"#items"},e("h3",null,"69 items"),e("span",null," I own 69 items. Here is the list. ")))))))}};var S=`.grid {
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.grid-hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.grid-element {
  height: 20rem;
  display: flex;
  gap: 2rem 0;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: #f4f4f6;
  padding: 1rem;
}

.grid-element-image {
  max-width: 12rem;
  max-height: 16rem;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.grid-element-image-img {
  max-width: 100%;
  max-height: 100%;
}

.grid-element-title {
  color: #666;
  font-size: 12px;
}

.grid-hero-title {
  font-weight: 400;
  font-size: 15px;
}

.grid-hero-subtitle {
  font-size: 12px;
}
`;var p=class extends m{static{l(this,"ItemsPage")}styles=S;render(){return e("div",{class:"grid"},e("div",{class:"grid-hero"},e("h1",{class:"grid-hero-title"},"jach.me \u2014 items"),e("div",{class:"grid-hero-subtitle"},"I own ",e("strong",null,"69")," items."," ",e("a",{href:"https://minimalistathome.com/minimalism-vs-essentialism/"},"The philosphy."))),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/iphone15pro-removebg-preview.png"})),e("span",{class:"grid-element-title"},"iPhone 15 Pro Black Titanium")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/patagonia-Black-Terrebonne-Joggers-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Patagonia Terrebonne Black Joggers")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/mbp14-spacegray-gallery1-202301-removebg-preview.png"})),e("span",{class:"grid-element-title"},"MacBook Pro 14 M2 Pro Space Grey")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/21086_product_image1000x1000png.png"})),e("span",{class:"grid-element-title"},"Apple MagSafe charger")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/Apple-Display-1024x758-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Apple Studio Display")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/eugoods_09_451646_copy_3-transformed.png"})),e("span",{class:"grid-element-title"},"Uniqlo Dry Stretch Hoodie")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/15c3a2b57d3441c0a789498c5f78af39-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Blundstone 585 CLASSIC")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/MN713_AV1-removebg-preview-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Apple Thunderbolt 4 Pro Cable (1.8 m)")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/arket_shirt-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Arket Black Cotton Silk Overshirt")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/image_1-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Tesla Model 3")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/LEGO-Batman-76240-Batmobile-Tumbler-2-768x432.png"})),e("span",{class:"grid-element-title"},"Lego Batman Tumbler")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/uniqlo-black-men-supima-cotton-crew-neck-short-sleeve-t-shirt-product-0-613021972-normal-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Uniqlo Black Supima\xAE Cotton Tshirt")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"https://cdn2.easycosmetic.nl/images/Produkte/D2/chanel-egoiste-platinum-edt-vapo-50ml.png"})),e("span",{class:"grid-element-title"},"Chanel \xC9go\xEFste Platinum")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/10001_2Y2_ALT100-1300x514.png"})),e("span",{class:"grid-element-title"},"Crocs Slides Bone")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/MLL82_AV1-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Apple USB-C Charging Cable (2 m)")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/Herman-Miller-Cosm-Chair-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Herman Miller Cosm")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/MWP22-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Apple Airpods Pro")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"https://cdn.shopify.com/s/files/1/0090/1329/7207/products/Reuzel-Azul-01_700x.png?v=1604982073"})),e("span",{class:"grid-element-title"},"Reuzel Hair Pomade")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/s03h03e04c02_mlpng-removebg-preview.png"})),e("span",{class:"grid-element-title"},"AIAIAI TMA-2")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"https://img01.ztat.net/article/spp-media-p1/e32efe2833ac464e80746e0d91d3b121/54bfe36321604089ad77473913dd3bcb.jpg?imwidth=1800&filter=packshot"})),e("span",{class:"grid-element-title"},"Selected Homme Black Chino")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_88212433/fee_786_587_png"})),e("span",{class:"grid-element-title"},"Apple 67W USB-C Power Adapter")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/image-1-3197972026-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Samsung Portable SSD T5")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/36703-jordan-green-clean-toothbrush-medium-1-pcs-20181005-144006-big-2x-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Jordan Medium Toothbrush")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"https://img01.ztat.net/article/spp-media-p1/15faacd4ee5b3175b9d804e7a3e23b40/599a337175d34bcea4d5172e63743a5e.jpg?imwidth=1800&filter=packshot"})),e("span",{class:"grid-element-title"},"Camano Soft Sneaker Socks")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/dpwlqkddlbkmbjrnmwzc_copy-transformed.png"})),e("span",{class:"grid-element-title"},"ON Running Cloud Ultra")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"https://img01.ztat.net/article/spp-media-p1/b4e1ae9d99133c819dea3e5ad8161fd3/bc85fe3732f04eec8240746a46f5634d.jpg?filter=packshot&imwidth=169"})),e("span",{class:"grid-element-title"},"Calvin Clein Trunks")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/149c87dd45d248d78b0214c1710f6a0d-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Massimo Dutti Black Sweater")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/arket-shorts-preview.png"})),e("span",{class:"grid-element-title"},"Arket Cotton-Linen Drawstring Shorts")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/14fdb864-12fa-444a-bdd5-8f5a1d530e16_1.cf1beb728c4aea8629b59d2dd78e9efb-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Wenger Tandem Backpack")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/7ZCI_JK3_alt20-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Northface STOLEMBERG 3L DRYVENT\u2122")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/car-k121-blk-xl_carhartt-midweight-hooded-sweatshirt-black-xl-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Carhartt Midweight Black Hoodie")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/7085474_1-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Witchen Maleta Travel Suitcase")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/loake-wadham-mens-oxford-shoes-black-SIDE-min-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Loake Black Oxford Shoes")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/apple-magic-keyboard_ie5613479-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Apple Magic Keyboard")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/b2b5223c-eed6-4381-b16f-21536e506004-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Timberland 6 Inch Black Winter Boots")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/2-47-2046x2048-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Logitech G305")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/Hp0eBgPHWhV27DeVnFIVka-30-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Vishy 72H Black Deodorant")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/27un880-b-1-1200x1200-removebg-preview.png"})),e("span",{class:"grid-element-title"},"LG Ultrafine 4K 27UN880")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/9c2e62b46ba4492ab1ca15f1fabfaa7e-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Massimo Dutti Slim Fit Oxford Shirt")))}};var B=`.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

main {
  display: flex;
  flex-direction: column;
  gap: 34px;
  max-width: 576px;
  padding: 48px;
}

.item a {
  color: var(--subtext-color);
}
.item-addon {
  color: var(--subtext-color);
  margin-top: 0.2rem;
  font-size: 12px;
}

h1 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

h2 {
  color: var(--subtext-color);
  font-size: 14px;
  font-weight: 450;
  margin: 0;
}

span {
  font-weight: 450;
}

@media only screen and (max-width: 768px) {
  .container {
    align-items: start;
  }
}

@media (prefers-color-scheme: dark) {
  body {
    color: var(--dark-text-color);
    background: #000;
  }

  a {
    color: var(--dark-text-color);
    text-decoration-color: var(--dark-border-color);
  }

  a:hover {
    text-decoration-color: var(--dark-text-color);
  }
}
`;var v=class extends m{static{l(this,"Year2023Page")}styles=B;render(){return e("div",{class:"container"},e("main",null,e("div",{class:"header"},e("h1",null,"2023 in review"),e("span",null,"by Michael Jach")),e("div",{class:"item"},e("h2",null,"Best music album"),e("span",null,"Let's start here \u2014 Lil Yachty")),e("div",{class:"item"},e("h2",null,"Best artist/creator"),e("span",null,"Hudson Mohawke"),e("div",{class:"item-addon"},e("span",null,"Honorable mentions: Jack Sather"))),e("div",{class:"item"},e("h2",null,"Best game"),e("span",null,"Hogwarts Legacy"),e("div",{class:"item-addon"},e("span",null,"Honorable mentions: Disco Elysium, Cyberpunk 2077 2.0, Baldurs Gate 3"))),e("div",{class:"item"},e("h2",null,"Best movie"),e("span",null,"Where the Crawdads Sing"),e("div",{class:"item-addon"},e("span",null,"Honorable mentions: The Outsider, Alien Covenant, The Killer, The system was blinking red, Air, Oppenheimer, Barbie"))),e("div",{class:"item"},e("h2",null,"Best TV series"),e("span",null,"Succession"),e("div",{class:"item-addon"},e("span",null,"Honorable mentions: How to become a Mob boss, Severance, Get Gotti, Fear City"))),e("div",{class:"item"},e("h2",null,"Best podcast episode"),e("span",null,"The Really Good Podcast \u2014 Mark Cuban"),e("div",{class:"item-addon"},e("span",null,"Honorable mentions: Lex Fridman with Mark Zuckerberg, Stan Wyj\u0105tkowy - Wybory 2023 (PL), Piers Morgan vs HasanAbi On Palestine-Israel Conflict and War"))),e("div",{class:"item"},e("h2",null,"Best book"),e("span",null,"Dune \u2014 Frank Herbert"),e("div",{class:"item-addon"},e("span",null,"Honorable mentions: Adolf Hitler Biography - Bronis\u0142aw Kurzweil, Foundation Prelude \u2014 Asimov"))),e("div",{class:"item"},e("h2",null,"Best hardware innovation"),e("span",null,"4K/60 ProRes Log on iPhone 15 Pro")),e("div",{class:"item"},e("h2",null,"Best software innovation"),e("span",null,"ChatGPT 4.5"),e("div",{class:"item-addon"},e("span",null,"Honorable mentions: Make real by Tldraw"))),e("div",{class:"item"},e("h2",null,"Best tech blopper"),e("span",null,"Twitter rebrand to X"),e("div",{class:"item-addon"},e("span",null,"Honorable mentions: Next.js inline SQL"))),e("div",{class:"item"},e("h2",null,"Best comback story"),e("span",null,"Cyberpunk 2077"),e("div",{class:"item-addon"},e("span",null,"Honorable mentions: Atrioc AI Porn scandal, 2023 Polish parliamentary election"))),e("div",{class:"item"},e("h2",null,"Best meme"),e("a",{href:"https://twitter.com/cachedeposits/status/1650534793287806978"},"Link \u2192")),e("div",{class:"item"},e("h2",null,"Best photo"),e("a",{href:"https://twitter.com/ennntropy/status/1610831450663784448/photo/1"},"Link \u2192")),e("div",{class:"item"},e("h2",null,"Best Twitter thread"),e("a",{href:"https://twitter.com/wxbx4/status/1661649415910612992"},"Link \u2192"))))}};var x=class extends m{static{l(this,"AppComponent")}render(){return e(h,{routes:{"/":e(g,null),"/items":e(p,null),"/2023":e(v,null)}})}};f(x,document.body);
