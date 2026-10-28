(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=Array.isArray,t=Array.prototype.indexOf,n=Array.prototype.includes,r=Array.from,i=Object.defineProperty,a=Object.getOwnPropertyDescriptor,o=Object.getOwnPropertyDescriptors,s=Object.prototype,c=Array.prototype,l=Object.getPrototypeOf,u=Object.isExtensible,d=()=>{};function f(e){for(var t=0;t<e.length;t++)e[t]()}function p(){var e,t;return{promise:new Promise((n,r)=>{e=n,t=r}),resolve:e,reject:t}}var m=1024,h=2048,g=4096,_=8192,v=16384,y=32768,b=1<<25,x=65536,S=1<<19,C=1<<20,w=1<<25,T=1<<21,ee=1<<22,E=1<<23,D=Symbol(`$state`),te=Symbol(`component`),ne=Symbol(`legacy props`),re=Symbol(``),ie=Symbol(`attributes`),O=Symbol(`class`),ae=Symbol(`style`),k=Symbol(`text`),oe=Symbol(`form reset`),se=new class extends Error{name=`StaleReactionError`;message="The reaction that called `getAbortSignal()` was re-run or destroyed"},ce=!!globalThis.document?.contentType&&globalThis.document.contentType.includes(`xml`),le={},A=Symbol(`uninitialized`),ue=`http://www.w3.org/1999/xhtml`;function de(){console.warn(`https://svelte.dev/e/derived_inert`)}function fe(e){console.warn(`https://svelte.dev/e/hydration_mismatch`)}function pe(){console.warn(`https://svelte.dev/e/select_multiple_invalid_value`)}function me(){console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`)}var j=!1;function he(e){j=e}var M;function ge(e){if(e===null)throw fe(),le;return M=e}function _e(){return ge($t(M))}function N(e){if(j){if($t(M)!==null)throw fe(),le;M=e}}function ve(e=1){if(j){for(var t=e,n=M;t--;)n=$t(n);M=n}}function ye(e=!0){for(var t=0,n=M;;){if(n.nodeType===8){var r=n.data;if(r===`]`){if(t===0)return n;--t}else(r===`[`||r===`[!`||r[0]===`[`&&!isNaN(Number(r.slice(1))))&&(t+=1)}var i=$t(n);e&&n.remove(),n=i}}function be(e){if(!e||e.nodeType!==8)throw fe(),le;return e.data}function xe(e){return e===this.v}function Se(e,t){return e==e?e!==t||typeof e==`object`&&!!e||typeof e==`function`:t==t}function Ce(e){return!Se(e,this.v)}function we(e){throw Error(`https://svelte.dev/e/lifecycle_outside_component`)}function Te(){throw Error(`https://svelte.dev/e/async_derived_orphan`)}function Ee(e,t,n){throw Error(`https://svelte.dev/e/each_key_duplicate`)}function De(e){throw Error(`https://svelte.dev/e/effect_in_teardown`)}function Oe(){throw Error(`https://svelte.dev/e/effect_in_unowned_derived`)}function ke(e){throw Error(`https://svelte.dev/e/effect_orphan`)}function Ae(){throw Error(`https://svelte.dev/e/effect_update_depth_exceeded`)}function je(e){throw Error(`https://svelte.dev/e/props_invalid_value`)}function Me(){throw Error(`https://svelte.dev/e/state_descriptors_fixed`)}function Ne(){throw Error(`https://svelte.dev/e/state_prototype_fixed`)}function Pe(){throw Error(`https://svelte.dev/e/state_unsafe_mutation`)}function Fe(){throw Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`)}var Ie=[];function Le(e,t=!1,n=!1){return Re(e,new Map,``,Ie,null,n)}function Re(t,n,r,i,a=null,o=!1){if(typeof t==`object`&&t){var c=n.get(t);if(c!==void 0)return c;if(t instanceof Map)return new Map(t);if(t instanceof Set)return new Set(t);if(e(t)){var u=Array(t.length);n.set(t,u),a!==null&&n.set(a,u);for(var d=0;d<t.length;d+=1){var f=t[d];d in t&&(u[d]=Re(f,n,r,i,null,o))}return u}if(l(t)===s){u={},n.set(t,u),a!==null&&n.set(a,u);for(var p of Object.keys(t))u[p]=Re(t[p],n,r,i,null,o);return u}if(t instanceof Date)return t.getTime(),structuredClone(t);if(typeof t.toJSON==`function`&&!o)return Re(t.toJSON(),n,r,i,t)}if(t instanceof EventTarget)return t;try{return structuredClone(t)}catch{return t}}var ze=null;function Be(e){ze=e}function Ve(e,t=!1,n){ze={p:ze,i:!1,c:null,e:null,s:e,x:null,r:W,l:null}}function He(e){var t=ze,n=t.e;if(n!==null){t.e=null;for(var r of n)mn(r)}return e!==void 0&&(t.x=e),t.i=!0,ze=t.p,Ue(e)}function Ue(e={}){return i(e,te,{value:!0}),e}function We(){return!0}var Ge=[];function Ke(){var e=Ge;Ge=[],f(e)}function qe(e){if(Ge.length===0&&!_t){var t=Ge;queueMicrotask(()=>{t===Ge&&Ke()})}Ge.push(e)}var Je=~(h|g|m);function P(e,t){e.f=e.f&Je|t}function Ye(e){e.f&512||e.deps===null?P(e,m):P(e,g)}function Xe(e,t,n){e.f&2048?t.add(e):e.f&4096&&n.add(e),P(e,m)}var Ze=!1;function Qe(){Ze||(Ze=!0,document.addEventListener(`reset`,e=>{Promise.resolve().then(()=>{if(!e.defaultPrevented)for(let t of e.target.elements)t[oe]?.()})},{capture:!0}))}function $e(e){var t=U,n=W;In(null),Ln(null);try{return e()}finally{In(t),Ln(n)}}function et(e,t,n,r){let i=We()?it:st;var a=e.filter(e=>!e.settled),o=t.map(i);if(n.length===0&&a.length===0){r(o);return}var s=W,c=tt(),l=a.length===1?a[0].promise:a.length>1?Promise.all(a.map(e=>e.promise)):null;function u(e){if(!(s.f&16384)){c();try{r([...o,...e])}catch(e){sn(e,s)}nt()}}var d=rt();if(n.length===0){l.then(()=>u([])).finally(d);return}function f(){Promise.all(n.map(e=>ot(e))).then(u).catch(e=>sn(e,s)).finally(d)}l?l.then(()=>{s.f&16384?d():(c(),f(),nt())}):f()}function tt(){var e=W,t=U,n=ze,r=I;return function(i=!0){Ln(e),In(t),Be(n),i&&!(e.f&16384)&&(r?.activate(),r?.apply())}}function nt(e=!0){Ln(null),In(null),Be(null),e&&I?.deactivate()}function rt(){var e=W,t=e.b,n=I,r=!!t?.is_rendered();return t?.update_pending_count(1,n),n.increment(r,e),()=>{t?.update_pending_count(-1,n),n.decrement(r,e)}}function it(e){var t=2|h;return W!==null&&(W.f|=S),{ctx:ze,deps:null,effects:null,equals:xe,f:t,fn:e,reactions:null,rv:0,v:A,wv:0,parent:W,ac:null}}var at=Symbol(`obsolete`);function ot(e,t,n){let r=W;r===null&&Te();var i=void 0,a=Nt(A),o=!U,s=new Set;return _n(()=>{var t=W,n=p();i=n.promise;try{Promise.resolve(e()).then(n.resolve,e=>{e!==se&&n.reject(e)}).finally(nt)}catch(e){n.reject(e),nt()}var c=I;if(o){if(t.f&32768)var l=rt();if(r.b?.is_rendered())c.async_deriveds.get(t)?.reject(at);else for(let e of s.values())e.reject(at);s.add(n),c.async_deriveds.set(t,n)}let u=(e,t=void 0)=>{l?.(),s.delete(n),t!==at&&(c.activate(),t?(a.f|=E,Lt(a,t)):(a.f&8388608&&(a.f^=E),Lt(a,e)),c.deactivate())};n.promise.then(u,e=>u(null,e||`unknown`))}),fn(()=>{for(let e of s)e.reject(at)}),new Promise(e=>{function t(n){function r(){n===i?e(a):t(i)}n.then(r,r)}t(i)})}function F(e){let t=it(e);return zn(t),t}function st(e){let t=it(e);return t.equals=Ce,t}function ct(e){var t=e.effects;if(t!==null){e.effects=null;for(var n=0;n<t.length;n+=1)wn(t[n])}}function lt(e){var t,n=W,r=e.parent;if(!Nn&&r!==null&&e.v!==A&&r.f&24576)return de(),e.v;Ln(r);try{ct(e),t=Zn(e)}finally{Ln(n)}return t}function ut(e){var t=lt(e);!e.equals(t)&&(e.wv=Jn(),(!I?.is_fork||e.deps===null)&&(I===null?e.v=t:(I.capture(e,t,!0),mt?.capture(e,t,!0)),e.deps===null))?P(e,m):Nn||(ht===null?Ye(e):(dn()||I?.is_fork)&&ht.set(e,t))}function dt(e){if(e.effects!==null)for(let t of e.effects)(t.teardown||t.ac)&&(t.teardown?.(),t.ac!==null&&$e(()=>{t.ac.abort(se),t.ac=null}),t.fn!==null&&(t.teardown=d),er(t,0),Sn(t))}function ft(e){if(e.effects!==null)for(let t of e.effects)t.teardown&&t.fn!==null&&tr(t)}var pt=null,I=null,mt=null,ht=null,gt=null,_t=!1,vt=!1,yt=null,bt=null,xt=0,St=1,Ct=class e{id=St++;#e=!1;linked=!0;#t=null;#n=null;async_deriveds=new Map;current=new Map;previous=new Map;#r=new Set;#i=new Set;#a=0;#o=new Map;#s=null;#c=[];#l=[];#u=new Set;#d=new Set;#f=new Map;#p=new Set;is_fork=!1;#m=!1;constructor(){pt===null?pt=this:(pt.#n=this,this.#t=pt),pt=this}#h(){if(this.is_fork)return!0;for(let n of this.#o.keys()){for(var e=n,t=!1;e.parent!==null;){if(this.#f.has(e)){t=!0;break}e=e.parent}if(!t)return!0}return!1}skip_effect(e){this.#f.has(e)||this.#f.set(e,{d:[],m:[]}),this.#p.delete(e)}unskip_effect(e,t=e=>this.schedule(e)){var n=this.#f.get(e);if(n){this.#f.delete(e);for(var r of n.d)P(r,h),t(r);for(r of n.m)P(r,g),t(r)}this.#p.add(e)}#g(){var e=[];for(let i of this.#c)if(!(i.f&16384||!(i.f&6144))){for(var t=i,n=!1;t.parent!==null;){t=t.parent;var r=t.f;if(r&96){if(!(r&1024)){n=!0;break}t.f^=m}}n||e.push(t)}return this.#c=[],e}#_(){this.#e=!0;for(let e of this.#u)this.#d.delete(e),P(e,h),this.schedule(e);for(let e of this.#d)P(e,g),this.schedule(e);this.apply();for(var t=yt=[],n=[],r=bt=[];this.#c.length>0;){xt++>1e3&&(this.#S(),wt());for(let e of this.#g())try{this.#v(e,t,n)}catch(t){throw kt(e),this.#h()||this.discard(),t}}if(I=null,r.length>0){var i=e.ensure();for(let e of r)i.schedule(e)}if(yt=null,bt=null,this.#h()){this.#x(n),this.#x(t);for(let[e,t]of this.#f)Ot(e,t);r.length>0&&I.#_();return}let a=this.#y();if(a)this.#x(n),this.#x(t),a.#b(this);else{this.#u.clear(),this.#d.clear();for(let e of this.#r)e(this);this.#r.clear(),mt=this,Et(n),Et(t),mt=null,this.#s?.resolve();var o=I;if(this.#a===0&&(this.#c.length===0||o!==null)&&this.#S(),this.#c.length>0){if(o!==null){for(let e of this.#c)o.#c.push(e);this.#c=[]}else o=this}o!==null&&(jt.clear(),o.#_())}}#v(e,t,n){e.f^=m;for(var r=e.first;r!==null;){var i=r.f,a=!!(i&96);if(!(a&&i&1024||i&8192||this.#f.has(r))&&r.fn!==null){a?r.f^=m:i&4?t.push(r):Yn(r)&&(i&16&&this.#d.add(r),tr(r));var o=r.first;if(o!==null){r=o;continue}}for(;r!==null;){var s=r.next;if(s!==null){r=s;break}r=r.parent}}}#y(){for(var e=this.#t;e!==null;){if(!e.is_fork){for(let[t,[,n]]of this.current)if(e.current.has(t)&&!n)return e}e=e.#t}return null}#b(e){for(let[t,n]of e.current)!this.previous.has(t)&&e.previous.has(t)&&this.previous.set(t,e.previous.get(t)),this.current.set(t,n);for(let[t,n]of e.async_deriveds){let e=this.async_deriveds.get(t);e&&n.promise.then(e.resolve).catch(e.reject)}e.async_deriveds.clear(),this.transfer_effects(e.#u,e.#d);let t=e=>{var n=e.reactions;if(n!==null&&!(e.f&2&&!(e.f&6144)))for(let e of n){var r=e.f;if(r&2)t(e);else{var i=e;r&4194320&&!this.async_deriveds.has(i)&&(this.#d.delete(i),P(i,h),this.schedule(i))}}};for(let e of this.current.keys())t(e);this.oncommit(()=>e.discard()),e.#S(),I=this,this.#_()}#x(e){for(var t=0;t<e.length;t+=1)Xe(e[t],this.#u,this.#d)}capture(e,t,n=!1){e.v!==A&&!this.previous.has(e)&&this.previous.set(e,e.v),e.f&8388608||(this.current.set(e,[t,n]),ht?.set(e,t)),this.is_fork||(e.v=t)}activate(){I=this}deactivate(){I=null,ht=null}flush(){try{vt=!0,I=this,this.#_()}finally{xt=0,gt=null,yt=null,bt=null,vt=!1,I=null,ht=null,jt.clear()}}discard(){for(let e of this.#i)e(this);this.#i.clear();for(let e of this.async_deriveds.values())e.reject(at);this.#S(),this.#s?.resolve()}register_created_effect(e){this.#l.push(e)}increment(e,t){if(this.#a+=1,e){let e=this.#o.get(t)??0;this.#o.set(t,e+1)}}decrement(e,t){if(--this.#a,e){let e=this.#o.get(t)??0;e===1?this.#o.delete(t):this.#o.set(t,e-1)}this.#m||(this.#m=!0,qe(()=>{this.#m=!1,this.linked&&this.flush()}))}transfer_effects(e,t){for(let t of e)this.#u.add(t);for(let e of t)this.#d.add(e);e.clear(),t.clear()}oncommit(e){this.#r.add(e)}ondiscard(e){this.#i.add(e)}settled(){return(this.#s??=p()).promise}static ensure(){if(I===null){let t=I=new e;!vt&&qe(()=>{t.#e||t.flush()})}return I}apply(){ht=null}schedule(e){gt=e,e.b?.is_pending&&e.f&16777228&&!(e.f&32768)?e.b.defer_effect(e):this.#c.push(e)}#S(){if(this.linked){var e=this.#t,t=this.#n;e===null||(e.#n=t),t===null?pt=e:t.#t=e,this.linked=!1}}};function wt(){try{Ae()}catch(e){sn(e,gt)}}var Tt=null;function Et(e){var t=e.length;if(t!==0){for(var n=0;n<t;){var r=e[n++];if(!(r.f&24576)&&Yn(r)&&(Tt=new Set,tr(r),r.deps===null&&r.first===null&&r.nodes===null&&r.teardown===null&&r.ac===null&&En(r),Tt?.size>0)){jt.clear();for(let e of Tt){if(e.f&24576)continue;let t=[e],n=e.parent;for(;n!==null;)Tt.has(n)&&(Tt.delete(n),t.push(n)),n=n.parent;for(let e=t.length-1;e>=0;e--){let n=t[e];n.f&24576||tr(n)}}Tt.clear()}}Tt=null}}function Dt(e){I.schedule(e)}function Ot(e,t){if(!(e.f&32&&e.f&1024)){e.f&2048?t.d.push(e):e.f&4096&&t.m.push(e),P(e,m);for(var n=e.first;n!==null;)Ot(n,t),n=n.next}}function kt(e){P(e,m);for(var t=e.first;t!==null;)kt(t),t=t.next}var At=new Set,jt=new Map,Mt=!1;function Nt(e,t){return{f:0,v:e,reactions:null,equals:xe,rv:0,wv:0}}function L(e,t){let n=Nt(e,t);return zn(n),n}function Pt(e,t=!1,n=!0){let r=Nt(e);return t||(r.equals=Ce),r}function R(e,t,n=!1){return U!==null&&(!Fn||U.f&131072)&&We()&&U.f&4325394&&(Rn===null||!Rn.has(e))&&Pe(),Lt(e,n?Ht(t):t,bt)}var Ft=null,It=0;function Lt(e,t,n=null){if(!e.equals(t)){Nn?jt.set(e,t):jt.has(e)||jt.set(e,e.v);var r=Ct.ensure();if(r.capture(e,t),e.f&2){let t=e;e.f&2048&&lt(t),ht===null&&Ye(t)}e.wv=Jn(),Ft=null,It=0,Vt(e,h,n),Ft=null,We()&&W!==null&&W.f&1024&&!(W.f&96)&&(Hn===null?Un([e]):Hn.push(e)),!r.is_fork&&At.size>0&&!Mt&&Rt()}return t}function Rt(){Mt=!1;for(let e of At){e.f&1024&&P(e,g);let t;try{t=Yn(e)}catch{t=!0}t&&tr(e)}At.clear()}function zt(e,t=1){var n=G(e),r=t===1?n++:n--;return R(e,n),r}function Bt(e){R(e,e.v+1)}function Vt(e,t,n){var r=e.reactions;if(r!==null){var i=We(),a=r.length;if(It+=a,It>1e5&&Ft===null&&(Ft=new Set),Ft!==null){if(Ft.has(e))return;Ft.add(e)}for(var o=0;o<a;o++){var s=r[o],c=s.f;if(i||s!==W){var l=(c&h)===0;if(l&&P(s,t),c&131072)At.add(s);else if(c&2){var u=s;ht?.delete(u),Vt(u,g,n)}else if(l){var d=s;c&16&&Tt!==null&&Tt.add(d),n===null?Dt(d):n.push(d)}}}}}function Ht(t){if(typeof t!=`object`||!t||D in t||te in t)return t;let n=l(t);if(n!==s&&n!==c)return t;var r=new Map,i=e(t),o=L(0),u=null,d=Kn,f=e=>{if(Kn===d)return e();var t=U,n=Kn;In(null),qn(d);var r=e();return In(t),qn(n),r};return i&&r.set(`length`,L(t.length,u)),new Proxy(t,{defineProperty(e,t,n){`value`in n&&n.configurable!==!1&&n.enumerable!==!1&&n.writable!==!1||Me();var i=r.get(t);return i===void 0?f(()=>{var e=L(n.value,u);return r.set(t,e),e}):R(i,n.value,!0),!0},deleteProperty(e,t){var n=r.get(t);if(n===void 0){if(t in e){let e=f(()=>L(A,u));r.set(t,e),Bt(o)}}else R(n,A),Bt(o);return!0},get(e,n,i){if(n===D)return t;var o=r.get(n),s=n in e;if(o===void 0&&(!s||a(e,n)?.writable)&&(o=f(()=>L(Ht(s?e[n]:A),u)),r.set(n,o)),o!==void 0){var c=G(o);return c===A?void 0:c}return Reflect.get(e,n,i)},getOwnPropertyDescriptor(e,t){this.has?.(e,t);var n=Reflect.getOwnPropertyDescriptor(e,t),i=r.get(t);if(i!==void 0){var a=G(i);if(a===A)return;if(n&&`value`in n)n.value=a;else return{enumerable:!0,configurable:!0,value:a,writable:!0}}return n},has(e,t){if(t===D)return!0;var n=r.get(t),i=n!==void 0&&n.v!==A||Reflect.has(e,t);return(n!==void 0||W!==null&&(!i||a(e,t)?.writable))&&(n===void 0&&(n=f(()=>L(i?Ht(e[t]):A,u)),r.set(t,n)),G(n)===A)?!1:i},set(e,t,n,s){var c=r.get(t),l=t in e;if(i&&t===`length`)for(var d=n;d<c.v;d+=1){var p=r.get(d+``);p===void 0?d in e&&(p=f(()=>L(A,u)),r.set(d+``,p)):R(p,A)}if(c===void 0)(!l||a(e,t)?.writable)&&(c=f(()=>L(void 0,u)),R(c,Ht(n)),r.set(t,c));else{l=c.v!==A;var m=f(()=>Ht(n));R(c,m)}var h=Reflect.getOwnPropertyDescriptor(e,t);if(h?.set&&h.set.call(s,n),!l){if(i&&typeof t==`string`){var g=r.get(`length`),_=Number(t);Number.isInteger(_)&&_>=g.v&&R(g,_+1)}Bt(o)}return!0},ownKeys(e){G(o);var t=Reflect.ownKeys(e).filter(e=>{var t=r.get(e);return t===void 0||t.v!==A});for(var[n,i]of r)i.v!==A&&!(n in e)&&t.push(n);return t},setPrototypeOf(){Ne()}})}function Ut(e){try{if(typeof e==`object`&&e&&D in e)return e[D]}catch{}return e}function Wt(e,t){return Object.is(Ut(e),Ut(t))}var Gt,Kt,qt,Jt,Yt;function Xt(){if(Gt===void 0){Gt=window,Kt=document,qt=/Firefox/.test(navigator.userAgent);var e=Element.prototype,t=Node.prototype,n=Text.prototype;Jt=a(t,`firstChild`).get,Yt=a(t,`nextSibling`).get,u(e)&&(e[O]=void 0,e[ie]=null,e[ae]=void 0,e.__e=void 0),u(n)&&(n[k]=void 0)}}function Zt(e=``){return document.createTextNode(e)}function Qt(e){return Jt.call(e)}function $t(e){return Yt.call(e)}function z(e,t){if(!j)return Qt(e);var n=Qt(M);if(n===null)n=M.appendChild(Zt());else if(t&&n.nodeType!==3){var r=Zt();return n?.before(r),ge(r),r}return t&&an(n),ge(n),n}function en(e,t=!1){if(!j){var n=Qt(e);return n instanceof Comment&&n.data===``?$t(n):n}if(t){if(M?.nodeType!==3){var r=Zt();return M?.before(r),ge(r),r}an(M)}return M}function B(e,t=!1){if(!j)return Qt(e);var n=z(e,t);return N(e),n}function V(e,t=1,n=!1){let r=j?M:e;for(var i;t--;)i=r,r=$t(r);if(!j)return r;if(n){if(r?.nodeType!==3){var a=Zt();return r===null?i?.after(a):r.before(a),ge(a),a}an(r)}return ge(r),r}function tn(e){e.textContent=``}function nn(){return!1}function rn(e,t,n){return t==null||t===`http://www.w3.org/1999/xhtml`?n?document.createElement(e,{is:n}):document.createElement(e):n?document.createElementNS(t,e,{is:n}):document.createElementNS(t,e)}function an(e){if(e.nodeValue.length<65536)return;let t=e.nextSibling;for(;t!==null&&t.nodeType===3;)t.remove(),e.nodeValue+=t.nodeValue,t=e.nextSibling}function on(e){var t=W;if(t===null)return U.f|=E,e;if(!(t.f&32768)&&!(t.f&4))throw e;sn(e,t)}function sn(e,t){if(e===le)throw e;if(!(t!==null&&t.f&16384)){for(;t!==null;){if(t.f&128&&!(t.f&33570816)){if(!(t.f&32768))throw e;try{t.b.error(e);return}catch(t){e=t}}t=t.parent}throw e}}function cn(e){W===null&&(U===null&&ke(e),Oe()),Nn&&De(e)}function ln(e,t){var n=t.last;n===null?t.last=t.first=e:(n.next=e,e.prev=n,t.last=e)}function un(e,t){var n=W;n!==null&&n.f&8192&&(e|=_);var r={ctx:ze,deps:null,nodes:null,f:e|h|512,first:null,fn:t,last:null,next:null,parent:n,b:n&&n.b,prev:null,teardown:null,wv:0,ac:null};I?.register_created_effect(r);var i=r;if(e&4)yt===null?Ct.ensure().schedule(r):yt.push(r);else if(t!==null){try{tr(r)}catch(e){throw wn(r),e}i.deps===null&&i.teardown===null&&i.nodes===null&&i.first===i.last&&!(i.f&524288)&&(i=i.first,e&16&&e&65536&&i!==null&&(i.f|=x))}if(i!==null&&(i.parent=n,n!==null&&ln(i,n),U!==null&&U.f&2&&!(e&64))){var a=U;(a.effects??=[]).push(i)}return r}function dn(){return U!==null&&!Fn}function fn(e){let t=un(8,null);return P(t,m),t.teardown=e,t}function pn(e){cn(`$effect`);var t=W.f;if(!U&&t&32&&ze!==null&&!ze.i){var n=ze;(n.e??=[]).push(e)}else return mn(e)}function mn(e){return un(4|C,e)}function hn(e){Ct.ensure();let t=un(64|S,e);return(e={})=>new Promise(n=>{e.outro?Dn(t,()=>{wn(t),n(void 0)}):(wn(t),n(void 0))})}function gn(e){return un(4,e)}function _n(e){return un(ee|S,e)}function vn(e,t=0){return un(8|t,e)}function H(e,t=[],n=[],r=[]){et(r,t,n,t=>{un(8,()=>{e(...t.map(G))})})}function yn(e,t=0){return un(16|t,e)}function bn(e){return un(32|S,e)}function xn(e){var t=e.teardown;if(t!==null){let n=Nn,r=U;Pn(!0),In(null);try{t.call(null)}catch(t){sn(t,e.parent)}finally{Pn(n),In(r)}}}function Sn(e,t=!1){var n=e.first;for(e.first=e.last=null;n!==null;){let e=n.ac;e!==null&&$e(()=>{e.abort(se)});var r=n.next;n.f&64?n.parent=null:wn(n,t),n=r}}function Cn(e){for(var t=e.first;t!==null;){var n=t.next;t.f&32||wn(t),t=n}}function wn(e,t=!0){var n=!1;(t||e.f&262144)&&e.nodes!==null&&e.nodes.end!==null&&(Tn(e.nodes.start,e.nodes.end),n=!0),e.f|=b,Sn(e,t&&!n),er(e,0);var r=e.nodes&&e.nodes.t;if(r!==null)for(let e of r)e.stop();xn(e),e.f^=b,e.f|=v;var i=e.parent;i!==null&&i.first!==null&&En(e),e.next=e.prev=e.teardown=e.ctx=e.deps=e.fn=e.nodes=e.ac=e.b=null}function Tn(e,t){for(;e!==null;){var n=e===t?null:$t(e);e.remove(),e=n}}function En(e){var t=e.parent,n=e.prev,r=e.next;n!==null&&(n.next=r),r!==null&&(r.prev=n),t!==null&&(t.first===e&&(t.first=r),t.last===e&&(t.last=n))}function Dn(e,t,n=!0){var r=[];e.f|=256,On(e,r,!0);var i=()=>{n&&wn(e),t&&t()},a=r.length;if(a>0){var o=()=>--a||i();for(var s of r)s.out(o)}else i()}function On(e,t,n){if(!(e.f&8192)){e.f^=_;var r=e.nodes&&e.nodes.t;if(r!==null)for(let e of r)(e.is_global||n)&&t.push(e);for(var i=e.first;i!==null;){var a=i.next;if(!(i.f&64)){var o=!!(i.f&65536)||!!(i.f&32)&&!!(e.f&16);On(i,t,o?n:!1)}i=a}}}function kn(e){e.f&=-257,An(e,!0)}function An(e,t){if(!(e.f&256)&&e.f&8192){e.f^=_,e.f&1024||(P(e,h),Ct.ensure().schedule(e));for(var n=e.first;n!==null;){var r=n.next,i=!!(n.f&65536)||!!(n.f&32);An(n,i?t:!1),n=r}var a=e.nodes&&e.nodes.t;if(a!==null)for(let e of a)(e.is_global||t)&&e.in()}}function jn(e,t){if(e.nodes)for(var n=e.nodes.start,r=e.nodes.end;n!==null;){var i=n===r?null:$t(n);t.append(n),n=i}}var Mn=null,Nn=!1;function Pn(e){Nn=e}var U=null,Fn=!1;function In(e){U=e}var W=null;function Ln(e){W=e}var Rn=null;function zn(e){U!==null&&(U.f&2097152||U.f&2)&&(Rn??=new Set).add(e)}var Bn=null,Vn=0,Hn=null;function Un(e){Hn=e}var Wn=1,Gn=0,Kn=Gn;function qn(e){Kn=e}function Jn(){return++Wn}function Yn(e){var t=e.f;if(t&2048)return!0;if(t&4096){for(var n=e.deps,r=n.length,i=0;i<r;i++){var a=n[i];if(Yn(a)&&ut(a),a.wv>e.wv)return!0}t&512&&ht===null&&P(e,m)}return!1}function Xn(e,t,n=!0){var r=e.reactions;if(r!==null&&!(Rn!==null&&Rn.has(e)))for(var i=0;i<r.length;i++){var a=r[i];a.f&2?Xn(a,t,!1):t===a&&(n?P(a,h):a.f&1024&&P(a,g),Dt(a))}}function Zn(e){var t=Bn,n=Vn,r=Hn,i=U,a=Rn,o=ze,s=Fn,c=Kn,l=e.f;Bn=null,Vn=0,Hn=null,U=l&96?null:e,Rn=null,Be(e.ctx),Fn=!1,Kn=++Gn,e.ac!==null&&($e(()=>{e.ac.abort(se)}),e.ac=null);try{e.f|=T;var u=e.fn,d=u();e.f|=y;var f=Qn(e);if(We()&&Hn!==null&&!Fn&&f!==null&&!(e.f&6146))for(var p=0;p<Hn.length;p++)Xn(Hn[p],e);if(i!==null&&i!==e){if(Gn++,i.deps!==null)for(let e=0;e<n;e+=1)i.deps[e].rv=Gn;if(t!==null)for(let e of t)e.rv=Gn;Hn!==null&&(r===null?r=Hn:r.push(...Hn))}return e.f&8388608&&(e.f^=E),d}catch(t){return Qn(e),on(t)}finally{e.f^=T,Bn=t,Vn=n,Hn=r,U=i,Rn=a,Be(o),Fn=s,Kn=c}}function Qn(e){var t=e.deps,n=I?.is_fork;if(Bn!==null){var r;if(n||er(e,Vn),t!==null&&Vn>0)for(t.length=Vn+Bn.length,r=0;r<Bn.length;r++)t[Vn+r]=Bn[r];else e.deps=t=Bn;if(dn()&&e.f&512)for(r=Vn;r<t.length;r++)(t[r].reactions??=[]).push(e)}else!n&&t!==null&&Vn<t.length&&(er(e,Vn),t.length=Vn);return t}function $n(e,r){let i=r.reactions;if(i!==null){var a=t.call(i,e);if(a!==-1){var o=i.length-1;o===0?i=r.reactions=null:(i[a]=i[o],i.pop())}}if(i===null&&r.f&2&&(Bn===null||!n.call(Bn,r))){var s=r;s.f&512&&(s.f^=512),s.v!==A&&Ye(s),s.ac!==null&&$e(()=>{s.ac.abort(se),s.ac=null,P(s,h)}),dt(s),er(s,0)}}function er(e,t){var n=e.deps;if(n!==null)for(var r=t;r<n.length;r++)$n(e,n[r])}function tr(e){var t=e.f;if(!(t&16384)){P(e,m);var n=W;W=e;try{t&16777232?Cn(e):Sn(e),xn(e);var r=Zn(e);e.teardown=typeof r==`function`?r:null,e.wv=Wn}finally{W=n}}}function G(e){var t=!!(e.f&2);if(Mn?.add(e),U!==null&&!Fn&&!(W!==null&&W.f&16384)&&(Rn===null||!Rn.has(e))){var r=U.deps;if(U.f&2097152)e.rv<Gn&&(e.rv=Gn,Bn===null&&r!==null&&r[Vn]===e?Vn++:Bn===null?Bn=[e]:Bn.push(e));else{U.deps??=[],n.call(U.deps,e)||U.deps.push(e);var i=e.reactions;i===null?e.reactions=[U]:n.call(i,U)||i.push(U)}}if(Nn&&jt.has(e))return jt.get(e);if(t){var a=e;if(Nn){var o=a.v;return(!(a.f&1024)&&a.reactions!==null||rr(a))&&(o=lt(a)),jt.set(a,o),o}var s=!(a.f&512)&&!Fn&&U!==null&&!!(U.f&512),c=(a.f&y)===0;Yn(a)&&(s&&(a.f|=512),ut(a)),s&&!c&&(ft(a),nr(a))}if(ht?.has(e))return ht.get(e);if(e.f&8388608)throw e.v;return e.v}function nr(e){if(e.f|=512,e.deps!==null)for(let r of e.deps){var t=r.reactions;t===null?r.reactions=[e]:n.call(t,e)||t.push(e),r.f&2&&!(r.f&512)&&(ft(r),nr(r))}}function rr(e){if(e.v===A)return!0;if(e.deps===null)return!1;for(let t of e.deps)if(jt.has(t)||t.f&2&&rr(t))return!0;return!1}function ir(e){var t=Fn;try{return Fn=!0,e()}finally{Fn=t}}function ar(e){if(!(typeof e!=`object`||!e||e instanceof EventTarget)){if(D in e)or(e);else if(!Array.isArray(e))for(let t in e){let n=e[t];typeof n==`object`&&n&&D in n&&or(n)}}}function or(e,t=new Set){if(typeof e==`object`&&e&&!(e instanceof EventTarget)&&!t.has(e)){t.add(e),e instanceof Date&&e.getTime();for(let n in e)try{or(e[n],t)}catch{}let n=l(e);if(n!==Object.prototype&&n!==Array.prototype&&n!==Map.prototype&&n!==Set.prototype&&n!==Date.prototype){let t=o(n);for(let n in t){let r=t[n].get;if(r)try{r.call(e)}catch{}}}}}[...`allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback`.split(`.`)];var sr=[`touchstart`,`touchmove`];function cr(e){return sr.includes(e)}var lr=Symbol(`events`),ur=new Set,dr=new Set;function fr(e,t,n,r={}){function i(e){if(r.capture||_r.call(t,e),!e.cancelBubble)return $e(()=>n?.call(this,e))}return e.startsWith(`pointer`)||e.startsWith(`touch`)||e===`wheel`?(i.__removed=!1,qe(()=>{i.__removed||t.addEventListener(e,i,r)})):t.addEventListener(e,i,r),i}function pr(e,t,n,r,i){var a={capture:r,passive:i},o=fr(e,t,n,a);(t===document.body||t===window||t===document||t instanceof HTMLMediaElement)&&fn(()=>{o.__removed=!0,t.removeEventListener(e,o,a)})}function K(e,t,n){(t[lr]??={})[e]=n}function mr(e){for(var t=0;t<e.length;t++)ur.add(e[t]);for(var n of dr)n(e)}var hr=null,gr=!1;function _r(e){var t=this,n=t.ownerDocument,r=e.type,a=e.composedPath?.()||[],o=a[0]||e.target;hr=e,gr||(gr=!0,setTimeout(()=>{gr=!1,hr=null}));var s=0,c=hr===e&&e[lr];if(c){var l=a.indexOf(c);if(l!==-1&&(t===document||t===window)){e[lr]=t;return}var u=a.indexOf(t);if(u===-1)return;l<=u&&(s=l)}if(o=a[s]||e.target,o!==t){i(e,`currentTarget`,{configurable:!0,get(){return o||n}});var d=U,f=W;In(null),Ln(null);try{for(var p,m=[];o!==null&&o!==t;){try{var h=o[lr]?.[r];h==null||o.disabled&&e.target!==o||h.call(o,e)}catch(e){p?m.push(e):p=e}if(e.cancelBubble)break;s++,o=s<a.length?a[s]:null}if(p){for(let e of m)queueMicrotask(()=>{throw e});throw p}}finally{e[lr]=t,delete e.currentTarget,In(d),Ln(f)}}}var vr=globalThis?.window?.trustedTypes&&globalThis.window.trustedTypes.createPolicy(`svelte-trusted-html`,{createHTML:e=>e});function yr(e){return vr?.createHTML(e)??e}function br(e){var t=rn(`template`);return t.innerHTML=yr(e.replaceAll(`<!>`,`<!---->`)),t.content}function xr(e,t){var n=W;n.nodes===null&&(n.nodes={start:e,end:t,a:null,t:null})}function q(e,t){var n=!!(t&1),r=!!(t&2),i,a=!e.startsWith(`<!>`);return()=>{if(j)return xr(M,null),M;i===void 0&&(i=br(a?e:`<!>`+e),n||(i=Qt(i)));var t=r||qt?document.importNode(i,!0):i.cloneNode(!0);if(n){var o=Qt(t),s=t.lastChild;xr(o,s)}else xr(t,t);return t}}function Sr(e=``){if(!j){var t=Zt(e+``);return xr(t,t),t}var n=M;return n.nodeType===3?an(n):(n.before(n=Zt()),ge(n)),xr(n,n),n}function J(e,t){if(j){var n=W;n.f&32768&&n.nodes.end!==null||(n.nodes.end=M),_e()}else e!==null&&e.before(t)}function Cr(e){let t=0,n=Nt(0),r;return()=>{dn()&&(G(n),vn(()=>(t===0&&(r=ir(()=>e(()=>Bt(n)))),t+=1,()=>{qe(()=>{--t,t===0&&(r?.(),r=void 0,Bt(n))})})))}}var wr=x|S;function Tr(e,t,n,r){new Er(e,t,n,r)}var Er=class{parent;is_pending=!1;transform_error;#e;#t=j?M:null;#n;#r;#i;#a=null;#o=null;#s=null;#c=null;#l=0;#u=0;#d=!1;#f=new Set;#p=new Set;#m=null;#h=Cr(()=>(this.#m=Nt(this.#l),()=>{this.#m=null}));constructor(e,t,n,r){this.#e=e,this.#n=t,this.#r=e=>{var t=W;t.b=this,t.f|=128,n(e)},this.parent=W.b,this.transform_error=r??this.parent?.transform_error??(e=>e),this.#i=yn(()=>{if(j){let e=be(this.#t);_e();let t=e===`[!`;if(e.startsWith(`[?`)){let t=JSON.parse(e.slice(2));this.#_(t)}else t?this.#b():this.#g()}else this.#x()},wr),j&&(this.#e=M)}#g(){try{this.#a=bn(()=>this.#r(this.#e))}catch(e){this.error(e)}}#_(e){let t=this.#n.failed,{reset:n,invoke_onerror:r}=this.#v(e);qe(r),t&&(this.#s=bn(()=>{t(this.#e,()=>e,()=>n)}))}#v(e){var t=!1,n=!1;let r=()=>{this.#y()||(t?me():(t=!0,n&&Fe(),this.#s!==null&&Dn(this.#s,()=>{this.#s=null}),this.#C(()=>{this.#x()})))};return{reset:r,invoke_onerror:()=>{if(!this.#y())try{n=!0,this.#n.onerror?.(e,r),n=!1}catch(e){sn(e,this.#i&&this.#i.parent)}}}}#y(){return(this.#i.f&(v|b))!==0}#b(){let e=this.#n.pending;e&&(this.is_pending=!0,this.#o=bn(()=>e(this.#e)),qe(()=>{if(!this.#y()){var e=this.#c=document.createDocumentFragment(),t=Zt(),n=!1;e.append(t),this.#a=this.#C(()=>{try{return bn(()=>this.#r(t))}catch(e){try{this.error(e),n=!0}catch(e){sn(e,this.#i.parent)}return null}}),this.#a===null?(this.#c=null,n&&this.#S(I)):this.#u===0&&(this.#e.before(e),this.#c=null,Dn(this.#o,()=>{this.#o=null}),this.#S(I))}}))}#x(){try{if(this.is_pending=this.has_pending_snippet(),this.#u=0,this.#l=0,this.#a=bn(()=>{this.#r(this.#e)}),this.#u>0){var e=this.#c=document.createDocumentFragment();jn(this.#a,e);let t=this.#n.pending;this.#o=bn(()=>t(this.#e))}else this.#S(I)}catch(e){this.error(e)}}#S(e){this.is_pending=!1,e.transfer_effects(this.#f,this.#p)}defer_effect(e){Xe(e,this.#f,this.#p)}is_rendered(){return!this.is_pending&&(!this.parent||this.parent.is_rendered())}has_pending_snippet(){return!!this.#n.pending}#C(e){var t=W,n=U,r=ze;Ln(this.#i),In(this.#i),Be(this.#i.ctx);try{return Ct.ensure(),e()}finally{Ln(t),In(n),Be(r)}}#w(e,t){this.has_pending_snippet()?(this.#u+=e,this.#u===0&&(this.#S(t),this.#o&&Dn(this.#o,()=>{this.#o=null}),this.#c&&=(this.#e.before(this.#c),null))):this.parent&&this.parent.#w(e,t)}update_pending_count(e,t){this.#w(e,t),this.#l+=e,!(!this.#m||this.#d)&&(this.#d=!0,qe(()=>{this.#d=!1,this.#m&&Lt(this.#m,this.#l)}))}get_effect_pending(){return this.#h(),G(this.#m)}error(e){if(e===le||!this.#n.onerror&&!this.#n.failed)throw e;I?.is_fork?(this.#a&&I.skip_effect(this.#a),this.#o&&I.skip_effect(this.#o),this.#s&&I.skip_effect(this.#s),I.oncommit(()=>{this.#y()||this.#T(e)})):this.#T(e)}#T(e){this.#a&&=(wn(this.#a),null),this.#o&&=(wn(this.#o),null),this.#s&&=(wn(this.#s),null),j&&(ge(this.#t),ve(),ge(ye()));let t=this.#n.failed,n=e=>{if(this.#y())return;let{reset:n,invoke_onerror:r}=this.#v(e);r(),t&&!this.#y()&&(this.#s=this.#C(()=>{try{return bn(()=>{var r=W;r.b=this,r.f|=128,t(this.#e,()=>e,()=>n)})}catch(e){return sn(e,this.#i.parent),null}}))};qe(()=>{if(!this.#y()){var t;try{t=this.transform_error(e)}catch(e){sn(e,this.#i&&this.#i.parent);return}typeof t==`object`&&t&&typeof t.then==`function`?t.then(n,e=>sn(e,this.#i&&this.#i.parent)):n(t)}})}};function Y(e,t){var n=t==null?``:typeof t==`object`?`${t}`:t;n!==(e[k]??=e.nodeValue)&&(e[k]=n,e.nodeValue=`${n}`)}function Dr(e,t){return kr(e,t)}var Or=new Map;function kr(e,{target:t,anchor:n,props:i={},events:a,context:o,intro:s=!0,transformError:c}){Xt();var l=void 0,u=hn(()=>{var s=n??t.appendChild(Zt());Tr(s,{pending:()=>{}},t=>{Ve({});var n=ze;if(o&&(n.c=o),a&&(i.$$events=a),j&&xr(t,null),l=e(t,i)||Ue(),j&&(W.nodes.end=M,M===null||M.nodeType!==8||M.data!==`]`))throw fe(),le;He()},c);var u=new Set,d=e=>{for(var n=0;n<e.length;n++){var r=e[n];if(!u.has(r)){u.add(r);var i=cr(r);for(let e of[t,document]){var a=Or.get(e);a===void 0&&(a=new Map,Or.set(e,a));var o=a.get(r);o===void 0?(e.addEventListener(r,_r,{passive:i}),a.set(r,1)):a.set(r,o+1)}}}};return d(r(ur)),dr.add(d),()=>{for(var e of u)for(let n of[t,document]){var r=Or.get(n),i=r.get(e);--i==0?(n.removeEventListener(e,_r),r.delete(e),r.size===0&&Or.delete(n)):r.set(e,i)}dr.delete(d),s!==n&&s.parentNode?.removeChild(s)}});return Ar.set(l,u),l}var Ar=new WeakMap,jr=class{anchor;#e=new Map;#t=new Map;#n=new Map;#r=new Set;#i=!0;constructor(e,t=!0){this.anchor=e,this.#i=t}#a=e=>{if(this.#e.has(e)){var t=this.#e.get(e),n=this.#t.get(t);if(n)kn(n),this.#r.delete(t);else{var r=this.#n.get(t);r&&(kn(r.effect),this.#t.set(t,r.effect),this.#n.delete(t),r.fragment.lastChild.remove(),this.anchor.before(r.fragment),n=r.effect)}for(let[t,n]of this.#e){if(this.#e.delete(t),t===e)break;let r=this.#n.get(n);r&&(wn(r.effect),this.#n.delete(n))}for(let[e,r]of this.#t){if(e===t||this.#r.has(e))continue;let i=()=>{if(Array.from(this.#e.values()).includes(e)){var t=document.createDocumentFragment();jn(r,t),t.append(Zt()),this.#n.set(e,{effect:r,fragment:t})}else wn(r);this.#r.delete(e),this.#t.delete(e)};this.#i||!n?(this.#r.add(e),Dn(r,i,!1)):i()}}};#o=e=>{this.#e.delete(e);let t=Array.from(this.#e.values());for(let[e,n]of this.#n)t.includes(e)||(wn(n.effect),this.#n.delete(e))};ensure(e,t){var n=I,r=nn();if(t&&!this.#t.has(e)&&!this.#n.has(e)){if(r){var i=document.createDocumentFragment(),a=Zt();i.append(a),this.#n.set(e,{effect:bn(()=>t(a)),fragment:i})}else this.#t.set(e,bn(()=>t(this.anchor)))}if(this.#e.set(n,e),r){for(let[t,r]of this.#t)t===e?n.unskip_effect(r):n.skip_effect(r);for(let[t,r]of this.#n)t===e?n.unskip_effect(r.effect):n.skip_effect(r.effect);n.oncommit(this.#a),n.ondiscard(this.#o)}else j&&(this.anchor=M),this.#a(n)}};function Mr(e,t,n=!1){var r;j&&(r=M,_e());var i=new jr(e),a=n?x:0;function o(e,t){if(j){var n=be(r);if(e!==parseInt(n.substring(1))){var a=ye();ge(a),i.anchor=a,he(!1),i.ensure(e,t),he(!0);return}}i.ensure(e,t)}yn(()=>{var e=!1;t((t,n=0)=>{e=!0,o(n,t)}),e||o(-1,null)},a)}function Nr(e,t){return t}function Pr(e,t,n){for(var i=[],a=t.length,o,s=t.length,c=0;c<a;c++){let n=t[c];Dn(n,()=>{if(o){if(o.pending.delete(n),o.done.add(n),o.pending.size===0){var t=e.outrogroups;Fr(e,r(o.done)),t.delete(o),t.size===0&&(e.outrogroups=null)}}else--s},!1)}if(s===0){var l=i.length===0&&n!==null&&e.pending.size===0;if(l){var u=n,d=u.parentNode;tn(d),d.append(u),e.items.clear()}Fr(e,t,!l)}else o={pending:new Set(t),done:new Set},(e.outrogroups??=new Set).add(o)}function Fr(e,t,n=!0){var r;if(e.pending.size>0){r=new Set;for(let t of e.pending.values())for(let n of t)r.add(e.items.get(n).e)}for(var i=0;i<t.length;i++){var a=t[i];r?.has(a)?(a.f|=w,jn(a,document.createDocumentFragment())):wn(t[i],n)}}var Ir;function Lr(t,n,i,a,o,s=null){var c=t,l=new Map;if(n&4){var u=t;c=j?ge(Qt(u)):u.appendChild(Zt())}j&&_e();var d=null,f=st(()=>{var t=i();return e(t)?t:t==null?[]:r(t)}),p=new Map,m=!0;function h(e){if(!(_.effect.f&16384)){_.pending.delete(e);var t=G(f);_.fallback=d,zr(_,t,c,n,a),d!==null&&(t.length===0?d.f&33554432?(d.f^=w,Vr(d,null,c)):kn(d):Dn(d,()=>{d=null}))}}function g(e){_.pending.delete(e)}var _={effect:yn(()=>{var e=G(f),t=e.length;let r=!1;j&&be(c)===`[!`!=(t===0)&&(c=ye(),ge(c),he(!1),r=!0);for(var u=new Set,_=I,v=nn(),y=0;y<t;y+=1){j&&M.nodeType===8&&M.data===`]`&&(c=M,r=!0,he(!1));var b=e[y],x=a(b,y),S=m?null:l.get(x);S?(S.v&&Lt(S.v,b),S.i&&Lt(S.i,y),v&&_.unskip_effect(S.e)):(S=Br(l,m?c:Ir??=Zt(),b,x,y,o,n,i),m||(S.e.f|=w),l.set(x,S)),u.add(x)}if(t===0&&s&&!d&&(m?d=bn(()=>s(c)):(d=bn(()=>s(Ir??=Zt())),d.f|=w)),t>u.size&&Ee(``,``,``),j&&t>0&&ge(ye()),!m){if(p.set(_,u),v){for(let[e,t]of l)u.has(e)||_.skip_effect(t.e);_.oncommit(h),_.ondiscard(g)}else h(_)}r&&he(!0),G(f)}),flags:n,items:l,pending:p,outrogroups:null,fallback:d};m=!1,j&&(c=M)}function Rr(e){for(;e!==null&&!(e.f&32);)e=e.next;return e}function zr(e,t,n,i,a){var o=!!(i&8),s=t.length,c=e.items,l=Rr(e.effect.first),u,d=null,f,p=[],m=[],h,g,_,v;if(o)for(v=0;v<s;v+=1)h=t[v],g=a(h,v),_=c.get(g).e,_.f&33554432||(_.nodes?.a?.measure(),(f??=new Set).add(_));for(v=0;v<s;v+=1){if(h=t[v],g=a(h,v),_=c.get(g).e,e.outrogroups!==null)for(let t of e.outrogroups)t.pending.delete(_),t.done.delete(_);if(_.f&8192&&(kn(_),o&&(_.nodes?.a?.unfix(),(f??=new Set).delete(_))),_.f&33554432){if(_.f^=w,_===l)Vr(_,null,n);else{var y=d?d.next:l;_===e.effect.last&&(e.effect.last=_.prev),_.prev&&(_.prev.next=_.next),_.next&&(_.next.prev=_.prev),Hr(e,d,_),Hr(e,_,y),Vr(_,y,n),d=_,p=[],m=[],l=Rr(d.next);continue}}if(_!==l){if(u!==void 0&&u.has(_)){if(p.length<m.length){var b=m[0],x;d=b.prev;var S=p[0],C=p[p.length-1];for(x=0;x<p.length;x+=1)Vr(p[x],b,n);for(x=0;x<m.length;x+=1)u.delete(m[x]);Hr(e,S.prev,C.next),Hr(e,d,S),Hr(e,C,b),l=b,d=C,--v,p=[],m=[]}else u.delete(_),Vr(_,l,n),Hr(e,_.prev,_.next),Hr(e,_,d===null?e.effect.first:d.next),Hr(e,d,_),d=_;continue}for(p=[],m=[];l!==null&&l!==_;)(u??=new Set).add(l),m.push(l),l=Rr(l.next);if(l===null)continue}_.f&33554432||p.push(_),d=_,l=Rr(_.next)}if(e.outrogroups!==null){for(let t of e.outrogroups)t.pending.size===0&&(Fr(e,r(t.done)),e.outrogroups?.delete(t));e.outrogroups.size===0&&(e.outrogroups=null)}if(l!==null||u!==void 0){var T=[];if(u!==void 0)for(_ of u)_.f&8192||T.push(_);for(;l!==null;)!(l.f&8192)&&l!==e.fallback&&T.push(l),l=Rr(l.next);var ee=T.length;if(ee>0){var E=i&4&&s===0?n:null;if(o){for(v=0;v<ee;v+=1)T[v].nodes?.a?.measure();for(v=0;v<ee;v+=1)T[v].nodes?.a?.fix()}Pr(e,T,E)}}o&&qe(()=>{if(f!==void 0)for(_ of f)_.nodes?.a?.apply()})}function Br(e,t,n,r,i,a,o,s){var c=o&1?o&16?Nt(n):Pt(n,!1,!1):null,l=o&2?Nt(i):null;return{v:c,i:l,e:bn(()=>(a(t,c??n,l??i,s),()=>{e.delete(r)}))}}function Vr(e,t,n){if(e.nodes)for(var r=e.nodes.start,i=e.nodes.end,a=t&&!(t.f&33554432)?t.nodes.start:n;r!==null;){var o=$t(r);if(a.before(r),r===i)return;r=o}}function Hr(e,t,n){t===null?e.effect.first=n:t.next=n,n===null?e.effect.last=t:n.prev=t}function Ur(e,t,n){gn(()=>{var r=ir(()=>t(e,n?.())||{});if(n&&r?.update){var i=!1,a={};vn(()=>{var e=n();ar(e),i&&Se(a,e)&&(a=e,r.update(e))}),i=!0}if(r?.destroy)return()=>r.destroy()})}function Wr(e){var t,n,r=``;if(typeof e==`string`||typeof e==`number`)r+=e;else if(typeof e==`object`){if(Array.isArray(e)){var i=e.length;for(t=0;t<i;t++)e[t]&&(n=Wr(e[t]))&&(r&&(r+=` `),r+=n)}else for(n in e)e[n]&&(r&&(r+=` `),r+=n)}return r}function Gr(){for(var e,t,n=0,r=``,i=arguments.length;n<i;n++)(e=arguments[n])&&(t=Wr(e))&&(r&&(r+=` `),r+=t);return r}function Kr(e){return typeof e==`object`?Gr(e):e??``}var qr=[...` 	
\r\f\xA0\v﻿`];function Jr(e,t,n){var r=e==null?``:``+e;if(t&&(r=r?r+` `+t:t),n){for(var i of Object.keys(n))if(n[i])r=r?r+` `+i:i;else if(r.length)for(var a=i.length,o=0;(o=r.indexOf(i,o))>=0;){var s=o+a;(o===0||qr.includes(r[o-1]))&&(s===r.length||qr.includes(r[s]))?r=(o===0?``:r.substring(0,o))+r.substring(s+1):o=s}}return r===``?null:r}function Yr(e,t=!1){var n=t?` !important;`:`;`,r=``;for(var i of Object.keys(e)){var a=e[i];a!=null&&a!==``&&(r+=` `+i+`: `+a+n)}return r}function Xr(e){return e[0]!==`-`||e[1]!==`-`?e.toLowerCase():e}function Zr(e,t){if(t){var n=``,r,i;if(Array.isArray(t)?(r=t[0],i=t[1]):r=t,e){e=String(e).replaceAll(/\/\*.*?\*\//g,``).trim();var a=!1,o=0,s=!1,c=[];r&&c.push(...Object.keys(r).map(Xr)),i&&c.push(...Object.keys(i).map(Xr));var l=0,u=-1;let t=e.length;for(var d=0;d<t;d++){var f=e[d];if(s?f===`/`&&e[d-1]===`*`&&(s=!1):a?a===f&&(a=!1):f===`/`&&e[d+1]===`*`?s=!0:f===`"`||f===`'`?a=f:f===`(`?o++:f===`)`&&o--,!s&&a===!1&&o===0){if(f===`:`&&u===-1)u=d;else if(f===`;`||d===t-1){if(u!==-1){var p=Xr(e.substring(l,u).trim());if(!c.includes(p)){f!==`;`&&d++;var m=e.substring(l,d).trim();n+=` `+m+`;`}}l=d+1,u=-1}}}}return r&&(n+=Yr(r)),i&&(n+=Yr(i,!0)),n=n.trim(),n===``?null:n}return e==null?null:String(e)}function Qr(e,t,n,r,i,a){var o=e[O];if(j||o!==n||o===void 0){var s=Jr(n,r,a);j&&s===e.getAttribute(`class`)||(s==null?e.removeAttribute(`class`):t?e.className=s:e.setAttribute(`class`,s)),e[O]=n}else if(a&&i!==a)for(var c in a){var l=!!a[c];(i==null||l!==!!i[c])&&e.classList.toggle(c,l)}return a}function $r(e,t={},n,r){for(var i in n){var a=n[i];t[i]!==a&&(n[i]==null?e.style.removeProperty(i):e.style.setProperty(i,a,r))}}function ei(e,t,n,r){var i=e[ae];if(j||i!==t){var a=Zr(t,r);j&&a===e.getAttribute(`style`)||(a==null?e.removeAttribute(`style`):e.style.cssText=a),e[ae]=t}else r&&(Array.isArray(r)?($r(e,n?.[0],r[0]),$r(e,n?.[1],r[1],`important`)):$r(e,n,r));return r}function ti(e,t){t?e.hasAttribute(`selected`)||e.setAttribute(`selected`,``):e.removeAttribute(`selected`)}function ni(t,n){var r=t.__defaultValue,i=t.multiple,a=i?r??[]:null;if(!i||e(a)){var o=t.selectedIndex,s=n&&i?new Set(t.selectedOptions):null;for(var c of t.options){var l=ai(c);ti(c,i?a.includes(l):Wt(l,r))}if(n){if(s!==null)for(c of t.options){var u=s.has(c);c.selected!==u&&(c.selected=u)}else t.selectedIndex!==o&&(t.selectedIndex=o)}}}function ri(t,n,r=!1){if(t.multiple){if(n==null)return;if(!e(n))return pe();for(var i of t.options)i.selected=n.includes(ai(i))}else{for(i of t.options)if(Wt(ai(i),n)){i.selected=!0;return}r&&n===void 0||(t.selectedIndex=-1)}}function ii(e){var t=new MutationObserver(t=>{t.every(oi)||(`__defaultValue`in e&&ni(e,!1),`__value`in e&&ri(e,e.__value))});t.observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:[`value`]}),fn(()=>{t.disconnect()})}function ai(e){return`__value`in e?e.__value:e.value}function oi(e){if(e.target.closest(`selectedcontent`)!==null)return!0;if(e.type===`childList`){var t=[...e.addedNodes,...e.removedNodes];return t.length>0&&t.every(e=>e.nodeName===`SELECTEDCONTENT`)}return!1}var si=Symbol(`is custom element`),ci=Symbol(`is html`),li=ce?`link`:`LINK`,ui=ce?`progress`:`PROGRESS`;function di(e){if(j){var t=!1,n=()=>{if(!t){if(t=!0,e.hasAttribute(`value`)){var n=e.value;X(e,`value`,null),e.value=n}if(e.hasAttribute(`checked`)){var r=e.checked;X(e,`checked`,null),e.checked=r}}};e[oe]=n,qe(n),Qe()}}function fi(e,t){var n=mi(e);n.value!==(n.value=t??void 0)&&(e.value!==t||t===0&&e.nodeName===ui)&&(e.value=t??``)}function pi(e,t){var n=mi(e);n.checked!==(n.checked=t??void 0)&&(e.checked=t)}function X(e,t,n,r){var i=mi(e);j&&(i[t]=e.getAttribute(t),t===`src`||t===`srcset`||t===`href`&&e.nodeName===li)||i[t]!==(i[t]=n)&&(t===`loading`&&(e[re]=n),n==null?e.removeAttribute(t):typeof n!=`string`&&gi(e).has(t)?e[t]=n:e.setAttribute(t,n))}function mi(e){return e[ie]??={[si]:e.nodeName.includes(`-`),[ci]:e.namespaceURI===ue}}var hi=new Map;function gi(e){var t=e.getAttribute(`is`)||e.nodeName,n=hi.get(t);if(n)return n;hi.set(t,n=new Set);for(var r,i=e,a=Element.prototype;a!==i;){for(var s in r=o(i),r)r[s].set&&s!==`innerHTML`&&s!==`textContent`&&s!==`innerText`&&n.add(s);i=l(i)}return n}var _i=new class e{#e=new WeakMap;#t;#n;static entries=new WeakMap;constructor(e){this.#n=e}observe(e,t){var n=this.#e.get(e)||new Set;return n.add(t),this.#e.set(e,n),this.#r().observe(e,this.#n),()=>{var n=this.#e.get(e);n.delete(t),n.size===0&&(this.#e.delete(e),this.#t.unobserve(e))}}#r(){return this.#t??=new ResizeObserver(t=>{for(var n of t){e.entries.set(n.target,n);for(var r of this.#e.get(n.target)||[])r(n)}})}}({box:`border-box`});function vi(e,t,n){var r=_i.observe(e,()=>n(e[t]));gn(()=>(ir(()=>n(e[t])),r))}function yi(e,t){return e===t||e?.[D]===t}function bi(e=Ue(),t,n,r){var i=ze.r,a=W;return gn(()=>{var o,s;return vn(()=>{o=s,s=r?.()||[],ir(()=>{yi(n(...s),e)||(t(e,...s),o&&yi(n(...o),e)&&t(null,...o))})}),()=>{let r=a;for(;r!==i&&r.parent!==null&&r.parent.f&33554432;)r=r.parent;let o=()=>{s&&yi(n(...s),e)&&t(null,...s)},c=r.teardown;r.teardown=()=>{o(),c?.()}}}),e}var xi=!1;function Si(e){var t=xi;try{return xi=!1,[e(),xi]}finally{xi=t}}function Ci(e,t,n,r){var i=!0,o=!!(n&8),s=!!(n&16),c=r,l=!0,u=void 0,d=()=>s&&i?(u??=it(r),G(u)):(l&&(l=!1,c=s?ir(r):r),c);let f;if(o){var p=D in e||ne in e;f=a(e,t)?.set??(p&&t in e?n=>e[t]=n:void 0)}var m,h=!1;o?[m,h]=Si(()=>e[t]):m=e[t],m===void 0&&r!==void 0&&(m=d(),f&&(i&&je(t),f(m)));var g=i?()=>{var n=e[t];return n===void 0?d():(l=!0,n)}:()=>{var n=e[t];return n!==void 0&&(c=void 0),n===void 0?c:n};if(i&&!(n&4))return g;if(f){var _=e.$$legacy;return(function(e,t){return arguments.length>0?((!i||!t||_||h)&&f(t?g():e),e):g()})}var v=!1,y=(n&1?it:st)(()=>(v=!1,g()));o&&G(y);var b=W;return(function(e,t){if(arguments.length>0){let n=t?G(y):i&&o?Ht(e):e;return R(y,n),v=!0,c!==void 0&&(c=n),e}return Nn&&v||b.f&16384?y.v:G(y)})}function wi(e){ze===null&&we(`onMount`),pn(()=>{let t=ir(e);if(typeof t==`function`)return t})}typeof window<`u`&&((window.__svelte??={}).v??=new Set).add(`5`);function Ti(e){let t=e>>>0,n=()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296};return{random:n,choice(e){return e[Math.floor(n()*e.length)]}}}function Ei(e,t){for(let n=e.length-1;n>0;n--){let r=Math.floor(t.random()*(n+1));[e[n],e[r]]=[e[r],e[n]]}}function Di(){let e=new Uint32Array(1);return crypto.getRandomValues(e),e[0]}var Oi=class{index;ratio;forceSpan;constructor(e,t,n=!1){this.index=e,this.ratio=t,this.forceSpan=n}},ki=class{get x(){return this.parents[0].x}get w(){return this.parents.reduce((e,t)=>e+t.w,0)}get ratio(){return this.h/this.w}get wantedRatio(){return this.photo.ratio}topNeighbor(){let e;for(let t of this.parents[0].cells){if(this===t)return e;e=t}}bottomNeighbor(){let e,t=this.parents[0].cells;for(let n=t.length-1;n>=0;n--){let r=t[n];if(this===r)return e;e=r}}},Ai=class extends ki{parents;photo;extent=null;h;constructor(e,t){super(),this.parents=e,this.photo=t,this.h=this.w*this.wantedRatio}get y(){let e;for(let t of this.parents[0].cells){if(this===t)return e?e.y+e.h:0;e=t}throw Error(`cell is not in its parent column`)}scale(e){this.h*=e}isExtension(){return!1}toString(){return`[${Math.trunc(this.w)} ${Math.trunc(this.h)}${this.extent?`--`:`]`}`}},ji=class extends ki{origin;constructor(e){super(),this.origin=e,e.extent=this}get parents(){return[this.origin.parents[1]]}get photo(){return this.origin.photo}get y(){return this.origin.y}get h(){return this.origin.h}scale(){}isExtension(){return!0}toString(){return`------]`}},Mi=class{parent;w;cells=[];constructor(e,t){this.parent=e,this.w=t}get h(){let e=this.cells[this.cells.length-1];return e?e.y+e.h:0}get x(){let e=0;for(let t of this.parent.cols){if(this===t)break;e+=t.w}return e}scale(e){this.w*=e;for(let t of this.cells)t.scale(e)}leftNeighbor(){let e;for(let t of this.parent.cols){if(this===t)return e;e=t}}rightNeighbor(){let e,t=this.parent.cols;for(let n=t.length-1;n>=0;n--){let r=t[n];if(this===r)return e;e=r}}adjustHeight(e){let t=[{y:0,h:0,cells:[]}];for(let e of this.cells){let n=t[t.length-1];e.isExtension()?(n.h=e.y-n.y,t.push({y:e.y+e.h,h:0,cells:[]})):n.cells.push(e)}let n=t[t.length-1];n.h=e-n.y;for(let e of t){if(e.cells.length===0)continue;let t=e.h/e.cells.reduce((e,t)=>e+t.h,0);for(let n of e.cells)n.h*=t}}};function Ni(e){let t=Math.round(e);return Math.abs(e%1)===.5&&t%2!=0?t-1:t}var Pi=class{targetRatio;rng;cols=[];constructor(e,t,n,r){this.targetRatio=t,this.rng=r;let i=e/n;for(let e=0;e<n;e++)this.cols.push(new Mi(this,i))}get noCols(){return this.cols.length}get w(){return this.cols.reduce((e,t)=>e+t.w,0)}get h(){return Math.max(0,...this.cols.map(e=>e.h))}toString(){let e=[],t=0,n=!1;for(;!n;){e.push(``),n=!0;for(let r of this.cols){let i=r.cells.map(e=>e.toString()),a=i.length?i:[``],o=Math.max(...a.map(e=>e.length));r!==this.cols[this.cols.length-1]&&(o+=1);let s=` `.repeat(o),c=a[t];c!==void 0&&(s=c+` `.repeat(o-c.length),t<a.length-1&&(n=!1)),e[e.length-1]+=s}t++}return e.join(`
`)}nextFreeCol(){let e=Math.min(...this.cols.map(e=>e.h));return this.rng.choice(this.cols.filter(t=>t.h===e))}addCellSingleCol(e,t){e.cells.push(new Ai([e],t))}canJoin(e,t){let[n,r]=e.h<=t.h?[e,t]:[t,e];if(r.h-n.h<1e-9)return!0;let i=n.cells[n.cells.length-1];return i instanceof Ai&&i.extent===null}level(e,t){let[n,r]=e.h<=t.h?[e,t]:[t,e],i=n.cells[n.cells.length-1];i instanceof Ai&&i.extent===null&&(i.h+=r.h-n.h)}addCellMultiCol(e,t,n){this.level(e,t);let r=new Ai([e,t],n),i=new ji(r);e.cells.push(r),t.cells.push(i)}addCell(e){let t=this.nextFreeCol(),n=t.leftNeighbor(),r=t.rightNeighbor();if(e.forceSpan){let i=[n,r].filter(e=>e!==void 0);i.sort((e,n)=>Number(this.canJoin(t,n))-Number(this.canJoin(t,e))||Math.abs(t.h-e.h)-Math.abs(t.h-n.h));let a=i[0];if(a!==void 0){a===n?this.addCellMultiCol(a,t,e):this.addCellMultiCol(t,a,e);return}}if(2*this.rng.random()>e.ratio){if(n&&Math.abs(t.h-n.h)<.5*t.w&&this.canJoin(n,t)){this.addCellMultiCol(n,t,e);return}if(r&&Math.abs(t.h-r.h)<.5*t.w&&this.canJoin(t,r)){this.addCellMultiCol(t,r,e);return}}this.addCellSingleCol(t,e)}removeEmptyCols(){for(let e=this.cols.length-1;e>=0;e--)this.cols[e].cells.length===0&&this.cols.splice(e,1)}removeBottomHoles(){for(let e=0;e<=this.cols.length&&this.removeBottomHolesPass();e++);}removeBottomHolesPass(){let e=!1;for(let t of this.cols){let n=t.cells[t.cells.length-1];if(!n||n===t.cells[0])continue;let r=n.topNeighbor(),i=t.leftNeighbor(),a=t.rightNeighbor();if(n instanceof Ai&&!n.extent)r instanceof Ai&&r.extent&&r.extent.bottomNeighbor()===void 0?(a.cells.push(new ji(n)),n.parents=[t,a],e=!0):r instanceof ji&&r.origin.bottomNeighbor()===void 0&&(t.cells.splice(t.cells.indexOf(n),1),i.cells.push(n),t.cells.push(new ji(n)),n.parents=[i,t],e=!0);else if(n instanceof Ai&&n.extent&&n.extent.bottomNeighbor()===void 0){let o=n.extent,s=o.topNeighbor();if(s instanceof Ai&&s.extent&&s.extent.bottomNeighbor()===void 0){let r=a.rightNeighbor();t.cells.splice(t.cells.indexOf(n),1),a.cells.splice(a.cells.indexOf(o),1),a.cells.push(n),r.cells.push(o),n.parents=[a,r],e=!0}else r instanceof ji&&r.origin.bottomNeighbor()===void 0&&(t.cells.splice(t.cells.indexOf(n),1),a.cells.splice(a.cells.indexOf(o),1),i.cells.push(n),t.cells.push(o),n.parents=[i,t],e=!0)}}return e}adjustColsHeights(){let e=this.w*this.targetRatio;for(let t of this.cols)t.adjustHeight(e)}adjust(){this.removeEmptyCols(),this.removeBottomHoles(),this.removeEmptyCols(),this.adjustColsHeights()}setTargetRatio(e){this.targetRatio=e,this.adjustColsHeights()}swapPhotos(e,t){let n=this.photoCells(),r=n.find(t=>t.photo.index===e),i=n.find(e=>e.photo.index===t);r&&i&&([r.photo,i.photo]=[i.photo,r.photo])}photoCells(){return this.cols.flatMap(e=>e.cells.filter(e=>!e.isExtension()))}toLayout(){let e=this.w>0?1/this.w:1;return{width:1,height:this.targetRatio,placements:this.photoCells().map(t=>({photoIndex:t.photo.index,cell:{x:t.x*e,y:t.y*e,w:t.w*e,h:t.h*e}}))}}};function Fi(e,t){let n=e.length;if(n===0)return 1;let r=e.reduce((e,t)=>e+t.height/t.width,0)/n,i=2*n;return Math.max(1,Ni(Math.sqrt(r/t*i)))}function Ii(e){if(e!=null&&Number.isFinite(e))return Math.min(100,Math.max(1,Math.floor(e)))}function Li(e,t,n,r={}){if(e.length===0)return new Pi(1,t,1,n);let i=Ii(r.columns)??Fi(e,t);e.some(e=>e.span?.columns===2)&&(i=Math.max(i,2));let a=e.map(e=>e.height/e.width*(e.span?.rows??1)),o=new Pi(1,t,i,n),s=a.map((e,t)=>t);Ei(s,n);for(let t of s)o.addCell(new Oi(t,a[t],e[t]?.span?.columns===2));return o.adjust(),o}var Ri=.04,zi=.8;function Bi(e){let{first:t,second:n}=e;e.weight=t.weight+n.weight,e.count=t.count+n.count;let r,i=t.weight/t.count,a=n.weight/n.count;if(e.direction===`side`){let o=i/t.ratio,s=a/n.ratio;e.ratio=1/(1/t.ratio+1/n.ratio),r=o/(o+s)}else{let o=i*t.ratio,s=a*n.ratio;e.ratio=t.ratio+n.ratio,r=o/(o+s)}let o=t.weight/(t.weight+n.weight);r=zi*r+.19999999999999996*o,e.share=Math.min(.96,Math.max(Ri,r))}function Vi(e,t,n){let r={kind:`cut`,direction:n,first:e,second:t,ratio:1,weight:1,count:1,share:.5};return Bi(r),r}function Hi(e){e.kind!==`leaf`&&(Hi(e.first),Hi(e.second),Bi(e))}function Ui(e,t){let n=e.span;return{kind:`leaf`,photoIndex:t,ratio:e.height/e.width,weight:(n?.columns??1)*(n?.rows??1),count:1}}function Wi(e,t,n){let r=e.length,i=e.map((e,t)=>Ui(e,t));Ei(i,n);let a=Math.log(t);for(;i.length>1;){let e=1/0,t=[];for(let n=0;n+1<i.length;n++){let r=i[n].count+i[n+1].count;r<e?(e=r,t=[n]):r===e&&t.push(n)}let o=n.choice(t),s=i[o],c=i[o+1],l=a*(s.count+c.count)/r,u=Vi(s,c,`side`),d=Vi(s,c,`stack`),f=Math.abs(Math.log(u.ratio)-l)<=Math.abs(Math.log(d.ratio)-l),p=n.random()<.15?!f:f;i.splice(o,2,p?u:d)}let o=i[0];return Ji(o,t,n),o}function Gi(e,t=[]){return e.kind===`cut`&&(t.push(e),Gi(e.first,t),Gi(e.second,t)),t}function Ki(e,t,n,r){e.kind===`leaf`?r.push(t*n/e.weight):e.direction===`side`?(Ki(e.first,t*e.share,n,r),Ki(e.second,t*(1-e.share),n,r)):(Ki(e.first,t,n*e.share,r),Ki(e.second,t,n*(1-e.share),r))}function qi(e,t){let n=[];Ki(e,1,t,n);let r=n.map(e=>Math.log(e)),i=r.reduce((e,t)=>e+t,0)/r.length,a=Math.sqrt(r.reduce((e,t)=>e+(t-i)**2,0)/r.length);return 3*Math.abs(Math.log(e.ratio)-Math.log(t))+a}function Ji(e,t,n){if(e.kind===`leaf`)return;let r=Gi(e),i=Xi(e),a=Math.min(1500,Math.max(150,Math.round(6e4/i.length))),o=qi(e,t);for(let s=0;s<a&&o>.001;s++)if(n.random()<.5){let i=n.choice(r),a=()=>{i.direction=i.direction===`side`?`stack`:`side`,Hi(e)};a();let s=qi(e,t);s<=o?o=s:a()}else if(i.length>1){let r=n.choice(i),a=n.choice(i);if(r===a)continue;Yi(r,a),Hi(e);let s=qi(e,t);s<=o?o=s:(Yi(r,a),Hi(e))}}function Yi(e,t){[e.photoIndex,t.photoIndex]=[t.photoIndex,e.photoIndex],[e.ratio,t.ratio]=[t.ratio,e.ratio],[e.weight,t.weight]=[t.weight,e.weight]}function Xi(e,t=[]){return e.kind===`leaf`?t.push(e):(Xi(e.first,t),Xi(e.second,t)),t}function Zi(e,t,n){if(e.kind===`leaf`)n.push({photoIndex:e.photoIndex,cell:t});else if(e.direction===`side`){let r=t.w*e.share;Zi(e.first,{x:t.x,y:t.y,w:r,h:t.h},n),Zi(e.second,{x:t.x+r,y:t.y,w:t.w-r,h:t.h},n)}else{let r=t.h*e.share;Zi(e.first,{x:t.x,y:t.y,w:t.w,h:r},n),Zi(e.second,{x:t.x,y:t.y+r,w:t.w,h:t.h-r},n)}}var Qi=class{root;ratio;constructor(e,t){this.root=e,this.ratio=t}setTargetRatio(e){this.ratio=e}swapPhotos(e,t){if(!this.root)return;let n=Xi(this.root),r=n.find(t=>t.photoIndex===e),i=n.find(e=>e.photoIndex===t);r&&i&&([r.photoIndex,i.photoIndex]=[i.photoIndex,r.photoIndex])}toLayout(){let e=[];return this.root&&Zi(this.root,{x:0,y:0,w:1,h:this.ratio},e),{width:1,height:this.ratio,placements:e}}};function $i(e,t,n){return e.length===0?new Qi(null,t):new Qi(Wi(e,t,n),t)}function ea(e,t){let n=e.width*e.height,r=0,i=0;for(let{photoIndex:n,cell:a}of e.placements){r+=a.w*a.h;let e=t[n];if(!e||a.w<=0||a.h<=0){i+=1;continue}let o=e.height/e.width,s=a.h/a.w;i+=1-Math.min(s/o,o/s)}return{uncovered:n>0?Math.max(0,1-r/n):0,cutOff:e.placements.length>0?i/e.placements.length:0}}function ta(e,t){return Math.abs(e.uncovered-t.uncovered)>1e-6?e.uncovered<t.uncovered:e.cutOff<t.cutOff}function na(e,t,n,r){let i=Math.max(1,Math.floor(r)),a=Ti(n),o;for(let n=0;n<i;n++){let n=Math.floor(a.random()*2**32)>>>0,r=e(Ti(n)),s=ea(r.toLayout(),t);(!o||ta(s,o.score))&&(o={page:r,seed:n,score:s,tried:i})}return o}function ra(e,t,n,r,i={}){return e===`gallery`?$i(t,n,r):Li(t,n,r,i)}function ia(e,t,n,r,{tries:i=e===`gallery`?10:30,...a}={}){return na(r=>ra(e,t,n,r,a),t,r,i)}var aa=.04;function oa(e){return e==null||!Number.isFinite(e)?6:Math.min(20,Math.max(1,Math.floor(e)))}function sa(e){return e==null||!Number.isFinite(e)?1:Math.min(20,Math.max(1,Math.floor(e)))}function ca(e,t){return e+Math.imul(t,2654435761)>>>0}function la(e,t){let n=Array(t).fill(0);for(let r of e){let e=Math.min(t-1,Math.max(0,r));n[e]=(n[e]??0)+1}return n}function ua(e,t){let n=e.findIndex(e=>e<t);return n>=0?n:Math.min(e.length,19)}function da(e,t,n){let r=sa(Math.max(t,Math.ceil(e/Math.max(1,n)))),i=Math.floor(e/r),a=e%r,o=[];for(let e=0;e<r;e++){let t=i+ +(e<a);for(let n=0;n<t;n++)o.push(e)}return{pageOf:o,pages:r}}function fa(e,t){let n=[...e];for(let e=n.length-1;e>0;e--){let r=Math.floor(t.random()*(e+1));[n[e],n[r]]=[n[r],n[e]]}return n}function pa(e,t,n){return e.map(e=>e===t?n:t<n&&e>t&&e<=n?e-1:t>n&&e>=n&&e<t?e+1:e)}function ma(e,t){let n=t>0?t-1:0;return e.map(e=>e===t?t>0?n:0:e>t?e-1:e)}var ha=class{subs;maps;ratio;constructor(e,t,n){this.subs=e,this.maps=t,this.ratio=n}get pageCount(){return this.subs.length}pageOfPhoto(e){return this.maps.findIndex(t=>t.includes(e))}setTargetRatio(e){this.ratio=e;for(let t of this.subs)t?.setTargetRatio(e)}swapPhotos(e,t){let n=this.pageOfPhoto(e),r=this.pageOfPhoto(t);if(n<0||r<0)return;let i=this.maps[n],a=this.maps[r],o=i.indexOf(e),s=a.indexOf(t);n===r?this.subs[n]?.swapPhotos(o,s):(i[o]=t,a[s]=e)}addPage(){this.subs.push(null),this.maps.push([])}movePage(e,t){let[n]=this.subs.splice(e,1),[r]=this.maps.splice(e,1);this.subs.splice(t,0,n??null),this.maps.splice(t,0,r??[])}toLayout(){let e=this.subs.length,t=e+(e-1)*aa,n=[],r=[];return this.subs.forEach((e,i)=>{let a=i*1.04;if(r.push({x:a/t,w:1/t}),!e)return;let o=this.maps[i];for(let r of e.toLayout().placements){let{x:e,y:s,w:c,h:l}=r.cell;n.push({photoIndex:o[r.photoIndex],cell:{x:(a+e)/t,y:s/t,w:c/t,h:l/t},page:i})}}),{width:1,height:this.ratio/t,placements:n,pages:r}}};function ga(e,t,n,r,i,a,o={}){let s=sa(r),c=[],l=[];for(let r=0;r<s;r++){let u=t.map((e,t)=>t).filter(e=>Math.min(s-1,Math.max(0,n[e]??0))===r);l.push(u),c.push(u.length===0?null:ra(e,u.map(e=>t[e]),i,Ti(ca(a,r)),o))}return new ha(c,l,i)}function _a(e,t,n,r,i,a,o,s={}){let c=Ti(a),l;for(let a=0;a<Math.max(1,o);a++){let a=Math.floor(c.random()*2**32)>>>0,o=ga(e,t,n,r,i,a,s),u=ea(o.toLayout(),t);(!l||ta(u,l.score))&&(l={page:o,seed:a,score:u})}let u=l;return{page:u.page,seed:u.seed}}function va(e,t){let n=e.pages?.[t];return n?{width:1,height:e.height/n.w,placements:e.placements.filter(e=>e.page===t).map(e=>({photoIndex:e.photoIndex,cell:{x:(e.cell.x-n.x)/n.w,y:e.cell.y/n.w,w:e.cell.w/n.w,h:e.cell.h/n.w}}))}:e}function ya(e){return(e.pages??[]).map((e,t)=>t).filter(t=>e.placements.some(e=>e.page===t))}function ba(e,t,n){let r=String(t).length;return Array.from({length:t},(t,i)=>`${e}_${String(i+1).padStart(r,`0`)}.${n}`)}var xa={columns:1,rows:1},Sa={zoom:1,x:.5,y:.5},Ca=(e,t,n)=>Math.min(n,Math.max(t,e));function wa(e){let t=(e,t)=>Number.isFinite(e)?e:t;return{zoom:Ca(t(e.zoom,1),1,5),x:Ca(t(e.x,.5),0,1),y:Ca(t(e.y,.5),0,1)}}function Ta(e){return e===void 0||e.zoom===Sa.zoom&&e.x===Sa.x&&e.y===Sa.y}function Ea(e,t,n,r,i=1){let a=Math.max(n/e,r/t)*Math.max(1,i),o=e*a,s=t*a;return{w:o,h:s,spareX:Math.max(0,o-n),spareY:Math.max(0,s-r)}}function Da(e,t,n,r,i,a,o){let s=Ea(r,i,a,o,e.zoom);return wa({zoom:e.zoom,x:s.spareX>0?e.x-t/s.spareX:e.x,y:s.spareY>0?e.y-n/s.spareY:e.y})}function Oa(e,t,n,r,i,a){let o=Ca(t,1,5),s=Ea(n,r,i,a,e.zoom),c=Ea(n,r,i,a,o),l=t=>{let n=t===`x`?s.w:s.h,r=t===`x`?s.spareX:s.spareY,o=t===`x`?i:a;return(e[t]*r+o/2)/n},u=e=>{let t=e===`x`?c.w:c.h,n=e===`x`?c.spareX:c.spareY,r=e===`x`?i:a;return n>0?(l(e)*t-r/2)/n:.5};return wa({zoom:o,x:u(`x`),y:u(`y`)})}var ka=1080;function Aa(e){if(e==null||!Number.isFinite(e))return 0;let t=Math.floor(e);return t<2?0:Math.min(20,t)}function ja(e,t){let n=[];for(let r=1;r<t;r++)n.push(e*r/t);return n}function Ma(e,t){return Array.from({length:e},(e,n)=>({x:n*t,y:0,w:t,h:t}))}function Na(e,t,n){let r=String(t).length;return Array.from({length:t},(t,i)=>`${e}_${String(i+1).padStart(r,`0`)}.${n}`)}var Pa=`# PhotoCollage translation file
# Copyright (C) 2014 Adrien Vergé
# Copyright (C) 2015 Frank Quotschalla <gutschy@Computer-Retro.de>
# Copyright (C) 2015 Vincent Bermel <willovince@openmailbox.org>
# This file is distributed under the same license as the PhotoCollage package.
# Adrien Vergé, 2014.
#
msgid ""
msgstr ""
"Project-Id-Version: PhotoCollage 1.4.2\\n"
"Report-Msgid-Bugs-To: https://github.com/adrienverge/PhotoCollage/issues\\n"
"POT-Creation-Date: 2016-04-11 22:51+0200\\n"
"PO-Revision-Date: 2017-10-29 20:28+0200\\n"
"Last-Translator: Peyu Yovev <spacy00001@gmail.com>\\n"
"Language-Team: spacy00001@gmail.com\\n"
"Language: bg\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=2; plural=(n != 1);\\n"
"X-Generator: Poedit 1.8.7.1\\n"

#: photocollage/gtkgui.py:72 photocollage/gtkgui.py:94
msgid "All supported image formats"
msgstr "Всички поддържани формати"

#: photocollage/gtkgui.py:104
#, python-format
msgid "%s image"
msgstr "%s изображение"

#: photocollage/gtkgui.py:161
msgid "PhotoCollage"
msgstr "PhotoCollage"

#: photocollage/gtkgui.py:189
msgid "Add images..."
msgstr "Добавяне на изображения"

#: photocollage/gtkgui.py:196
msgid "Save poster..."
msgstr "Запази колажа..."

#: photocollage/gtkgui.py:221
msgid "Regenerate"
msgstr "Регенерирай"

#: photocollage/gtkgui.py:279
#, python-format
msgid ""
"This image could not be opened:\\n"
"\\"%(imgname)s\\"."
msgstr ""
"Изображението не може да се отвори:\\n"
"\\"%(imgname)s\\"."

#: photocollage/gtkgui.py:285
msgid "Choose images"
msgstr "Изберете изображения"

#: photocollage/gtkgui.py:339 photocollage/gtkgui.py:424
msgid "An error occurred while rendering image:"
msgstr "Получи се грешка по време на рендирането:"

#: photocollage/gtkgui.py:398
msgid "Save image"
msgstr "Запази изображението"

#: photocollage/gtkgui.py:622
msgid "Settings"
msgstr "Настройки"

#: photocollage/gtkgui.py:634
msgid "Output image size"
msgstr "Размер на изходното изобранжение"

#: photocollage/gtkgui.py:649
msgid "pixels"
msgstr "пиксела"

#: photocollage/gtkgui.py:673
msgid "Apply a template:"
msgstr "Приложи шаблон"

#: photocollage/gtkgui.py:686
msgid "Border"
msgstr "Рамка"

#: photocollage/gtkgui.py:691
msgid "Thickness:"
msgstr "Ширина:"

#: photocollage/gtkgui.py:701
msgid "Color:"
msgstr "Цвят:"

#: photocollage/gtkgui.py:740
msgid "Please wait"
msgstr "Моля изчакайте"

#: photocollage/gtkgui.py:749
msgid "Performing image computation..."
msgstr "Изпълнява се преизчисляване на изображението"

#: photocollage/gtkgui.py:764
msgid "Error"
msgstr "Грешка"
`,Fa=`# PhotoCollage translation file
# Copyright (C) 2015 Michal Kovařík <mkovarik@fedoraproject.org>
# This file is distributed under the same license as the PhotoCollage package.
# Michal Kovařík <mkovarik@fedoraproject.org>, 2015.
#
msgid ""
msgstr ""
"Project-Id-Version: PhotoCollage 1.4.2\\n"
"Report-Msgid-Bugs-To: https://github.com/adrienverge/PhotoCollage/issues\\n"
"POT-Creation-Date: 2015-11-21 18:04+0100\\n"
"PO-Revision-Date: 2016-04-07 14:38+0200\\n"
"Last-Translator: Michal Kovařík <mkovarik@fedoraproject.org >\\n"
"Language-Team: none <none@none.com>\\n"
"Language: cs\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=3; plural=(n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2;\\n"
"X-Generator: Poedit 1.8.5\\n"

#: photocollage/gtkgui.py:72 photocollage/gtkgui.py:94
msgid "All supported image formats"
msgstr "Všechny podporované formáty"

#: photocollage/gtkgui.py:104
#, python-format
msgid "%s image"
msgstr "%s obrázek"

#: photocollage/gtkgui.py:161
msgid "PhotoCollage"
msgstr "PhotoCollage"

#: photocollage/gtkgui.py:189
msgid "Add images..."
msgstr "Přidat obrázky..."

#: photocollage/gtkgui.py:196
msgid "Save poster..."
msgstr "Uložit pohlednici..."

#: photocollage/gtkgui.py:221
msgid "Regenerate"
msgstr "Přegenerovat"

#: photocollage/gtkgui.py:279
#, python-format
msgid ""
"This image could not be opened:\\n"
"\\"%(imgname)s\\"."
msgstr ""
"Nelze otevřít tento obrázek:\\n"
"\\"%(imgname)s\\"."

#: photocollage/gtkgui.py:285
msgid "Choose images"
msgstr "Vyberte obrázky"

#: photocollage/gtkgui.py:339 photocollage/gtkgui.py:424
msgid "An error occurred while rendering image:"
msgstr "Nastala chyba při renderování obrázku:"

#: photocollage/gtkgui.py:398
msgid "Save image"
msgstr "Uložit obrázek"

#: photocollage/gtkgui.py:622
msgid "Settings"
msgstr "Nastavení"

#: photocollage/gtkgui.py:634
msgid "Output image size"
msgstr "Výstupní velikost obrazu"

#: photocollage/gtkgui.py:649
msgid "pixels"
msgstr "pixelů"

#: photocollage/gtkgui.py:673
msgid "Apply a template:"
msgstr "Použití šablony:"

#: photocollage/gtkgui.py:686
msgid "Border"
msgstr "Rámečku"

#: photocollage/gtkgui.py:691
msgid "Thickness:"
msgstr "Šířka:"

#: photocollage/gtkgui.py:701
msgid "Color:"
msgstr "Barva:"

#: photocollage/gtkgui.py:740
msgid "Please wait"
msgstr "Prosím čekejte"

#: photocollage/gtkgui.py:749
msgid "Performing image computation..."
msgstr "Provádím výpočet obrázku..."

#: photocollage/gtkgui.py:764
msgid "Error"
msgstr "Chyba"
`,Ia=`# PhotoCollage translation file
# Copyright (C) 2014 Adrien Vergé
# Copyright (C) 2015 Frank Quotschalla <gutschy@Computer-Retro.de>
# Copyright (C) 2015 Vincent Bermel <willovince@openmailbox.org>
# This file is distributed under the same license as the PhotoCollage package.
# Adrien Vergé, 2014.
#
msgid ""
msgstr ""
"Project-Id-Version: PhotoCollage 1.4.2\\n"
"Report-Msgid-Bugs-To: https://github.com/adrienverge/PhotoCollage/issues\\n"
"POT-Creation-Date: 2016-04-11 22:51+0200\\n"
"PO-Revision-Date: 2016-04-11 23:13+0200\\n"
"Last-Translator: Vincent Bermel <willovince@openmailbox.org>\\n"
"Language-Team: none <none@none.com>\\n"
"Language: de\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=2; plural=(n != 1);\\n"
"X-Generator: Gtranslator 2.91.7\\n"

#: photocollage/gtkgui.py:72 photocollage/gtkgui.py:94
msgid "All supported image formats"
msgstr "Alle unterstützten Bildformate"

#: photocollage/gtkgui.py:104
#, python-format
msgid "%s image"
msgstr "Bild %s"

#: photocollage/gtkgui.py:161
msgid "PhotoCollage"
msgstr "PhotoCollage"

#: photocollage/gtkgui.py:189
msgid "Add images..."
msgstr "Bilder hinzufügen"

#: photocollage/gtkgui.py:196
msgid "Save poster..."
msgstr "Poster abspeichern"

#: photocollage/gtkgui.py:221
msgid "Regenerate"
msgstr "Neue Anordnung"

#: photocollage/gtkgui.py:279
#, python-format
msgid ""
"This image could not be opened:\\n"
"\\"%(imgname)s\\"."
msgstr ""
"Dieses Bild kann nicht geöffnet werden:\\n"
"\\"%(imgname)s\\"."

#: photocollage/gtkgui.py:285
msgid "Choose images"
msgstr "Bilder auswählen"

#: photocollage/gtkgui.py:339 photocollage/gtkgui.py:424
msgid "An error occurred while rendering image:"
msgstr "Beim Berechnen des Posters ist ein Fehler aufgetreten:"

#: photocollage/gtkgui.py:398
msgid "Save image"
msgstr "Poster speichern"

#: photocollage/gtkgui.py:622
msgid "Settings"
msgstr "Einstellungen"

#: photocollage/gtkgui.py:634
msgid "Output image size"
msgstr "Ausgabebildgröße"

#: photocollage/gtkgui.py:649
msgid "pixels"
msgstr "Pixel"

#: photocollage/gtkgui.py:673
msgid "Apply a template:"
msgstr "Formatvorlage:"

#: photocollage/gtkgui.py:686
msgid "Border"
msgstr "Rahmen"

#: photocollage/gtkgui.py:691
msgid "Thickness:"
msgstr "Breite:"

#: photocollage/gtkgui.py:701
msgid "Color:"
msgstr "Farbe:"

#: photocollage/gtkgui.py:740
msgid "Please wait"
msgstr "Bitte warten"

#: photocollage/gtkgui.py:749
msgid "Performing image computation..."
msgstr "Poster wird berechnet..."

#: photocollage/gtkgui.py:764
msgid "Error"
msgstr "Fehler"
`,La=`# PhotoCollage translation file
# This file is distributed under the same license as the PhotoCollage package.
# Leonardo J. Caballero G. <leonardocaballero@gmail.com>, 2019.
# Andrey Novikov <cooking95@yandex.ru>, 2021.
#
msgid ""
msgstr ""
"Project-Id-Version: PhotoCollage 1.4.4\\n"
"Report-Msgid-Bugs-To: https://github.com/adrienverge/PhotoCollage/issues\\n"
"POT-Creation-Date: 2014-01-18 02:46-0500\\n"
"PO-Revision-Date: 2021-07-05 13:10+0500\\n"
"Last-Translator: Leonardo J. Caballero G. <leonardocaballero@gmail.com>\\n"
"Language-Team: ES <LL@li.org>\\n"
"Language: es\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=2; plural=(n != 1);\\n"
"X-Generator: Virtaal 0.7.1\\n"

#: photocollage/gtkgui.py:72 photocollage/gtkgui.py:94
msgid "All supported image formats"
msgstr "Todos los formatos de imágenes soportados"

#: photocollage/gtkgui.py:104
#, python-format
msgid "%s image"
msgstr "%s imagen"

#: photocollage/gtkgui.py:161
msgid "PhotoCollage"
msgstr "PhotoCollage"

#: photocollage/gtkgui.py:189
msgid "Add images..."
msgstr "Añadir imágenes..."

#: photocollage/gtkgui.py:196
msgid "Save poster..."
msgstr "Guardar póster..."

#: photocollage/gtkgui.py:221
msgid "Regenerate"
msgstr "Regenerar"

#: photocollage/gtkgui.py:279
#, python-format
msgid ""
"This image could not be opened:\\n"
"\\"%(imgname)s\\"."
msgstr ""
"Esta imagen no pudo ser abierta:\\n"
"\\"%(imgname)s\\"."

#: photocollage/gtkgui.py:285
msgid "Choose images"
msgstr "Elegir imágenes"

#: photocollage/gtkgui.py:339 photocollage/gtkgui.py:424
msgid "An error occurred while rendering image:"
msgstr "Un error ocurrió al renderizar la imagen:"

#: photocollage/gtkgui.py:398
msgid "Save image"
msgstr "Guardar imagen"

#: photocollage/gtkgui.py:622
msgid "Settings"
msgstr "Configuración"

#: photocollage/gtkgui.py:634
msgid "Output image size"
msgstr "Tamaño de salida de la imagen"

#: photocollage/gtkgui.py:649
msgid "pixels"
msgstr "píxeles"

#: photocollage/gtkgui.py:673
msgid "Apply a template:"
msgstr "Aplicar una plantilla:"

#: photocollage/gtkgui.py:686
msgid "Border"
msgstr "Borde"

#: photocollage/gtkgui.py:691
msgid "Thickness:"
msgstr "Espesor:"

#: photocollage/gtkgui.py:701
msgid "Color:"
msgstr "Color:"

#: photocollage/gtkgui.py:740
msgid "Please wait"
msgstr "Por favor, aguarde"

#: photocollage/gtkgui.py:749
msgid "Performing image computation..."
msgstr "Realizando el cálculo de la imagen..."

#: photocollage/gtkgui.py:764
msgid "Error"
msgstr "Error"
`,Ra=`# PhotoCollage translation file
# Copyright (C) 2014 Adrien Vergé
# This file is distributed under the same license as the PhotoCollage package.
# Adrien Vergé, 2014.
#
msgid ""
msgstr ""
"Project-Id-Version: PhotoCollage 1.4.2\\n"
"Report-Msgid-Bugs-To: https://github.com/adrienverge/PhotoCollage/issues\\n"
"POT-Creation-Date: 2014-01-18 02:46-0500\\n"
"PO-Revision-Date: 2016-04-07 12:31+0200\\n"
"Last-Translator: Adrien Vergé <no@spam.please>\\n"
"Language-Team: none <none@none.com>\\n"
"Language: fr\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=2; plural=n>1;\\n"

#: photocollage/gtkgui.py:72 photocollage/gtkgui.py:94
msgid "All supported image formats"
msgstr "Tous les formats d'image supportés"

#: photocollage/gtkgui.py:104
#, python-format
msgid "%s image"
msgstr "Image %s"

#: photocollage/gtkgui.py:161
msgid "PhotoCollage"
msgstr "PhotoCollage"

#: photocollage/gtkgui.py:189
msgid "Add images..."
msgstr "Ajouter des images..."

#: photocollage/gtkgui.py:196
msgid "Save poster..."
msgstr "Enregistrer le poster..."

#: photocollage/gtkgui.py:221
msgid "Regenerate"
msgstr "Regénérer"

#: photocollage/gtkgui.py:279
#, python-format
msgid ""
"This image could not be opened:\\n"
"\\"%(imgname)s\\"."
msgstr ""
"Cette image n'a pas pu être ouverte :\\n"
"\\"%(imgname)s\\"."

#: photocollage/gtkgui.py:285
msgid "Choose images"
msgstr "Choisir les images"

#: photocollage/gtkgui.py:339 photocollage/gtkgui.py:424
msgid "An error occurred while rendering image:"
msgstr "Une erreur est survenue pendant la composition de l'image :"

#: photocollage/gtkgui.py:398
msgid "Save image"
msgstr "Enregistrer l'image"

#: photocollage/gtkgui.py:622
msgid "Settings"
msgstr "Réglages"

#: photocollage/gtkgui.py:634
msgid "Output image size"
msgstr "Taille de l'image en sortie"

#: photocollage/gtkgui.py:649
msgid "pixels"
msgstr "pixels"

#: photocollage/gtkgui.py:673
msgid "Apply a template:"
msgstr "Appliquer un modèle :"

#: photocollage/gtkgui.py:686
msgid "Border"
msgstr "Bordure"

#: photocollage/gtkgui.py:691
msgid "Thickness:"
msgstr "Épaisseur :"

#: photocollage/gtkgui.py:701
msgid "Color:"
msgstr "Couleur :"

#: photocollage/gtkgui.py:740
msgid "Please wait"
msgstr "Veuillez patienter"

#: photocollage/gtkgui.py:749
msgid "Performing image computation..."
msgstr "Calcul de l'image en cours..."

#: photocollage/gtkgui.py:764
msgid "Error"
msgstr "Erreur"
`,za=`# PhotoCollage translation file
# Copyright (C) 2016 Lorenzo Bicci
# Copyright (C) 2016 Adrien Vergé
# This file is distributed under the same license as the PhotoCollage package.
# Adrien Vergé, 2016.
#
msgid ""
msgstr ""
"Project-Id-Version: PhotoCollage 1.4.2\\n"
"Report-Msgid-Bugs-To: https://github.com/adrienverge/PhotoCollage/issues\\n"
"POT-Creation-Date: 2014-01-18 02:46-0500\\n"
"PO-Revision-Date: 2016-04-09 16:20+0200\\n"
"Last-Translator: Lorenzo Bicci <no@spam.please>\\n"
"Language-Team: none <none@none.com>\\n"
"Language: it\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=2; plural=n!=1;\\n"

#: photocollage/gtkgui.py:72 photocollage/gtkgui.py:94
msgid "All supported image formats"
msgstr "Tutti i formati d’immagine supportati"

#: photocollage/gtkgui.py:104
#, python-format
msgid "%s image"
msgstr "Immagine %s"

#: photocollage/gtkgui.py:161
msgid "PhotoCollage"
msgstr "PhotoCollage"

#: photocollage/gtkgui.py:189
msgid "Add images..."
msgstr "Aggiungi immagini..."

#: photocollage/gtkgui.py:196
msgid "Save poster..."
msgstr "Salva poster..."

#: photocollage/gtkgui.py:221
msgid "Regenerate"
msgstr "Rigenera"

#: photocollage/gtkgui.py:279
#, python-format
msgid ""
"This image could not be opened:\\n"
"\\"%(imgname)s\\"."
msgstr ""
"Questa immagine non può essere aperta :\\n"
"\\"%(imgname)s\\"."

#: photocollage/gtkgui.py:285
msgid "Choose images"
msgstr "Seleziona immagini"

#: photocollage/gtkgui.py:339 photocollage/gtkgui.py:424
msgid "An error occurred while rendering image:"
msgstr "Si è verificato un errore durante il rendering dell'immagine:"

#: photocollage/gtkgui.py:398
msgid "Save image"
msgstr "Salva immagine"

#: photocollage/gtkgui.py:622
msgid "Settings"
msgstr "Impostazioni"

#: photocollage/gtkgui.py:634
msgid "Output image size"
msgstr "Dimensione finale dell'immagine"

#: photocollage/gtkgui.py:649
msgid "pixels"
msgstr "pixel"

#: photocollage/gtkgui.py:673
msgid "Apply a template:"
msgstr "Applica un modello:"

#: photocollage/gtkgui.py:686
msgid "Border"
msgstr "Bordo"

#: photocollage/gtkgui.py:691
msgid "Thickness:"
msgstr "Spessore:"

#: photocollage/gtkgui.py:701
msgid "Color:"
msgstr "Colore:"

#: photocollage/gtkgui.py:740
msgid "Please wait"
msgstr "Attendere, prego"

#: photocollage/gtkgui.py:749
msgid "Performing image computation..."
msgstr "Calcolo dell'immagine in corso..."

#: photocollage/gtkgui.py:764
msgid "Error"
msgstr "Errore"
`,Ba=`# PhotoCollage translation file
# Copyright (C) 2014 Adrien Vergé
# Copyright (C) 2015 Frank Quotschalla <gutschy@Computer-Retro.de>
# Copyright (C) 2015 Vincent Bermel <willovince@openmailbox.org>
# This file is distributed under the same license as the PhotoCollage package.
# Adrien Vergé, 2014.
#
msgid ""
msgstr ""
"Project-Id-Version: \\n"
"Report-Msgid-Bugs-To: https://github.com/adrienverge/PhotoCollage/issues\\n"
"POT-Creation-Date: 2016-04-11 22:51+0200\\n"
"PO-Revision-Date: 2020-09-24 13:56+0200\\n"
"Last-Translator: Heimen Stoffels <vistausss@outlook.com>\\n"
"Language-Team: none <none@none.com>\\n"
"Language: nl\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=2; plural=(n != 1);\\n"
"X-Generator: Poedit 2.4.1\\n"

#: photocollage/gtkgui.py:72 photocollage/gtkgui.py:94
msgid "All supported image formats"
msgstr "Alle ondersteunde afbeeldingsformaten"

#: photocollage/gtkgui.py:104
#, python-format
msgid "%s image"
msgstr "Afbeelding %s"

#: photocollage/gtkgui.py:161
msgid "PhotoCollage"
msgstr "PhotoCollage"

#: photocollage/gtkgui.py:189
msgid "Add images..."
msgstr "Afbeeldingen toevoegen..."

#: photocollage/gtkgui.py:196
msgid "Save poster..."
msgstr "Poster opslaan..."

#: photocollage/gtkgui.py:221
msgid "Regenerate"
msgstr "Opnieuw samenstellen"

#: photocollage/gtkgui.py:279
#, python-format
msgid ""
"This image could not be opened:\\n"
"\\"%(imgname)s\\"."
msgstr ""
"De volgende afbeelding kan niet worden geopend:\\n"
"\\"%(imgname)s\\"."

#: photocollage/gtkgui.py:285
msgid "Choose images"
msgstr "Afbeeldingen selecteren"

#: photocollage/gtkgui.py:339 photocollage/gtkgui.py:424
msgid "An error occurred while rendering image:"
msgstr "Er is een fout opgetreden tijdens het samenstellen:"

#: photocollage/gtkgui.py:398
msgid "Save image"
msgstr "Afbeelding opslaan"

#: photocollage/gtkgui.py:622
msgid "Settings"
msgstr "Instellingen"

#: photocollage/gtkgui.py:634
msgid "Output image size"
msgstr "Afbeeldingsgrootte"

#: photocollage/gtkgui.py:649
msgid "pixels"
msgstr "pixels"

#: photocollage/gtkgui.py:673
msgid "Apply a template:"
msgstr "Sjabloon toepassen:"

#: photocollage/gtkgui.py:686
msgid "Border"
msgstr "Rand"

#: photocollage/gtkgui.py:691
msgid "Thickness:"
msgstr "Dikte:"

#: photocollage/gtkgui.py:701
msgid "Color:"
msgstr "Kleur:"

#: photocollage/gtkgui.py:740
msgid "Please wait"
msgstr "Even geduld"

#: photocollage/gtkgui.py:749
msgid "Performing image computation..."
msgstr "Bezig met berekenen..."

#: photocollage/gtkgui.py:764
msgid "Error"
msgstr "Fout"
`,Va=`# PhotoCollage translation file
# Copyright (C) 2024 Marcin Schoenknecht <marcin.schoenknecht@gmail.com>
# This file is distributed under the same license as the PhotoCollage package.
# Marcin Schoenknecht <marcin.schoenknecht@gmail.com>, 2024.
#
msgid ""
msgstr ""
"Project-Id-Version: PhotoCollage 1.4.7\\n"
"Report-Msgid-Bugs-To: https://github.com/adrienverge/PhotoCollage/issues\\n"
"POT-Creation-Date: 2024-07-27 14:06+0200\\n"
"PO-Revision-Date: 2024-07-27 14:06+0200\\n"
"Last-Translator: Marcin Schoenknecht <marcin.schoenknecht@gmail.com>\\n"
"Language-Team: Marcin Schoenknecht for Polish translation <marcin.schoenknecht@gmail.com>\\n"
"Language: pl\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=3; plural=(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 "
"|| n%100>=20) ? 1 : 2)\\n"

#: photocollage/gtkgui.py:72 photocollage/gtkgui.py:94
msgid "All supported image formats"
msgstr "Wszystkie wspierane formaty graficzne"

#: photocollage/gtkgui.py:104
#, python-format
msgid "%s image"
msgstr "%s obraz"

#: photocollage/gtkgui.py:161
msgid "PhotoCollage"
msgstr "PhotoCollage"

#: photocollage/gtkgui.py:189
msgid "Add images..."
msgstr "Dodaj zdjęcia..."

#: photocollage/gtkgui.py:196
msgid "Save poster..."
msgstr "Zapisz kolaż..."

#: photocollage/gtkgui.py:221
msgid "Regenerate"
msgstr "Utwórz ponownie"

#: photocollage/gtkgui.py:279
#, python-format
msgid ""
"This image could not be opened:\\n"
"\\"%(imgname)s\\"."
msgstr ""
"Ten obraz nie może zostać otwarty:\\n"
"\\"%(imgname)s\\"."

#: photocollage/gtkgui.py:285
msgid "Choose images"
msgstr "Wybierz obrazy"

#: photocollage/gtkgui.py:339 photocollage/gtkgui.py:424
msgid "An error occurred while rendering image:"
msgstr "Wystąpił błąd podczas renderowanie obrazu:"

#: photocollage/gtkgui.py:398
msgid "Save image"
msgstr "Zapisz obraz"

#: photocollage/gtkgui.py:622
msgid "Settings"
msgstr "Ustawienia"

#: photocollage/gtkgui.py:634
msgid "Output image size"
msgstr "Rozmiar obrazu wyjściowego"

#: photocollage/gtkgui.py:649
msgid "pixels"
msgstr "pikseli"

#: photocollage/gtkgui.py:673
msgid "Apply a template:"
msgstr "Zastosuj szablon:"

#: photocollage/gtkgui.py:686
msgid "Border"
msgstr "Obramowanie"

#: photocollage/gtkgui.py:691
msgid "Thickness:"
msgstr "Grubość:"

#: photocollage/gtkgui.py:701
msgid "Color:"
msgstr "Kolor:"

#: photocollage/gtkgui.py:740
msgid "Please wait"
msgstr "Proszę czekać"

#: photocollage/gtkgui.py:749
msgid "Performing image computation..."
msgstr "Wykonywanie obliczeń analizy obrazu..."

#: photocollage/gtkgui.py:764
msgid "Error"
msgstr "Błąd"
`,Ha=`# PhotoCollage translation file
# This file is distributed under the same license as the PhotoCollage package.
# Danton Medrado <dantonmedrado@gmail.com>, 2022.
# Andrey Novikov <cooking95@yandex.ru>, 2021.
#
msgid ""
msgstr ""
"Project-Id-Version: PhotoCollage 1.4.4\\n"
"Report-Msgid-Bugs-To: https://github.com/adrienverge/PhotoCollage/issues\\n"
"POT-Creation-Date: 2022-07-23 09:36-0500\\n"
"PO-Revision-Date: 2022-07-23 10:05-0300\\n"
"Last-Translator: Danton Medrado <dantonmedrado@gmail.com>\\n"
"Language-Team: \\n"
"Language: pt_BR\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=2; plural=(n != 1);\\n"
"X-Generator: Poedit 3.1\\n"

#: photocollage/gtkgui.py:72 photocollage/gtkgui.py:94
msgid "All supported image formats"
msgstr "Todos os formatos de imagens suportados"

#: photocollage/gtkgui.py:104
#, python-format
msgid "%s image"
msgstr "%s imagem"

#: photocollage/gtkgui.py:161
msgid "PhotoCollage"
msgstr "PhotoCollage"

#: photocollage/gtkgui.py:189
msgid "Add images..."
msgstr "Adicionar imagens..."

#: photocollage/gtkgui.py:196
msgid "Save poster..."
msgstr "Salvar pôster..."

#: photocollage/gtkgui.py:221
msgid "Regenerate"
msgstr "Regerar"

#: photocollage/gtkgui.py:279
#, python-format
msgid ""
"This image could not be opened:\\n"
"\\"%(imgname)s\\"."
msgstr ""
"Esta imagem não pode ser aberta:\\n"
"\\"%(imgname)s\\"."

#: photocollage/gtkgui.py:285
msgid "Choose images"
msgstr "Escolher imagens"

#: photocollage/gtkgui.py:339 photocollage/gtkgui.py:424
msgid "An error occurred while rendering image:"
msgstr "Ocorreu um erro ao renderizar a imagem:"

#: photocollage/gtkgui.py:398
msgid "Save image"
msgstr "Salvar imagem"

#: photocollage/gtkgui.py:622
msgid "Settings"
msgstr "Configuração"

#: photocollage/gtkgui.py:634
msgid "Output image size"
msgstr "Tamanho de saída da imagem"

#: photocollage/gtkgui.py:649
msgid "pixels"
msgstr "pixels"

#: photocollage/gtkgui.py:673
msgid "Apply a template:"
msgstr "Aplicar um modelo:"

#: photocollage/gtkgui.py:686
msgid "Border"
msgstr "Borda"

#: photocollage/gtkgui.py:691
msgid "Thickness:"
msgstr "Espessura:"

#: photocollage/gtkgui.py:701
msgid "Color:"
msgstr "Cor:"

#: photocollage/gtkgui.py:740
msgid "Please wait"
msgstr "Por favor, aguarde"

#: photocollage/gtkgui.py:749
msgid "Performing image computation..."
msgstr "Realizando o cálculo da imagem..."

#: photocollage/gtkgui.py:764
msgid "Error"
msgstr "Erro"
`,Ua=`# PhotoCollage translation file
# Copyright (C) 2021 Andrey Novikov <cooking95@yandex.ru>
# This file is distributed under the same license as the PhotoCollage package.
# Andrey Novikov <cooking95@yandex.ru>, 2021.
# Eugene Uvin <eugene.uvin@protonmail.com>, 2021.
#
msgid ""
msgstr ""
"Project-Id-Version: PhotoCollage 1.4.3\\n"
"Report-Msgid-Bugs-To: https://github.com/adrienverge/PhotoCollage/issues\\n"
"POT-Creation-Date: 2021-07-02 10:29:47+0500\\n"
"PO-Revision-Date: 2021-07-02 10:29:47+0500\\n"
"Last-Translator: Andrey Novikov <cooking95@yandex.ru>\\n"
"Language-Team: Andrey Novikov <cooking95@yandex.ru>\\n"
"Language: ru\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=2; plural=(n != 1);\\n"
"X-Generator: Poedit 1.8.7.1\\n"

#: photocollage/gtkgui.py:72 photocollage/gtkgui.py:94
msgid "All supported image formats"
msgstr "Все поддерживаемые форматы изображений"

#: photocollage/gtkgui.py:104
#, python-format
msgid "%s image"
msgstr "%s изображение"

#: photocollage/gtkgui.py:161
msgid "PhotoCollage"
msgstr "PhotoCollage"

#: photocollage/gtkgui.py:189
msgid "Add images..."
msgstr "Добавить изображения..."

#: photocollage/gtkgui.py:196
msgid "Save poster..."
msgstr "Сохранить коллаж..."

#: photocollage/gtkgui.py:221
msgid "Regenerate"
msgstr "Перегенерировать"

#: photocollage/gtkgui.py:279
#, python-format
msgid ""
"This image could not be opened:\\n"
"\\"%(imgname)s\\"."
msgstr ""
"Изображение не удалось открыть:\\n"
"\\"%(imgname)s\\"."

#: photocollage/gtkgui.py:285
msgid "Choose images"
msgstr "Выбрать изображения"

#: photocollage/gtkgui.py:339 photocollage/gtkgui.py:424
msgid "An error occurred while rendering image:"
msgstr "При отрисовке изображения произошла ошибка:"

#: photocollage/gtkgui.py:398
msgid "Save image"
msgstr "Сохранить изображение"

#: photocollage/gtkgui.py:622
msgid "Settings"
msgstr "Настройки"

#: photocollage/gtkgui.py:634
msgid "Output image size"
msgstr "Размер выходного изображения"

#: photocollage/gtkgui.py:649
msgid "pixels"
msgstr "пиксели"

#: photocollage/gtkgui.py:673
msgid "Apply a template:"
msgstr "Применить шаблон:"

#: photocollage/gtkgui.py:686
msgid "Border"
msgstr "Граница"

#: photocollage/gtkgui.py:691
msgid "Thickness:"
msgstr "Толщина:"

#: photocollage/gtkgui.py:701
msgid "Color:"
msgstr "Цвет:"

#: photocollage/gtkgui.py:740
msgid "Please wait"
msgstr "Пожалуйста, подождите"

#: photocollage/gtkgui.py:749
msgid "Performing image computation..."
msgstr "Выполнение вычисления изображений..."

#: photocollage/gtkgui.py:764
msgid "Error"
msgstr "Ошибка"
`,Wa=`# PhotoCollage translation file
# Copyright (C) 2021 Eugene Uvin <eugene.uvin@protonmail.com>
# This file is distributed under the same license as the PhotoCollage package.
# Eugene Uvin <eugene.uvin@protonmail.com>, 2021.
#
msgid ""
msgstr ""
"Project-Id-Version: PhotoCollage 1.4.3\\n"
"Report-Msgid-Bugs-To: https://github.com/adrienverge/PhotoCollage/issues\\n"
"POT-Creation-Date: 2021-09-27 10:29:47+0500\\n"
"PO-Revision-Date: 2021-09-27 10:29:47+0500\\n"
"Last-Translator: Eugene Uvin <eugene.uvin@protonmail.com>\\n"
"Language-Team: Eugene Uvin <eugene.uvin@protonmail.com>\\n"
"Language: uk\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);\\n"
"X-Language: uk_UA\\n"
"X-Source-Language: C\\n"

#: photocollage/gtkgui.py:72 photocollage/gtkgui.py:94
msgid "All supported image formats"
msgstr "Всі формати зображень що підтримуються"

#: photocollage/gtkgui.py:104
#, python-format
msgid "%s image"
msgstr "%s зображення"

#: photocollage/gtkgui.py:161
msgid "PhotoCollage"
msgstr "PhotoCollage"

#: photocollage/gtkgui.py:189
msgid "Add images..."
msgstr "Додати зображення..."

#: photocollage/gtkgui.py:196
msgid "Save poster..."
msgstr "Зберегти постер..."

#: photocollage/gtkgui.py:221
msgid "Regenerate"
msgstr "Перегенерувати"

#: photocollage/gtkgui.py:279
#, python-format
msgid ""
"This image could not be opened:\\n"
"\\"%(imgname)s\\"."
msgstr ""
"Зображення не вдалося відкрити:\\n"
"\\"%(imgname)s\\"."

#: photocollage/gtkgui.py:285
msgid "Choose images"
msgstr "Обрати зображення"

#: photocollage/gtkgui.py:339 photocollage/gtkgui.py:424
msgid "An error occurred while rendering image:"
msgstr "При рендерингу зображення сталася помилка:"

#: photocollage/gtkgui.py:398
msgid "Save image"
msgstr "Зберегти зображення"

#: photocollage/gtkgui.py:622
msgid "Settings"
msgstr "Налаштування"

#: photocollage/gtkgui.py:634
msgid "Output image size"
msgstr "Розмір вихідного зображення"

#: photocollage/gtkgui.py:649
msgid "pixels"
msgstr "пікселі"

#: photocollage/gtkgui.py:673
msgid "Apply a template:"
msgstr "Застосувати шаблон:"

#: photocollage/gtkgui.py:686
msgid "Border"
msgstr "Обрамлення"

#: photocollage/gtkgui.py:691
msgid "Thickness:"
msgstr "Товщина:"

#: photocollage/gtkgui.py:701
msgid "Color:"
msgstr "Колір:"

#: photocollage/gtkgui.py:740
msgid "Please wait"
msgstr "Будь ласка, зачекайте"

#: photocollage/gtkgui.py:749
msgid "Performing image computation..."
msgstr "Обчислюю зображення..."

#: photocollage/gtkgui.py:764
msgid "Error"
msgstr "Помилка"
`;function Ga(e){return e.trim().slice(1,-1).replace(/\\(n|t|"|\\)/g,(e,t)=>t===`n`?`
`:t===`t`?`	`:t)}function Ka(e){let t={},n=null,r=null,i=null,a=!1,o=!1,s=()=>{n!==null&&r!==null&&n!==``&&r!==``&&!a&&(t[n]=r),n=r=i=null,a=!1};for(let t of e.split(/\r?\n/)){let e=t.trim();e.startsWith(`#,`)?e.includes(`fuzzy`)&&(o=!0):e.startsWith(`#`)||(e.startsWith(`msgid_plural`)||e.startsWith(`msgstr[`)?i=null:e.startsWith(`msgid `)?(s(),a=o,o=!1,n=Ga(e.slice(6)),i=`id`):e.startsWith(`msgstr `)?(r=Ga(e.slice(7)),i=`str`):e.startsWith(`"`)?i===`id`&&n!==null?n+=Ga(e):i===`str`&&r!==null&&(r+=Ga(e)):e===``&&s())}return s(),t}var qa=Object.assign({"./po/bg.po":Pa,"./po/cs.po":Fa,"./po/de.po":Ia,"./po/es.po":La,"./po/fr.po":Ra,"./po/it.po":za,"./po/nl.po":Ba,"./po/pl.po":Va,"./po/pt_BR.po":Ha,"./po/ru.po":Ua,"./po/uk.po":Wa}),Ja={};for(let[e,t]of Object.entries(qa)){let n=/\/([^/]+)\.po$/.exec(e)?.[1];n&&(Ja[n]=Ka(t))}var Ya=[`en`,...Object.keys(Ja).sort()],Xa=`en`;function Za(e){if(!e)return;let t=e.replace(`-`,`_`).toLowerCase(),n=Ya.find(e=>e.toLowerCase()===t);if(n)return n;let r=t.split(`_`)[0];return Ya.find(e=>e.toLowerCase()===r)??Ya.find(e=>e.split(`_`)[0]?.toLowerCase()===r)}function Qa(e){return Za(e)??`en`}function $a(e){for(let t of e??[]){let e=Za(t);if(e)return e}return`en`}function eo(e){return Xa=Qa(e),Xa}function to(){return Xa}function Z(e,t){let n=Ja[Xa]?.[e]??e;return t?n.replace(/%\((\w+)\)s/g,(e,n)=>n in t?String(t[n]):e):n}function no(e){let t=0,n=0,r=0,i=0;for(let a=0;a+3<e.length;a+=4){let o=e[a+3]/255;t+=e[a]*o,n+=e[a+1]*o,r+=e[a+2]*o,i+=o}return i===0?`rgb(200, 200, 200)`:`rgb(${Math.round(t/i)}, ${Math.round(n/i)}, ${Math.round(r/i)})`}var ro=8;function io(e){try{let t=new OffscreenCanvas(ro,ro).getContext(`2d`,{willReadFrequently:!0});return t?(t.imageSmoothingEnabled=!0,t.imageSmoothingQuality=`high`,t.drawImage(e,0,0,ro,ro),no(t.getImageData(0,0,ro,ro).data)):no([])}catch{return no([])}}var ao=[`avif`,`bmp`,`gif`,`heic`,`heif`,`jfif`,`jpe`,`jpeg`,`jpg`,`png`,`webp`];function oo(e){if(e.type.startsWith(`image/`))return!0;let t=e.name.split(`.`).pop()?.toLowerCase()??``;return ao.includes(t)}function so(e){return`${e.name}|${e.size}|${e.lastModified}`}var co=0;async function lo(e,t,n,r,i,a){let o=new Set(t.map(e=>so(e.file))),s=[];for(let t of e)oo(t)?o.has(so(t))?(a?.({reason:`duplicate`,name:t.name}),r({kind:`info`,text:Z(`Skipped %(name)s: it was already added.`,{name:t.name})})):(o.add(so(t)),s.push(t)):(a?.({reason:`not-image`,name:t.name}),r({kind:`error`,text:Z(`Skipped %(name)s: it is not an image.`,{name:t.name})}));let c=0;return(await Promise.all(s.map(async e=>{try{let t=await n.run({kind:`probe`,file:e,thumbMax:480});if(!t.ok||t.kind!==`probe`||t.width<1||t.height<1)throw Error(t.ok?`empty image`:t.error);return{id:`photo-${++co}`,name:e.name,width:t.width,height:t.height,span:{...xa},file:e,thumb:t.thumb,colour:io(t.thumb)}}catch{return a?.({reason:`unreadable`,name:e.name}),r({kind:`error`,text:Z(`This image could not be opened:
"%(imgname)s".`,{imgname:e.name})}),null}finally{i?.(++c,s.length)}}))).filter(e=>e!==null)}var uo=`collage-creator`,fo=`files`,po=`meta`,mo=`session`;function ho(){return new Promise((e,t)=>{let n=indexedDB.open(uo,1);n.onupgradeneeded=()=>{n.result.createObjectStore(fo),n.result.createObjectStore(po)},n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error??Error(`could not open storage`))})}function go(e){return new Promise((t,n)=>{e.onsuccess=()=>t(e.result),e.onerror=()=>n(e.error??Error(`storage request failed`))})}function _o(e){return new Promise((t,n)=>{e.oncomplete=()=>t(),e.onerror=()=>n(e.error??Error(`storage transaction failed`)),e.onabort=()=>n(e.error??Error(`storage transaction aborted`))})}async function vo(e,t){let n=await ho();try{let r=new Set((await go(n.transaction(fo,`readonly`).objectStore(fo).getAllKeys())).map(String)),i=[];for(let[e,n]of t)r.has(e)||i.push([e,{name:n.name,type:n.type,lastModified:n.lastModified,data:await n.arrayBuffer()}]);let a=n.transaction([fo,po],`readwrite`),o=a.objectStore(fo);for(let e of r)t.has(e)||o.delete(e);for(let[e,t]of i)o.put(t,e);a.objectStore(po).put(e,mo),await _o(a)}finally{n.close()}}async function yo(e){let t=await ho();try{let n=t.transaction([fo,po],`readonly`),r=To(await go(n.objectStore(po).get(mo)),e);if(!r)return null;let i=new Map;for(let{key:e}of r.photos){let t=await go(n.objectStore(fo).get(e));t?.data instanceof ArrayBuffer&&typeof t.name==`string`&&i.set(e,new File([t.data],t.name,{type:t.type??``,lastModified:t.lastModified??0}))}return{session:r,files:i}}finally{t.close()}}function bo(e){let t=e;return typeof t==`object`&&!!t&&(t.columns===1||t.columns===2)&&(t.rows===1||t.rows===2||t.rows===3)}function xo(e){let t=e;return typeof t==`object`&&!!t&&typeof t.pages==`number`&&typeof t.perPage==`number`}function So(e){let t=e;return typeof t==`object`&&!!t&&[t.zoom,t.x,t.y].every(e=>typeof e==`number`&&Number.isFinite(e))}function Co(e,t,n){let r=Aa(typeof e==`number`?e:void 0);return r>0&&typeof t==`number`&&typeof n==`number`&&t===r*n?r:0}function wo(e,t){let n=typeof e==`object`&&e?e:{},r=(e,t,n,r)=>typeof e==`number`&&Number.isFinite(e)&&e>=t&&e<=n?e:r;return{width:Math.round(r(n.width,1,1e6,t.width)),height:Math.round(r(n.height,1,1e6,t.height)),borderWidth:r(n.borderWidth,0,.2,t.borderWidth),borderColor:typeof n.borderColor==`string`&&/^#[0-9a-f]{6}$/i.test(n.borderColor)?n.borderColor:t.borderColor,cornerStyle:n.cornerStyle===`slight`||n.cornerStyle===`rounded`?n.cornerStyle:`none`,outerBorder:typeof n.outerBorder==`boolean`?n.outerBorder:t.outerBorder,splitImages:Co(n.splitImages,n.width,n.height),format:n.format===`jpeg`?`jpeg`:`png`,jpegQuality:r(n.jpegQuality,.1,1,t.jpegQuality)}}function To(e,t){let n=e;if(typeof n!=`object`||!n||n.v!==1||!Array.isArray(n.photos))return null;let r=[];for(let e of n.photos){if(typeof e?.key!=`string`)continue;let t={key:e.key,span:bo(e.span)?e.span:{...xa}};So(e.crop)&&!Ta(e.crop)&&(t.crop=wa(e.crop)),typeof e.page==`number`&&Number.isInteger(e.page)&&e.page>=0&&(t.page=Math.min(19,e.page)),r.push(t)}let i=n.seed;return{v:1,photos:r,seed:typeof i==`number`&&Number.isInteger(i)&&i>=0&&i<=4294967295?i:0,columns:typeof n.columns==`number`&&n.columns>=1?Math.floor(n.columns):void 0,layoutStyle:n.layoutStyle===`gallery`?`gallery`:`mosaic`,...xo(n.book)?{book:{pages:sa(n.book.pages),perPage:oa(n.book.perPage)}}:{},settings:wo(n.settings,t)}}var Eo=(()=>{let e=new Uint32Array(256);for(let t=0;t<256;t++){let n=t;for(let e=0;e<8;e++)n=n&1?3988292384^n>>>1:n>>>1;e[t]=n>>>0}return e})();function Do(e){let t=4294967295;for(let n of e)t=Eo[(t^n)&255]^t>>>8;return(t^4294967295)>>>0}function Oo(e){let t=Math.max(1980,e.getFullYear());return{time:e.getHours()<<11|e.getMinutes()<<5|e.getSeconds()>>1,date:t-1980<<9|e.getMonth()+1<<5|e.getDate()}}function ko(e,t=new Date){let n=new TextEncoder,r=Oo(t),i=[],a=[],o=0;for(let t of e){let e=n.encode(t.name),s=Do(t.data),c=t.data.length,l=new DataView(new ArrayBuffer(30));l.setUint32(0,67324752,!0),l.setUint16(4,20,!0),l.setUint16(6,2048,!0),l.setUint16(8,0,!0),l.setUint16(10,r.time,!0),l.setUint16(12,r.date,!0),l.setUint32(14,s,!0),l.setUint32(18,c,!0),l.setUint32(22,c,!0),l.setUint16(26,e.length,!0),l.setUint16(28,0,!0),i.push(new Uint8Array(l.buffer),e,t.data);let u=new DataView(new ArrayBuffer(46));u.setUint32(0,33639248,!0),u.setUint16(4,20,!0),u.setUint16(6,20,!0),u.setUint16(8,2048,!0),u.setUint16(10,0,!0),u.setUint16(12,r.time,!0),u.setUint16(14,r.date,!0),u.setUint32(16,s,!0),u.setUint32(20,c,!0),u.setUint32(24,c,!0),u.setUint16(28,e.length,!0),u.setUint32(42,o,!0),a.push(new Uint8Array(u.buffer),e),o+=30+e.length+c}let s=a.reduce((e,t)=>e+t.length,0),c=new DataView(new ArrayBuffer(22));c.setUint32(0,101010256,!0),c.setUint16(8,e.length,!0),c.setUint16(10,e.length,!0),c.setUint32(12,s,!0),c.setUint32(16,o,!0);let l=[...i,...a,new Uint8Array(c.buffer)],u=new Uint8Array(l.reduce((e,t)=>e+t.length,0)),d=0;for(let e of l)u.set(e,d),d+=e.length;return u}function Ao(e){return new Blob([ko(e)],{type:`application/zip`})}function jo(e){let t=e.sizes.shift(),n=Math.max(Math.ceil(t[0]),1),r=Math.max(Math.ceil(t[1]),1),i=[n-1,r-1,1,1],a=performance.now(),o=typeof WorkerGlobalScope<`u`&&self instanceof WorkerGlobalScope,s,c;o?(s=new OffscreenCanvas(1,1),c=new OffscreenCanvas(n,r)):(s=document.createElement(`canvas`),s.width=1,s.height=1,c=document.createElement(`canvas`),c.width=n,c.height=r);let l=s.getContext(`2d`),u=c.getContext(`2d`);u&&(u.fillRect.apply(u,i),l.drawImage(c,n-1,r-1,1,1,0,0,1,1));let d=l&&l.getImageData(0,0,1,1).data[3]!==0,f=parseInt(performance.now()-a);return[s,c].forEach((e=>{e.height=0,e.width=0})),o?(postMessage({width:n,height:r,testTime:f,isTestPass:d}),!d&&e.sizes.length&&setTimeout((()=>{jo(e)}),0)):d?e.onSuccess({width:n,height:r,testTime:f}):(e.onError({width:n,height:r,testTime:f}),e.sizes.length&&setTimeout((()=>{jo(e)}),0)),d}var Mo={area:[16384,14188,11402,11180,10836,8192,4096,1],height:[8388607,65535,32767,16384,8192,4096,1],width:[4194303,65535,32767,16384,8192,4096,1]},No={max:null,min:1,sizes:[],step:1024,useWorker:!1,onError:Function.prototype,onSuccess:Function.prototype},Po={};function Fo(e){let t=e.width===e.height,n=e.height===1,r=e.width===1,i=[];if(!e.width||!e.height)e.sizes.forEach((e=>{let a=t||n?e:1,o=t||r?e:1;i.push([a,o])}));else{let a=e.min||No.min,o=e.step||No.step,s=Math.max(e.width,e.height);for(;s>=a;){let e=t||n?s:1,a=t||r?s:1;i.push([e,a]),s-=o}}return i}function Io(e){let t=typeof window<`u`,n=t&&`Promise`in window,r=t&&`HTMLCanvasElement`in window,i=t&&`OffscreenCanvas`in window,a=URL.createObjectURL(new Blob([])).slice(-36),o=performance.now(),{onError:s,onSuccess:c,...l}=e,u=()=>parseInt(performance.now()-o),d=null;if(!r)return!1;if(e.useWorker&&i){let e=`\n            var canvasTest = ${jo.toString()};\n            onmessage = function(e) {\n                canvasTest(e.data);\n            };\n        `,t=new Blob([e],{type:`application/javascript`}),n=URL.createObjectURL(t);d=new Worker(n),URL.revokeObjectURL(n),d.onmessage=function(e){let{width:t,height:n,testTime:r,isTestPass:i}=e.data,o={width:t,height:n,testTime:r,totalTime:u()};i?(Po[a].onSuccess(o),delete Po[a]):Po[a].onError(o)}}if(n)return new Promise((t=>{let n={...e,onError(n){let{width:r,height:i,testTime:a}=n,o={width:r,height:i,testTime:a,totalTime:u()},c;if(e.sizes.length===0)c=!0;else{let[[t,n]]=e.sizes.slice(-1);c=r===t&&i===n}s(o),c&&t({...o,success:!1})},onSuccess(e){let{width:n,height:r,testTime:i}=e,a={width:n,height:r,testTime:i,totalTime:u()};c(a),t({...a,success:!0})}};if(d){let{onError:e,onSuccess:t}=n;Po[a]={onError:e,onSuccess:t},d.postMessage(l)}else jo(n)}));if(d)Po[a]={onError:s,onSuccess:c},d.postMessage(l);else return jo(e)}var Lo={maxArea(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=Fo({width:e.max,height:e.max,min:e.min,step:e.step,sizes:[...Mo.area]});return Io({...No,...e,sizes:t})},maxHeight(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=Fo({width:1,height:e.max,min:e.min,step:e.step,sizes:[...Mo.height]});return Io({...No,...e,sizes:t})},maxWidth(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=Fo({width:e.max,height:1,min:e.min,step:e.step,sizes:[...Mo.width]});return Io({...No,...e,sizes:t})},test(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t={...No,...e};return t.sizes=[...t.sizes],t.width&&t.height&&(t.sizes=[[t.width,t.height]]),Io(t)}},Ro={maxSide:4096,maxArea:16777216};async function zo(){try{let[e,t,n]=await Promise.all([Lo.maxArea(),Lo.maxWidth(),Lo.maxHeight()]);return e.success?{maxArea:e.width*e.height,maxSide:Math.max(Math.min(t.success?t.width:0,n.success?n.height:0),e.width)}:Ro}catch{return Ro}}function Bo(e,t,n){let r=Math.min(1,n.maxSide/Math.max(e,t),Math.sqrt(n.maxArea/(e*t)));return r>=1?{width:e,height:t,clamped:!1}:{width:Math.max(1,Math.floor(e*r)),height:Math.max(1,Math.floor(t*r)),clamped:!0}}function Vo(e,t,n){return e.placements.map(({cell:r})=>{let i=Math.round(r.x/e.width*t),a=Math.round(r.y/e.height*n),o=Math.round((r.x+r.w)/e.width*t),s=Math.round((r.y+r.h)/e.height*n);return{x:i,y:a,w:o-i,h:s-a}})}function Ho(e,t,n){return e<=0?0:Math.max(1,Math.round(e*Math.max(t,n)))}function Uo(e,t,n,r){let i=Math.min(1,Math.max(n/e,r/t));return{width:Math.max(1,Math.ceil(e*i)),height:Math.max(1,Math.ceil(t*i))}}var Wo={slight:.08,rounded:.25};function Go(e,t,n){return e===`slight`||e===`rounded`?Math.min(t,n)*Wo[e]:0}function Ko(e,t,n,r,i=!0){let a=Math.floor(r/2),o=r-a,s=i?r:0,c=e.x<=0?s:o,l=e.y<=0?s:o,u=e.x+e.w>=t?s:a,d=e.y+e.h>=n?s:a,f=e.w-c-u,p=e.h-l-d;return{x:f>0?e.x+c:e.x+e.w/2,y:p>0?e.y+l:e.y+e.h/2,w:Math.max(0,f),h:Math.max(0,p)}}var qo={topLeft:!1,topRight:!1,bottomRight:!1,bottomLeft:!1};function Jo(e,t,n,r){if(r)return qo;let i=e.x<=0,a=e.y<=0,o=e.x+e.w>=t,s=e.y+e.h>=n;return{topLeft:i||a,topRight:o||a,bottomRight:o||s,bottomLeft:i||s}}function Yo(e,t,n,r=qo){e.beginPath();let i=Go(n,t.w,t.h);if(i<=0){e.rect(t.x,t.y,t.w,t.h);return}let a=r.topLeft?0:i,o=r.topRight?0:i,s=r.bottomRight?0:i,c=r.bottomLeft?0:i,l=t.x+t.w,u=t.y+t.h;e.moveTo(t.x+a,t.y),e.lineTo(l-o,t.y),o>0?e.arcTo(l,t.y,l,t.y+o,o):e.lineTo(l,t.y),e.lineTo(l,u-s),s>0?e.arcTo(l,u,l-s,u,s):e.lineTo(l,u),e.lineTo(t.x+c,u),c>0?e.arcTo(t.x,u,t.x,u-c,c):e.lineTo(t.x,u),e.lineTo(t.x,t.y+a),a>0?e.arcTo(t.x,t.y,t.x+a,t.y,a):e.lineTo(t.x,t.y),e.closePath()}function Xo(e,t,n,r){e.fillStyle=r!==void 0&&r.corners!==`none`?r.color:`#ffffff`,e.fillRect(0,0,t,n)}function Zo(e,t,n,r,i,a,o,s,c){if(s.corners===`none`){Qo(e,t,n,r,i,c);return}let l=Ko(i,a,o,s.border,s.outer);l.w<=0||l.h<=0||(e.save(),Yo(e,l,s.corners,Jo(i,a,o,s.outer)),e.clip(),Qo(e,t,n,r,l,c),e.restore())}function Qo(e,t,n,r,i,a){if(i.w<=0||i.h<=0)return;let{w:o,h:s,spareX:c,spareY:l}=Ea(n,r,i.w,i.h,a?.zoom);e.save(),e.beginPath(),e.rect(i.x,i.y,i.w,i.h),e.clip(),e.imageSmoothingEnabled=!0,e.imageSmoothingQuality=`high`,e.drawImage(t,i.x-c*(a?.x??.5),i.y-l*(a?.y??.5),o,s),e.restore()}function $o(e,t,n,r,i,a){if(i<=0)return;e.save(),e.beginPath(),e.rect(0,0,n,r),e.clip(),e.fillStyle=a;let o=Math.floor(i/2);for(let a of t)a.x>0&&e.fillRect(a.x-o,a.y-o,i,a.h+i),a.y>0&&e.fillRect(a.x-o,a.y-o,a.w+i,i),a.x+a.w<n&&e.fillRect(a.x+a.w-o,a.y-o,i,a.h+i),a.y+a.h<r&&e.fillRect(a.x-o,a.y+a.h-o,a.w+i,i);e.restore()}function es(e,t,n,r,i){let{border:a,color:o}=i;a<=0||i.corners!==`none`||($o(e,t,n,r,a,o),i.outer&&(e.fillStyle=o,e.fillRect(0,0,n,a),e.fillRect(0,r-a,n,a),e.fillRect(0,0,a,r),e.fillRect(n-a,0,a,r)))}function ts(e){return e===`jpeg`?`image/jpeg`:`image/png`}function ns(e){return e===`jpeg`?`jpg`:`png`}async function rs(e){let{layout:t,photos:n,settings:r,pool:i,signal:a,onProgress:o}=e,{width:s,height:c}=r,l=new OffscreenCanvas(s,c),u=l.getContext(`2d`);if(!u)throw Error(`2D canvas is not available`);let d={corners:r.cornerStyle,border:Ho(r.borderWidth,s,c),color:r.borderColor,outer:r.outerBorder},f=Vo(t,s,c);Xo(u,s,c,d);let p=()=>i.terminate();a?.aborted&&p(),a?.addEventListener(`abort`,p,{once:!0});try{let p=0;if(o?.(0,f.length),await Promise.all(t.placements.map(async(e,t)=>{let r=n[e.photoIndex],a=f[t];if(!r||!a)return;let l=Math.max(1,r.crop?.zoom??1),m=Uo(r.width,r.height,a.w*l,a.h*l),h=await i.run({kind:`cell`,file:r.file,...m});if(!h.ok||h.kind!==`cell`)throw Error(h.ok?`unexpected response`:h.error);try{Zo(u,h.bitmap,h.bitmap.width,h.bitmap.height,a,s,c,d,r.crop)}finally{h.bitmap.close()}o?.(++p,f.length)})),a?.aborted)throw new DOMException(`Cancelled`,`AbortError`);es(u,f,s,c,d);let m={type:ts(r.format),quality:r.format===`jpeg`?r.jpegQuality:void 0},h=r.splitImages;if(h<2)return await l.convertToBlob(m);let g=Na(e.baseName??`collage`,h,ns(r.format)),_=[];for(let[e,t]of Ma(h,c).entries()){if(a?.aborted)throw new DOMException(`Cancelled`,`AbortError`);let n=new OffscreenCanvas(t.w,t.h),r=n.getContext(`2d`);if(!r)throw Error(`2D canvas is not available`);r.drawImage(l,t.x,t.y,t.w,t.h,0,0,t.w,t.h);let i=await n.convertToBlob(m);_.push({name:g[e],data:new Uint8Array(await i.arrayBuffer())})}return Ao(_)}finally{a?.removeEventListener(`abort`,p)}}var is=class{size;workers=[];idle=[];queue=[];running=new Map;nextId=1;terminated=!1;readyCount=0;resolveReady=()=>{};ready=new Promise(e=>{this.resolveReady=e});constructor(e=as()){this.size=e;for(let t=0;t<e;t++){let t=new Worker(new URL(new URL(`export.worker-DmYFRvHx.js`,import.meta.url).href,``+import.meta.url),{type:`module`});t.onmessage=n=>{n.data.kind===`ready`?++this.readyCount===e&&this.resolveReady():this.onDone(t,n.data)},t.onerror=e=>this.onCrash(t,e.message),this.workers.push(t),this.idle.push(t)}}run(e){return this.terminated?Promise.reject(new DOMException(`Pool terminated`,`AbortError`)):new Promise((t,n)=>{this.queue.push({req:e,resolve:t,reject:n}),this.pump()})}terminate(){this.terminated=!0;let e=new DOMException(`Cancelled`,`AbortError`);for(let t of this.queue)t.reject(e);for(let{job:t}of this.running.values())t.reject(e);this.queue=[],this.running.clear();for(let e of this.workers)e.terminate();this.workers=[],this.idle=[]}pump(){for(;this.idle.length&&this.queue.length;){let e=this.idle.pop(),t=this.queue.shift(),n=this.nextId++;this.running.set(e,{id:n,job:t}),e.postMessage({...t.req,id:n})}}onDone(e,t){let n=this.running.get(e);n&&n.id===t.id&&(this.running.delete(e),this.idle.push(e),n.job.resolve(t),this.pump())}onCrash(e,t){let n=this.running.get(e);n&&(this.running.delete(e),this.idle.push(e),n.job.reject(Error(t||`Worker error`)),this.pump())}};function as(){return Math.max(2,Math.min(4,navigator.hardwareConcurrency||2))}function os(e,t,n,r){let i=Math.min(n/e,r/t);return{width:Math.max(1,Math.floor(e*i)),height:Math.max(1,Math.floor(t*i))}}function ss(e,t,n,r){let{layout:i}=r;return i.pages?cs(e,t,n,r):ls(e,t,n,r)}function cs(e,t,n,r){let{layout:i}=r,a=Array(i.placements.length);return(i.pages??[]).forEach((o,s)=>{let c=Math.round(o.x*t),l=Math.max(1,Math.round((o.x+o.w)*t)-c),u=i.placements.flatMap((e,t)=>e.page===s?[t]:[]);e.save(),e.translate(c,0),e.beginPath(),e.rect(0,0,l,n),e.clip();let d=ls(e,l,n,{...r,layout:va(i,s)});e.restore(),d.forEach((e,t)=>{let n=u[t];n!==void 0&&(a[n]={x:e.x+c,y:e.y,w:e.w,h:e.h})})}),a}function ls(e,t,n,{layout:r,thumbs:i,crops:a,settings:o}){let s={corners:o.cornerStyle,border:Ho(o.borderWidth,t,n),color:o.borderColor,outer:o.outerBorder},c=Vo(r,t,n);return Xo(e,t,n,s),r.placements.forEach((r,o)=>{let l=i[r.photoIndex],u=c[o],d=a?.[r.photoIndex];l&&u&&Zo(e,l,l.width,l.height,u,t,n,s,d)}),es(e,c,t,n,s),c}function us(e,t,n){e.save(),e.strokeStyle=n,e.lineWidth=4,e.strokeRect(t.x+2,t.y+2,t.w-4,t.h-4),e.restore()}var ds=3,fs=36,ps=10;function ms(e,t){e.save(),e.scale(t,t),e.lineWidth=1.2,e.setLineDash([]),e.beginPath(),e.moveTo(-2.6,-3),e.lineTo(2.4,7),e.moveTo(2.6,-3),e.lineTo(-2.4,7),e.stroke();for(let t of[-3.4,3.4])e.beginPath(),e.arc(t,-5.4,2.3,0,Math.PI*2),e.stroke();e.restore()}function hs(e,t,n,r,i,a){let o=ja(t.w,n);if(o.length===0)return;e.save(),e.strokeStyle=i,e.fillStyle=i,e.lineWidth=Math.max(1,r),e.lineCap=`butt`;for(let n of o){let i=Math.round(t.x+n)+.5;for(let n of[!0,!1]){let a=n?t.y-ds*r:t.y+t.h+ds*r,o=n?-1:1;e.setLineDash([4*r,3*r]),e.beginPath(),e.moveTo(i,a),e.lineTo(i,a+o*ps*r),e.moveTo(i,a+o*26*r),e.lineTo(i,a+o*fs*r),e.stroke(),e.save(),e.translate(i,a+o*18*r),n||e.rotate(Math.PI),ms(e,r),e.restore()}}let s=o[0],c=Math.round(t.x+s)+8*r,l=t.x+t.w-c;l>40*r&&(e.font=`${12*r}px system-ui, sans-serif`,e.textAlign=`left`,e.textBaseline=`alphabetic`,e.fillText(a,c,t.y-44*r,l)),e.restore()}var gs={zoom:1,panX:0,panY:0},_s=.5,vs=48;function ys(e){return Number.isFinite(e)?Math.min(8,Math.max(_s,e)):1}function bs(e){return e.zoom===1&&e.panX===0&&e.panY===0}function xs(e,t){return{w:e.w*t.zoom,h:e.h*t.zoom}}function Ss(e,t,n){let r=xs(t,n);return{x:(e.w-r.w)/2+n.panX,y:(e.h-r.h)/2+n.panY}}function Cs(e,t,n){let r=xs(n,e),i=Math.min(vs,r.w/2,t.w/2),a=Math.min(vs,r.h/2,t.h/2),o=i-r.w-(t.w-r.w)/2,s=t.w-i-(t.w-r.w)/2,c=a-r.h-(t.h-r.h)/2,l=t.h-a-(t.h-r.h)/2;return{zoom:e.zoom,panX:Math.min(s,Math.max(o,e.panX)),panY:Math.min(l,Math.max(c,e.panY))}}function ws(e,t,n,r,i){return Cs({...e,panX:e.panX+t,panY:e.panY+n},r,i)}function Ts(e,t,n,r,i){let a=ys(e.zoom*t),o=xs(i,e),s=Ss(r,i,e),c=(n.x-s.x)/o.w,l=(n.y-s.y)/o.h,u=xs(i,{...e,zoom:a}),d=n.x-c*u.w,f=n.y-l*u.h;return Cs({zoom:a,panX:d-(r.w-u.w)/2,panY:f-(r.h-u.h)/2},r,i)}function Es(e){return Math.round(e.zoom*100)}var Ds=[{label:`800 × 600`,width:800,height:600},{label:`600 × 800`,width:600,height:800},{label:`1600 × 1200`,width:1600,height:1200},{label:`1200 × 1600`,width:1200,height:1600},{label:`A4 portrait (300 DPI)`,width:2480,height:3508},{label:`A4 landscape (300 DPI)`,width:3508,height:2480},{label:`A3 portrait (300 DPI)`,width:3508,height:4961},{label:`A3 landscape (300 DPI)`,width:4961,height:3508},{label:`A2 portrait (300 DPI)`,width:4961,height:7016},{label:`A2 landscape (300 DPI)`,width:7016,height:4961},{label:`B1 portrait (300 DPI)`,width:8350,height:11811},{label:`B1 landscape (300 DPI)`,width:11811,height:8350},{label:`Square (1080 × 1080)`,width:1080,height:1080}];function Os(e,t){return Ds.findIndex(n=>n.width===e&&n.height===t)}var ks=[{id:`screen`,label:`Screen`,group:`screen`,width:1600,height:1200},{id:`small`,label:`Small`,group:`screen`,width:800,height:600},{id:`square`,label:`Square`,group:`screen`,width:1080,height:1080},{id:`a4`,label:`A4`,group:`print`,width:3508,height:2480},{id:`a3`,label:`A3`,group:`print`,width:4961,height:3508},{id:`a2`,label:`A2`,group:`print`,width:7016,height:4961},{id:`b1`,label:`B1`,group:`print`,width:11811,height:8350}];function As(e,t){return t===`portrait`?{width:e.height,height:e.width}:{width:e.width,height:e.height}}function js(e,t){for(let n of ks){if(n.width===e&&n.height===t)return{choice:n,orientation:e===t?`square`:`landscape`};if(n.height===e&&n.width===t)return{choice:n,orientation:`portrait`}}}function Ms(e,t){return e===t?`square`:t>e?`portrait`:`landscape`}var Ns=`seed`,Ps=4294967295;function Fs(e){let t=new URLSearchParams(e).get(Ns);if(t===null||!/^\d{1,10}$/.test(t))return;let n=Number(t);return n<=Ps?n:void 0}function Is(e,t){let n=new URL(e);return n.searchParams.set(Ns,String(t)),n.toString()}var Ls=`collage-creator.language`,Rs=`collage-web.language`;function zs(){try{return localStorage.getItem(Ls)??localStorage.getItem(Rs)}catch{return null}}function Bs(){try{let e=navigator.languages;return e?.length?e:navigator.language?[navigator.language]:[]}catch{return[]}}function Vs(e){try{localStorage.setItem(Ls,e)}catch{}}var Hs=1e4,Us=6e3;function Ws(e,t){let n=URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.download=t,document.body.append(r),r.click(),r.remove(),setTimeout(()=>URL.revokeObjectURL(n),6e4)}function Gs(e){let t=[];return e?.columns===2&&t.push(Z(`wider`)),e&&e.rows>1&&t.push(`${Z(`taller`)} ×${e.rows}`),t.join(` · `)}var Q=new class{#e=L([]);get photos(){return G(this.#e)}set photos(e){R(this.#e,e)}#t=L(Ht(Fs(location.search)??Di()));get seed(){return G(this.#t)}set seed(e){R(this.#t,e,!0)}#n=L(void 0);get columns(){return G(this.#n)}set columns(e){R(this.#n,e,!0)}#r=L(`mosaic`);get layoutStyle(){return G(this.#r)}set layoutStyle(e){R(this.#r,e,!0)}#i=L(!1);get book(){return G(this.#i)}set book(e){R(this.#i,e,!0)}#a=L(1);get pageCount(){return G(this.#a)}set pageCount(e){R(this.#a,e,!0)}#o=L(Ht(6));get perPage(){return G(this.#o)}set perPage(e){R(this.#o,e,!0)}#s=L(null);get page(){return G(this.#s)}set page(e){R(this.#s,e)}#c=L(0);get pageRev(){return G(this.#c)}set pageRev(e){R(this.#c,e,!0)}#l=L(Ht({width:1600,height:1200,borderWidth:.005,borderColor:`#ffffff`,cornerStyle:`none`,outerBorder:!0,splitImages:0,format:`png`,jpegQuality:.92}));get settings(){return G(this.#l)}set settings(e){R(this.#l,e,!0)}#u=L(!1);get customSize(){return G(this.#u)}set customSize(e){R(this.#u,e,!0)}#d=L(!1);get portrait(){return G(this.#d)}set portrait(e){R(this.#d,e,!0)}#f=L(Ro);get limits(){return G(this.#f)}set limits(e){R(this.#f,e)}#p=L(``);get sizeNote(){return G(this.#p)}set sizeNote(e){R(this.#p,e,!0)}#m=L(0);get sizeEpoch(){return G(this.#m)}set sizeEpoch(e){R(this.#m,e,!0)}#h=L(0);get restoreEpoch(){return G(this.#h)}set restoreEpoch(e){R(this.#h,e,!0)}#g=L(`photos`);get tab(){return G(this.#g)}set tab(e){R(this.#g,e,!0)}#_=L(!1);get sheetOpen(){return G(this.#_)}set sheetOpen(e){R(this.#_,e,!0)}#v=L(!1);get menuOpen(){return G(this.#v)}set menuOpen(e){R(this.#v,e,!0)}#y=L(0);get riseToken(){return G(this.#y)}set riseToken(e){R(this.#y,e,!0)}#b=L(!1);get narrow(){return G(this.#b)}set narrow(e){R(this.#b,e,!0)}#x=L(`pan`);get mode(){return G(this.#x)}set mode(e){R(this.#x,e,!0)}#S=L(null);get selected(){return G(this.#S)}set selected(e){R(this.#S,e,!0)}#C=L(null);get cropFor(){return G(this.#C)}set cropFor(e){R(this.#C,e,!0)}#w=L(0);get revealToken(){return G(this.#w)}set revealToken(e){R(this.#w,e,!0)}#T=L(0);get focused(){return G(this.#T)}set focused(e){R(this.#T,e,!0)}#E=L(gs);get view(){return G(this.#E)}set view(e){R(this.#E,e)}#D=L(Ht({w:0,h:0}));get viewport(){return G(this.#D)}set viewport(e){R(this.#D,e,!0)}#O=L(!1);get spaceHeld(){return G(this.#O)}set spaceHeld(e){R(this.#O,e,!0)}#k=L(!1);get canvasFocused(){return G(this.#k)}set canvasFocused(e){R(this.#k,e,!0)}#A=L(!1);get focusRing(){return G(this.#A)}set focusRing(e){R(this.#A,e,!0)}#j=L(null);get removed(){return G(this.#j)}set removed(e){R(this.#j,e)}#M=L(``);get status(){return G(this.#M)}set status(e){R(this.#M,e,!0)}#N=L([]);get messages(){return G(this.#N)}set messages(e){R(this.#N,e)}#P=L(null);get notice(){return G(this.#P)}set notice(e){R(this.#P,e)}#F=L(!1);get noticeDetailsOpen(){return G(this.#F)}set noticeDetailsOpen(e){R(this.#F,e,!0)}#I=L(null);get restoring(){return G(this.#I)}set restoring(e){R(this.#I,e,!0)}#L=L(Ht(to()));get lang(){return G(this.#L)}set lang(e){R(this.#L,e,!0)}#R=L(null);get dialog(){return G(this.#R)}set dialog(e){R(this.#R,e,!0)}#z=L(0);get progress(){return G(this.#z)}set progress(e){R(this.#z,e,!0)}#B=L(!1);get persistReady(){return G(this.#B)}set persistReady(e){R(this.#B,e,!0)}importPool=new is(2);exportPool=new is;#V=F(()=>this.photos.length>0);get hasPhotos(){return G(this.#V)}set hasPhotos(e){R(this.#V,e)}#H=F(()=>(this.pageRev,this.page?this.page.toLayout():null));get layout(){return G(this.#H)}set layout(e){R(this.#H,e)}#U=F(()=>(this.pageRev,this.page?.noCols));get columnsInUse(){return G(this.#U)}set columnsInUse(e){R(this.#U,e)}#W=F(()=>this.layout?Math.round(ea(this.layout,this.photos).cutOff*100):0);get cropPercent(){return G(this.#W)}set cropPercent(e){R(this.#W,e)}#G=F(()=>this.selected===null?void 0:this.photos[this.selected]);get selectedPhoto(){return G(this.#G)}set selectedPhoto(e){R(this.#G,e)}#K=F(()=>this.settings.splitImages>1);get isSplit(){return G(this.#K)}set isSplit(e){R(this.#K,e)}#q=F(()=>this.selectedPhoto?.bookPage??0);get selectedPage(){return G(this.#q)}set selectedPage(e){R(this.#q,e)}#J=F(()=>la(this.photos.map(e=>e.bookPage??0),this.pageCount));get pageCounts(){return G(this.#J)}set pageCounts(e){R(this.#J,e)}#Y=F(()=>{if(this.isSplit)return`post`;let e=js(this.settings.width,this.settings.height);return this.customSize||!e?`custom`:e.choice.id});get activeSize(){return G(this.#Y)}set activeSize(e){R(this.#Y,e)}#X=F(()=>this.spaceHeld?`pan`:this.mode);get activeMode(){return G(this.#X)}set activeMode(e){R(this.#X,e)}#Z=F(()=>this.photos.map(e=>e.colour));get photoColours(){return G(this.#Z)}set photoColours(e){R(this.#Z,e)}statusTimer;noticeTimer;sizeTimer;pendingSize=null;restoringDone=Promise.resolve();fileInput=null;replaceUrl=!0;persistWarned=!1;get ratio(){return this.settings.height/this.settings.width}addMessage(e){this.messages=[...this.messages,e].slice(-8)}clearMessages(){this.messages=[]}setStatus(e){this.status=e,clearTimeout(this.statusTimer),e&&(this.statusTimer=setTimeout(()=>{this.status=``},Us))}hideNotice(){clearTimeout(this.noticeTimer),this.notice=null,this.noticeDetailsOpen=!1}showNotice(e){if(this.hideNotice(),e.length===0)return;let t=t=>e.filter(e=>e.reason===t).length,n=t(`duplicate`),r=t(`not-image`),i=t(`unreadable`),a=[];n&&a.push(Z(`%(n)s already added`,{n})),r&&a.push(Z(`%(n)s not an image`,{n:r})),i&&a.push(Z(`%(n)s could not be opened`,{n:i}));let o=n===e.length;this.notice={summary:Z(`%(n)s skipped: %(what)s`,{n:e.length,what:a.join(`, `)}),items:e.map(e=>{let t=e.reason===`duplicate`?Z(`already added`):e.reason===`not-image`?Z(`not an image`):Z(`could not be opened`);return`${e.name}: ${t}`}),kind:o?`info`:`error`},o&&(this.noticeTimer=setTimeout(()=>this.hideNotice(),Hs))}initLanguage(){let e=zs(),t=e?Qa(e):$a(Bs());this.lang=eo(t),document.documentElement.lang=this.lang.replace(`_`,`-`)}chooseLanguage(e){this.lang=eo(e),Vs(this.lang),document.documentElement.lang=this.lang.replace(`_`,`-`)}closeMenu(){this.menuOpen=!1}setTab(e,t){let n=this.narrow,r=!n&&e===`save`?`photos`:e,i=this.sheetOpen,a=this.tab,o=n&&t&&i&&this.tab===r,s=n&&!o&&(t||i);this.tab=r,this.sheetOpen=s,s&&(this.closeMenu(),r===a&&i||this.riseToken++)}relayout(e=`single`,t=!1){if(this.selected=t?this.selected:null,this.focused=0,this.photos.length===0)this.page=null;else if(this.book){let t=this.photos.map(e=>e.bookPage??0);if(e===`search`){let e=this.layoutStyle===`gallery`?10:30,n=_a(this.layoutStyle,this.photos,t,this.pageCount,this.ratio,Di(),e,{columns:this.columns});this.page=n.page,this.seed=n.seed}else this.page=ga(this.layoutStyle,this.photos,t,this.pageCount,this.ratio,this.seed,{columns:this.columns})}else if(e===`search`){let e=ia(this.layoutStyle,this.photos,this.ratio,Di(),{columns:this.columns});this.page=e.page,this.seed=e.seed}else this.page=ra(this.layoutStyle,this.photos,this.ratio,Ti(this.seed),{columns:this.columns});this.pageRev++,this.status=``,this.syncUrl()}reshape(){this.page?.setTargetRatio(this.ratio),this.pageRev++}shuffle(){this.seed=Di(),this.relayout()}setSeed(e){let t=Math.floor(e);return!Number.isFinite(t)||t<0||t>4294967295?!1:(this.seed=t,this.relayout(),!0)}chooseLayout(e){(this.layoutStyle!==e||this.book)&&(this.layoutStyle=e,this.book=!1,this.reshape(),this.relayout(`search`))}get rowSize(){if(!this.book)return{w:this.settings.width,h:this.settings.height};let e=this.pageCount;return{w:(e+(e-1)*aa)*this.settings.width,h:this.settings.height}}withPages(e,t){let n=la(t.map(e=>e.bookPage??0),Math.max(1,this.pageCount));return e.map(e=>{if(e.bookPage!==void 0&&e.bookPage<this.pageCount)return n[e.bookPage]=(n[e.bookPage]??0)+1,e;let t=ua(n,this.perPage);return n[t]=(n[t]??0)+1,this.pageCount=Math.max(this.pageCount,t+1),{...e,bookPage:t}})}chooseBook(){if(!this.book){if(this.settings.splitImages>1){let e=this.settings.height;this.settings.splitImages=0,this.applySize(e,e)}this.book=!0,this.customSize=!1,this.pageCount=Math.max(1,this.pageCount),this.photos=this.withPages(this.photos,[]),this.reshape(),this.relayout(`search`),this.setStatus(Z(`Book: %(n)s page(s).`,{n:this.pageCount}))}}chooseBookStyle(e){this.layoutStyle!==e&&(this.layoutStyle=e,this.relayout(`search`))}get perPageMin(){return 1}get perPageMax(){return 20}get maxPages(){return 20}setPerPage(e){this.perPage=oa(e)}setPages(e,t=this.pageCount){this.pageCount=t,this.photos=this.photos.map((t,n)=>({...t,bookPage:e[n]??0}))}addPage(){!this.book||this.pageCount>=20||(this.pageCount++,this.page?.addPage(),this.pageRev++,this.setStatus(Z(`Added page %(n)s.`,{n:this.pageCount})))}removePage(e){if(!this.book||this.pageCount<=1||e<0||e>=this.pageCount)return;let t=ma(this.photos.map(e=>e.bookPage??0),e);this.setPages(t,this.pageCount-1),this.relayout(`single`,!1),this.setStatus(Z(`Removed page %(n)s; its photos moved to a neighbouring page.`,{n:e+1}))}movePage(e,t){let n=e+t;!this.book||e<0||n<0||e>=this.pageCount||n>=this.pageCount||(this.setPages(pa(this.photos.map(e=>e.bookPage??0),e,n)),this.page?.movePage(e,n),this.pageRev++,this.setStatus(Z(`Moved page %(a)s to place %(b)s.`,{a:e+1,b:n+1})))}spreadPhotos(){if(!this.book)return;let e=da(this.photos.length,this.pageCount,this.perPage);this.setPages(e.pageOf,e.pages),this.relayout(`search`),this.setStatus(Z(`Photos shared evenly across %(n)s page(s).`,{n:e.pages}))}shufflePages(){if(!this.book)return;let e=fa(this.photos.map(e=>e.bookPage??0),Ti(Di()));this.setPages(e),this.relayout(`search`),this.setStatus(Z(`Photos shuffled between pages.`))}moveSelectedToPage(e){let t=this.selected,n=this.selectedPhoto;if(!this.book||t===null||!n||e<0||e>=this.pageCount||(n.bookPage??0)===e)return;let r={...n,bookPage:e},i=this.photos.filter((e,n)=>n!==t),a=i.length;for(let t=i.length-1;t>=0;t--){if((i[t]?.bookPage??0)<=e){a=t+1;break}a=t}i.splice(a,0,r),this.photos=i,this.relayout(`single`,!1),this.selected=a,this.setStatus(Z(`Moved %(name)s to page %(n)s.`,{name:n.name,n:e+1}))}setColumns(e){e!==this.columns&&(this.columns=e,this.relayout())}stepColumns(e){let t=this.columns??this.page?.noCols??1;this.setColumns(Ii(t+e))}syncUrl(){try{let e=Is(location.href,this.seed);if(e===location.href)return;this.replaceUrl?history.replaceState(null,``,e):history.pushState(null,``,e)}catch{}}onPopState(){let e=Fs(location.search);e!==void 0&&e!==this.seed&&(this.seed=e,this.relayout())}async persist(){let e=new Map(this.photos.map(e=>[so(e.file),e.file]));try{await vo({v:1,photos:this.photos.map(e=>({key:so(e.file),span:e.span??{...xa},...e.crop?{crop:e.crop}:{},...this.book&&e.bookPage!==void 0?{page:e.bookPage}:{}})),seed:this.seed,columns:this.columns,layoutStyle:this.layoutStyle,...this.book?{book:{pages:this.pageCount,perPage:this.perPage}}:{},settings:Le(this.settings)},e)}catch{if(this.persistWarned)return;this.persistWarned=!0,this.addMessage({kind:`error`,text:Z(`Your work could not be kept for next time: browser storage is unavailable or full.`)})}}async restore(){this.restoring={done:0,total:0};try{let e=await yo(this.settings);if(e){Object.assign(this.settings,e.session.settings),this.columns=e.session.columns,this.layoutStyle=e.session.layoutStyle??`mosaic`;let t=e.session.book;this.book=t!==void 0,this.pageCount=t?.pages??1,this.perPage=t?.perPage??6,this.restoreEpoch++;let n=e.session.photos.map(t=>e.files.get(t.key)).filter(e=>e!==void 0);this.restoring={done:0,total:n.length};let r=await lo(n,[],this.importPool,e=>this.addMessage(e),(e,t)=>{this.restoring={done:e,total:t}}),i=new Map(e.session.photos.map(e=>[e.key,e]));this.photos=r.map(e=>{let t=i.get(so(e.file));return{...e,span:{...t?.span??xa},...t?.crop?{crop:t.crop}:{},...t?.page===void 0?{}:{bookPage:t.page}}}),this.seed=Fs(location.search)??e.session.seed,this.applySize(this.settings.width,this.settings.height),this.relayout()}}catch{}finally{this.restoring=null,this.persistReady=!0,this.replaceUrl=!1}}start(){this.initLanguage(),this.relayout(),this.restoringDone=this.restore(),Promise.all([this.importPool.ready,this.exportPool.ready]).then(()=>{document.documentElement.dataset.workersReady=`true`}),zo().then(e=>{this.limits=e,this.applySize(this.settings.width,this.settings.height)})}fitPoster(e=this.viewport){let t=this.narrow?12:88,n=this.narrow?104:72,r=this.settings.splitImages>1||this.book?112:0,i=this.rowSize,a=os(i.w,i.h,Math.max(160,e.w-2*t),Math.max(160,e.h-2*n-r));return{w:a.width,h:a.height}}get isFit(){return bs(this.view)}get zoomPercent(){return Es(this.view)}zoomAtCentre(e){let t=this.viewport,n={x:t.w/2,y:t.h/2};this.view=Ts(this.view,e,n,t,this.fitPoster(t))}zoomAtPoint(e,t){this.view=Ts(this.view,e,t,this.viewport,this.fitPoster(this.viewport))}panBy(e,t){this.view=ws(this.view,e,t,this.viewport,this.fitPoster(this.viewport))}fitView(){this.view=gs}setMode(e){this.mode=e,this.status=``,clearTimeout(this.statusTimer)}setSpaceHeld(e){this.spaceHeld=e}selectPhoto(e){let t=this.photos[e];t&&(this.selected===e?(this.selected=null,this.setStatus(``)):(this.selected=e,this.setStatus(Z(`Selected %(name)s.`,{name:t.name}))))}selectInPhotos(e){this.selectPhoto(e),!(this.selected!==e||this.narrow)&&(this.setTab(`photos`,!1),this.revealToken++)}pick(e){let t=this.layout?.placements[e];if(!this.page||!t)return;let n=t.photoIndex;if(this.selected===null)this.selected=n,this.setStatus(Z(`Selected %(name)s. Choose another photo to swap, or press Escape.`,{name:this.photos[n]?.name??``}));else if(this.selected===n)this.selected=null,this.setStatus(``);else{if(this.page.swapPhotos(this.selected,n),this.book){let e=this.selected,t=this.photos[e]?.bookPage??0,r=this.photos[n]?.bookPage??0;this.photos=this.photos.map((i,a)=>a===e?{...i,bookPage:r}:a===n?{...i,bookPage:t}:i)}this.pageRev++,this.setStatus(Z(`Swapped %(a)s and %(b)s.`,{a:this.photos[this.selected]?.name??``,b:this.photos[n]?.name??``})),this.selected=null}}get cropping(){return this.cropFor!==null&&this.cropFor===this.selected}toggleCrop(){this.selected!==null&&(this.cropFor=this.cropping?null:this.selected,this.setStatus(this.cropping?Z(`Drag the photo to move it, scroll to zoom.`):``))}selectedCell(){let e=this.selected;return e===null?void 0:this.layout?.placements.find(t=>t.photoIndex===e)?.cell}writeCrop(e,t){let n=Ta(t)?void 0:wa(t);this.photos=this.photos.map((t,r)=>{if(r!==e)return t;let{crop:i,...a}=t;return n?{...a,crop:n}:a})}panSelectedCrop(e,t){let n=this.selected,r=n===null?void 0:this.photos[n],i=this.selectedCell();n!==null&&r&&i&&this.writeCrop(n,Da(r.crop??Sa,e,t,r.width,r.height,i.w,i.h))}zoomSelectedCrop(e){let t=this.selected,n=t===null?void 0:this.photos[t],r=this.selectedCell();t!==null&&n&&r&&this.writeCrop(t,Oa(n.crop??Sa,e,n.width,n.height,r.w,r.h))}zoomSelectedCropBy(e){let t=this.selectedPhoto?.crop?.zoom??1;this.zoomSelectedCrop(t*e)}resetCrop(){this.selected!==null&&(this.writeCrop(this.selected,Sa),this.setStatus(Z(`%(name)s is back to its default crop.`,{name:this.selectedPhoto?.name??``})))}maxZoom=5;deselect(){this.selected=null,this.setStatus(``)}chooseFiles(){this.fileInput?.click()}async addFiles(e){if(e.length===0)return;this.restoring&&this.setStatus(Z(`Your new photos are added once your saved ones are back.`)),await this.restoringDone,this.clearMessages(),this.hideNotice(),this.setStatus(Z(`Please wait`));let t=[],n=await lo(e,this.photos,this.importPool,e=>this.addMessage(e),void 0,e=>t.push(e));if(this.setStatus(``),this.showNotice(t),n.length>0){let e=this.book?this.withPages(n,this.photos):n;this.photos=[...this.photos,...e],this.relayout(`search`)}}discardRemoved(){for(let{photo:e}of this.removed??[])e.thumb.close();this.removed=null}removePhotos(e,t){let n=this.photos.map((e,t)=>({photo:e,index:t})).filter(t=>e.has(t.photo.id));n.length!==0&&(this.discardRemoved(),this.removed=n,this.photos=this.photos.filter(t=>!e.has(t.id)),this.relayout(`search`),this.setStatus(`${t} ${Z(`Undo remove brings it back.`)}`))}removeSelected(){let e=this.selectedPhoto;e&&this.removePhotos(new Set([e.id]),Z(`Removed %(name)s.`,{name:e.name}))}removeAll(){let e=this.photos.length;this.removePhotos(new Set(this.photos.map(e=>e.id)),Z(`Removed all %(n)s photos.`,{n:e}))}undoRemove(){let e=this.removed;if(!e)return;let t=new Set(this.photos.map(e=>so(e.file))),n=e.filter(e=>!t.has(so(e.photo.file)));for(let t of e)n.includes(t)||t.photo.thumb.close();let r=[...this.photos];for(let e of n)r.splice(Math.min(e.index,r.length),0,e.photo);this.photos=r,this.removed=null,this.relayout(`search`),this.setStatus(Z(`Restored %(n)s photo(s).`,{n:n.length}))}setSpan(e,t){let n=this.photos[e];if(!n)return;let r=t===`reset`?{...xa}:{...n.span??xa,...t},i={...n,span:r};this.photos=this.photos.map((t,n)=>n===e?i:t),this.relayout(`single`,!0);let a=Gs(r);this.setStatus(a?Z(`%(name)s: %(what)s.`,{name:n.name,what:a}):Z(`%(name)s is back to its normal size.`,{name:n.name}))}toggleWider(){let e=this.selected;if(e===null)return;let t=this.photos[e]?.span?.columns===2;this.setSpan(e,{columns:t?1:2})}cycleTaller(){let e=this.selected;if(e===null)return;let t=this.photos[e]?.span?.rows??1;this.setSpan(e,{rows:t===1?2:t===2?3:1})}resetSpan(){this.selected!==null&&this.setSpan(this.selected,`reset`)}chooseSize(e,t){this.settings.splitImages=0,this.applySize(e,t)}chooseNamedSize(e){this.customSize=!1;let t=ks.find(t=>t.id===e);if(!t)return;let n=As(t,this.portrait?`portrait`:`landscape`);this.chooseSize(n.width,n.height)}chooseCustomSize(){this.customSize=!0,this.sizeEpoch++}chooseInstagramPost(){this.customSize=!1,this.book=!1,this.setSplit(3,ka,!0)}turn(e){this.portrait=e;let{width:t,height:n}=this.settings;e&&n<t||!e&&t<n?this.applySize(n,t):this.sizeEpoch++}syncOrientation(){let e=Ms(this.settings.width,this.settings.height);e!==`square`&&(this.portrait=e===`portrait`)}applySize(e,t){if(!Number.isFinite(e)||!Number.isFinite(t)||e<1||t<1){this.sizeEpoch++;return}let n=Bo(Math.round(e),Math.round(t),this.limits);this.settings.width=n.width,this.settings.height=n.height,this.sizeNote=n.clamped?Z(`This browser can only make images up to %(w)s × %(h)s pixels here; using that size.`,{w:n.width,h:n.height}):``,this.settings.splitImages>1?this.setSplit(this.settings.splitImages,this.settings.height,!1):(this.syncOrientation(),this.sizeEpoch++,this.reshape())}commitSize(e,t){clearTimeout(this.sizeTimer),this.pendingSize=null,Bo(Math.round(e),Math.round(t),this.limits).clamped?(this.pendingSize={width:e,height:t},this.sizeTimer=setTimeout(()=>this.flushSize(),600)):this.applySize(e,t)}flushSize(){clearTimeout(this.sizeTimer);let e=this.pendingSize;this.pendingSize=null,e&&this.applySize(e.width,e.height)}setSplit(e,t,n){let r=Aa(e)||3,i=Math.max(16,Math.round(Number.isFinite(t)?t:ka)),a=Bo(r*i,i,this.limits);a.clamped&&(i=Math.max(16,Math.floor(Math.min(a.height,a.width/r)))),this.sizeNote=a.clamped?Z(`This browser can only make images up to %(w)s × %(h)s pixels here; using that size.`,{w:r*i,h:i}):``;let o=r!==this.settings.splitImages;this.settings.splitImages=r,this.settings.width=r*i,this.settings.height=i,this.syncOrientation(),this.sizeEpoch++,n&&(o||!this.page)?this.relayout(`search`):this.reshape()}get splitMin(){return 2}get splitMax(){return 20}async save(e){let t=this.layout;if(!t)return;this.clearMessages(),this.flushSize();let n=Bo(this.settings.width,this.settings.height,this.limits);n.clamped&&this.applySize(n.width,n.height);let r=Le(this.settings),i=new AbortController;this.cancelExport=()=>i.abort(),this.progress=0,this.dialog=`progress`;try{let n=r.format===`jpeg`?`jpg`:`png`;if(t.pages){await this.saveBook(t,r,n,i.signal,e);return}let a=await rs({layout:t,photos:this.photos,settings:r,pool:this.exportPool,signal:i.signal,onProgress:(e,t)=>{this.progress=t?e/t*100:100},baseName:`collage-${this.seed}`}),o=`collage-${this.seed}`;Ws(a,r.splitImages>1?`${o}.zip`:`${o}.${n}`)}catch(e){e instanceof DOMException&&e.name===`AbortError`||this.addMessage({kind:`error`,text:`${Z(`An error occurred while rendering image:`)} ${e instanceof Error?e.message:String(e)}`})}finally{this.dialog=null,i.signal.aborted&&(this.exportPool=new is)}}async saveBook(e,t,n,r,i){let a=ya(e),o=i===void 0?a:a.filter(e=>e===i);if(o.length===0){this.addMessage({kind:`error`,text:Z(`That page has no photos to save.`)});return}if(i===void 0&&o.length<(e.pages?.length??0)){let t=(e.pages??[]).map((e,t)=>t).filter(e=>!a.includes(e));this.addMessage({kind:`info`,text:Z(`Skipped empty page(s): %(list)s.`,{list:t.map(e=>e+1).join(`, `)})})}let s=`book-${this.seed}`,c={...t,splitImages:0},l=[];for(let[t,n]of o.entries())l.push(await rs({layout:va(e,n),photos:this.photos,settings:c,pool:this.exportPool,signal:r,onProgress:(e,n)=>{this.progress=(t+(n?e/n:1))/o.length*100}}));if(l.length===1){let e=i===void 0?s:`${s}_page-${(o[0]??0)+1}`;Ws(l[0],`${e}.${n}`);return}let u=ba(s,l.length,n);Ws(Ao(await Promise.all(l.map(async(e,t)=>({name:u[t],data:new Uint8Array(await e.arrayBuffer())})))),`${s}.zip`)}cancelExport=()=>{}};function Ks(e){return Array.from({length:12},(t,n)=>e.length===0?void 0:e[n%e.length])}function $(e,t){return Q.lang,Z(e,t)}var qs=q(`<dialog id="progress-dialog" aria-labelledby="progress-title"><h2 id="progress-title"> </h2> <p> </p> <progress id="progress" max="100"></progress> <div class="button-row"><button type="button" id="cancel"> </button></div></dialog> <dialog id="help-dialog" aria-labelledby="help-title"><h2 id="help-title"> </h2> <h3> </h3> <ul class="help-list"><li><strong> </strong>: <span> </span></li> <li><strong> </strong>: <span> </span></li></ul> <h3> </h3> <ul class="help-list"><li><strong> </strong>: <span> </span></li> <li><strong> </strong>: <span> </span></li> <li><strong> </strong>: <span> </span></li> <li><strong> </strong>: <span> </span></li></ul> <p class="hint help-note"> </p> <div class="button-row"><button type="button" id="help-close" class="primary"> </button></div></dialog> <dialog id="about-dialog" aria-labelledby="about-title"><h2 id="about-title"> </h2> <p><strong>Collage Creator</strong> <span> </span> <a href="https://github.com/adrienverge/PhotoCollage" rel="noopener">PhotoCollage</a>,
    Copyright © 2013–2014 Adrien Vergé, with translations by the contributors credited in the
    NOTICE. It is not the original and is not endorsed by its authors.</p> <p>The changes and additions in this version are Copyright © 2026 John Briggs. It is released under
    the <a href="./LICENSE.txt" rel="noopener">GNU General Public License</a>, version 2 or (at
    your option) any later version (SPDX: GPL-2.0-or-later).</p> <p> </p> <p><span> </span> <a href="https://github.com/briggsyj/CollageCreator" rel="noopener"> </a> · <a href="./NOTICE.txt" rel="noopener">NOTICE</a> · <a href="./THIRD-PARTY-LICENSES.txt" rel="noopener">Third-party licences</a></p> <div class="button-row"><button type="button" id="about-close" class="primary"> </button></div></dialog>`,1);function Js(e,t){Ve(t,!0);let n,r,i;pn(()=>{let e={progress:n,help:r,about:i};for(let t of Object.keys(e)){let n=e[t];Q.dialog===t&&!n.open?n.showModal():Q.dialog!==t&&n.open&&n.close()}});let a=e=>()=>{Q.dialog===e&&(Q.dialog=null)};var o=qs(),s=en(o),c=z(s),l=B(c,!0),u=V(c,2),d=B(u,!0),f=V(u,2),p=V(f,2),m=z(p),h=B(m,!0);N(p),N(s),bi(s,e=>n=e,()=>n);var g=V(s,2),_=F(()=>a(`help`)),v=z(g),y=B(v,!0),b=V(v,2),x=B(b,!0),S=V(b,2),C=z(S),w=z(C),T=B(w,!0),ee=B(V(w,2),!0);N(C);var E=V(C,2),D=z(E),te=B(D,!0),ne=B(V(D,2),!0);N(E),N(S);var re=V(S,2),ie=B(re,!0),O=V(re,2),ae=z(O),k=z(ae),oe=B(k,!0),se=B(V(k,2),!0);N(ae);var ce=V(ae,2),le=z(ce),A=B(le,!0),ue=B(V(le,2),!0);N(ce);var de=V(ce,2),fe=z(de),pe=B(fe,!0),me=B(V(fe,2),!0);N(de);var j=V(de,2),he=z(j),M=B(he,!0),ge=B(V(he,2),!0);N(j),N(O);var _e=V(O,2),ye=B(_e,!0),be=V(_e,2),xe=z(be),Se=B(xe,!0);N(be),N(g),bi(g,e=>r=e,()=>r);var Ce=V(g,2),we=F(()=>a(`about`)),Te=z(Ce),Ee=B(Te,!0),De=V(Te,2),Oe=B(V(z(De),2),!0);ve(3),N(De);var ke=V(De,4),Ae=B(ke,!0),je=V(ke,2),Me=z(je),Ne=B(Me,!0),Pe=B(V(Me,2),!0);ve(4),N(je);var Fe=V(je,2),Ie=z(Fe),Le=B(Ie,!0);N(Fe),N(Ce),bi(Ce,e=>i=e,()=>i),H((e,t,n,r,i,a,o,s,c,u,p,m,g,_,v,b,S,C,w,E,D,re,O,ae,k,ce)=>{Y(l,e),Y(d,t),fi(f,Q.progress),Y(h,n),Y(y,r),Y(x,i),Y(T,a),Y(ee,o),Y(te,s),Y(ne,c),Y(ie,u),Y(oe,p),Y(se,m),Y(A,g),Y(ue,_),Y(pe,v),Y(me,b),Y(M,S),Y(ge,C),Y(ye,w),Y(Se,E),Y(Ee,D),Y(Oe,re),Y(Ae,O),Y(Ne,ae),Y(Pe,k),Y(Le,ce)},[()=>$(`Please wait`),()=>$(`Performing image computation...`),()=>$(`Cancel`),()=>$(`Help`),()=>$(`Moving around`),()=>$(`Pan`),()=>$(`drag the collage to move it. Hold Space to pan from any tool.`),()=>$(`Zoom`),()=>$(`scroll over the collage, or use + and − at the top right. Fit shows it all.`),()=>$(`Changing photos`),()=>$(`Swap`),()=>$(`click a photo, then another, to swap them.`),()=>$(`Select`),()=>$(`click a photo to select it in the Photos step, then make it wider or taller.`),()=>$(`Crop`),()=>$(`select a photo, press Crop, then drag it and zoom to choose which part shows.`),()=>$(`Book`),()=>$(`in Style, choose Book for several pages in a row, each saved as its own image. Swap works between pages.`),()=>$(`Everything runs in your browser. Your photos are never uploaded.`),()=>$(`Close`),()=>$(`About`),()=>$(`is an independent, modified web version of`),()=>$(`This program comes with ABSOLUTELY NO WARRANTY; without even the implied warranty of merchantability or fitness for a particular purpose.`),()=>$(`Your photos never leave your device.`),()=>$(`Source code`),()=>$(`Close`)]),pr(`cancel`,s,e=>e.preventDefault()),K(`click`,m,()=>Q.cancelExport()),pr(`close`,g,function(...e){G(_)?.apply(this,e)}),K(`click`,xe,()=>Q.dialog=null),pr(`close`,Ce,function(...e){G(we)?.apply(this,e)}),K(`click`,Ie,()=>Q.dialog=null),J(e,o),He()}mr([`click`]);function Ys(e,t){let n=e.parentElement,r=null,i=()=>{r=null,n?.style.removeProperty(`--drag`)},a=t=>{t.target.closest(`button`)||(r=t.clientY,e.setPointerCapture(t.pointerId),n?.classList.remove(`rise`))},o=e=>{r!==null&&n?.style.setProperty(`--drag`,`${Math.max(0,e.clientY-r)}px`)},s=e=>{if(r===null)return;let n=e.clientY-r;i(),n>60&&t()};return e.addEventListener(`pointerdown`,a),e.addEventListener(`pointermove`,o),e.addEventListener(`pointerup`,s),e.addEventListener(`pointercancel`,i),{destroy(){e.removeEventListener(`pointerdown`,a),e.removeEventListener(`pointermove`,o),e.removeEventListener(`pointerup`,s),e.removeEventListener(`pointercancel`,i)}}}function Xs(e,t){let n=t,r=e=>n(e);return e.addEventListener(`wheel`,r,{passive:!1}),{update(e){n=e},destroy(){e.removeEventListener(`wheel`,r)}}}function Zs(e,t){let n=t;return e.value=t.value,{update(t){t.sticky&&t.again===n.again||(e.value=t.value),n=t}}}var Qs=q(`<canvas aria-hidden="true"></canvas>`);function $s(e,t){Ve(t,!0);let n;pn(()=>{let e=n.getContext(`2d`);e&&(e.clearRect(0,0,160,160),Qo(e,t.bitmap,t.bitmap.width,t.bitmap.height,{x:0,y:0,w:160,h:160}))});var r=Qs();X(r,`width`,160),X(r,`height`,160),bi(r,e=>n=e,()=>n),J(e,r),He()}var ec=q(`<div class="restoring" role="status"><p><!></p> <progress></progress></div>`),tc=q(`<li> </li>`),nc=q(`<div class="page-head"><h4> <span class="count"> </span></h4> <div class="page-actions"><button type="button" class="link move-page-left">◀</button> <button type="button" class="link move-page-right">▶</button> <button type="button" class="link remove-page"> </button></div></div>`),rc=q(`<p class="hint"> </p>`),ic=q(`<span class="tag"> </span>`),ac=q(`<li><button type="button" class="tile"><!> <!> <span class="name"> </span></button></li>`),oc=q(`<section class="page-group"><!> <!> <ul class="photo-list"></ul></section>`),sc=q(`<section class="tabpanel" id="panel-photos" role="tabpanel" aria-labelledby="tab-photos"><button type="button" id="add" class="primary wide" aria-describedby="privacy-note"> </button> <p class="drop-tip"> </p> <p id="privacy-note" class="sr-only"> </p> <!> <div id="notices" class="notices"><p id="notices-summary" class="notices-summary"> </p> <div class="notices-actions"><button type="button" id="notices-details" class="link" aria-controls="notices-list"> </button> <button type="button" id="notices-dismiss" class="link"> </button></div> <ul id="notices-list" class="notices-list"></ul></div> <div class="rowhead"><h3 id="photo-count"> </h3> <div><button type="button" id="undo-remove" class="link"> </button> <button type="button" id="remove-all" class="link"> </button></div></div> <p id="empty-hint" class="hint"> </p> <div id="photo-list"></div></section>`);function cc(e,t){Ve(t,!0);let n;pn(()=>{if(Q.revealToken===0)return;let e=Q.selected;e!==null&&n.querySelector(`[data-photo="${e}"]`)?.scrollIntoView({block:`nearest`})});let r=F(()=>{let e=Q.photos.map((e,t)=>({photo:e,index:t}));return Q.book?Array.from({length:Q.pageCount},(t,n)=>({page:n,items:e.filter(e=>Math.min(Q.pageCount-1,e.photo.bookPage??0)===n)})):[{page:-1,items:e}]}),i=F(()=>Q.photos.length===1?$(`1 photo`):$(`%(n)s photos`,{n:Q.photos.length}));var a=sc(),o=z(a),s=B(o,!0),c=V(o,2),l=B(c,!0),u=V(c,2),d=B(u,!0),f=V(u,2),p=e=>{var t=ec(),n=z(t),r=z(n),i=e=>{var t=Sr();H(e=>Y(t,e),[()=>$(`Bringing back your photos… %(done)s of %(total)s`,{done:Q.restoring.done,total:Q.restoring.total})]),J(e,t)},a=e=>{var t=Sr();H(e=>Y(t,e),[()=>$(`Looking for your saved photos…`)]),J(e,t)};Mr(r,e=>{Q.restoring.total>0?e(i):e(a,-1)}),N(n);var o=V(n,2);N(t),H((e,t)=>{X(o,`max`,e),fi(o,Q.restoring.total>0?Q.restoring.done:void 0),X(o,`aria-label`,t)},[()=>Math.max(1,Q.restoring.total),()=>$(`Bringing back your photos`)]),J(e,t)};Mr(f,e=>{Q.restoring&&e(p)});var m=V(f,2),h=z(m),g=B(h,!0),_=V(h,2),v=z(_),y=B(v,!0),b=V(v,2),x=B(b,!0);N(_);var S=V(_,2);Lr(S,20,()=>Q.notice?.items??[],e=>e,(e,t)=>{var n=tc(),r=B(n,!0);H(()=>Y(r,t)),J(e,n)}),N(S),N(m);var C=V(m,2),w=z(C),T=B(w,!0),ee=V(w,2),E=z(ee),D=B(E,!0),te=V(E,2),ne=B(te,!0);N(ee),N(C);var re=V(C,2),ie=B(re,!0),O=V(re,2);Lr(O,21,()=>G(r),e=>e.page,(e,t)=>{var n=oc(),r=z(n),i=e=>{var n=nc(),r=z(n),i=z(r),a=B(V(i));N(r);var o=V(r,2),s=z(o),c=V(s,2),l=V(c,2),u=B(l,!0);N(o),N(n),H((e,n,r,o,d,f)=>{Y(i,`${e??``} `),Y(a,`· ${n??``}`),X(s,`aria-label`,r),s.disabled=G(t).page===0,X(c,`aria-label`,o),c.disabled=G(t).page===Q.pageCount-1,X(l,`aria-label`,d),l.disabled=Q.pageCount<=1,Y(u,f)},[()=>$(`Page %(n)s`,{n:G(t).page+1}),()=>G(t).items.length===1?$(`1 photo`):$(`%(n)s photos`,{n:G(t).items.length}),()=>$(`Move page %(n)s left`,{n:G(t).page+1}),()=>$(`Move page %(n)s right`,{n:G(t).page+1}),()=>$(`Remove page %(n)s`,{n:G(t).page+1}),()=>$(`Remove page`)]),K(`click`,s,()=>Q.movePage(G(t).page,-1)),K(`click`,c,()=>Q.movePage(G(t).page,1)),K(`click`,l,()=>Q.removePage(G(t).page)),J(e,n)};Mr(r,e=>{G(t).page>=0&&e(i)});var a=V(r,2),o=e=>{var t=rc(),n=B(t,!0);H(e=>Y(n,e),[()=>$(`Drop or move photos here`)]),J(e,t)};Mr(a,e=>{G(t).page>=0&&G(t).items.length===0&&e(o)});var s=V(a,2);Lr(s,21,()=>G(t).items,({photo:e,index:t})=>e.id,(e,t)=>{let n=()=>G(t).photo,r=()=>G(t).index,i=F(()=>Gs(n().span)),a=F(()=>G(i)?`${n().name}, ${G(i)}`:n().name);var o=ac(),s=z(o),c=z(s);$s(c,{get bitmap(){return n().thumb}});var l=V(c,2),u=e=>{var t=ic(),n=B(t,!0);H(()=>Y(n,G(i))),J(e,t)};Mr(l,e=>{G(i)&&e(u)});var d=V(l,2),f=B(d,!0);N(s),N(o),H(e=>{X(o,`data-photo`,r()),X(s,`aria-pressed`,r()===Q.selected),X(s,`aria-label`,e),X(d,`title`,n().name),Y(f,n().name)},[()=>Q.book?`${G(a)}, ${$(`Page %(n)s`,{n:(n().bookPage??0)+1})}`:G(a)]),K(`click`,s,()=>Q.selectPhoto(r())),J(e,o)}),N(s),N(n),H(e=>X(n,`aria-label`,e),[()=>G(t).page>=0?$(`Page %(n)s`,{n:G(t).page+1}):void 0]),J(e,n)}),N(O),bi(O,e=>n=e,()=>n),N(a),H((e,t,n,r,c,u,f,p)=>{X(a,`hidden`,Q.tab!==`photos`),o.disabled=Q.restoring!==null,Y(s,e),Y(l,t),Y(d,n),X(m,`hidden`,Q.notice===null),X(m,`data-kind`,Q.notice?.kind),Y(g,Q.notice?.summary??``),X(v,`aria-expanded`,Q.noticeDetailsOpen),Y(y,r),Y(x,c),X(S,`hidden`,!Q.noticeDetailsOpen),Y(T,G(i)),E.disabled=Q.removed===null,Y(D,u),te.disabled=!Q.hasPhotos,Y(ne,f),X(re,`hidden`,Q.hasPhotos),Y(ie,p)},[()=>$(`Add images...`),()=>$(`or drop photos anywhere on this page`),()=>$(`Everything runs in your browser. Your photos are never uploaded.`),()=>$(`Details`),()=>$(`Dismiss`),()=>$(`Undo remove`),()=>$(`Remove all`),()=>$(`No photos yet. Add a few and the collage builds itself.`)]),K(`click`,o,()=>Q.chooseFiles()),K(`click`,v,()=>Q.noticeDetailsOpen=!Q.noticeDetailsOpen),K(`click`,b,()=>Q.hideNotice()),K(`click`,E,()=>Q.undoRemove()),K(`click`,te,()=>Q.removeAll()),J(e,a),He()}mr([`click`]);var lc=q(`<button type="button" class="chip"><span> </span> <small> </small></button>`),uc=q(`<p class="group-label"> </p> <!>`,1),dc=q(`<option> </option>`),fc=q(`<section class="tabpanel" id="panel-poster" role="tabpanel" aria-labelledby="tab-poster"><section aria-labelledby="pages-h" id="pages-block"><h3 id="pages-h"> </h3> <p class="hint" id="pages-count"> </p> <div class="field"><span> </span> <div class="stepper"><button type="button" id="per-page-less" class="sq"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path></svg></button> <input id="per-page" type="number" step="1" inputmode="numeric"/> <button type="button" id="per-page-more" class="sq"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></button></div></div> <div class="button-row"><button type="button" id="add-page"> </button> <button type="button" id="spread-pages"> </button></div> <p class="hint"> </p></section> <section aria-labelledby="size-h"><h3 id="size-h"> </h3> <fieldset id="size-choices" class="choices group" aria-labelledby="size-h"><!> <p class="group-label"> </p> <button type="button" class="chip" data-choice="post"><span> </span> <small> </small></button> <button type="button" class="chip wide-chip" data-choice="custom"><span> </span></button></fieldset> <fieldset class="seg group" id="orientation" aria-label="Orientation"><button type="button" id="orient-landscape"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2"></rect></svg> <span> </span></button> <button type="button" id="orient-portrait"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="12" height="18" rx="2"></rect></svg> <span> </span></button></fieldset> <div class="size-row"><label class="field"><span><span> </span> (px)</span> <input id="width" type="number" min="1" step="1" inputmode="numeric"/></label> <span class="times" aria-hidden="true">×</span> <label class="field"><span><span> </span> (px)</span> <input id="height" type="number" min="1" step="1" inputmode="numeric"/></label></div> <div id="split-controls" class="split-controls"><div class="field"><span> </span> <div class="stepper"><button type="button" id="split-less" class="sq" aria-label="Fewer images"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path></svg></button> <input id="split-count" type="number" min="2" max="20" step="1" inputmode="numeric"/> <button type="button" id="split-more" class="sq" aria-label="More images"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></button></div></div> <label class="field"><span> </span> <input id="split-size" type="number" min="16" step="1" inputmode="numeric"/></label> <p id="split-hint" class="hint"> </p></div> <p id="book-size-hint" class="hint"> </p> <p id="size-note" class="hint"> </p> <p id="split-note" class="hint"> </p> <label class="sr-only"><span> </span> <select id="preset" tabindex="-1"><!><option>—</option></select></label></section></section>`);function pc(e,t){Ve(t,!0);let n=F(()=>Q.portrait?`portrait`:`landscape`),r=F(()=>Ms(Q.settings.width,Q.settings.height)),i=F(()=>Os(Q.settings.width,Q.settings.height)),a={screen:`Screen`,print:`Print`},o=F(()=>[`screen`,`print`].map(e=>({group:e,choices:ks.filter(t=>t.group===e)}))),s=F(()=>Q.settings.splitImages),c=F(()=>Q.settings.height);function l(e){let t=Number(e.querySelector(`#width`).value),n=Number(e.querySelector(`#height`).value);Q.customSize=!0,Q.commitSize(t,n)}let u;var d=fc(),f=z(d),p=z(f),m=B(p,!0),h=V(p,2),g=B(h,!0),_=V(h,2),v=z(_),y=B(v,!0),b=V(v,2),x=z(b),S=V(x,2);Ur(S,(e,t)=>Zs?.(e,t),()=>({value:String(Q.perPage),again:Q.sizeEpoch}));var C=V(S,2);N(b),N(_);var w=V(_,2),T=z(w),ee=B(T,!0),E=V(T,2),D=B(E,!0);N(w);var te=B(V(w,2),!0);N(f);var ne=V(f,2),re=z(ne),ie=B(re,!0),O=V(re,2),ae=z(O);Lr(ae,17,()=>G(o),({group:e,choices:t})=>e,(e,t)=>{let r=()=>G(t).group,i=()=>G(t).choices;var o=uc(),s=en(o),c=B(s,!0);Lr(V(s,2),17,i,e=>e.id,(e,t)=>{let r=F(()=>As(G(t),G(n)));var i=lc(),a=z(i),o=B(a,!0),s=B(V(a,2));N(i),H(e=>{X(i,`data-choice`,G(t).id),X(i,`aria-pressed`,Q.activeSize===G(t).id),Y(o,e),Y(s,`${G(r).width??``} × ${G(r).height??``}`)},[()=>$(G(t).label)]),K(`click`,i,()=>Q.chooseNamedSize(G(t).id)),J(e,i)}),H(e=>Y(c,e),[()=>$(a[r()])]),J(e,o)});var k=V(ae,2),oe=B(k,!0),se=V(k,2),ce=z(se),le=B(ce,!0),A=B(V(ce,2),!0);N(se);var ue=V(se,2),de=B(z(ue),!0);N(ue),N(O);var fe=V(O,2),pe=z(fe),me=B(V(z(pe),2),!0);N(pe);var j=V(pe,2),he=B(V(z(j),2),!0);N(j),N(fe);var M=V(fe,2),ge=z(M),_e=z(ge),ye=B(z(_e),!0);ve(),N(_e);var be=V(_e,2);Ur(be,(e,t)=>Zs?.(e,t),()=>({value:String(Q.settings.width),again:Q.sizeEpoch})),N(ge);var xe=V(ge,4),Se=z(xe),Ce=B(z(Se),!0);ve(),N(Se);var we=V(Se,2);Ur(we,(e,t)=>Zs?.(e,t),()=>({value:String(Q.settings.height),again:Q.sizeEpoch})),N(xe),N(M),bi(M,e=>u=e,()=>u);var Te=V(M,2),Ee=z(Te),De=z(Ee),Oe=B(De,!0),ke=V(De,2),Ae=z(ke),je=V(Ae,2);Ur(je,(e,t)=>Zs?.(e,t),()=>({value:String(G(s)),again:Q.sizeEpoch}));var Me=V(je,2);N(ke),N(Ee);var Ne=V(Ee,2),Pe=z(Ne),Fe=B(Pe,!0),Ie=V(Pe,2);Ur(Ie,(e,t)=>Zs?.(e,t),()=>({value:String(G(c)),again:Q.sizeEpoch})),N(Ne);var Le=B(V(Ne,2),!0);N(Te);var Re=V(Te,2),ze=B(Re,!0),Be=V(Re,2),Ue=B(Be,!0),We=V(Be,2),Ge=B(We,!0),Ke=V(We,2),qe=z(Ke),Je=B(qe,!0),P=V(qe,2),Ye=z(P);Lr(Ye,19,()=>Ds,e=>e.label,(e,t,n)=>{var r=dc(),i=B(r,!0),a={};H(e=>{Y(i,G(t).label),a!==(a=e)&&(r.value=(r.__value=a)??``)},[()=>String(G(n))]),J(e,r)});var Xe=V(Ye);Xe.value=Xe.__value=`custom`,N(P),Ur(P,(e,t)=>Zs?.(e,t),()=>({value:G(i)>=0?String(G(i)):`custom`,again:Q.sizeEpoch})),N(Ke),N(ne),N(d),H((e,t,n,i,a,o,c,l,u,p,h,_,v,b,w,ne,re,O,ae,k,ce,fe,M)=>{X(d,`hidden`,Q.tab!==`poster`),X(f,`hidden`,!Q.book),Y(m,e),Y(g,t),Y(y,n),X(x,`aria-label`,i),x.disabled=Q.perPage<=Q.perPageMin,X(S,`min`,Q.perPageMin),X(S,`max`,Q.perPageMax),X(C,`aria-label`,a),C.disabled=Q.perPage>=Q.perPageMax,T.disabled=Q.pageCount>=Q.maxPages,Y(ee,o),E.disabled=!Q.hasPhotos,Y(D,c),Y(te,l),Y(ie,u),Y(oe,p),X(se,`aria-pressed`,Q.activeSize===`post`),Y(le,h),Y(A,_),X(ue,`aria-pressed`,Q.activeSize===`custom`),Y(de,v),X(pe,`aria-pressed`,G(r)===`landscape`),pe.disabled=G(s)>1,Y(me,b),X(j,`aria-pressed`,G(r)===`portrait`),j.disabled=G(s)>1,Y(he,w),Y(ye,ne),be.disabled=G(s)>1,Y(Ce,re),we.disabled=G(s)>1,X(Te,`hidden`,G(s)<=1),Y(Oe,O),Ae.disabled=G(s)<=Q.splitMin,Me.disabled=G(s)>=Q.splitMax,Y(Fe,ae),Y(Le,k),X(Re,`hidden`,!Q.book),Y(ze,ce),Y(Ue,Q.sizeNote),X(We,`hidden`,G(s)<=1),Y(Ge,fe),Y(Je,M)},[()=>$(`Pages`),()=>$(`%(pages)s page(s), %(photos)s photo(s)`,{pages:Q.pageCount,photos:Q.photos.length}),()=>$(`Photos per page`),()=>$(`Fewer photos per page`),()=>$(`More photos per page`),()=>$(`Add page`),()=>$(`Spread evenly`),()=>$(`New photos fill the pages in order and a page is added when all are full. Each page is saved as its own image; several are saved as a zip.`),()=>$(`Output image size`),()=>$(`Social`),()=>$(`Instagram post`),()=>$(`Several square images`),()=>$(`Custom`),()=>$(`Landscape`),()=>$(`Portrait`),()=>$(`Width`),()=>$(`Height`),()=>$(`Number of images`),()=>$(`Size of each image (px)`),()=>$(`The collage is made as one wide picture and cut into %(n)s squares when you save. Use Columns to change how it is arranged.`,{n:G(s)}),()=>$(`In a book, this is the size of each page.`),()=>$(`Dashed lines mark where the collage is split into %(n)s images of %(px)s × %(px)s pixels. They are saved as a zip, numbered _1 to _%(n)s from left to right.`,{n:G(s),px:G(c)}),()=>$(`Apply a template:`)]),K(`click`,x,()=>Q.setPerPage(Q.perPage-1)),K(`change`,S,e=>{Q.setPerPage(Number(e.currentTarget.value)),e.currentTarget.value=String(Q.perPage)}),K(`click`,C,()=>Q.setPerPage(Q.perPage+1)),K(`click`,T,()=>Q.addPage()),K(`click`,E,()=>Q.spreadPhotos()),K(`click`,se,()=>Q.chooseInstagramPost()),K(`click`,ue,()=>{Q.chooseCustomSize(),u.querySelector(`#width`)?.focus()}),K(`click`,pe,()=>Q.turn(!1)),K(`click`,j,()=>Q.turn(!0)),K(`input`,be,e=>l(e.currentTarget.closest(`.size-row`))),K(`change`,be,e=>l(e.currentTarget.closest(`.size-row`))),K(`input`,we,e=>l(e.currentTarget.closest(`.size-row`))),K(`change`,we,e=>l(e.currentTarget.closest(`.size-row`))),K(`click`,Ae,()=>Q.setSplit(G(s)-1,G(c),!0)),K(`change`,je,e=>{let t=Aa(Number(e.currentTarget.value));t===0?e.currentTarget.value=String(G(s)):Q.setSplit(t,G(c),!0)}),K(`click`,Me,()=>Q.setSplit(G(s)+1,G(c),!0)),K(`change`,Ie,e=>{let t=Number(e.currentTarget.value);Number.isFinite(t)&&t>=16?Q.setSplit(G(s),t,!0):e.currentTarget.value=String(G(c))}),K(`change`,P,e=>{let t=Ds[Number(e.currentTarget.value)];Q.customSize=!1,t&&Q.chooseSize(t.width,t.height)}),J(e,d),He()}mr([`click`,`change`,`input`]);var mc=q(`<button type="button" id="save-page" class="wide"> </button>`),hc=q(`<div class="save-block" id="save-block"><div class="sheet-head only-narrow"><span class="grab" aria-hidden="true"></span> <h2> </h2> <button type="button" id="save-close" class="link"> </button></div> <p id="save-summary" class="meta"> </p> <div class="save-opts"><fieldset class="seg group" id="format-seg" aria-label="Format"><button type="button" id="format-png">PNG</button> <button type="button" id="format-jpeg">JPEG</button></fieldset> <select id="format" class="sr-only" tabindex="-1" aria-label="Format"><option>PNG</option><option>JPEG</option></select> <label class="field" id="quality-field"><span class="rowhead"><span> </span> <output id="quality-output" for="quality"> </output></span> <input id="quality" class="range" type="range" min="10" max="100" step="1"/></label></div> <button type="button" id="save" class="primary wide"> </button> <!></div>`);function gc(e,t){Ve(t,!0);let n=Ci(t,`block`,15),r=F(()=>Q.settings.format===`jpeg`?`JPEG`:`PNG`),i=F(()=>Q.pageCounts.filter(e=>e>0).length),a=F(()=>Q.book?G(i)>1?$(`ZIP of %(n)s %(kind)s images, %(w)s × %(h)s px each`,{n:G(i),kind:G(r),w:Q.settings.width,h:Q.settings.height}):`${G(r)}, ${Q.settings.width} × ${Q.settings.height} px`:Q.settings.splitImages>1?$(`ZIP of %(n)s %(kind)s images, %(px)s × %(px)s px each`,{n:Q.settings.splitImages,kind:G(r),px:Q.settings.height}):`${G(r)}, ${Q.settings.width} × ${Q.settings.height} px`),o=()=>Math.max(0,Q.pageCounts.findIndex(e=>e>0)),s=F(()=>Math.round(Q.settings.jpegQuality*100));var c=hc(),l=z(c),u=V(z(l),2),d=B(u,!0),f=V(u,2),p=B(f,!0);N(l),Ur(l,(e,t)=>Ys?.(e,t),()=>()=>Q.setTab(`save`,!0));var m=V(l,2),h=B(m,!0),g=V(m,2),_=z(g),v=z(_),y=V(v,2);N(_);var b=V(_,2),x=z(b);x.value=x.__value=`png`;var S=V(x);S.value=S.__value=`jpeg`,N(b),Ur(b,(e,t)=>Zs?.(e,t),()=>({value:Q.settings.format}));var C=V(b,2),w=z(C),T=z(w),ee=B(T,!0),E=B(V(T,2));N(w);var D=V(w,2);let te;Ur(D,(e,t)=>Zs?.(e,t),()=>({value:String(G(s)),again:Q.restoreEpoch,sticky:!0})),N(C),N(g);var ne=V(g,2),re=B(ne,!0),ie=V(ne,2),O=e=>{var t=mc(),n=B(t,!0);H(e=>{t.disabled=!Q.hasPhotos,Y(n,e)},[()=>$(`Save this page`)]),K(`click`,t,()=>void Q.save(Q.selected===null?o():Q.selectedPage)),J(e,t)};Mr(ie,e=>{Q.book&&e(O)}),N(c),bi(c,e=>n(e),()=>n()),H((e,t,n,r)=>{Y(d,e),Y(p,t),Y(h,G(a)),X(v,`aria-pressed`,Q.settings.format===`png`),X(y,`aria-pressed`,Q.settings.format===`jpeg`),X(C,`hidden`,Q.settings.format!==`jpeg`),Y(ee,n),Y(E,`${G(s)??``}%`),te=ei(D,``,te,{"--p":`${(G(s)-10)/90*100}%`}),ne.disabled=!Q.hasPhotos,Y(re,r)},[()=>$(`Save image`),()=>$(`Close`),()=>$(`JPEG quality`),()=>Q.book?$(`Save book...`):$(`Save poster...`)]),K(`click`,f,()=>Q.setTab(`save`,!0)),K(`click`,v,()=>Q.settings.format=`png`),K(`click`,y,()=>Q.settings.format=`jpeg`),K(`change`,b,e=>Q.settings.format=e.currentTarget.value===`jpeg`?`jpeg`:`png`),K(`input`,D,e=>Q.settings.jpegQuality=Number(e.currentTarget.value)/100),K(`click`,ne,()=>void Q.save()),J(e,c),He()}mr([`click`,`change`,`input`]);var _c=q(`<option> </option>`),vc=q(`<label class="field move-page" for="move-page"><span> </span> <select id="move-page"></select></label>`),yc=q(`<div class="crop-tools" id="crop-tools"><label for="crop-zoom"> </label> <input id="crop-zoom" type="range" min="1" step="0.01"/> <button type="button" id="crop-reset"> </button> <p class="hint"> </p></div>`),bc=q(`<section class="dock" id="selected-dock" aria-label="Selected photo"><div class="rowhead"><h3 id="dock-name"> </h3> <button type="button" id="dock-done" class="link"> </button></div> <fieldset id="span-group" class="span-group"><legend class="sr-only"> </legend> <button type="button" id="span-wider"> </button> <button type="button" id="span-taller"> </button> <button type="button" id="span-reset"> </button> <button type="button" id="crop-toggle"> </button> <button type="button" id="remove-selected" class="danger"> </button></fieldset> <!> <!></section>`);function xc(e,t){Ve(t,!0);let n=F(()=>Q.selectedPhoto?.span??{columns:1,rows:1}),r=F(()=>Q.selectedPhoto?.crop),i=F(()=>G(r)?.zoom??1),a=F(()=>G(n).rows>1?`${$(`Taller`)} ×${G(n).rows}`:$(`Taller`));var o=bc(),s=z(o),c=z(s),l=B(c,!0),u=V(c,2),d=B(u,!0);N(s);var f=V(s,2),p=z(f),m=B(p,!0),h=V(p,2),g=B(h,!0),_=V(h,2),v=B(_,!0),y=V(_,2),b=B(y,!0),x=V(y,2),S=B(x,!0),C=V(x,2),w=B(C,!0);N(f);var T=V(f,2),ee=e=>{var t=vc(),n=z(t),r=B(n,!0),i=V(n,2);Lr(i,20,()=>Array.from({length:Q.pageCount},(e,t)=>t),e=>e,(e,t)=>{var n=_c(),r=B(n,!0),i={};H((e,t)=>{Y(r,e),i!==(i=t)&&(n.value=(n.__value=i)??``)},[()=>$(`Page %(n)s`,{n:t+1}),()=>String(t)]),J(e,n)}),N(i);var a;ii(i),N(t),H((e,t)=>{Y(r,e),a!==(a=t)&&(i.value=(i.__value=a)??``,ri(i,a))},[()=>$(`Page`),()=>String(Q.selectedPage)]),K(`change`,i,e=>Q.moveSelectedToPage(Number(e.currentTarget.value))),J(e,t)};Mr(T,e=>{Q.book&&e(ee)});var E=V(T,2),D=e=>{var t=yc(),n=z(t),a=B(n,!0),o=V(n,2);di(o);var s=V(o,2),c=B(s,!0),l=B(V(s,2),!0);N(t),H((e,t,n)=>{Y(a,e),X(o,`max`,Q.maxZoom),fi(o,G(i)),s.disabled=!G(r),Y(c,t),Y(l,n)},[()=>$(`Zoom`),()=>$(`Reset crop`),()=>$(`Drag the photo to move it, scroll or use the slider to zoom.`)]),K(`input`,o,e=>Q.zoomSelectedCrop(Number(e.currentTarget.value))),K(`click`,s,()=>Q.resetCrop()),J(e,t)};Mr(E,e=>{Q.cropping&&e(D)}),N(o),H((e,t,r,i,s,c)=>{X(o,`hidden`,!Q.selectedPhoto),Y(l,Q.selectedPhoto?.name??``),Y(d,e),Y(m,t),X(h,`aria-pressed`,G(n).columns===2),Y(g,r),Y(v,G(a)),y.disabled=G(n).columns===1&&G(n).rows===1,Y(b,i),X(x,`aria-pressed`,Q.cropping),Y(S,s),Y(w,c)},[()=>$(`Done`),()=>$(`Size of the selected photo`),()=>$(`Wider`),()=>$(`Normal size`),()=>$(`Crop`),()=>$(`Remove selected photo`)]),K(`click`,u,()=>Q.deselect()),K(`click`,h,()=>Q.toggleWider()),K(`click`,_,()=>Q.cycleTaller()),K(`click`,y,()=>Q.resetSpan()),K(`click`,x,()=>Q.toggleCrop()),K(`click`,C,()=>Q.removeSelected()),J(e,o),He()}mr([`click`,`change`,`input`]);var Sc=q(`<button type="button"></button>`),Cc=q(`<button type="button" class="card"><span></span> <span> </span></button>`),wc=q(`<section class="tabpanel" id="panel-style" role="tabpanel" aria-labelledby="tab-style"><section aria-labelledby="layout-h"><h3 id="layout-h"> </h3> <fieldset class="cards group" id="layout-cards" aria-labelledby="layout-h"><button type="button" class="card" id="layout-mosaic"><svg viewBox="0 0 40 30" aria-hidden="true"><rect x="1" y="1" width="8" height="12" rx="1.5"></rect><rect x="1" y="15" width="8" height="14" rx="1.5"></rect><rect x="11" y="1" width="8" height="16" rx="1.5"></rect><rect x="11" y="19" width="8" height="10" rx="1.5"></rect><rect x="21" y="1" width="8" height="9" rx="1.5"></rect><rect x="21" y="12" width="8" height="17" rx="1.5"></rect><rect x="31" y="1" width="8" height="13" rx="1.5"></rect><rect x="31" y="16" width="8" height="13" rx="1.5"></rect></svg> <b> </b> <small> </small></button> <button type="button" class="card" id="layout-gallery"><svg viewBox="0 0 40 30" aria-hidden="true"><rect x="1" y="1" width="17" height="16" rx="1.5"></rect><rect x="1" y="19" width="8" height="10" rx="1.5"></rect><rect x="11" y="19" width="7" height="10" rx="1.5"></rect><rect x="20" y="1" width="19" height="9" rx="1.5"></rect><rect x="20" y="12" width="9" height="17" rx="1.5"></rect><rect x="31" y="12" width="8" height="17" rx="1.5"></rect></svg> <b> </b> <small> </small></button> <button type="button" class="card wide-card" id="layout-book"><svg viewBox="0 0 40 30" aria-hidden="true"><rect x="1" y="3" width="11" height="24" rx="1.5"></rect><rect x="14.5" y="3" width="11" height="24" rx="1.5"></rect><rect x="28" y="3" width="11" height="24" rx="1.5"></rect></svg> <b> </b> <small> </small></button></fieldset> <fieldset class="seg group" id="book-style"><button type="button" id="book-style-mosaic"> </button> <button type="button" id="book-style-gallery"> </button></fieldset> <div id="columns-block" class="columns-block"><label class="field" for="columns"><span> </span></label> <div class="stepper"><button type="button" id="columns-less" class="sq" aria-label="Fewer columns"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path></svg></button> <input id="columns" type="number" min="1" step="1" inputmode="numeric"/> <button type="button" id="columns-more" class="sq" aria-label="More columns"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></button> <button type="button" id="columns-auto"> </button></div> <p id="columns-note" class="hint"> </p></div> <p id="gallery-note" class="hint"> </p> <p class="trim"><strong id="crop-note"> </strong> <span class="hint"> </span></p> <button type="button" id="regenerate" class="wide"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"></path><path d="M20 4v7h-7"></path></svg> <span> </span></button> <button type="button" id="shuffle-pages" class="wide"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h11l-3-3M20 17H9l3 3"></path></svg> <span> </span></button></section> <section aria-labelledby="bw-h"><div class="rowhead"><h3 id="bw-h"> </h3> <output id="border-output" for="border-width"> </output></div> <input id="border-width" class="range" type="range" min="0" max="20" step="0.1" aria-labelledby="bw-h"/> <p class="hint"> </p></section> <section aria-labelledby="bc-h"><h3 id="bc-h"> </h3> <fieldset class="swatches group" id="swatches" aria-labelledby="bc-h"></fieldset> <label class="custom-colour"><span> </span> <input id="border-color" type="color"/></label></section> <section aria-labelledby="cs-h"><h3 id="cs-h"> </h3> <fieldset class="cards corners group" id="corner-cards" aria-labelledby="cs-h"></fieldset> <label class="sr-only"><span> </span> <select id="corner-style" tabindex="-1"><option> </option><option> </option><option> </option></select></label></section> <section><label class="switch" for="outer-border"><span> </span> <input id="outer-border" type="checkbox"/></label> <p class="hint"> </p></section> <details id="technical" class="technical"><summary> </summary> <label class="field"><span> </span> <input id="seed" type="number" min="0" max="4294967295" step="1" inputmode="numeric"/></label> <p class="hint"> </p></details></section>`);function Tc(e,t){Ve(t,!0);let n=[{name:`White`,color:`#ffffff`},{name:`Black`,color:`#111111`},{name:`Cream`,color:`#f1e7d0`},{name:`Sage`,color:`#a3b18a`},{name:`Dusty blue`,color:`#8aa1b5`},{name:`Terracotta`,color:`#c8785a`}],r=[{value:`none`,label:`Square`},{value:`slight`,label:`Slight`},{value:`rounded`,label:`Rounded`}],i=F(()=>Q.layoutStyle===`gallery`),a=F(()=>Math.round(Q.settings.borderWidth*1e3)/10),o=(e,t,n)=>`${Math.min(100,Math.max(0,(e-t)/(n-t)*100))}%`,s=L(0);function c(e){let t=e.trim();Q.setColumns(t===``?void 0:Ii(Number(t)))}function l(e){let t=Number(e);Q.settings.borderWidth=Number.isFinite(t)?Math.min(20,Math.max(0,t))/100:0}var u=wc(),d=z(u),f=z(d),p=B(f,!0),m=V(f,2),h=z(m),g=V(z(h),2),_=B(g,!0),v=B(V(g,2),!0);N(h);var y=V(h,2),b=V(z(y),2),x=B(b,!0),S=B(V(b,2),!0);N(y);var C=V(y,2),w=V(z(C),2),T=B(w,!0),ee=B(V(w,2),!0);N(C),N(m);var E=V(m,2),D=z(E),te=B(D,!0),ne=V(D,2),re=B(ne,!0);N(E);var ie=V(E,2),O=z(ie),ae=B(z(O),!0);N(O);var k=V(O,2),oe=z(k),se=V(oe,2);Ur(se,(e,t)=>Zs?.(e,t),()=>({value:Q.columns===void 0?``:String(Q.columns),again:G(s)}));var ce=V(se,2),le=V(ce,2),A=B(le,!0);N(k);var ue=B(V(k,2),!0);N(ie);var de=V(ie,2),fe=B(de,!0),pe=V(de,2),me=z(pe),j=B(me,!0),he=B(V(me,2),!0);N(pe);var M=V(pe,2),ge=B(V(z(M),2),!0);N(M);var _e=V(M,2),ve=B(V(z(_e),2),!0);N(_e),N(d);var ye=V(d,2),be=z(ye),xe=z(be),Se=B(xe,!0),Ce=B(V(xe,2));N(be);var we=V(be,2);let Te;Ur(we,(e,t)=>Zs?.(e,t),()=>({value:String(G(a)),again:Q.restoreEpoch,sticky:!0}));var Ee=B(V(we,2),!0);N(ye);var De=V(ye,2),Oe=z(De),ke=B(Oe,!0),Ae=V(Oe,2);Lr(Ae,21,()=>n,({name:e,color:t})=>t,(e,t)=>{let n=()=>G(t).name,r=()=>G(t).color;var i=Sc();let a;H(e=>{X(i,`data-color`,r()),X(i,`aria-label`,n()),X(i,`aria-pressed`,e),a=ei(i,``,a,{background:r()})},[()=>Q.settings.borderColor.toLowerCase()===r()]),K(`click`,i,()=>Q.settings.borderColor=r()),J(e,i)}),N(Ae);var je=V(Ae,2),Me=z(je),Ne=B(Me,!0),Pe=V(Me,2);di(Pe),N(je),N(De);var Fe=V(De,2),Ie=z(Fe),Le=B(Ie,!0),Re=V(Ie,2);Lr(Re,21,()=>r,({value:e,label:t})=>e,(e,t)=>{let n=()=>G(t).value,r=()=>G(t).label;var i=Cc(),a=z(i),o=B(V(a,2),!0);N(i),H(e=>{X(i,`data-corner`,n()),X(i,`aria-pressed`,Q.settings.cornerStyle===n()),Qr(a,1,`shape ${n()??``}`),Y(o,e)},[()=>$(r())]),K(`click`,i,()=>Q.settings.cornerStyle=n()),J(e,i)}),N(Re);var ze=V(Re,2),Be=z(ze),Ue=B(Be,!0),We=V(Be,2),Ge=z(We),Ke=B(Ge,!0);Ge.value=Ge.__value=`none`;var qe=V(Ge),Je=B(qe,!0);qe.value=qe.__value=`slight`;var P=V(qe),Ye=B(P,!0);P.value=P.__value=`rounded`,N(We),Ur(We,(e,t)=>Zs?.(e,t),()=>({value:Q.settings.cornerStyle})),N(ze),N(Fe);var Xe=V(Fe,2),Ze=z(Xe),Qe=z(Ze),$e=B(Qe,!0),et=V(Qe,2);di(et),N(Ze);var tt=B(V(Ze,2),!0);N(Xe);var nt=V(Xe,2),rt=z(nt),it=B(rt,!0),at=V(rt,2),ot=z(at),st=B(ot,!0),ct=V(ot,2);Ur(ct,(e,t)=>Zs?.(e,t),()=>({value:String(Q.seed)})),N(at);var lt=B(V(at,2),!0);N(nt),N(u),H((e,t,n,r,o,s,c,l,d,f,m,g,b,w,O,k,oe,ce,le,pe,me,M,N,ye,be,xe,De,Oe,Ae,je,Me,Fe,Ie,Re)=>{X(u,`hidden`,Q.tab!==`style`),Y(p,e),X(h,`aria-pressed`,!G(i)&&!Q.book),Y(_,t),Y(v,n),X(y,`aria-pressed`,G(i)&&!Q.book),Y(x,r),Y(S,o),X(C,`aria-pressed`,Q.book),Y(T,s),Y(ee,c),X(E,`aria-label`,l),X(E,`hidden`,!Q.book),X(D,`aria-pressed`,!G(i)),Y(te,d),X(ne,`aria-pressed`,G(i)),Y(re,f),X(ie,`hidden`,G(i)),Y(ae,m),X(se,`max`,100),X(se,`placeholder`,g),Y(A,b),Y(ue,w),X(de,`hidden`,!G(i)),Y(fe,O),Y(j,k),Y(he,oe),Y(ge,ce),X(_e,`hidden`,!Q.book),Y(ve,le),Y(Se,pe),Y(Ce,`${G(a)??``}%`),Te=ei(we,``,Te,{"--p":me}),Y(Ee,M),Y(ke,N),Y(Ne,ye),fi(Pe,Q.settings.borderColor),Y(Le,be),Y(Ue,xe),Y(Ke,De),Y(Je,Oe),Y(Ye,Ae),Y($e,je),pi(et,Q.settings.outerBorder),Y(tt,Me),Y(it,Fe),Y(st,Ie),Y(lt,Re)},[()=>$(`Layout`),()=>$(`Mosaic`),()=>$(`Photos fill columns of different heights.`),()=>$(`Gallery`),()=>$(`The poster is split into panels, one per photo.`),()=>$(`Book`),()=>$(`Several pages in a row, each saved as its own image.`),()=>$(`Page style`),()=>$(`Mosaic pages`),()=>$(`Gallery pages`),()=>$(`Columns`),()=>$(`Auto`),()=>$(`Automatic`),()=>Q.columnsInUse===void 0?``:$(`Columns in use: %(n)s`,{n:Q.columnsInUse}),()=>$(`Gallery sizes its panels itself.`),()=>Q.layout?$(`%(pct)s% of each photo is trimmed to fit.`,{pct:Q.cropPercent}):``,()=>$(`Lower means more of each photo is visible.`),()=>$(`Shuffle layout`),()=>$(`Shuffle photos between pages`),()=>$(`Border thickness`),()=>o(G(a),0,20),()=>$(`A share of the poster's longer side. 0 removes the border.`),()=>$(`Border colour`),()=>$(`Custom…`),()=>$(`Corner style`),()=>$(`Corner style`),()=>$(`None`),()=>$(`Slightly rounded`),()=>$(`Rounded`),()=>$(`Border around the whole collage`),()=>$(`Turn off to keep the border only between photos.`),()=>$(`Technical configuration`),()=>$(`Seed`),()=>$(`The same photos, seed and number of columns always give the same layout. When photos are added, the seed of the best of 30 tries is shown here.`)]),K(`click`,h,()=>Q.chooseLayout(`mosaic`)),K(`click`,y,()=>Q.chooseLayout(`gallery`)),K(`click`,C,()=>Q.chooseBook()),K(`click`,D,()=>Q.chooseBookStyle(`mosaic`)),K(`click`,ne,()=>Q.chooseBookStyle(`gallery`)),K(`click`,oe,()=>Q.stepColumns(-1)),K(`input`,se,e=>c(e.currentTarget.value)),K(`change`,se,e=>{c(e.currentTarget.value),zt(s)}),K(`click`,ce,()=>Q.stepColumns(1)),K(`click`,le,()=>Q.setColumns(void 0)),K(`click`,M,()=>Q.shuffle()),K(`click`,_e,()=>Q.shufflePages()),K(`input`,we,e=>l(e.currentTarget.value)),K(`input`,Pe,e=>Q.settings.borderColor=e.currentTarget.value),K(`change`,We,e=>{let t=e.currentTarget.value;Q.settings.cornerStyle=t===`slight`||t===`rounded`?t:`none`}),K(`change`,et,e=>Q.settings.outerBorder=e.currentTarget.checked),K(`change`,ct,e=>{Q.setSeed(Number(e.currentTarget.value))||(e.currentTarget.value=String(Q.seed))}),J(e,u),He()}mr([`click`,`input`,`change`]);var Ec=q(`<option> </option>`),Dc=q(`<aside class="side panel" aria-label="Controls"><div class="brand"><h1>Collage Creator</h1> <div class="brand-actions"><button type="button" id="help-open-head" class="icon-btn help-btn" aria-haspopup="dialog" aria-label="Help">?</button> <button type="button" id="menu-open" class="icon-btn menu-btn" aria-controls="util" aria-label="Menu: language and about"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"></path></svg></button></div></div> <div id="tabs" role="tablist" aria-label="Settings"><button type="button" role="tab" id="tab-photos" aria-controls="panel-photos"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><circle cx="9" cy="10" r="1.5"></circle><path d="m21 16-5-5-9 8"></path></svg> <span><span class="num">1.</span><span> </span></span></button> <button type="button" role="tab" id="tab-poster" aria-controls="panel-poster"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M12 3v18M3 12h9M12 8h9"></path></svg> <span><span class="num">2.</span><span> </span></span></button> <button type="button" role="tab" id="tab-style" aria-controls="panel-style"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5S14 15 15 15h2a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"></path></svg> <span><span class="num">3.</span><span> </span></span></button> <button type="button" role="tab" id="tab-save" class="tab-save" aria-controls="save-block"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"></path></svg> <span> </span></button></div> <div class="sheet" id="sheet"><div class="sheet-head"><span class="grab" aria-hidden="true"></span> <h2 id="sheet-title"> </h2> <button type="button" id="sheet-close" class="link"> </button></div> <!> <!> <!></div> <!> <!> <div class="util" id="util"><div class="util-row"><label class="inline"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"></path></svg> <span class="sr-only"> </span> <select id="language"></select></label> <button type="button" id="about-open" class="link"> </button></div></div></aside>`);function Oc(e,t){Ve(t,!0);let n={photos:`Photos`,poster:`Poster`,style:`Style`,save:`Save image`},r,i=L(void 0),a,o=L(!1);pn(()=>{if(Q.riseToken===0)return;let e=Q.tab===`save`?G(i):r;e&&(e.classList.remove(`rise`),e.offsetWidth,e.classList.add(`rise`))}),pn(()=>{Q.tab,r.scrollTop=0,R(o,!1)});function s(e){if(e.key!==`ArrowRight`&&e.key!==`ArrowLeft`)return;let t=[...a.querySelectorAll(`[role="tab"]`)].filter(e=>e.offsetParent!==null),n=t.map(e=>e.id.replace(`tab-`,``)),r=n[(n.indexOf(Q.tab)+(e.key===`ArrowRight`?1:-1)+n.length)%n.length];r&&(e.preventDefault(),Q.setTab(r,!1),t[n.indexOf(r)]?.focus())}function c(e){try{let t=e.replace(`_`,`-`);return new Intl.DisplayNames([t],{type:`language`}).of(t)??e}catch{return e}}let l=e=>e===Q.tab&&(!Q.narrow||Q.sheetOpen);var u=Dc();pr(`click`,Kt,e=>{Q.menuOpen&&(e.target instanceof Node&&e.target.closest?.(`#util`)||Q.closeMenu())});var d=z(u),f=V(z(d),2),p=z(f),m=V(p,2);N(f),N(d);var h=V(d,2);let g;var _=z(h),v=V(z(_),2),y=B(V(z(v)),!0);N(v),N(_);var b=V(_,2),x=V(z(b),2),S=B(V(z(x)),!0);N(x),N(b);var C=V(b,2),w=V(z(C),2),T=B(V(z(w)),!0);N(w),N(C);var ee=V(C,2),E=B(V(z(ee),2),!0);N(ee),N(h),bi(h,e=>a=e,()=>a);var D=V(h,2),te=z(D),ne=V(z(te),2),re=B(ne,!0),ie=V(ne,2),O=B(ie,!0);N(te),Ur(te,(e,t)=>Ys?.(e,t),()=>()=>Q.setTab(Q.tab,!0));var ae=V(te,2);cc(ae,{});var k=V(ae,2);pc(k,{}),Tc(V(k,2),{}),N(D),bi(D,e=>r=e,()=>r);var oe=V(D,2);xc(oe,{});var se=V(oe,2);gc(se,{get block(){return G(i)},set block(e){R(i,e,!0)}});var ce=V(se,2),le=z(ce),A=z(le),ue=V(z(A),2),de=B(ue,!0),fe=V(ue,2);Lr(fe,20,()=>Ya,e=>e,(e,t)=>{var n=Ec(),r=B(n,!0),i={};H(e=>{Y(r,e),i!==(i=t)&&(n.value=(n.__value=i)??``)},[()=>c(t)]),J(e,n)}),N(fe);var pe;ii(fe),N(A);var me=V(A,2),j=B(me,!0);N(le),N(ce),N(u),H((e,t,n,r,i,a,s,c,l,u,d,f)=>{X(m,`aria-expanded`,Q.menuOpen),g=Qr(h,1,`tabs`,null,g,{lifted:G(o)}),X(_,`aria-selected`,e),X(_,`tabindex`,Q.tab===`photos`?0:-1),Y(y,t),X(b,`aria-selected`,n),X(b,`tabindex`,Q.tab===`poster`?0:-1),Y(S,r),X(C,`aria-selected`,i),X(C,`tabindex`,Q.tab===`style`?0:-1),Y(T,a),X(ee,`aria-selected`,s),X(ee,`tabindex`,Q.tab===`save`?0:-1),Y(E,c),Y(re,l),Y(O,u),Y(de,d),pe!==(pe=Q.lang)&&(fe.value=(fe.__value=pe)??``,ri(fe,pe)),Y(j,f)},[()=>l(`photos`),()=>$(`Photos`),()=>l(`poster`),()=>$(`Poster`),()=>l(`style`),()=>$(`Style`),()=>l(`save`),()=>$(`Save`),()=>$(n[Q.tab]),()=>$(`Close`),()=>$(`Language`),()=>$(`About`)]),K(`click`,p,()=>Q.dialog=`help`),K(`click`,m,e=>{e.stopPropagation(),Q.menuOpen=!Q.menuOpen}),K(`keydown`,h,s),K(`click`,_,()=>Q.setTab(`photos`,!0)),K(`click`,b,()=>Q.setTab(`poster`,!0)),K(`click`,C,()=>Q.setTab(`style`,!0)),K(`click`,ee,()=>Q.setTab(`save`,!0)),pr(`scroll`,D,()=>R(o,r.scrollTop>1)),K(`click`,ie,()=>Q.setTab(Q.tab,!0)),K(`change`,fe,e=>Q.chooseLanguage(e.currentTarget.value)),K(`click`,me,()=>Q.dialog=`about`),J(e,u),He()}mr([`click`,`keydown`,`change`]);var kc=q(`<div class="restoring-stage" role="status"><progress></progress> <h2> </h2> <p> </p></div>`),Ac=q(`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><circle cx="9" cy="10" r="1.5"></circle><path d="m21 16-5-5-9 8"></path></svg> <h2> </h2> <p> </p> <button type="button" id="add-empty"> </button>`,1),jc=q(`<div id="canvas-box"><canvas id="preview" tabindex="0" role="application" aria-label="Collage preview. Use arrow keys to move between photos, Enter to pick one and Enter on another to swap them, Delete to remove the photo, Escape to cancel. Plus and minus zoom, Shift and arrow keys pan, zero fits the window. With a mouse, drag to pan, scroll to zoom, or choose Swap to click two photos and swap them."></canvas> <section id="empty-state" class="empty" aria-label="Drop photos here"><!></section></div>`);function Mc(e,t){Ve(t,!0);let n,r,i=L(0),a=L(0),o=L(!1),s=[],c={x:0,y:0},l=1,u=!1,d=-1,f=null,p=!1,m=null,h=!1,g=F(()=>Q.fitPoster({w:G(i),h:G(a)}));pn(()=>{Q.viewport={w:G(i),h:G(a)}});function _(e){return e.placements.map((e,t)=>({i:t,page:e.page??0,y:Math.round(e.cell.y*1e3),x:e.cell.x})).sort((e,t)=>e.page-t.page||e.y-t.y||e.x-t.x).map(e=>e.i)}function v(){u||(u=!0,r.dataset.pending=`1`,requestAnimationFrame(()=>{u=!1;try{y()}finally{r.dataset.pending=`0`}}))}function y(){let e={w:n.clientWidth,h:n.clientHeight},t=Q.fitPoster(e),i=Math.min(window.devicePixelRatio||1,2);r.width=Math.max(1,Math.round(e.w*i)),r.height=Math.max(1,Math.round(e.h*i));let a=r.getContext(`2d`);if(!a)return;let o=xs(t,Q.view),u=Ss(e,t,Q.view),d=Math.max(1,Math.round(o.w*i)),f=Math.max(1,Math.round(o.h*i)),p=Math.round(u.x*i),m=Math.round(u.y*i);c={x:p,y:m},l=d,r.dataset.poster=[p,m,d,f].map(e=>(e/i).toFixed(1)).join(`,`);let h=Q.selectedPhoto?.crop;r.dataset.crop=h?[h.zoom,h.x,h.y].map(e=>e.toFixed(3)).join(`,`):``;let g=Q.layout;if(!g){s=[];return}a.save(),a.shadowColor=`rgba(0, 0, 0, 0.35)`,a.shadowBlur=12*i,a.shadowOffsetY=2*i,a.fillStyle=`#ffffff`;for(let e of g.pages??[{x:0,w:1}]){let t=Math.round(e.x*d);a.fillRect(p+t,m,Math.round((e.x+e.w)*d)-t,f)}a.restore(),a.save(),a.translate(p,m);let v=Le(Q.settings);s=ss(a,d,f,{layout:g,thumbs:Q.photos.map(e=>e.thumb),crops:Q.photos.map(e=>e.crop),settings:v});let y=_(g)[Q.focused];if(Q.canvasFocused&&Q.focusRing&&y!==void 0){let e=s[y];e&&us(a,e,`#ff9d00`)}if(Q.selected!==null){let e=g.placements.findIndex(e=>e.photoIndex===Q.selected),t=s[e];t&&us(a,t,`#1f5fbf`)}if(a.restore(),g.pages&&b(a,g,{x:p,y:m,w:d,h:f},i),v.splitImages>1){let e=getComputedStyle(document.documentElement).getPropertyValue(`--sub`).trim()||`#3b3b37`;hs(a,{x:p,y:m,w:d,h:f},v.splitImages,i,e,Z(`Cut along the dashed lines: the collage is split into %(n)s images for the post.`,{n:v.splitImages}))}}function b(e,t,n,r){let i=getComputedStyle(document.documentElement).getPropertyValue(`--sub`).trim()||`#3b3b37`,a=t.pages??[];e.save(),e.fillStyle=i,e.font=`${13*r}px system-ui, sans-serif`,e.textAlign=`center`,e.textBaseline=`top`,a.forEach((t,o)=>{let s=n.x+Math.round(t.x*n.w),c=Math.round((t.x+t.w)*n.w)-Math.round(t.x*n.w),l=Q.pageCounts[o]??0,u=Z(`Page %(n)s of %(total)s`,{n:o+1,total:a.length}),d=l===0?`${u} · ${Z(`empty`)}`:u;e.fillText(d,s+c/2,n.y+n.h+10*r,c),l===0&&(e.setLineDash([6*r,4*r]),e.strokeStyle=i,e.lineWidth=1.5*r,e.strokeRect(s+.5*r,n.y+.5*r,c-r,n.h-r),e.setLineDash([]),e.fillText(Z(`Drop or move photos here`),s+c/2,n.y+n.h/2,c-16*r))});let o=Q.selected===null?void 0:Q.selectedPhoto?.bookPage,s=o===void 0?void 0:a[o];if(s){let t=n.x+Math.round(s.x*n.w),i=Math.round((s.x+s.w)*n.w)-Math.round(s.x*n.w);e.strokeStyle=`#1f5fbf`,e.lineWidth=3*r,e.strokeRect(t-2*r,n.y-2*r,i+4*r,n.h+4*r)}e.restore()}pn(()=>{Q.layout,Q.photos,Le(Q.settings),Q.view,Q.selected,Q.pageCounts,Q.cropping,Q.focused,Q.canvasFocused,Q.focusRing,Q.narrow,Q.lang,G(i),G(a),v()});function x(e,t){let n=r.getBoundingClientRect(),i=(e-n.left)/n.width*r.width-c.x,a=(t-n.top)/n.height*r.height-c.y;return s.findIndex(e=>i>=e.x&&i<e.x+e.w&&a>=e.y&&a<e.y+e.h)}function S(){f=null,R(o,!1)}function C(e){return Q.layout?.placements[e]?.photoIndex}function w(e){r.focus(),Q.focusRing=!1;let t=(Q.layout?_(Q.layout):[]).indexOf(x(e.clientX,e.clientY));if(t>=0&&(Q.focused=t),Q.cropping){let t=C(x(e.clientX,e.clientY));t===Q.selected?(m={x:e.clientX,y:e.clientY},r.setPointerCapture(e.pointerId),e.preventDefault()):t!==void 0&&(h=!0,Q.selectPhoto(t))}else Q.spaceHeld||Q.mode===`pan`?(f={x:e.clientX,y:e.clientY},r.setPointerCapture(e.pointerId),R(o,!0),e.preventDefault()):d=x(e.clientX,e.clientY)}function T(e){if(m){let t=r.getBoundingClientRect(),n=r.width/t.width/l;Q.panSelectedCrop((e.clientX-m.x)*n,(e.clientY-m.y)*n),m={x:e.clientX,y:e.clientY};return}if(!f)return;let t=e.clientX-f.x,n=e.clientY-f.y;f={x:e.clientX,y:e.clientY},Q.panBy(t,n)}function ee(e){if(h){h=!1;return}if(m||Q.cropping){m=null;return}if(f){S();return}let t=x(e.clientX,e.clientY);if(!(t<0)){if(Q.mode===`select`){let e=C(t);e!==void 0&&Q.selectInPhotos(e)}else d>=0&&d!==t&&Q.selected===null&&Q.pick(d),Q.pick(t),d=-1}}function E(e){e.preventDefault();let t=e.deltaMode===1?16:e.deltaMode===2?400:1,n=Math.exp(-e.deltaY*t*(e.ctrlKey?.01:.0015));if(Q.cropping){Q.zoomSelectedCropBy(n);return}let i=r.getBoundingClientRect();Q.zoomAtPoint(n,{x:e.clientX-i.left,y:e.clientY-i.top})}function D(e){return e instanceof HTMLInputElement||e instanceof HTMLSelectElement||e instanceof HTMLTextAreaElement||e instanceof HTMLButtonElement}function te(e){Q.setSpaceHeld(e),e||S()}function ne(e){if(e.code!==`Space`)return;let t=p&&e.target instanceof HTMLButtonElement;D(e.target)&&!t||!p&&document.activeElement!==r||(e.preventDefault(),e.repeat||te(!0))}function re(e){e.code===`Space`&&(Q.spaceHeld&&e.preventDefault(),te(!1))}function ie(e){if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`z`){e.preventDefault(),Q.undoRemove();return}if(e.key===`+`||e.key===`=`){e.preventDefault(),Q.cropping?Q.zoomSelectedCropBy(1.25):Q.zoomAtCentre(1.25);return}if(e.key===`-`||e.key===`_`){e.preventDefault(),Q.cropping?Q.zoomSelectedCropBy(.8):Q.zoomAtCentre(.8);return}if(e.key===`0`){e.preventDefault(),Q.fitView();return}if(e.shiftKey&&e.key.startsWith(`Arrow`)){e.preventDefault();let t=e.key===`ArrowLeft`?40:e.key===`ArrowRight`?-40:0,n=e.key===`ArrowUp`?40:e.key===`ArrowDown`?-40:0;Q.panBy(t,n);return}if(Q.cropping&&e.key.startsWith(`Arrow`)){e.preventDefault();let t=.01,n=e.key===`ArrowLeft`?-.01:e.key===`ArrowRight`?t:0,r=e.key===`ArrowUp`?-.01:e.key===`ArrowDown`?t:0;Q.panSelectedCrop(n,r);return}let t=Q.layout;if(!t)return;let n=_(t);if((e.key.startsWith(`Arrow`)||e.key===`Enter`)&&(Q.focusRing=!0),e.key===`Delete`||e.key===`Backspace`){let r=Q.selected??t.placements[n[Q.focused]??-1]?.photoIndex,i=r===void 0?void 0:Q.photos[r];e.preventDefault(),i&&Q.removePhotos(new Set([i.id]),Z(`Removed %(name)s.`,{name:i.name}));return}if(e.key===`ArrowRight`||e.key===`ArrowDown`)Q.focused=(Q.focused+1)%n.length;else if(e.key===`ArrowLeft`||e.key===`ArrowUp`)Q.focused=(Q.focused-1+n.length)%n.length;else if(e.key===`Enter`){let e=n[Q.focused];e!==void 0&&Q.pick(e)}else if(e.key===`Escape`)Q.deselect();else return;e.preventDefault();let r=t.placements[n[Q.focused]],i=Q.photos[r?.photoIndex??-1]?.name;i&&e.key.startsWith(`Arrow`)&&Q.setStatus(t.pages?Z(`%(name)s, page %(n)s of %(total)s`,{name:i,n:(r?.page??0)+1,total:t.pages.length}):i)}var O=jc();pr(`keydown`,Gt,ne),pr(`keyup`,Gt,re),pr(`blur`,Gt,()=>te(!1));let ae;var k=z(O);bi(k,e=>r=e,()=>r),Ur(k,(e,t)=>Xs?.(e,t),()=>E);var oe=V(k,2);let se;var ce=z(oe),le=e=>{var t=kc(),n=z(t),r=V(n,2),i=B(r,!0),a=B(V(r,2),!0);N(t),H((e,t,r,o)=>{X(n,`max`,e),fi(n,Q.restoring.total>0?Q.restoring.done:void 0),X(n,`aria-label`,t),Y(i,r),Y(a,o)},[()=>Math.max(1,Q.restoring.total),()=>$(`Bringing back your photos`),()=>Q.restoring.total>0?$(`Bringing back your photos… %(done)s of %(total)s`,{done:Q.restoring.done,total:Q.restoring.total}):$(`Looking for your saved photos…`),()=>$(`You can add more once they are back.`)]),J(e,t)},A=e=>{var t=Ac(),n=V(en(t),2),r=B(n,!0),i=V(n,2),a=B(i,!0),o=V(i,2),s=B(o,!0);H((e,t,n)=>{Y(r,e),Y(a,t),Y(s,n)},[()=>$(`Drop photos here`),()=>$(`Everything runs in your browser. Your photos are never uploaded.`),()=>$(`Choose photos…`)]),K(`click`,o,()=>Q.chooseFiles()),J(e,t)};Mr(ce,e=>{Q.restoring?e(le):e(A,-1)}),N(oe),N(O),bi(O,e=>n=e,()=>n),H(()=>{ae=Qr(O,1,`canvas-box`,null,ae,{"pan-mode":Q.mode===`pan`,"pan-ready":Q.spaceHeld,panning:G(o),cropping:Q.cropping}),X(oe,`hidden`,Q.hasPhotos),se=ei(oe,``,se,{"--empty-w":`${G(g).w}px`,"--empty-h":`${G(g).h}px`})}),pr(`pointerenter`,O,()=>p=!0),pr(`pointerleave`,O,()=>p=!1),K(`pointerdown`,k,w),K(`pointermove`,k,T),K(`pointerup`,k,ee),pr(`pointercancel`,k,()=>{m=null,S()}),K(`keydown`,k,ie),pr(`focus`,k,()=>{Q.canvasFocused=!0,Q.focusRing=r.matches(`:focus-visible`)}),pr(`blur`,k,()=>Q.canvasFocused=!1),vi(O,`clientWidth`,e=>R(i,e)),vi(O,`clientHeight`,e=>R(a,e)),J(e,O),He()}mr([`pointerdown`,`pointermove`,`pointerup`,`keydown`,`click`]);var Nc=q(`<div class="status"> </div>`),Pc=q(`<div> </div>`),Fc=q(`<main class="stage" aria-label="Preview"><p id="hint" class="pill hint-pill"> </p> <div class="tools" id="tools"><fieldset class="modes group" id="modes" aria-label="Mode"><button type="button" id="mode-pan" aria-keyshortcuts="Space"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"></path></svg> <span> </span></button> <button type="button" id="mode-swap"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"></path></svg> <span> </span></button> <button type="button" id="mode-select"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3v16l4.2-4 3.3 6.2 2.4-1.3-3.3-6.1H19z"></path></svg> <span> </span></button></fieldset> <fieldset class="zoomers group" aria-label="Zoom"><button type="button" id="zoom-in" class="sq" aria-label="Zoom in"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></button> <button type="button" id="zoom-out" class="sq" aria-label="Zoom out"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path></svg></button> <button type="button" id="reset-view" class="sq" aria-label="Fit to window"> </button> <span id="view-zoom" class="zoom-pct" aria-live="off"> </span></fieldset></div> <!> <button type="button" id="help-open" class="help-btn help-fab" aria-haspopup="dialog" aria-label="Help">?</button> <p id="status-line" class="pill status-pill"> </p> <div id="messages" class="sr-only" role="status" aria-live="polite"><!> <!></div></main>`);function Ic(e,t){Ve(t,!0);let n=F(()=>{if(!Q.layout)return $(`No photos yet`);let e=Q.photos.length;return[e===1?$(`1 photo`):$(`%(n)s photos`,{n:e}),Q.layoutStyle===`gallery`?$(`Gallery`):$(`%(n)s columns`,{n:Q.columnsInUse??0}),$(`%(pct)s% trimmed`,{pct:Q.cropPercent})].join(` · `)}),r=F(()=>!Q.hasPhotos);var i=Fc(),a=z(i),o=B(a,!0),s=V(a,2),c=z(s),l=z(c),u=B(V(z(l),2),!0);N(l);var d=V(l,2),f=B(V(z(d),2),!0);N(d);var p=V(d,2),m=B(V(z(p),2),!0);N(p),N(c);var h=V(c,2),g=z(h),_=V(g,2),v=V(_,2),y=B(v,!0),b=V(v,2),x=B(b);N(h),N(s);var S=V(s,2);Mc(S,{});var C=V(S,2),w=V(C,2),T=B(w,!0),ee=V(w,2),E=z(ee),D=e=>{var t=Nc(),n=B(t,!0);H(()=>Y(n,Q.status)),J(e,t)};Mr(E,e=>{Q.status&&e(D)}),Lr(V(E,2),17,()=>Q.messages,Nr,(e,t)=>{var n=Pc(),r=B(n,!0);H(()=>{Qr(n,1,Kr(G(t).kind)),Y(r,G(t).text)}),J(e,n)}),N(ee),N(i),H((e,t,i,a,s)=>{Y(o,Q.status),X(l,`aria-pressed`,Q.activeMode===`pan`),l.disabled=G(r),Y(u,e),X(d,`aria-pressed`,Q.activeMode===`swap`),d.disabled=G(r),Y(f,t),X(p,`aria-pressed`,Q.activeMode===`select`),p.disabled=G(r),Y(m,i),g.disabled=G(r),_.disabled=G(r),v.disabled=Q.isFit||G(r),Y(y,a),X(b,`title`,s),Y(x,`${Q.zoomPercent??``}%`),Y(T,G(n))},[()=>$(`Pan`),()=>$(`Swap`),()=>$(`Select`),()=>$(`Fit`),()=>$(`Zoom`)]),K(`click`,l,()=>Q.setMode(`pan`)),K(`click`,d,()=>Q.setMode(`swap`)),K(`click`,p,()=>Q.setMode(`select`)),K(`click`,g,()=>Q.zoomAtCentre(1.25)),K(`click`,_,()=>Q.zoomAtCentre(.8)),K(`click`,v,()=>Q.fitView()),K(`click`,C,()=>Q.dialog=`help`),J(e,i),He()}mr([`click`]);var Lc=q(`<i></i>`),Rc=q(`<div class="backdrop" id="backdrop" aria-hidden="true"></div> <div class="app" id="app"><input id="file-input" type="file" accept="image/*,.heic,.heif" multiple="" hidden=""/> <!> <!></div> <!>`,1);function zc(e,t){Ve(t,!0);let n=F(()=>Ks(Q.photoColours)),r;wi(()=>{let e=window.matchMedia(`(max-width: 760px)`);Q.narrow=e.matches;let t=()=>{Q.narrow=e.matches,Q.setTab(Q.tab,!1)};return e.addEventListener(`change`,t),Q.fileInput=r,Q.setTab(`photos`,!1),Q.start(),document.documentElement.dataset.appReady=`true`,()=>e.removeEventListener(`change`,t)}),pn(()=>{if(!Q.persistReady)return;Q.photos,Q.seed,Q.columns,Q.layoutStyle,Le(Q.settings);let e=setTimeout(()=>void Q.persist(),250);return()=>clearTimeout(e)});function i(){let e=Array.from(r.files??[]);r.value=``,Q.addFiles(e)}var a=Rc();pr(`popstate`,Gt,()=>Q.onPopState()),pr(`dragover`,Gt,e=>{e.preventDefault(),document.body.classList.add(`dragging`)}),pr(`dragleave`,Gt,e=>{e.relatedTarget||document.body.classList.remove(`dragging`)}),pr(`drop`,Gt,e=>{e.preventDefault(),document.body.classList.remove(`dragging`),Q.addFiles(Array.from(e.dataTransfer?.files??[]))});var o=en(a);Lr(o,21,()=>G(n),Nr,(e,t)=>{var n=Lc();let r;H(()=>r=ei(n,``,r,{"--c":G(t)})),J(e,n)}),N(o);var s=V(o,2),c=z(s);bi(c,e=>r=e,()=>r);var l=V(c,2);Oc(l,{}),Ic(V(l,2),{}),N(s),Js(V(s,2),{}),H((e,t)=>{X(s,`data-tab`,Q.tab),X(s,`data-open`,e),X(s,`data-empty`,t),X(s,`data-menu`,Q.menuOpen?`open`:`closed`)},[()=>String(Q.sheetOpen),()=>String(!Q.hasPhotos)]),K(`change`,c,i),J(e,a),He()}mr([`change`]);var Bc=document.getElementById(`root`);if(!Bc)throw Error(`missing #root`);Dr(zc,{target:Bc});
//# sourceMappingURL=index-bse-zzXN.js.map