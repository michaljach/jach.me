var P=Object.defineProperty;var o=(t,i)=>P(t,"name",{value:i,configurable:!0});var B=Object.defineProperty,l=o((t,i)=>B(t,"name",{value:i,configurable:!0}),"t"),f=l(t=>t.name[0].toLowerCase()+t.name.slice(1,t.name.length).replace(/[A-Z]/g,i=>`-${i.toLowerCase()}`),"getComponentName"),b=l((t,i)=>{let r=f(t);customElements.define(r,t);let a=document.createElement(r);i.appendChild(a)},"render");var e=l((t,i,...r)=>{let a=typeof t=="function",s=a?f(t):t;a&&!customElements.get(s)&&customElements.define(s,t);let n=document.createElement(s);return{tagName:s,attrs:i,element:n,children:r}},"h");var w=l(({tagName:t,attrs:i,children:r,element:a})=>{let s=a;for(let[n,m]of Object.entries(i||{}))switch(n){case"click":case"keyup":s.addEventListener(n,m);break;default:customElements.get(t)?s.props[n]=m:s.setAttribute(n,m);break}for(let n of r||[]){let m=c(n);m&&(customElements.get(t)||s.appendChild(m))}return s},"renderElement"),c=l(t=>t===void 0?null:Array.isArray(t)?w({tagName:"span",attrs:{},children:t,element:document.createElement("span")}):typeof t=="string"||typeof t=="number"?document.createTextNode(t.toString()):w(t),"render"),x=l((t,i)=>{let r=[];for(let a=0;a<Math.min(t.length,i.length);a++)r.push([t[a],i[a]]);return r},"zip"),k=l((t,i)=>{let r=[];for(let[s,n]of x(t,i))r.push(y(s,n));let a=[];for(let s of i.slice(t.length))a.push(n=>(n.appendChild(c(s)),n));return s=>{for(let[n,m]of x(r,s.childNodes))n(m);for(let n of a)n(s);return s}},"diffChildren"),E=l((t,i)=>{let r=[];r.push(a=>{if(a.props){if(JSON.stringify(a.props)!==JSON.stringify(i)){a.props=i;let s=a.render();y(a.__prevTree,s)(a.shadowRoot.firstElementChild)}}else for(let[s,n]of Object.entries(i||{}))s!=="click"&&s!=="keyup"&&a.setAttribute(s,n);return a});for(let a in t)a in i||r.push(s=>(s.removeAttribute(a),s));return a=>{for(let s of r)s(a)}},"diffAttrs"),y=l((t,i)=>{if(typeof i>"u")return s=>{s.remove()};if(typeof t=="string"||typeof i=="string"||typeof t=="number"||typeof i=="number")return t!==i?s=>{let n=c(i);return s.replaceWith(n),n}:s=>{};if(Array.isArray(t)||Array.isArray(i)){let s=k(t,i);return n=>(s(n),n)}if(t.tagName!==i.tagName)return s=>{let n=c(i);return s.replaceWith(n),n};let r=E(t.attrs,i.attrs),a=k(t.children,i.children);return s=>(r(s),a(s),s)},"diff"),d=class extends HTMLElement{static{o(this,"p")}static{l(this,"Component")}styles;props={};state={};__v;constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.__v=this.render();let t=c(this.__v);if(this.shadowRoot.replaceChildren(t),this.styles){let i=document.createElement("style");i.innerHTML=this.styles,this.shadowRoot.appendChild(i)}this.state=new Proxy(this.state,{set:(i,r,a)=>(i[r]=a,this.diff(),!0)})}diff(){if(this.__v){let t=this.render();y(this.__v,t)(this.shadowRoot.firstElementChild),this.__v=t}}render(){throw`render() in ${this.constructor.name} not implemented.`}},j=class{static{o(this,"y")}static{l(this,"Data")}data={};targets=[];isObserving=!1;observe(){this.data=new Proxy(this.data,{set:(t,i,r)=>{t[i]=r;let{targets:a}=this;return a.forEach(s=>{s.diff()}),!0}})}};function L(t,i){return r=>{let a=class extends r{static{o(this,"s")}static{l(this,"NewClass")}constructor(){super(),this[i||t.constructor.name]=t.data,t.targets.push(this),t.isObserving||(t.observe(),t.isObserving=!0)}};return Object.defineProperty(a,"name",{value:r.name}),a}}o(L,"S");l(L,"data");var A=class extends d{static{o(this,"u")}static{l(this,"RouterComponent")}currentRoute=this.getLocation();constructor(){super(),window.history.pushState=new Proxy(window.history.pushState,{apply:(t,i,r)=>(this.currentRoute=r[2].replace("#","/"),this.diff(),t.apply(i,r))}),window.addEventListener("popstate",()=>{this.currentRoute=this.getLocation(),this.diff()})}getLocation(){return`/${window.location.hash.slice(1)}`||"/"}render(){return e("div",null,this.props.routes[this.currentRoute])}};var C=`.container {
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
`;var g=class extends d{static{o(this,"HomePage")}styles=C;render(){return e("div",{class:"container"},e("main",null,e("header",null,e("h1",null,"Michael Jach"),e("span",null,"Software engineer")),e("div",null,"I craft fast and beautiful user interfaces and apps using modern technologies like ",e("a",{href:"https://react.dev/"},"React"),","," ",e("a",{href:"https://github.com/michaljach/htm0"},"htm0")," or"," ",e("a",{href:"https://developer.apple.com/xcode/swiftui/"},"SwiftUI")," ","(iOS). I'm a huge believer in open source, you can check my code on"," ",e("a",{href:"https://github.com/michaljach"},"Github"),". I share my thoughts and likes on"," ",e("a",{href:"https://twitter.com/michaeljach/likes"},"Twitter")," and I'm also reachable via email."),e("ul",{class:"links"},e("li",null,e("a",{href:"https://github.com/michaljach"},"Open source")),e("li",null,e("a",{href:"mailto:michaljach@gmail.com?subject=jach.me"},"Contact"))),e("section",{class:"thoughts"},e("h2",null,"Thoughts"),e("ul",{class:"items"},e("li",{class:"item"},e("a",{href:"#2023"},e("h3",null,"2023 in review"),e("span",null,"My take on best movies, shows, music, artists and bloopers from this year."))),e("li",{class:"item"},e("a",{href:"#items"},e("h3",null,"69 items"),e("span",null," I own 69 items. Here is the list. ")))))))}};var S=`.grid {
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
`;var p=class extends d{static{o(this,"ItemsPage")}styles=S;render(){return e("div",{class:"grid"},e("div",{class:"grid-hero"},e("h1",{class:"grid-hero-title"},"jach.me \u2014 items"),e("div",{class:"grid-hero-subtitle"},"I own ",e("strong",null,"69")," items."," ",e("a",{href:"https://minimalistathome.com/minimalism-vs-essentialism/"},"The philosphy."))),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/iphone15pro-removebg-preview.png"})),e("span",{class:"grid-element-title"},"iPhone 15 Pro Black Titanium")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/patagonia-Black-Terrebonne-Joggers-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Patagonia Terrebonne Black Joggers")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/mbp14-spacegray-gallery1-202301-removebg-preview.png"})),e("span",{class:"grid-element-title"},"MacBook Pro 14 M2 Pro Space Grey")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/21086_product_image1000x1000png.png"})),e("span",{class:"grid-element-title"},"Apple MagSafe charger")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/Apple-Display-1024x758-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Apple Studio Display")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/eugoods_09_451646_copy_3-transformed.png"})),e("span",{class:"grid-element-title"},"Uniqlo Dry Stretch Hoodie")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/15c3a2b57d3441c0a789498c5f78af39-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Blundstone 585 CLASSIC")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/MN713_AV1-removebg-preview-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Apple Thunderbolt 4 Pro Cable (1.8 m)")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/arket_shirt-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Arket Black Cotton Silk Overshirt")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/image_1-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Tesla Model 3")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/LEGO-Batman-76240-Batmobile-Tumbler-2-768x432.png"})),e("span",{class:"grid-element-title"},"Lego Batman Tumbler")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/uniqlo-black-men-supima-cotton-crew-neck-short-sleeve-t-shirt-product-0-613021972-normal-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Uniqlo Black Supima\xAE Cotton Tshirt")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"https://cdn2.easycosmetic.nl/images/Produkte/D2/chanel-egoiste-platinum-edt-vapo-50ml.png"})),e("span",{class:"grid-element-title"},"Chanel \xC9go\xEFste Platinum")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/10001_2Y2_ALT100-1300x514.png"})),e("span",{class:"grid-element-title"},"Crocs Slides Bone")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/MLL82_AV1-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Apple USB-C Charging Cable (2 m)")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/Herman-Miller-Cosm-Chair-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Herman Miller Cosm")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/MWP22-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Apple Airpods Pro")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"https://cdn.shopify.com/s/files/1/0090/1329/7207/products/Reuzel-Azul-01_700x.png?v=1604982073"})),e("span",{class:"grid-element-title"},"Reuzel Hair Pomade")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/s03h03e04c02_mlpng-removebg-preview.png"})),e("span",{class:"grid-element-title"},"AIAIAI TMA-2")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"https://img01.ztat.net/article/spp-media-p1/e32efe2833ac464e80746e0d91d3b121/54bfe36321604089ad77473913dd3bcb.jpg?imwidth=1800&filter=packshot"})),e("span",{class:"grid-element-title"},"Selected Homme Black Chino")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_88212433/fee_786_587_png"})),e("span",{class:"grid-element-title"},"Apple 67W USB-C Power Adapter")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/image-1-3197972026-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Samsung Portable SSD T5")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/36703-jordan-green-clean-toothbrush-medium-1-pcs-20181005-144006-big-2x-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Jordan Medium Toothbrush")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"https://img01.ztat.net/article/spp-media-p1/15faacd4ee5b3175b9d804e7a3e23b40/599a337175d34bcea4d5172e63743a5e.jpg?imwidth=1800&filter=packshot"})),e("span",{class:"grid-element-title"},"Camano Soft Sneaker Socks")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/dpwlqkddlbkmbjrnmwzc_copy-transformed.png"})),e("span",{class:"grid-element-title"},"ON Running Cloud Ultra")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"https://img01.ztat.net/article/spp-media-p1/b4e1ae9d99133c819dea3e5ad8161fd3/bc85fe3732f04eec8240746a46f5634d.jpg?filter=packshot&imwidth=169"})),e("span",{class:"grid-element-title"},"Calvin Clein Trunks")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/149c87dd45d248d78b0214c1710f6a0d-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Massimo Dutti Black Sweater")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/arket-shorts-preview.png"})),e("span",{class:"grid-element-title"},"Arket Cotton-Linen Drawstring Shorts")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/14fdb864-12fa-444a-bdd5-8f5a1d530e16_1.cf1beb728c4aea8629b59d2dd78e9efb-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Wenger Tandem Backpack")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/7ZCI_JK3_alt20-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Northface STOLEMBERG 3L DRYVENT\u2122")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/car-k121-blk-xl_carhartt-midweight-hooded-sweatshirt-black-xl-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Carhartt Midweight Black Hoodie")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/7085474_1-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Witchen Maleta Travel Suitcase")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/loake-wadham-mens-oxford-shoes-black-SIDE-min-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Loake Black Oxford Shoes")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/apple-magic-keyboard_ie5613479-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Apple Magic Keyboard")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/b2b5223c-eed6-4381-b16f-21536e506004-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Timberland 6 Inch Black Winter Boots")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/2-47-2046x2048-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Logitech G305")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/Hp0eBgPHWhV27DeVnFIVka-30-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Vishy 72H Black Deodorant")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/27un880-b-1-1200x1200-removebg-preview.png"})),e("span",{class:"grid-element-title"},"LG Ultrafine 4K 27UN880")),e("div",{class:"grid-element"},e("div",{class:"grid-element-image"},e("img",{class:"grid-element-image-img",src:"assets/9c2e62b46ba4492ab1ca15f1fabfaa7e-removebg-preview.png"})),e("span",{class:"grid-element-title"},"Massimo Dutti Slim Fit Oxford Shirt")))}};var T=`.container {
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
`;var v=class extends d{static{o(this,"Year2023Page")}styles=T;render(){return e("div",{class:"container"},e("main",null,e("div",{class:"header"},e("h1",null,"2023 in review"),e("span",null,"by Michael Jach")),e("div",{class:"item"},e("h2",null,"Best music album"),e("span",null,"Let's start here \u2014 Lil Yachty")),e("div",{class:"item"},e("h2",null,"Best artist/creator"),e("span",null,"Hudson Mohawke"),e("div",{class:"item-addon"},e("span",null,"Honorable mentions: Jack Sather"))),e("div",{class:"item"},e("h2",null,"Best game"),e("span",null,"Hogwarts Legacy"),e("div",{class:"item-addon"},e("span",null,"Honorable mentions: Disco Elysium, Cyberpunk 2077 2.0, Baldurs Gate 3"))),e("div",{class:"item"},e("h2",null,"Best movie"),e("span",null,"Where the Crawdads Sing"),e("div",{class:"item-addon"},e("span",null,"Honorable mentions: The Outsider, Alien Covenant, The Killer, The system was blinking red, Air, Oppenheimer, Barbie"))),e("div",{class:"item"},e("h2",null,"Best TV series"),e("span",null,"Succession"),e("div",{class:"item-addon"},e("span",null,"Honorable mentions: How to become a Mob boss, Severance, Get Gotti, Fear City"))),e("div",{class:"item"},e("h2",null,"Best podcast episode"),e("span",null,"The Really Good Podcast \u2014 Mark Cuban"),e("div",{class:"item-addon"},e("span",null,"Honorable mentions: Lex Fridman with Mark Zuckerberg, Stan Wyj\u0105tkowy - Wybory 2023 (PL), Piers Morgan vs HasanAbi On Palestine-Israel Conflict and War"))),e("div",{class:"item"},e("h2",null,"Best book"),e("span",null,"Dune \u2014 Frank Herbert"),e("div",{class:"item-addon"},e("span",null,"Honorable mentions: Adolf Hitler Biography - Bronis\u0142aw Kurzweil, Foundation Prelude \u2014 Asimov"))),e("div",{class:"item"},e("h2",null,"Best hardware innovation"),e("span",null,"4K/60 ProRes Log on iPhone 15 Pro")),e("div",{class:"item"},e("h2",null,"Best software innovation"),e("span",null,"ChatGPT 4.5"),e("div",{class:"item-addon"},e("span",null,"Honorable mentions: Make real by Tldraw"))),e("div",{class:"item"},e("h2",null,"Best tech blopper"),e("span",null,"Twitter rebrand to X"),e("div",{class:"item-addon"},e("span",null,"Honorable mentions: Next.js inline SQL"))),e("div",{class:"item"},e("h2",null,"Best comback story"),e("span",null,"Cyberpunk 2077"),e("div",{class:"item-addon"},e("span",null,"Honorable mentions: Atrioc AI Porn scandal, 2023 Polish parliamentary election"))),e("div",{class:"item"},e("h2",null,"Best meme"),e("a",{href:"https://twitter.com/cachedeposits/status/1650534793287806978"},"Link \u2192")),e("div",{class:"item"},e("h2",null,"Best photo"),e("a",{href:"https://twitter.com/ennntropy/status/1610831450663784448/photo/1"},"Link \u2192")),e("div",{class:"item"},e("h2",null,"Best Twitter thread"),e("a",{href:"https://twitter.com/wxbx4/status/1661649415910612992"},"Link \u2192"))))}};var u=class extends d{static{o(this,"PrivacyPage")}render(){return e("div",{class:"container"},e("div",{className:"p-24"},e("p",{className:"text-2xl"},"Privacy Policy"),e("p",null,"1. OUR DETAILS AS THE DATA CONTROLLER AND APP DEVELOPER"),e("p",null,"Local Brain Application (the 'App') and Local Brain for Business are brought to you by ink.community Company (the 'Data Controller and App Developer' of your personal data). Consequently, 'We', 'Us' and 'Ours' refers to the Data Controller and App Developer."),e("p",null,"2. INFORMATION WE COLLECT AND HOW WE USE THIS INFORMATION"),e("p",null,"Regarding the App: your data IS NOT stored anywhere on our servers and it is not processed, manipulated or seen in any state in any time while using the app. We use Apple CloudKit to store your data which is safe, secure Cloud service for iOS/Mac users hosted by Apple. If you are not using iCloud or iCloud Drive your data is stored in encrypted fashion on your local device."),e("p",null,"Regarding this Website: your browser transfers certain data so that it can access the Website, namely: the IP address the date and time of the request the browser type the operating system the language and version of the browser software. Cookies: Use of (Further Analyzing) Tools Cookies are stored on your computer when using the Website. Cookies are small text files that are stored on your hard disk of the computer with which you visit a website and which are allocated to your browser and through which certain information is submitted to the cookies user that sets the cookie (in this case us). Cookies serve to make the website offering more user-friendly and effective overall. The Website uses cookies to the following extent: Transient / Session cookies Persistent / Setting cookies Analytics cookies Transient cookies are automatically deleted when you close your browser. This includes in particular the session cookies. These store a so-called session ID, which identify user session in the browser. Session cookies are deleted when you log out or close your browser. Persistent cookies help the Website remember your information and settings when you visit them in the future. They are automatically deleted after a specified period, which may differ depending on the cookie. We also use cookies on our website which enable an analysis of the user's surfing behavior. You can configure your browser settings according to your wishes and, for example, restrict the use of cookies or refuse them altogether. However, we would like to point out that you may not be able to use all the functions of the Website in this case. The Website uses Google Analytics, a web analytics service provided by Google, Inc. ('Google'). Google Analytics uses 'cookies', which are text files placed on your computer, to help analyze how you use the Website. The information generated by the cookie about your use of the Website will normally be transmitted to and stored by Google on servers in the United States. In case IP-anonymization is activated on the Website, your IP address will be truncated within the area of member states of the European Union or within other contracting states to the Agreement on the European Economic Area. Only in exceptional cases the whole IP address will be first transferred to a Google server in the USA and truncated there. Google will use this information on behalf of Readdle for the purpose of evaluating your use of the Website, compiling reports on Website activity and providing other services for Readdle relating to website activity and internet usage. The IP address that your browser transfers within the scope of Google Analytics will not be associated with any other data held by Google. You may refuse the use of cookies by selecting the appropriate settings in your browser, however please note that if you do so you may not be able to use all functions of the Website. You can also opt-out from the storage by Google of the data that is created by the cookie and is related to the use of the Website (including your IP address) and the processing of such data by Google by downloading and installing the Google Analytics opt-out Browser add-on available under https://tools.google.com/dlpage/gaoptout?hl=en. As an alternative to the browser add-on or within browsers on mobile devices, you can click this link in order to opt-out from being tracked by Google Analytics within this Website in the future (this opt-out option applies only for the browser in which you set it and with regard to the Website). In this case an opt-out cookie is put on your device. In case you delete your cookies, you will have to use the aforementioned link again. For further information on Google Analytics please refer to: http://www.google.com/analytics/terms/, https://support.google.com/analytics/answer/6004245?hl=en and https://policies.google.com/privacy?hl=en&gl=en"),e("p",null,"3. WHAT WE DO WITH YOUR PERSONAL DATA"),e("p",null,"Your personal data is used to provide you our App and Services, and to improve the Product. Your personal data is not used for marketing purposes. Your personal data is not stored and used on our side. As stated in section 2 above, We only access personal, encrypted data for the purposes strictly necessary to provide you with the service and we get that data from Apple secure servers."),e("p",null,"4. CHANGES TO THE PRIVACY POLICY"),e("p",null,"We will always notify you via email or otherwise should we update this privacy policy. We will update the 'last modified' date at the bottom of this privacy policy to indicate the latest revision, as well as the changes were made."),e("p",{className:"footer"},"\xA9 2024 Local Brain, jach.me")))}};var h=class extends d{static{o(this,"AppComponent")}render(){return e(A,{routes:{"/":e(g,null),"/items":e(p,null),"/2023":e(v,null),"/privacy":e(u,null)}})}};b(h,document.body);
