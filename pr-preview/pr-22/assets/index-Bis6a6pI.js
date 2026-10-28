(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=Array.isArray,t=Array.prototype.indexOf,n=Array.prototype.includes,r=Array.from,i=Object.defineProperty,a=Object.getOwnPropertyDescriptor,o=Object.getOwnPropertyDescriptors,s=Object.prototype,c=Array.prototype,l=Object.getPrototypeOf,u=Object.isExtensible,d=()=>{};function f(e){for(var t=0;t<e.length;t++)e[t]()}function p(){var e,t;return{promise:new Promise((n,r)=>{e=n,t=r}),resolve:e,reject:t}}var m=1024,h=2048,g=4096,_=8192,v=16384,y=32768,b=1<<25,x=65536,S=1<<19,C=1<<20,w=1<<25,T=1<<21,E=1<<22,ee=1<<23,D=Symbol(`$state`),O=Symbol(`component`),te=Symbol(`legacy props`),ne=Symbol(``),re=Symbol(`attributes`),ie=Symbol(`class`),ae=Symbol(`style`),k=Symbol(`text`),oe=Symbol(`form reset`),se=new class extends Error{name=`StaleReactionError`;message="The reaction that called `getAbortSignal()` was re-run or destroyed"},ce=!!globalThis.document?.contentType&&globalThis.document.contentType.includes(`xml`),le={},A=Symbol(`uninitialized`),ue=`http://www.w3.org/1999/xhtml`;function de(){console.warn(`https://svelte.dev/e/derived_inert`)}function fe(e){console.warn(`https://svelte.dev/e/hydration_mismatch`)}function pe(){console.warn(`https://svelte.dev/e/select_multiple_invalid_value`)}function me(){console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`)}var j=!1;function he(e){j=e}var M;function ge(e){if(e===null)throw fe(),le;return M=e}function _e(){return ge($t(M))}function N(e){if(j){if($t(M)!==null)throw fe(),le;M=e}}function ve(e=1){if(j){for(var t=e,n=M;t--;)n=$t(n);M=n}}function ye(e=!0){for(var t=0,n=M;;){if(n.nodeType===8){var r=n.data;if(r===`]`){if(t===0)return n;--t}else(r===`[`||r===`[!`||r[0]===`[`&&!isNaN(Number(r.slice(1))))&&(t+=1)}var i=$t(n);e&&n.remove(),n=i}}function be(e){if(!e||e.nodeType!==8)throw fe(),le;return e.data}function xe(e){return e===this.v}function Se(e,t){return e==e?e!==t||typeof e==`object`&&!!e||typeof e==`function`:t==t}function Ce(e){return!Se(e,this.v)}function we(e){throw Error(`https://svelte.dev/e/lifecycle_outside_component`)}function Te(){throw Error(`https://svelte.dev/e/async_derived_orphan`)}function Ee(e,t,n){throw Error(`https://svelte.dev/e/each_key_duplicate`)}function De(e){throw Error(`https://svelte.dev/e/effect_in_teardown`)}function Oe(){throw Error(`https://svelte.dev/e/effect_in_unowned_derived`)}function ke(e){throw Error(`https://svelte.dev/e/effect_orphan`)}function Ae(){throw Error(`https://svelte.dev/e/effect_update_depth_exceeded`)}function je(e){throw Error(`https://svelte.dev/e/props_invalid_value`)}function Me(){throw Error(`https://svelte.dev/e/state_descriptors_fixed`)}function Ne(){throw Error(`https://svelte.dev/e/state_prototype_fixed`)}function Pe(){throw Error(`https://svelte.dev/e/state_unsafe_mutation`)}function Fe(){throw Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`)}var Ie=[];function Le(e,t=!1,n=!1){return Re(e,new Map,``,Ie,null,n)}function Re(t,n,r,i,a=null,o=!1){if(typeof t==`object`&&t){var c=n.get(t);if(c!==void 0)return c;if(t instanceof Map)return new Map(t);if(t instanceof Set)return new Set(t);if(e(t)){var u=Array(t.length);n.set(t,u),a!==null&&n.set(a,u);for(var d=0;d<t.length;d+=1){var f=t[d];d in t&&(u[d]=Re(f,n,r,i,null,o))}return u}if(l(t)===s){u={},n.set(t,u),a!==null&&n.set(a,u);for(var p of Object.keys(t))u[p]=Re(t[p],n,r,i,null,o);return u}if(t instanceof Date)return t.getTime(),structuredClone(t);if(typeof t.toJSON==`function`&&!o)return Re(t.toJSON(),n,r,i,t)}if(t instanceof EventTarget)return t;try{return structuredClone(t)}catch{return t}}var P=null;function ze(e){P=e}function Be(e,t=!1,n){P={p:P,i:!1,c:null,e:null,s:e,x:null,r:W,l:null}}function Ve(e){var t=P,n=t.e;if(n!==null){t.e=null;for(var r of n)mn(r)}return e!==void 0&&(t.x=e),t.i=!0,P=t.p,He(e)}function He(e={}){return i(e,O,{value:!0}),e}function Ue(){return!0}var We=[];function Ge(){var e=We;We=[],f(e)}function Ke(e){if(We.length===0&&!_t){var t=We;queueMicrotask(()=>{t===We&&Ge()})}We.push(e)}var qe=~(h|g|m);function Je(e,t){e.f=e.f&qe|t}function Ye(e){e.f&512||e.deps===null?Je(e,m):Je(e,g)}function Xe(e,t,n){e.f&2048?t.add(e):e.f&4096&&n.add(e),Je(e,m)}var Ze=!1;function Qe(){Ze||(Ze=!0,document.addEventListener(`reset`,e=>{Promise.resolve().then(()=>{if(!e.defaultPrevented)for(let t of e.target.elements)t[oe]?.()})},{capture:!0}))}function $e(e){var t=U,n=W;In(null),Ln(null);try{return e()}finally{In(t),Ln(n)}}function et(e,t,n,r){let i=Ue()?it:st;var a=e.filter(e=>!e.settled),o=t.map(i);if(n.length===0&&a.length===0){r(o);return}var s=W,c=tt(),l=a.length===1?a[0].promise:a.length>1?Promise.all(a.map(e=>e.promise)):null;function u(e){if(!(s.f&16384)){c();try{r([...o,...e])}catch(e){sn(e,s)}nt()}}var d=rt();if(n.length===0){l.then(()=>u([])).finally(d);return}function f(){Promise.all(n.map(e=>ot(e))).then(u).catch(e=>sn(e,s)).finally(d)}l?l.then(()=>{s.f&16384?d():(c(),f(),nt())}):f()}function tt(){var e=W,t=U,n=P,r=I;return function(i=!0){Ln(e),In(t),ze(n),i&&!(e.f&16384)&&(r?.activate(),r?.apply())}}function nt(e=!0){Ln(null),In(null),ze(null),e&&I?.deactivate()}function rt(){var e=W,t=e.b,n=I,r=!!t?.is_rendered();return t?.update_pending_count(1,n),n.increment(r,e),()=>{t?.update_pending_count(-1,n),n.decrement(r,e)}}function it(e){var t=2|h;return W!==null&&(W.f|=S),{ctx:P,deps:null,effects:null,equals:xe,f:t,fn:e,reactions:null,rv:0,v:A,wv:0,parent:W,ac:null}}var at=Symbol(`obsolete`);function ot(e,t,n){let r=W;r===null&&Te();var i=void 0,a=Nt(A),o=!U,s=new Set;return _n(()=>{var t=W,n=p();i=n.promise;try{Promise.resolve(e()).then(n.resolve,e=>{e!==se&&n.reject(e)}).finally(nt)}catch(e){n.reject(e),nt()}var c=I;if(o){if(t.f&32768)var l=rt();if(r.b?.is_rendered())c.async_deriveds.get(t)?.reject(at);else for(let e of s.values())e.reject(at);s.add(n),c.async_deriveds.set(t,n)}let u=(e,t=void 0)=>{l?.(),s.delete(n),t!==at&&(c.activate(),t?(a.f|=ee,Lt(a,t)):(a.f&8388608&&(a.f^=ee),Lt(a,e)),c.deactivate())};n.promise.then(u,e=>u(null,e||`unknown`))}),fn(()=>{for(let e of s)e.reject(at)}),new Promise(e=>{function t(n){function r(){n===i?e(a):t(i)}n.then(r,r)}t(i)})}function F(e){let t=it(e);return zn(t),t}function st(e){let t=it(e);return t.equals=Ce,t}function ct(e){var t=e.effects;if(t!==null){e.effects=null;for(var n=0;n<t.length;n+=1)wn(t[n])}}function lt(e){var t,n=W,r=e.parent;if(!Nn&&r!==null&&e.v!==A&&r.f&24576)return de(),e.v;Ln(r);try{ct(e),t=Zn(e)}finally{Ln(n)}return t}function ut(e){var t=lt(e);!e.equals(t)&&(e.wv=Jn(),(!I?.is_fork||e.deps===null)&&(I===null?e.v=t:(I.capture(e,t,!0),mt?.capture(e,t,!0)),e.deps===null))?Je(e,m):Nn||(ht===null?Ye(e):(dn()||I?.is_fork)&&ht.set(e,t))}function dt(e){if(e.effects!==null)for(let t of e.effects)(t.teardown||t.ac)&&(t.teardown?.(),t.ac!==null&&$e(()=>{t.ac.abort(se),t.ac=null}),t.fn!==null&&(t.teardown=d),er(t,0),Sn(t))}function ft(e){if(e.effects!==null)for(let t of e.effects)t.teardown&&t.fn!==null&&tr(t)}var pt=null,I=null,mt=null,ht=null,gt=null,_t=!1,vt=!1,yt=null,bt=null,xt=0,St=1,Ct=class e{id=St++;#e=!1;linked=!0;#t=null;#n=null;async_deriveds=new Map;current=new Map;previous=new Map;#r=new Set;#i=new Set;#a=0;#o=new Map;#s=null;#c=[];#l=[];#u=new Set;#d=new Set;#f=new Map;#p=new Set;is_fork=!1;#m=!1;constructor(){pt===null?pt=this:(pt.#n=this,this.#t=pt),pt=this}#h(){if(this.is_fork)return!0;for(let n of this.#o.keys()){for(var e=n,t=!1;e.parent!==null;){if(this.#f.has(e)){t=!0;break}e=e.parent}if(!t)return!0}return!1}skip_effect(e){this.#f.has(e)||this.#f.set(e,{d:[],m:[]}),this.#p.delete(e)}unskip_effect(e,t=e=>this.schedule(e)){var n=this.#f.get(e);if(n){this.#f.delete(e);for(var r of n.d)Je(r,h),t(r);for(r of n.m)Je(r,g),t(r)}this.#p.add(e)}#g(){var e=[];for(let i of this.#c)if(!(i.f&16384||!(i.f&6144))){for(var t=i,n=!1;t.parent!==null;){t=t.parent;var r=t.f;if(r&96){if(!(r&1024)){n=!0;break}t.f^=m}}n||e.push(t)}return this.#c=[],e}#_(){this.#e=!0;for(let e of this.#u)this.#d.delete(e),Je(e,h),this.schedule(e);for(let e of this.#d)Je(e,g),this.schedule(e);this.apply();for(var t=yt=[],n=[],r=bt=[];this.#c.length>0;){xt++>1e3&&(this.#S(),wt());for(let e of this.#g())try{this.#v(e,t,n)}catch(t){throw kt(e),this.#h()||this.discard(),t}}if(I=null,r.length>0){var i=e.ensure();for(let e of r)i.schedule(e)}if(yt=null,bt=null,this.#h()){this.#x(n),this.#x(t);for(let[e,t]of this.#f)Ot(e,t);r.length>0&&I.#_();return}let a=this.#y();if(a)this.#x(n),this.#x(t),a.#b(this);else{this.#u.clear(),this.#d.clear();for(let e of this.#r)e(this);this.#r.clear(),mt=this,Et(n),Et(t),mt=null,this.#s?.resolve();var o=I;if(this.#a===0&&(this.#c.length===0||o!==null)&&this.#S(),this.#c.length>0){if(o!==null){for(let e of this.#c)o.#c.push(e);this.#c=[]}else o=this}o!==null&&(jt.clear(),o.#_())}}#v(e,t,n){e.f^=m;for(var r=e.first;r!==null;){var i=r.f,a=!!(i&96);if(!(a&&i&1024||i&8192||this.#f.has(r))&&r.fn!==null){a?r.f^=m:i&4?t.push(r):Yn(r)&&(i&16&&this.#d.add(r),tr(r));var o=r.first;if(o!==null){r=o;continue}}for(;r!==null;){var s=r.next;if(s!==null){r=s;break}r=r.parent}}}#y(){for(var e=this.#t;e!==null;){if(!e.is_fork){for(let[t,[,n]]of this.current)if(e.current.has(t)&&!n)return e}e=e.#t}return null}#b(e){for(let[t,n]of e.current)!this.previous.has(t)&&e.previous.has(t)&&this.previous.set(t,e.previous.get(t)),this.current.set(t,n);for(let[t,n]of e.async_deriveds){let e=this.async_deriveds.get(t);e&&n.promise.then(e.resolve).catch(e.reject)}e.async_deriveds.clear(),this.transfer_effects(e.#u,e.#d);let t=e=>{var n=e.reactions;if(n!==null&&!(e.f&2&&!(e.f&6144)))for(let e of n){var r=e.f;if(r&2)t(e);else{var i=e;r&4194320&&!this.async_deriveds.has(i)&&(this.#d.delete(i),Je(i,h),this.schedule(i))}}};for(let e of this.current.keys())t(e);this.oncommit(()=>e.discard()),e.#S(),I=this,this.#_()}#x(e){for(var t=0;t<e.length;t+=1)Xe(e[t],this.#u,this.#d)}capture(e,t,n=!1){e.v!==A&&!this.previous.has(e)&&this.previous.set(e,e.v),e.f&8388608||(this.current.set(e,[t,n]),ht?.set(e,t)),this.is_fork||(e.v=t)}activate(){I=this}deactivate(){I=null,ht=null}flush(){try{vt=!0,I=this,this.#_()}finally{xt=0,gt=null,yt=null,bt=null,vt=!1,I=null,ht=null,jt.clear()}}discard(){for(let e of this.#i)e(this);this.#i.clear();for(let e of this.async_deriveds.values())e.reject(at);this.#S(),this.#s?.resolve()}register_created_effect(e){this.#l.push(e)}increment(e,t){if(this.#a+=1,e){let e=this.#o.get(t)??0;this.#o.set(t,e+1)}}decrement(e,t){if(--this.#a,e){let e=this.#o.get(t)??0;e===1?this.#o.delete(t):this.#o.set(t,e-1)}this.#m||(this.#m=!0,Ke(()=>{this.#m=!1,this.linked&&this.flush()}))}transfer_effects(e,t){for(let t of e)this.#u.add(t);for(let e of t)this.#d.add(e);e.clear(),t.clear()}oncommit(e){this.#r.add(e)}ondiscard(e){this.#i.add(e)}settled(){return(this.#s??=p()).promise}static ensure(){if(I===null){let t=I=new e;!vt&&Ke(()=>{t.#e||t.flush()})}return I}apply(){ht=null}schedule(e){gt=e,e.b?.is_pending&&e.f&16777228&&!(e.f&32768)?e.b.defer_effect(e):this.#c.push(e)}#S(){if(this.linked){var e=this.#t,t=this.#n;e===null||(e.#n=t),t===null?pt=e:t.#t=e,this.linked=!1}}};function wt(){try{Ae()}catch(e){sn(e,gt)}}var Tt=null;function Et(e){var t=e.length;if(t!==0){for(var n=0;n<t;){var r=e[n++];if(!(r.f&24576)&&Yn(r)&&(Tt=new Set,tr(r),r.deps===null&&r.first===null&&r.nodes===null&&r.teardown===null&&r.ac===null&&En(r),Tt?.size>0)){jt.clear();for(let e of Tt){if(e.f&24576)continue;let t=[e],n=e.parent;for(;n!==null;)Tt.has(n)&&(Tt.delete(n),t.push(n)),n=n.parent;for(let e=t.length-1;e>=0;e--){let n=t[e];n.f&24576||tr(n)}}Tt.clear()}}Tt=null}}function Dt(e){I.schedule(e)}function Ot(e,t){if(!(e.f&32&&e.f&1024)){e.f&2048?t.d.push(e):e.f&4096&&t.m.push(e),Je(e,m);for(var n=e.first;n!==null;)Ot(n,t),n=n.next}}function kt(e){Je(e,m);for(var t=e.first;t!==null;)kt(t),t=t.next}var At=new Set,jt=new Map,Mt=!1;function Nt(e,t){return{f:0,v:e,reactions:null,equals:xe,rv:0,wv:0}}function L(e,t){let n=Nt(e,t);return zn(n),n}function Pt(e,t=!1,n=!0){let r=Nt(e);return t||(r.equals=Ce),r}function R(e,t,n=!1){return U!==null&&(!Fn||U.f&131072)&&Ue()&&U.f&4325394&&(Rn===null||!Rn.has(e))&&Pe(),Lt(e,n?Ht(t):t,bt)}var Ft=null,It=0;function Lt(e,t,n=null){if(!e.equals(t)){Nn?jt.set(e,t):jt.has(e)||jt.set(e,e.v);var r=Ct.ensure();if(r.capture(e,t),e.f&2){let t=e;e.f&2048&&lt(t),ht===null&&Ye(t)}e.wv=Jn(),Ft=null,It=0,Vt(e,h,n),Ft=null,Ue()&&W!==null&&W.f&1024&&!(W.f&96)&&(Hn===null?Un([e]):Hn.push(e)),!r.is_fork&&At.size>0&&!Mt&&Rt()}return t}function Rt(){Mt=!1;for(let e of At){e.f&1024&&Je(e,g);let t;try{t=Yn(e)}catch{t=!0}t&&tr(e)}At.clear()}function zt(e,t=1){var n=G(e),r=t===1?n++:n--;return R(e,n),r}function Bt(e){R(e,e.v+1)}function Vt(e,t,n){var r=e.reactions;if(r!==null){var i=Ue(),a=r.length;if(It+=a,It>1e5&&Ft===null&&(Ft=new Set),Ft!==null){if(Ft.has(e))return;Ft.add(e)}for(var o=0;o<a;o++){var s=r[o],c=s.f;if(i||s!==W){var l=(c&h)===0;if(l&&Je(s,t),c&131072)At.add(s);else if(c&2){var u=s;ht?.delete(u),Vt(u,g,n)}else if(l){var d=s;c&16&&Tt!==null&&Tt.add(d),n===null?Dt(d):n.push(d)}}}}}function Ht(t){if(typeof t!=`object`||!t||D in t||O in t)return t;let n=l(t);if(n!==s&&n!==c)return t;var r=new Map,i=e(t),o=L(0),u=null,d=Kn,f=e=>{if(Kn===d)return e();var t=U,n=Kn;In(null),qn(d);var r=e();return In(t),qn(n),r};return i&&r.set(`length`,L(t.length,u)),new Proxy(t,{defineProperty(e,t,n){`value`in n&&n.configurable!==!1&&n.enumerable!==!1&&n.writable!==!1||Me();var i=r.get(t);return i===void 0?f(()=>{var e=L(n.value,u);return r.set(t,e),e}):R(i,n.value,!0),!0},deleteProperty(e,t){var n=r.get(t);if(n===void 0){if(t in e){let e=f(()=>L(A,u));r.set(t,e),Bt(o)}}else R(n,A),Bt(o);return!0},get(e,n,i){if(n===D)return t;var o=r.get(n),s=n in e;if(o===void 0&&(!s||a(e,n)?.writable)&&(o=f(()=>L(Ht(s?e[n]:A),u)),r.set(n,o)),o!==void 0){var c=G(o);return c===A?void 0:c}return Reflect.get(e,n,i)},getOwnPropertyDescriptor(e,t){this.has?.(e,t);var n=Reflect.getOwnPropertyDescriptor(e,t),i=r.get(t);if(i!==void 0){var a=G(i);if(a===A)return;if(n&&`value`in n)n.value=a;else return{enumerable:!0,configurable:!0,value:a,writable:!0}}return n},has(e,t){if(t===D)return!0;var n=r.get(t),i=n!==void 0&&n.v!==A||Reflect.has(e,t);return(n!==void 0||W!==null&&(!i||a(e,t)?.writable))&&(n===void 0&&(n=f(()=>L(i?Ht(e[t]):A,u)),r.set(t,n)),G(n)===A)?!1:i},set(e,t,n,s){var c=r.get(t),l=t in e;if(i&&t===`length`)for(var d=n;d<c.v;d+=1){var p=r.get(d+``);p===void 0?d in e&&(p=f(()=>L(A,u)),r.set(d+``,p)):R(p,A)}if(c===void 0)(!l||a(e,t)?.writable)&&(c=f(()=>L(void 0,u)),R(c,Ht(n)),r.set(t,c));else{l=c.v!==A;var m=f(()=>Ht(n));R(c,m)}var h=Reflect.getOwnPropertyDescriptor(e,t);if(h?.set&&h.set.call(s,n),!l){if(i&&typeof t==`string`){var g=r.get(`length`),_=Number(t);Number.isInteger(_)&&_>=g.v&&R(g,_+1)}Bt(o)}return!0},ownKeys(e){G(o);var t=Reflect.ownKeys(e).filter(e=>{var t=r.get(e);return t===void 0||t.v!==A});for(var[n,i]of r)i.v!==A&&!(n in e)&&t.push(n);return t},setPrototypeOf(){Ne()}})}function Ut(e){try{if(typeof e==`object`&&e&&D in e)return e[D]}catch{}return e}function Wt(e,t){return Object.is(Ut(e),Ut(t))}var Gt,Kt,qt,Jt,Yt;function Xt(){if(Gt===void 0){Gt=window,Kt=document,qt=/Firefox/.test(navigator.userAgent);var e=Element.prototype,t=Node.prototype,n=Text.prototype;Jt=a(t,`firstChild`).get,Yt=a(t,`nextSibling`).get,u(e)&&(e[ie]=void 0,e[re]=null,e[ae]=void 0,e.__e=void 0),u(n)&&(n[k]=void 0)}}function Zt(e=``){return document.createTextNode(e)}function Qt(e){return Jt.call(e)}function $t(e){return Yt.call(e)}function z(e,t){if(!j)return Qt(e);var n=Qt(M);if(n===null)n=M.appendChild(Zt());else if(t&&n.nodeType!==3){var r=Zt();return n?.before(r),ge(r),r}return t&&an(n),ge(n),n}function en(e,t=!1){if(!j){var n=Qt(e);return n instanceof Comment&&n.data===``?$t(n):n}if(t){if(M?.nodeType!==3){var r=Zt();return M?.before(r),ge(r),r}an(M)}return M}function B(e,t=!1){if(!j)return Qt(e);var n=z(e,t);return N(e),n}function V(e,t=1,n=!1){let r=j?M:e;for(var i;t--;)i=r,r=$t(r);if(!j)return r;if(n){if(r?.nodeType!==3){var a=Zt();return r===null?i?.after(a):r.before(a),ge(a),a}an(r)}return ge(r),r}function tn(e){e.textContent=``}function nn(){return!1}function rn(e,t,n){return t==null||t===`http://www.w3.org/1999/xhtml`?n?document.createElement(e,{is:n}):document.createElement(e):n?document.createElementNS(t,e,{is:n}):document.createElementNS(t,e)}function an(e){if(e.nodeValue.length<65536)return;let t=e.nextSibling;for(;t!==null&&t.nodeType===3;)t.remove(),e.nodeValue+=t.nodeValue,t=e.nextSibling}function on(e){var t=W;if(t===null)return U.f|=ee,e;if(!(t.f&32768)&&!(t.f&4))throw e;sn(e,t)}function sn(e,t){if(e===le)throw e;if(!(t!==null&&t.f&16384)){for(;t!==null;){if(t.f&128&&!(t.f&33570816)){if(!(t.f&32768))throw e;try{t.b.error(e);return}catch(t){e=t}}t=t.parent}throw e}}function cn(e){W===null&&(U===null&&ke(e),Oe()),Nn&&De(e)}function ln(e,t){var n=t.last;n===null?t.last=t.first=e:(n.next=e,e.prev=n,t.last=e)}function un(e,t){var n=W;n!==null&&n.f&8192&&(e|=_);var r={ctx:P,deps:null,nodes:null,f:e|h|512,first:null,fn:t,last:null,next:null,parent:n,b:n&&n.b,prev:null,teardown:null,wv:0,ac:null};I?.register_created_effect(r);var i=r;if(e&4)yt===null?Ct.ensure().schedule(r):yt.push(r);else if(t!==null){try{tr(r)}catch(e){throw wn(r),e}i.deps===null&&i.teardown===null&&i.nodes===null&&i.first===i.last&&!(i.f&524288)&&(i=i.first,e&16&&e&65536&&i!==null&&(i.f|=x))}if(i!==null&&(i.parent=n,n!==null&&ln(i,n),U!==null&&U.f&2&&!(e&64))){var a=U;(a.effects??=[]).push(i)}return r}function dn(){return U!==null&&!Fn}function fn(e){let t=un(8,null);return Je(t,m),t.teardown=e,t}function pn(e){cn(`$effect`);var t=W.f;if(!U&&t&32&&P!==null&&!P.i){var n=P;(n.e??=[]).push(e)}else return mn(e)}function mn(e){return un(4|C,e)}function hn(e){Ct.ensure();let t=un(64|S,e);return(e={})=>new Promise(n=>{e.outro?Dn(t,()=>{wn(t),n(void 0)}):(wn(t),n(void 0))})}function gn(e){return un(4,e)}function _n(e){return un(E|S,e)}function vn(e,t=0){return un(8|t,e)}function H(e,t=[],n=[],r=[]){et(r,t,n,t=>{un(8,()=>{e(...t.map(G))})})}function yn(e,t=0){return un(16|t,e)}function bn(e){return un(32|S,e)}function xn(e){var t=e.teardown;if(t!==null){let n=Nn,r=U;Pn(!0),In(null);try{t.call(null)}catch(t){sn(t,e.parent)}finally{Pn(n),In(r)}}}function Sn(e,t=!1){var n=e.first;for(e.first=e.last=null;n!==null;){let e=n.ac;e!==null&&$e(()=>{e.abort(se)});var r=n.next;n.f&64?n.parent=null:wn(n,t),n=r}}function Cn(e){for(var t=e.first;t!==null;){var n=t.next;t.f&32||wn(t),t=n}}function wn(e,t=!0){var n=!1;(t||e.f&262144)&&e.nodes!==null&&e.nodes.end!==null&&(Tn(e.nodes.start,e.nodes.end),n=!0),e.f|=b,Sn(e,t&&!n),er(e,0);var r=e.nodes&&e.nodes.t;if(r!==null)for(let e of r)e.stop();xn(e),e.f^=b,e.f|=v;var i=e.parent;i!==null&&i.first!==null&&En(e),e.next=e.prev=e.teardown=e.ctx=e.deps=e.fn=e.nodes=e.ac=e.b=null}function Tn(e,t){for(;e!==null;){var n=e===t?null:$t(e);e.remove(),e=n}}function En(e){var t=e.parent,n=e.prev,r=e.next;n!==null&&(n.next=r),r!==null&&(r.prev=n),t!==null&&(t.first===e&&(t.first=r),t.last===e&&(t.last=n))}function Dn(e,t,n=!0){var r=[];e.f|=256,On(e,r,!0);var i=()=>{n&&wn(e),t&&t()},a=r.length;if(a>0){var o=()=>--a||i();for(var s of r)s.out(o)}else i()}function On(e,t,n){if(!(e.f&8192)){e.f^=_;var r=e.nodes&&e.nodes.t;if(r!==null)for(let e of r)(e.is_global||n)&&t.push(e);for(var i=e.first;i!==null;){var a=i.next;if(!(i.f&64)){var o=!!(i.f&65536)||!!(i.f&32)&&!!(e.f&16);On(i,t,o?n:!1)}i=a}}}function kn(e){e.f&=-257,An(e,!0)}function An(e,t){if(!(e.f&256)&&e.f&8192){e.f^=_,e.f&1024||(Je(e,h),Ct.ensure().schedule(e));for(var n=e.first;n!==null;){var r=n.next,i=!!(n.f&65536)||!!(n.f&32);An(n,i?t:!1),n=r}var a=e.nodes&&e.nodes.t;if(a!==null)for(let e of a)(e.is_global||t)&&e.in()}}function jn(e,t){if(e.nodes)for(var n=e.nodes.start,r=e.nodes.end;n!==null;){var i=n===r?null:$t(n);t.append(n),n=i}}var Mn=null,Nn=!1;function Pn(e){Nn=e}var U=null,Fn=!1;function In(e){U=e}var W=null;function Ln(e){W=e}var Rn=null;function zn(e){U!==null&&(U.f&2097152||U.f&2)&&(Rn??=new Set).add(e)}var Bn=null,Vn=0,Hn=null;function Un(e){Hn=e}var Wn=1,Gn=0,Kn=Gn;function qn(e){Kn=e}function Jn(){return++Wn}function Yn(e){var t=e.f;if(t&2048)return!0;if(t&4096){for(var n=e.deps,r=n.length,i=0;i<r;i++){var a=n[i];if(Yn(a)&&ut(a),a.wv>e.wv)return!0}t&512&&ht===null&&Je(e,m)}return!1}function Xn(e,t,n=!0){var r=e.reactions;if(r!==null&&!(Rn!==null&&Rn.has(e)))for(var i=0;i<r.length;i++){var a=r[i];a.f&2?Xn(a,t,!1):t===a&&(n?Je(a,h):a.f&1024&&Je(a,g),Dt(a))}}function Zn(e){var t=Bn,n=Vn,r=Hn,i=U,a=Rn,o=P,s=Fn,c=Kn,l=e.f;Bn=null,Vn=0,Hn=null,U=l&96?null:e,Rn=null,ze(e.ctx),Fn=!1,Kn=++Gn,e.ac!==null&&($e(()=>{e.ac.abort(se)}),e.ac=null);try{e.f|=T;var u=e.fn,d=u();e.f|=y;var f=Qn(e);if(Ue()&&Hn!==null&&!Fn&&f!==null&&!(e.f&6146))for(var p=0;p<Hn.length;p++)Xn(Hn[p],e);if(i!==null&&i!==e){if(Gn++,i.deps!==null)for(let e=0;e<n;e+=1)i.deps[e].rv=Gn;if(t!==null)for(let e of t)e.rv=Gn;Hn!==null&&(r===null?r=Hn:r.push(...Hn))}return e.f&8388608&&(e.f^=ee),d}catch(t){return Qn(e),on(t)}finally{e.f^=T,Bn=t,Vn=n,Hn=r,U=i,Rn=a,ze(o),Fn=s,Kn=c}}function Qn(e){var t=e.deps,n=I?.is_fork;if(Bn!==null){var r;if(n||er(e,Vn),t!==null&&Vn>0)for(t.length=Vn+Bn.length,r=0;r<Bn.length;r++)t[Vn+r]=Bn[r];else e.deps=t=Bn;if(dn()&&e.f&512)for(r=Vn;r<t.length;r++)(t[r].reactions??=[]).push(e)}else!n&&t!==null&&Vn<t.length&&(er(e,Vn),t.length=Vn);return t}function $n(e,r){let i=r.reactions;if(i!==null){var a=t.call(i,e);if(a!==-1){var o=i.length-1;o===0?i=r.reactions=null:(i[a]=i[o],i.pop())}}if(i===null&&r.f&2&&(Bn===null||!n.call(Bn,r))){var s=r;s.f&512&&(s.f^=512),s.v!==A&&Ye(s),s.ac!==null&&$e(()=>{s.ac.abort(se),s.ac=null,Je(s,h)}),dt(s),er(s,0)}}function er(e,t){var n=e.deps;if(n!==null)for(var r=t;r<n.length;r++)$n(e,n[r])}function tr(e){var t=e.f;if(!(t&16384)){Je(e,m);var n=W;W=e;try{t&16777232?Cn(e):Sn(e),xn(e);var r=Zn(e);e.teardown=typeof r==`function`?r:null,e.wv=Wn}finally{W=n}}}function G(e){var t=!!(e.f&2);if(Mn?.add(e),U!==null&&!Fn&&!(W!==null&&W.f&16384)&&(Rn===null||!Rn.has(e))){var r=U.deps;if(U.f&2097152)e.rv<Gn&&(e.rv=Gn,Bn===null&&r!==null&&r[Vn]===e?Vn++:Bn===null?Bn=[e]:Bn.push(e));else{U.deps??=[],n.call(U.deps,e)||U.deps.push(e);var i=e.reactions;i===null?e.reactions=[U]:n.call(i,U)||i.push(U)}}if(Nn&&jt.has(e))return jt.get(e);if(t){var a=e;if(Nn){var o=a.v;return(!(a.f&1024)&&a.reactions!==null||rr(a))&&(o=lt(a)),jt.set(a,o),o}var s=!(a.f&512)&&!Fn&&U!==null&&!!(U.f&512),c=(a.f&y)===0;Yn(a)&&(s&&(a.f|=512),ut(a)),s&&!c&&(ft(a),nr(a))}if(ht?.has(e))return ht.get(e);if(e.f&8388608)throw e.v;return e.v}function nr(e){if(e.f|=512,e.deps!==null)for(let r of e.deps){var t=r.reactions;t===null?r.reactions=[e]:n.call(t,e)||t.push(e),r.f&2&&!(r.f&512)&&(ft(r),nr(r))}}function rr(e){if(e.v===A)return!0;if(e.deps===null)return!1;for(let t of e.deps)if(jt.has(t)||t.f&2&&rr(t))return!0;return!1}function ir(e){var t=Fn;try{return Fn=!0,e()}finally{Fn=t}}function ar(e){if(!(typeof e!=`object`||!e||e instanceof EventTarget)){if(D in e)or(e);else if(!Array.isArray(e))for(let t in e){let n=e[t];typeof n==`object`&&n&&D in n&&or(n)}}}function or(e,t=new Set){if(typeof e==`object`&&e&&!(e instanceof EventTarget)&&!t.has(e)){t.add(e),e instanceof Date&&e.getTime();for(let n in e)try{or(e[n],t)}catch{}let n=l(e);if(n!==Object.prototype&&n!==Array.prototype&&n!==Map.prototype&&n!==Set.prototype&&n!==Date.prototype){let t=o(n);for(let n in t){let r=t[n].get;if(r)try{r.call(e)}catch{}}}}}[...`allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback`.split(`.`)];var sr=[`touchstart`,`touchmove`];function cr(e){return sr.includes(e)}var lr=Symbol(`events`),ur=new Set,dr=new Set;function fr(e,t,n,r={}){function i(e){if(r.capture||_r.call(t,e),!e.cancelBubble)return $e(()=>n?.call(this,e))}return e.startsWith(`pointer`)||e.startsWith(`touch`)||e===`wheel`?(i.__removed=!1,Ke(()=>{i.__removed||t.addEventListener(e,i,r)})):t.addEventListener(e,i,r),i}function pr(e,t,n,r,i){var a={capture:r,passive:i},o=fr(e,t,n,a);(t===document.body||t===window||t===document||t instanceof HTMLMediaElement)&&fn(()=>{o.__removed=!0,t.removeEventListener(e,o,a)})}function K(e,t,n){(t[lr]??={})[e]=n}function mr(e){for(var t=0;t<e.length;t++)ur.add(e[t]);for(var n of dr)n(e)}var hr=null,gr=!1;function _r(e){var t=this,n=t.ownerDocument,r=e.type,a=e.composedPath?.()||[],o=a[0]||e.target;hr=e,gr||(gr=!0,setTimeout(()=>{gr=!1,hr=null}));var s=0,c=hr===e&&e[lr];if(c){var l=a.indexOf(c);if(l!==-1&&(t===document||t===window)){e[lr]=t;return}var u=a.indexOf(t);if(u===-1)return;l<=u&&(s=l)}if(o=a[s]||e.target,o!==t){i(e,`currentTarget`,{configurable:!0,get(){return o||n}});var d=U,f=W;In(null),Ln(null);try{for(var p,m=[];o!==null&&o!==t;){try{var h=o[lr]?.[r];h==null||o.disabled&&e.target!==o||h.call(o,e)}catch(e){p?m.push(e):p=e}if(e.cancelBubble)break;s++,o=s<a.length?a[s]:null}if(p){for(let e of m)queueMicrotask(()=>{throw e});throw p}}finally{e[lr]=t,delete e.currentTarget,In(d),Ln(f)}}}var vr=globalThis?.window?.trustedTypes&&globalThis.window.trustedTypes.createPolicy(`svelte-trusted-html`,{createHTML:e=>e});function yr(e){return vr?.createHTML(e)??e}function br(e){var t=rn(`template`);return t.innerHTML=yr(e.replaceAll(`<!>`,`<!---->`)),t.content}function xr(e,t){var n=W;n.nodes===null&&(n.nodes={start:e,end:t,a:null,t:null})}function q(e,t){var n=!!(t&1),r=!!(t&2),i,a=!e.startsWith(`<!>`);return()=>{if(j)return xr(M,null),M;i===void 0&&(i=br(a?e:`<!>`+e),n||(i=Qt(i)));var t=r||qt?document.importNode(i,!0):i.cloneNode(!0);if(n){var o=Qt(t),s=t.lastChild;xr(o,s)}else xr(t,t);return t}}function Sr(e=``){if(!j){var t=Zt(e+``);return xr(t,t),t}var n=M;return n.nodeType===3?an(n):(n.before(n=Zt()),ge(n)),xr(n,n),n}function Cr(){if(j)return xr(M,null),M;var e=document.createDocumentFragment(),t=document.createComment(``),n=Zt();return e.append(t,n),xr(t,n),e}function J(e,t){if(j){var n=W;n.f&32768&&n.nodes.end!==null||(n.nodes.end=M),_e()}else e!==null&&e.before(t)}function wr(e){let t=0,n=Nt(0),r;return()=>{dn()&&(G(n),vn(()=>(t===0&&(r=ir(()=>e(()=>Bt(n)))),t+=1,()=>{Ke(()=>{--t,t===0&&(r?.(),r=void 0,Bt(n))})})))}}var Tr=x|S;function Er(e,t,n,r){new Dr(e,t,n,r)}var Dr=class{parent;is_pending=!1;transform_error;#e;#t=j?M:null;#n;#r;#i;#a=null;#o=null;#s=null;#c=null;#l=0;#u=0;#d=!1;#f=new Set;#p=new Set;#m=null;#h=wr(()=>(this.#m=Nt(this.#l),()=>{this.#m=null}));constructor(e,t,n,r){this.#e=e,this.#n=t,this.#r=e=>{var t=W;t.b=this,t.f|=128,n(e)},this.parent=W.b,this.transform_error=r??this.parent?.transform_error??(e=>e),this.#i=yn(()=>{if(j){let e=be(this.#t);_e();let t=e===`[!`;if(e.startsWith(`[?`)){let t=JSON.parse(e.slice(2));this.#_(t)}else t?this.#b():this.#g()}else this.#x()},Tr),j&&(this.#e=M)}#g(){try{this.#a=bn(()=>this.#r(this.#e))}catch(e){this.error(e)}}#_(e){let t=this.#n.failed,{reset:n,invoke_onerror:r}=this.#v(e);Ke(r),t&&(this.#s=bn(()=>{t(this.#e,()=>e,()=>n)}))}#v(e){var t=!1,n=!1;let r=()=>{this.#y()||(t?me():(t=!0,n&&Fe(),this.#s!==null&&Dn(this.#s,()=>{this.#s=null}),this.#C(()=>{this.#x()})))};return{reset:r,invoke_onerror:()=>{if(!this.#y())try{n=!0,this.#n.onerror?.(e,r),n=!1}catch(e){sn(e,this.#i&&this.#i.parent)}}}}#y(){return(this.#i.f&(v|b))!==0}#b(){let e=this.#n.pending;e&&(this.is_pending=!0,this.#o=bn(()=>e(this.#e)),Ke(()=>{if(!this.#y()){var e=this.#c=document.createDocumentFragment(),t=Zt(),n=!1;e.append(t),this.#a=this.#C(()=>{try{return bn(()=>this.#r(t))}catch(e){try{this.error(e),n=!0}catch(e){sn(e,this.#i.parent)}return null}}),this.#a===null?(this.#c=null,n&&this.#S(I)):this.#u===0&&(this.#e.before(e),this.#c=null,Dn(this.#o,()=>{this.#o=null}),this.#S(I))}}))}#x(){try{if(this.is_pending=this.has_pending_snippet(),this.#u=0,this.#l=0,this.#a=bn(()=>{this.#r(this.#e)}),this.#u>0){var e=this.#c=document.createDocumentFragment();jn(this.#a,e);let t=this.#n.pending;this.#o=bn(()=>t(this.#e))}else this.#S(I)}catch(e){this.error(e)}}#S(e){this.is_pending=!1,e.transfer_effects(this.#f,this.#p)}defer_effect(e){Xe(e,this.#f,this.#p)}is_rendered(){return!this.is_pending&&(!this.parent||this.parent.is_rendered())}has_pending_snippet(){return!!this.#n.pending}#C(e){var t=W,n=U,r=P;Ln(this.#i),In(this.#i),ze(this.#i.ctx);try{return Ct.ensure(),e()}finally{Ln(t),In(n),ze(r)}}#w(e,t){this.has_pending_snippet()?(this.#u+=e,this.#u===0&&(this.#S(t),this.#o&&Dn(this.#o,()=>{this.#o=null}),this.#c&&=(this.#e.before(this.#c),null))):this.parent&&this.parent.#w(e,t)}update_pending_count(e,t){this.#w(e,t),this.#l+=e,!(!this.#m||this.#d)&&(this.#d=!0,Ke(()=>{this.#d=!1,this.#m&&Lt(this.#m,this.#l)}))}get_effect_pending(){return this.#h(),G(this.#m)}error(e){if(e===le||!this.#n.onerror&&!this.#n.failed)throw e;I?.is_fork?(this.#a&&I.skip_effect(this.#a),this.#o&&I.skip_effect(this.#o),this.#s&&I.skip_effect(this.#s),I.oncommit(()=>{this.#y()||this.#T(e)})):this.#T(e)}#T(e){this.#a&&=(wn(this.#a),null),this.#o&&=(wn(this.#o),null),this.#s&&=(wn(this.#s),null),j&&(ge(this.#t),ve(),ge(ye()));let t=this.#n.failed,n=e=>{if(this.#y())return;let{reset:n,invoke_onerror:r}=this.#v(e);r(),t&&!this.#y()&&(this.#s=this.#C(()=>{try{return bn(()=>{var r=W;r.b=this,r.f|=128,t(this.#e,()=>e,()=>n)})}catch(e){return sn(e,this.#i.parent),null}}))};Ke(()=>{if(!this.#y()){var t;try{t=this.transform_error(e)}catch(e){sn(e,this.#i&&this.#i.parent);return}typeof t==`object`&&t&&typeof t.then==`function`?t.then(n,e=>sn(e,this.#i&&this.#i.parent)):n(t)}})}};function Y(e,t){var n=t==null?``:typeof t==`object`?`${t}`:t;n!==(e[k]??=e.nodeValue)&&(e[k]=n,e.nodeValue=`${n}`)}function Or(e,t){return Ar(e,t)}var kr=new Map;function Ar(e,{target:t,anchor:n,props:i={},events:a,context:o,intro:s=!0,transformError:c}){Xt();var l=void 0,u=hn(()=>{var s=n??t.appendChild(Zt());Er(s,{pending:()=>{}},t=>{Be({});var n=P;if(o&&(n.c=o),a&&(i.$$events=a),j&&xr(t,null),l=e(t,i)||He(),j&&(W.nodes.end=M,M===null||M.nodeType!==8||M.data!==`]`))throw fe(),le;Ve()},c);var u=new Set,d=e=>{for(var n=0;n<e.length;n++){var r=e[n];if(!u.has(r)){u.add(r);var i=cr(r);for(let e of[t,document]){var a=kr.get(e);a===void 0&&(a=new Map,kr.set(e,a));var o=a.get(r);o===void 0?(e.addEventListener(r,_r,{passive:i}),a.set(r,1)):a.set(r,o+1)}}}};return d(r(ur)),dr.add(d),()=>{for(var e of u)for(let n of[t,document]){var r=kr.get(n),i=r.get(e);--i==0?(n.removeEventListener(e,_r),r.delete(e),r.size===0&&kr.delete(n)):r.set(e,i)}dr.delete(d),s!==n&&s.parentNode?.removeChild(s)}});return jr.set(l,u),l}var jr=new WeakMap,Mr=class{anchor;#e=new Map;#t=new Map;#n=new Map;#r=new Set;#i=!0;constructor(e,t=!0){this.anchor=e,this.#i=t}#a=e=>{if(this.#e.has(e)){var t=this.#e.get(e),n=this.#t.get(t);if(n)kn(n),this.#r.delete(t);else{var r=this.#n.get(t);r&&(kn(r.effect),this.#t.set(t,r.effect),this.#n.delete(t),r.fragment.lastChild.remove(),this.anchor.before(r.fragment),n=r.effect)}for(let[t,n]of this.#e){if(this.#e.delete(t),t===e)break;let r=this.#n.get(n);r&&(wn(r.effect),this.#n.delete(n))}for(let[e,r]of this.#t){if(e===t||this.#r.has(e))continue;let i=()=>{if(Array.from(this.#e.values()).includes(e)){var t=document.createDocumentFragment();jn(r,t),t.append(Zt()),this.#n.set(e,{effect:r,fragment:t})}else wn(r);this.#r.delete(e),this.#t.delete(e)};this.#i||!n?(this.#r.add(e),Dn(r,i,!1)):i()}}};#o=e=>{this.#e.delete(e);let t=Array.from(this.#e.values());for(let[e,n]of this.#n)t.includes(e)||(wn(n.effect),this.#n.delete(e))};ensure(e,t){var n=I,r=nn();if(t&&!this.#t.has(e)&&!this.#n.has(e)){if(r){var i=document.createDocumentFragment(),a=Zt();i.append(a),this.#n.set(e,{effect:bn(()=>t(a)),fragment:i})}else this.#t.set(e,bn(()=>t(this.anchor)))}if(this.#e.set(n,e),r){for(let[t,r]of this.#t)t===e?n.unskip_effect(r):n.skip_effect(r);for(let[t,r]of this.#n)t===e?n.unskip_effect(r.effect):n.skip_effect(r.effect);n.oncommit(this.#a),n.ondiscard(this.#o)}else j&&(this.anchor=M),this.#a(n)}};function Nr(e,t,n=!1){var r;j&&(r=M,_e());var i=new Mr(e),a=n?x:0;function o(e,t){if(j){var n=be(r);if(e!==parseInt(n.substring(1))){var a=ye();ge(a),i.anchor=a,he(!1),i.ensure(e,t),he(!0);return}}i.ensure(e,t)}yn(()=>{var e=!1;t((t,n=0)=>{e=!0,o(n,t)}),e||o(-1,null)},a)}function Pr(e,t){return t}function Fr(e,t,n){for(var i=[],a=t.length,o,s=t.length,c=0;c<a;c++){let n=t[c];Dn(n,()=>{if(o){if(o.pending.delete(n),o.done.add(n),o.pending.size===0){var t=e.outrogroups;Ir(e,r(o.done)),t.delete(o),t.size===0&&(e.outrogroups=null)}}else--s},!1)}if(s===0){var l=i.length===0&&n!==null&&e.pending.size===0;if(l){var u=n,d=u.parentNode;tn(d),d.append(u),e.items.clear()}Ir(e,t,!l)}else o={pending:new Set(t),done:new Set},(e.outrogroups??=new Set).add(o)}function Ir(e,t,n=!0){var r;if(e.pending.size>0){r=new Set;for(let t of e.pending.values())for(let n of t)r.add(e.items.get(n).e)}for(var i=0;i<t.length;i++){var a=t[i];r?.has(a)?(a.f|=w,jn(a,document.createDocumentFragment())):wn(t[i],n)}}var Lr;function Rr(t,n,i,a,o,s=null){var c=t,l=new Map;if(n&4){var u=t;c=j?ge(Qt(u)):u.appendChild(Zt())}j&&_e();var d=null,f=st(()=>{var t=i();return e(t)?t:t==null?[]:r(t)}),p=new Map,m=!0;function h(e){if(!(_.effect.f&16384)){_.pending.delete(e);var t=G(f);_.fallback=d,Br(_,t,c,n,a),d!==null&&(t.length===0?d.f&33554432?(d.f^=w,Hr(d,null,c)):kn(d):Dn(d,()=>{d=null}))}}function g(e){_.pending.delete(e)}var _={effect:yn(()=>{var e=G(f),t=e.length;let r=!1;j&&be(c)===`[!`!=(t===0)&&(c=ye(),ge(c),he(!1),r=!0);for(var u=new Set,_=I,v=nn(),y=0;y<t;y+=1){j&&M.nodeType===8&&M.data===`]`&&(c=M,r=!0,he(!1));var b=e[y],x=a(b,y),S=m?null:l.get(x);S?(S.v&&Lt(S.v,b),S.i&&Lt(S.i,y),v&&_.unskip_effect(S.e)):(S=Vr(l,m?c:Lr??=Zt(),b,x,y,o,n,i),m||(S.e.f|=w),l.set(x,S)),u.add(x)}if(t===0&&s&&!d&&(m?d=bn(()=>s(c)):(d=bn(()=>s(Lr??=Zt())),d.f|=w)),t>u.size&&Ee(``,``,``),j&&t>0&&ge(ye()),!m){if(p.set(_,u),v){for(let[e,t]of l)u.has(e)||_.skip_effect(t.e);_.oncommit(h),_.ondiscard(g)}else h(_)}r&&he(!0),G(f)}),flags:n,items:l,pending:p,outrogroups:null,fallback:d};m=!1,j&&(c=M)}function zr(e){for(;e!==null&&!(e.f&32);)e=e.next;return e}function Br(e,t,n,i,a){var o=!!(i&8),s=t.length,c=e.items,l=zr(e.effect.first),u,d=null,f,p=[],m=[],h,g,_,v;if(o)for(v=0;v<s;v+=1)h=t[v],g=a(h,v),_=c.get(g).e,_.f&33554432||(_.nodes?.a?.measure(),(f??=new Set).add(_));for(v=0;v<s;v+=1){if(h=t[v],g=a(h,v),_=c.get(g).e,e.outrogroups!==null)for(let t of e.outrogroups)t.pending.delete(_),t.done.delete(_);if(_.f&8192&&(kn(_),o&&(_.nodes?.a?.unfix(),(f??=new Set).delete(_))),_.f&33554432){if(_.f^=w,_===l)Hr(_,null,n);else{var y=d?d.next:l;_===e.effect.last&&(e.effect.last=_.prev),_.prev&&(_.prev.next=_.next),_.next&&(_.next.prev=_.prev),Ur(e,d,_),Ur(e,_,y),Hr(_,y,n),d=_,p=[],m=[],l=zr(d.next);continue}}if(_!==l){if(u!==void 0&&u.has(_)){if(p.length<m.length){var b=m[0],x;d=b.prev;var S=p[0],C=p[p.length-1];for(x=0;x<p.length;x+=1)Hr(p[x],b,n);for(x=0;x<m.length;x+=1)u.delete(m[x]);Ur(e,S.prev,C.next),Ur(e,d,S),Ur(e,C,b),l=b,d=C,--v,p=[],m=[]}else u.delete(_),Hr(_,l,n),Ur(e,_.prev,_.next),Ur(e,_,d===null?e.effect.first:d.next),Ur(e,d,_),d=_;continue}for(p=[],m=[];l!==null&&l!==_;)(u??=new Set).add(l),m.push(l),l=zr(l.next);if(l===null)continue}_.f&33554432||p.push(_),d=_,l=zr(_.next)}if(e.outrogroups!==null){for(let t of e.outrogroups)t.pending.size===0&&(Ir(e,r(t.done)),e.outrogroups?.delete(t));e.outrogroups.size===0&&(e.outrogroups=null)}if(l!==null||u!==void 0){var T=[];if(u!==void 0)for(_ of u)_.f&8192||T.push(_);for(;l!==null;)!(l.f&8192)&&l!==e.fallback&&T.push(l),l=zr(l.next);var E=T.length;if(E>0){var ee=i&4&&s===0?n:null;if(o){for(v=0;v<E;v+=1)T[v].nodes?.a?.measure();for(v=0;v<E;v+=1)T[v].nodes?.a?.fix()}Fr(e,T,ee)}}o&&Ke(()=>{if(f!==void 0)for(_ of f)_.nodes?.a?.apply()})}function Vr(e,t,n,r,i,a,o,s){var c=o&1?o&16?Nt(n):Pt(n,!1,!1):null,l=o&2?Nt(i):null;return{v:c,i:l,e:bn(()=>(a(t,c??n,l??i,s),()=>{e.delete(r)}))}}function Hr(e,t,n){if(e.nodes)for(var r=e.nodes.start,i=e.nodes.end,a=t&&!(t.f&33554432)?t.nodes.start:n;r!==null;){var o=$t(r);if(a.before(r),r===i)return;r=o}}function Ur(e,t,n){t===null?e.effect.first=n:t.next=n,n===null?e.effect.last=t:n.prev=t}function Wr(e,t,n){gn(()=>{var r=ir(()=>t(e,n?.())||{});if(n&&r?.update){var i=!1,a={};vn(()=>{var e=n();ar(e),i&&Se(a,e)&&(a=e,r.update(e))}),i=!0}if(r?.destroy)return()=>r.destroy()})}function Gr(e){var t,n,r=``;if(typeof e==`string`||typeof e==`number`)r+=e;else if(typeof e==`object`){if(Array.isArray(e)){var i=e.length;for(t=0;t<i;t++)e[t]&&(n=Gr(e[t]))&&(r&&(r+=` `),r+=n)}else for(n in e)e[n]&&(r&&(r+=` `),r+=n)}return r}function Kr(){for(var e,t,n=0,r=``,i=arguments.length;n<i;n++)(e=arguments[n])&&(t=Gr(e))&&(r&&(r+=` `),r+=t);return r}function qr(e){return typeof e==`object`?Kr(e):e??``}var Jr=[...` 	
\r\f\xA0\v﻿`];function Yr(e,t,n){var r=e==null?``:``+e;if(t&&(r=r?r+` `+t:t),n){for(var i of Object.keys(n))if(n[i])r=r?r+` `+i:i;else if(r.length)for(var a=i.length,o=0;(o=r.indexOf(i,o))>=0;){var s=o+a;(o===0||Jr.includes(r[o-1]))&&(s===r.length||Jr.includes(r[s]))?r=(o===0?``:r.substring(0,o))+r.substring(s+1):o=s}}return r===``?null:r}function Xr(e,t=!1){var n=t?` !important;`:`;`,r=``;for(var i of Object.keys(e)){var a=e[i];a!=null&&a!==``&&(r+=` `+i+`: `+a+n)}return r}function Zr(e){return e[0]!==`-`||e[1]!==`-`?e.toLowerCase():e}function Qr(e,t){if(t){var n=``,r,i;if(Array.isArray(t)?(r=t[0],i=t[1]):r=t,e){e=String(e).replaceAll(/\/\*.*?\*\//g,``).trim();var a=!1,o=0,s=!1,c=[];r&&c.push(...Object.keys(r).map(Zr)),i&&c.push(...Object.keys(i).map(Zr));var l=0,u=-1;let t=e.length;for(var d=0;d<t;d++){var f=e[d];if(s?f===`/`&&e[d-1]===`*`&&(s=!1):a?a===f&&(a=!1):f===`/`&&e[d+1]===`*`?s=!0:f===`"`||f===`'`?a=f:f===`(`?o++:f===`)`&&o--,!s&&a===!1&&o===0){if(f===`:`&&u===-1)u=d;else if(f===`;`||d===t-1){if(u!==-1){var p=Zr(e.substring(l,u).trim());if(!c.includes(p)){f!==`;`&&d++;var m=e.substring(l,d).trim();n+=` `+m+`;`}}l=d+1,u=-1}}}}return r&&(n+=Xr(r)),i&&(n+=Xr(i,!0)),n=n.trim(),n===``?null:n}return e==null?null:String(e)}function $r(e,t,n,r,i,a){var o=e[ie];if(j||o!==n||o===void 0){var s=Yr(n,r,a);j&&s===e.getAttribute(`class`)||(s==null?e.removeAttribute(`class`):t?e.className=s:e.setAttribute(`class`,s)),e[ie]=n}else if(a&&i!==a)for(var c in a){var l=!!a[c];(i==null||l!==!!i[c])&&e.classList.toggle(c,l)}return a}function ei(e,t={},n,r){for(var i in n){var a=n[i];t[i]!==a&&(n[i]==null?e.style.removeProperty(i):e.style.setProperty(i,a,r))}}function ti(e,t,n,r){var i=e[ae];if(j||i!==t){var a=Qr(t,r);j&&a===e.getAttribute(`style`)||(a==null?e.removeAttribute(`style`):e.style.cssText=a),e[ae]=t}else r&&(Array.isArray(r)?(ei(e,n?.[0],r[0]),ei(e,n?.[1],r[1],`important`)):ei(e,n,r));return r}function ni(e,t){t?e.hasAttribute(`selected`)||e.setAttribute(`selected`,``):e.removeAttribute(`selected`)}function ri(t,n){var r=t.__defaultValue,i=t.multiple,a=i?r??[]:null;if(!i||e(a)){var o=t.selectedIndex,s=n&&i?new Set(t.selectedOptions):null;for(var c of t.options){var l=oi(c);ni(c,i?a.includes(l):Wt(l,r))}if(n){if(s!==null)for(c of t.options){var u=s.has(c);c.selected!==u&&(c.selected=u)}else t.selectedIndex!==o&&(t.selectedIndex=o)}}}function ii(t,n,r=!1){if(t.multiple){if(n==null)return;if(!e(n))return pe();for(var i of t.options)i.selected=n.includes(oi(i))}else{for(i of t.options)if(Wt(oi(i),n)){i.selected=!0;return}r&&n===void 0||(t.selectedIndex=-1)}}function ai(e){var t=new MutationObserver(t=>{t.every(si)||(`__defaultValue`in e&&ri(e,!1),`__value`in e&&ii(e,e.__value))});t.observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:[`value`]}),fn(()=>{t.disconnect()})}function oi(e){return`__value`in e?e.__value:e.value}function si(e){if(e.target.closest(`selectedcontent`)!==null)return!0;if(e.type===`childList`){var t=[...e.addedNodes,...e.removedNodes];return t.length>0&&t.every(e=>e.nodeName===`SELECTEDCONTENT`)}return!1}var ci=Symbol(`is custom element`),li=Symbol(`is html`),ui=ce?`link`:`LINK`,di=ce?`progress`:`PROGRESS`;function fi(e){if(j){var t=!1,n=()=>{if(!t){if(t=!0,e.hasAttribute(`value`)){var n=e.value;X(e,`value`,null),e.value=n}if(e.hasAttribute(`checked`)){var r=e.checked;X(e,`checked`,null),e.checked=r}}};e[oe]=n,Ke(n),Qe()}}function pi(e,t){var n=hi(e);n.value!==(n.value=t??void 0)&&(e.value!==t||t===0&&e.nodeName===di)&&(e.value=t??``)}function mi(e,t){var n=hi(e);n.checked!==(n.checked=t??void 0)&&(e.checked=t)}function X(e,t,n,r){var i=hi(e);j&&(i[t]=e.getAttribute(t),t===`src`||t===`srcset`||t===`href`&&e.nodeName===ui)||i[t]!==(i[t]=n)&&(t===`loading`&&(e[ne]=n),n==null?e.removeAttribute(t):typeof n!=`string`&&_i(e).has(t)?e[t]=n:e.setAttribute(t,n))}function hi(e){return e[re]??={[ci]:e.nodeName.includes(`-`),[li]:e.namespaceURI===ue}}var gi=new Map;function _i(e){var t=e.getAttribute(`is`)||e.nodeName,n=gi.get(t);if(n)return n;gi.set(t,n=new Set);for(var r,i=e,a=Element.prototype;a!==i;){for(var s in r=o(i),r)r[s].set&&s!==`innerHTML`&&s!==`textContent`&&s!==`innerText`&&n.add(s);i=l(i)}return n}var vi=new class e{#e=new WeakMap;#t;#n;static entries=new WeakMap;constructor(e){this.#n=e}observe(e,t){var n=this.#e.get(e)||new Set;return n.add(t),this.#e.set(e,n),this.#r().observe(e,this.#n),()=>{var n=this.#e.get(e);n.delete(t),n.size===0&&(this.#e.delete(e),this.#t.unobserve(e))}}#r(){return this.#t??=new ResizeObserver(t=>{for(var n of t){e.entries.set(n.target,n);for(var r of this.#e.get(n.target)||[])r(n)}})}}({box:`border-box`});function yi(e,t,n){var r=vi.observe(e,()=>n(e[t]));gn(()=>(ir(()=>n(e[t])),r))}function bi(e,t){return e===t||e?.[D]===t}function xi(e=He(),t,n,r){var i=P.r,a=W;return gn(()=>{var o,s;return vn(()=>{o=s,s=r?.()||[],ir(()=>{bi(n(...s),e)||(t(e,...s),o&&bi(n(...o),e)&&t(null,...o))})}),()=>{let r=a;for(;r!==i&&r.parent!==null&&r.parent.f&33554432;)r=r.parent;let o=()=>{s&&bi(n(...s),e)&&t(null,...s)},c=r.teardown;r.teardown=()=>{o(),c?.()}}}),e}var Si=!1;function Ci(e){var t=Si;try{return Si=!1,[e(),Si]}finally{Si=t}}function wi(e,t,n,r){var i=!0,o=!!(n&8),s=!!(n&16),c=r,l=!0,u=void 0,d=()=>s&&i?(u??=it(r),G(u)):(l&&(l=!1,c=s?ir(r):r),c);let f;if(o){var p=D in e||te in e;f=a(e,t)?.set??(p&&t in e?n=>e[t]=n:void 0)}var m,h=!1;o?[m,h]=Ci(()=>e[t]):m=e[t],m===void 0&&r!==void 0&&(m=d(),f&&(i&&je(t),f(m)));var g=i?()=>{var n=e[t];return n===void 0?d():(l=!0,n)}:()=>{var n=e[t];return n!==void 0&&(c=void 0),n===void 0?c:n};if(i&&!(n&4))return g;if(f){var _=e.$$legacy;return(function(e,t){return arguments.length>0?((!i||!t||_||h)&&f(t?g():e),e):g()})}var v=!1,y=(n&1?it:st)(()=>(v=!1,g()));o&&G(y);var b=W;return(function(e,t){if(arguments.length>0){let n=t?G(y):i&&o?Ht(e):e;return R(y,n),v=!0,c!==void 0&&(c=n),e}return Nn&&v||b.f&16384?y.v:G(y)})}function Ti(e){P===null&&we(`onMount`),pn(()=>{let t=ir(e);if(typeof t==`function`)return t})}typeof window<`u`&&((window.__svelte??={}).v??=new Set).add(`5`);function Ei(e){let t=e>>>0,n=()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296};return{random:n,choice(e){return e[Math.floor(n()*e.length)]}}}function Di(e,t){for(let n=e.length-1;n>0;n--){let r=Math.floor(t.random()*(n+1));[e[n],e[r]]=[e[r],e[n]]}}function Oi(){let e=new Uint32Array(1);return crypto.getRandomValues(e),e[0]}var ki=class{index;ratio;forceSpan;constructor(e,t,n=!1){this.index=e,this.ratio=t,this.forceSpan=n}},Ai=class{get x(){return this.parents[0].x}get w(){return this.parents.reduce((e,t)=>e+t.w,0)}get ratio(){return this.h/this.w}get wantedRatio(){return this.photo.ratio}topNeighbor(){let e;for(let t of this.parents[0].cells){if(this===t)return e;e=t}}bottomNeighbor(){let e,t=this.parents[0].cells;for(let n=t.length-1;n>=0;n--){let r=t[n];if(this===r)return e;e=r}}},ji=class extends Ai{parents;photo;extent=null;h;constructor(e,t){super(),this.parents=e,this.photo=t,this.h=this.w*this.wantedRatio}get y(){let e;for(let t of this.parents[0].cells){if(this===t)return e?e.y+e.h:0;e=t}throw Error(`cell is not in its parent column`)}scale(e){this.h*=e}isExtension(){return!1}toString(){return`[${Math.trunc(this.w)} ${Math.trunc(this.h)}${this.extent?`--`:`]`}`}},Mi=class extends Ai{origin;constructor(e){super(),this.origin=e,e.extent=this}get parents(){return[this.origin.parents[1]]}get photo(){return this.origin.photo}get y(){return this.origin.y}get h(){return this.origin.h}scale(){}isExtension(){return!0}toString(){return`------]`}},Ni=class{parent;w;cells=[];constructor(e,t){this.parent=e,this.w=t}get h(){let e=this.cells[this.cells.length-1];return e?e.y+e.h:0}get x(){let e=0;for(let t of this.parent.cols){if(this===t)break;e+=t.w}return e}scale(e){this.w*=e;for(let t of this.cells)t.scale(e)}leftNeighbor(){let e;for(let t of this.parent.cols){if(this===t)return e;e=t}}rightNeighbor(){let e,t=this.parent.cols;for(let n=t.length-1;n>=0;n--){let r=t[n];if(this===r)return e;e=r}}adjustHeight(e){let t=[{y:0,h:0,cells:[]}];for(let e of this.cells){let n=t[t.length-1];e.isExtension()?(n.h=e.y-n.y,t.push({y:e.y+e.h,h:0,cells:[]})):n.cells.push(e)}let n=t[t.length-1];n.h=e-n.y;for(let e of t){if(e.cells.length===0)continue;let t=e.h/e.cells.reduce((e,t)=>e+t.h,0);for(let n of e.cells)n.h*=t}}};function Pi(e){let t=Math.round(e);return Math.abs(e%1)===.5&&t%2!=0?t-1:t}var Fi=class{targetRatio;rng;cols=[];constructor(e,t,n,r){this.targetRatio=t,this.rng=r;let i=e/n;for(let e=0;e<n;e++)this.cols.push(new Ni(this,i))}get noCols(){return this.cols.length}get w(){return this.cols.reduce((e,t)=>e+t.w,0)}get h(){return Math.max(0,...this.cols.map(e=>e.h))}toString(){let e=[],t=0,n=!1;for(;!n;){e.push(``),n=!0;for(let r of this.cols){let i=r.cells.map(e=>e.toString()),a=i.length?i:[``],o=Math.max(...a.map(e=>e.length));r!==this.cols[this.cols.length-1]&&(o+=1);let s=` `.repeat(o),c=a[t];c!==void 0&&(s=c+` `.repeat(o-c.length),t<a.length-1&&(n=!1)),e[e.length-1]+=s}t++}return e.join(`
`)}nextFreeCol(){let e=Math.min(...this.cols.map(e=>e.h));return this.rng.choice(this.cols.filter(t=>t.h===e))}addCellSingleCol(e,t){e.cells.push(new ji([e],t))}canJoin(e,t){let[n,r]=e.h<=t.h?[e,t]:[t,e];if(r.h-n.h<1e-9)return!0;let i=n.cells[n.cells.length-1];return i instanceof ji&&i.extent===null}level(e,t){let[n,r]=e.h<=t.h?[e,t]:[t,e],i=n.cells[n.cells.length-1];i instanceof ji&&i.extent===null&&(i.h+=r.h-n.h)}addCellMultiCol(e,t,n){this.level(e,t);let r=new ji([e,t],n),i=new Mi(r);e.cells.push(r),t.cells.push(i)}addCell(e){let t=this.nextFreeCol(),n=t.leftNeighbor(),r=t.rightNeighbor();if(e.forceSpan){let i=[n,r].filter(e=>e!==void 0);i.sort((e,n)=>Number(this.canJoin(t,n))-Number(this.canJoin(t,e))||Math.abs(t.h-e.h)-Math.abs(t.h-n.h));let a=i[0];if(a!==void 0){a===n?this.addCellMultiCol(a,t,e):this.addCellMultiCol(t,a,e);return}}if(2*this.rng.random()>e.ratio){if(n&&Math.abs(t.h-n.h)<.5*t.w&&this.canJoin(n,t)){this.addCellMultiCol(n,t,e);return}if(r&&Math.abs(t.h-r.h)<.5*t.w&&this.canJoin(t,r)){this.addCellMultiCol(t,r,e);return}}this.addCellSingleCol(t,e)}removeEmptyCols(){for(let e=this.cols.length-1;e>=0;e--)this.cols[e].cells.length===0&&this.cols.splice(e,1)}removeBottomHoles(){for(let e=0;e<=this.cols.length&&this.removeBottomHolesPass();e++);}removeBottomHolesPass(){let e=!1;for(let t of this.cols){let n=t.cells[t.cells.length-1];if(!n||n===t.cells[0])continue;let r=n.topNeighbor(),i=t.leftNeighbor(),a=t.rightNeighbor();if(n instanceof ji&&!n.extent)r instanceof ji&&r.extent&&r.extent.bottomNeighbor()===void 0?(a.cells.push(new Mi(n)),n.parents=[t,a],e=!0):r instanceof Mi&&r.origin.bottomNeighbor()===void 0&&(t.cells.splice(t.cells.indexOf(n),1),i.cells.push(n),t.cells.push(new Mi(n)),n.parents=[i,t],e=!0);else if(n instanceof ji&&n.extent&&n.extent.bottomNeighbor()===void 0){let o=n.extent,s=o.topNeighbor();if(s instanceof ji&&s.extent&&s.extent.bottomNeighbor()===void 0){let r=a.rightNeighbor();t.cells.splice(t.cells.indexOf(n),1),a.cells.splice(a.cells.indexOf(o),1),a.cells.push(n),r.cells.push(o),n.parents=[a,r],e=!0}else r instanceof Mi&&r.origin.bottomNeighbor()===void 0&&(t.cells.splice(t.cells.indexOf(n),1),a.cells.splice(a.cells.indexOf(o),1),i.cells.push(n),t.cells.push(o),n.parents=[i,t],e=!0)}}return e}adjustColsHeights(){let e=this.w*this.targetRatio;for(let t of this.cols)t.adjustHeight(e)}adjust(){this.removeEmptyCols(),this.removeBottomHoles(),this.removeEmptyCols(),this.adjustColsHeights()}setTargetRatio(e){this.targetRatio=e,this.adjustColsHeights()}swapPhotos(e,t){let n=this.photoCells(),r=n.find(t=>t.photo.index===e),i=n.find(e=>e.photo.index===t);r&&i&&([r.photo,i.photo]=[i.photo,r.photo])}photoCells(){return this.cols.flatMap(e=>e.cells.filter(e=>!e.isExtension()))}toLayout(){let e=this.w>0?1/this.w:1;return{width:1,height:this.targetRatio,placements:this.photoCells().map(t=>({photoIndex:t.photo.index,cell:{x:t.x*e,y:t.y*e,w:t.w*e,h:t.h*e}}))}}};function Ii(e,t){let n=e.length;if(n===0)return 1;let r=e.reduce((e,t)=>e+t.height/t.width,0)/n,i=2*n;return Math.max(1,Pi(Math.sqrt(r/t*i)))}function Li(e){if(e!=null&&Number.isFinite(e))return Math.min(100,Math.max(1,Math.floor(e)))}function Ri(e,t,n,r={}){if(e.length===0)return new Fi(1,t,1,n);let i=Li(r.columns)??Ii(e,t);e.some(e=>e.span?.columns===2)&&(i=Math.max(i,2));let a=e.map(e=>e.height/e.width*(e.span?.rows??1)),o=new Fi(1,t,i,n),s=a.map((e,t)=>t);Di(s,n);for(let t of s)o.addCell(new ki(t,a[t],e[t]?.span?.columns===2));return o.adjust(),o}var zi=.04,Bi=.8;function Vi(e){let{first:t,second:n}=e;e.weight=t.weight+n.weight,e.count=t.count+n.count;let r,i=t.weight/t.count,a=n.weight/n.count;if(e.direction===`side`){let o=i/t.ratio,s=a/n.ratio;e.ratio=1/(1/t.ratio+1/n.ratio),r=o/(o+s)}else{let o=i*t.ratio,s=a*n.ratio;e.ratio=t.ratio+n.ratio,r=o/(o+s)}let o=t.weight/(t.weight+n.weight);r=Bi*r+.19999999999999996*o,e.share=Math.min(.96,Math.max(zi,r))}function Hi(e,t,n){let r={kind:`cut`,direction:n,first:e,second:t,ratio:1,weight:1,count:1,share:.5};return Vi(r),r}function Ui(e){e.kind!==`leaf`&&(Ui(e.first),Ui(e.second),Vi(e))}function Wi(e,t){let n=e.span;return{kind:`leaf`,photoIndex:t,ratio:e.height/e.width,weight:(n?.columns??1)*(n?.rows??1),count:1}}function Gi(e,t,n){let r=e.length,i=e.map((e,t)=>Wi(e,t));Di(i,n);let a=Math.log(t);for(;i.length>1;){let e=1/0,t=[];for(let n=0;n+1<i.length;n++){let r=i[n].count+i[n+1].count;r<e?(e=r,t=[n]):r===e&&t.push(n)}let o=n.choice(t),s=i[o],c=i[o+1],l=a*(s.count+c.count)/r,u=Hi(s,c,`side`),d=Hi(s,c,`stack`),f=Math.abs(Math.log(u.ratio)-l)<=Math.abs(Math.log(d.ratio)-l),p=n.random()<.15?!f:f;i.splice(o,2,p?u:d)}let o=i[0];return Yi(o,t,n),o}function Ki(e,t=[]){return e.kind===`cut`&&(t.push(e),Ki(e.first,t),Ki(e.second,t)),t}function qi(e,t,n,r){e.kind===`leaf`?r.push(t*n/e.weight):e.direction===`side`?(qi(e.first,t*e.share,n,r),qi(e.second,t*(1-e.share),n,r)):(qi(e.first,t,n*e.share,r),qi(e.second,t,n*(1-e.share),r))}function Ji(e,t){let n=[];qi(e,1,t,n);let r=n.map(e=>Math.log(e)),i=r.reduce((e,t)=>e+t,0)/r.length,a=Math.sqrt(r.reduce((e,t)=>e+(t-i)**2,0)/r.length);return 3*Math.abs(Math.log(e.ratio)-Math.log(t))+a}function Yi(e,t,n){if(e.kind===`leaf`)return;let r=Ki(e),i=Zi(e),a=Math.min(1500,Math.max(150,Math.round(6e4/i.length))),o=Ji(e,t);for(let s=0;s<a&&o>.001;s++)if(n.random()<.5){let i=n.choice(r),a=()=>{i.direction=i.direction===`side`?`stack`:`side`,Ui(e)};a();let s=Ji(e,t);s<=o?o=s:a()}else if(i.length>1){let r=n.choice(i),a=n.choice(i);if(r===a)continue;Xi(r,a),Ui(e);let s=Ji(e,t);s<=o?o=s:(Xi(r,a),Ui(e))}}function Xi(e,t){[e.photoIndex,t.photoIndex]=[t.photoIndex,e.photoIndex],[e.ratio,t.ratio]=[t.ratio,e.ratio],[e.weight,t.weight]=[t.weight,e.weight]}function Zi(e,t=[]){return e.kind===`leaf`?t.push(e):(Zi(e.first,t),Zi(e.second,t)),t}function Qi(e,t,n){if(e.kind===`leaf`)n.push({photoIndex:e.photoIndex,cell:t});else if(e.direction===`side`){let r=t.w*e.share;Qi(e.first,{x:t.x,y:t.y,w:r,h:t.h},n),Qi(e.second,{x:t.x+r,y:t.y,w:t.w-r,h:t.h},n)}else{let r=t.h*e.share;Qi(e.first,{x:t.x,y:t.y,w:t.w,h:r},n),Qi(e.second,{x:t.x,y:t.y+r,w:t.w,h:t.h-r},n)}}var $i=class{root;ratio;constructor(e,t){this.root=e,this.ratio=t}setTargetRatio(e){this.ratio=e}swapPhotos(e,t){if(!this.root)return;let n=Zi(this.root),r=n.find(t=>t.photoIndex===e),i=n.find(e=>e.photoIndex===t);r&&i&&([r.photoIndex,i.photoIndex]=[i.photoIndex,r.photoIndex])}toLayout(){let e=[];return this.root&&Qi(this.root,{x:0,y:0,w:1,h:this.ratio},e),{width:1,height:this.ratio,placements:e}}};function ea(e,t,n){return e.length===0?new $i(null,t):new $i(Gi(e,t,n),t)}function ta(e,t){let n=e.width*e.height,r=0,i=0;for(let{photoIndex:n,cell:a}of e.placements){r+=a.w*a.h;let e=t[n];if(!e||a.w<=0||a.h<=0){i+=1;continue}let o=e.height/e.width,s=a.h/a.w;i+=1-Math.min(s/o,o/s)}return{uncovered:n>0?Math.max(0,1-r/n):0,cutOff:e.placements.length>0?i/e.placements.length:0}}function na(e,t){return Math.abs(e.uncovered-t.uncovered)>1e-6?e.uncovered<t.uncovered:e.cutOff<t.cutOff}function ra(e,t,n,r){let i=Math.max(1,Math.floor(r)),a=Ei(n),o;for(let n=0;n<i;n++){let n=Math.floor(a.random()*2**32)>>>0,r=e(Ei(n)),s=ta(r.toLayout(),t);(!o||na(s,o.score))&&(o={page:r,seed:n,score:s,tried:i})}return o}function ia(e,t,n,r,i={}){return e===`gallery`?ea(t,n,r):Ri(t,n,r,i)}function aa(e,t,n,r,{tries:i=e===`gallery`?10:30,...a}={}){return ra(r=>ia(e,t,n,r,a),t,r,i)}var oa=.04;function sa(e){return e==null||!Number.isFinite(e)?6:Math.min(20,Math.max(1,Math.floor(e)))}function ca(e){return e==null||!Number.isFinite(e)?1:Math.min(20,Math.max(1,Math.floor(e)))}function la(e,t){return e+Math.imul(t,2654435761)>>>0}function ua(e,t){let n=Array(t).fill(0);for(let r of e){let e=Math.min(t-1,Math.max(0,r));n[e]=(n[e]??0)+1}return n}function da(e,t){let n=ca(t),r=Math.floor(e/n),i=e%n,a=[];for(let e=0;e<n;e++){let t=r+ +(e<i);for(let n=0;n<t;n++)a.push(e)}return{pageOf:a,pages:n}}function fa(e,t){let n=[...e];for(let e=n.length-1;e>0;e--){let r=Math.floor(t.random()*(e+1));[n[e],n[r]]=[n[r],n[e]]}return n}function pa(e,t,n){return e.map(e=>e===t?n:t<n&&e>t&&e<=n?e-1:t>n&&e>=n&&e<t?e+1:e)}function ma(e,t){let n=t>0?t-1:0;return e.map(e=>e===t?t>0?n:0:e>t?e-1:e)}var ha=class e{subs;maps;ratio;constructor(e,t,n){this.subs=e,this.maps=t,this.ratio=n}static wrap(t,n,r){return new e([t],[Array.from({length:n},(e,t)=>t)],r)}get pageCount(){return this.subs.length}pageOfPhoto(e){return this.maps.findIndex(t=>t.includes(e))}setTargetRatio(e){this.ratio=e;for(let t of this.subs)t?.setTargetRatio(e)}swapPhotos(e,t){let n=this.pageOfPhoto(e),r=this.pageOfPhoto(t);if(n<0||r<0)return;let i=this.maps[n],a=this.maps[r],o=i.indexOf(e),s=a.indexOf(t);n===r?this.subs[n]?.swapPhotos(o,s):(i[o]=t,a[s]=e)}addPage(){this.subs.push(null),this.maps.push([])}movePage(e,t){let[n]=this.subs.splice(e,1),[r]=this.maps.splice(e,1);this.subs.splice(t,0,n??null),this.maps.splice(t,0,r??[])}toLayout(){let e=this.subs.length,t=e+(e-1)*oa,n=[],r=[];return this.subs.forEach((e,i)=>{let a=i*1.04;if(r.push({x:a/t,w:1/t}),!e)return;let o=this.maps[i];for(let r of e.toLayout().placements){let{x:e,y:s,w:c,h:l}=r.cell;n.push({photoIndex:o[r.photoIndex],cell:{x:(a+e)/t,y:s/t,w:c/t,h:l/t},page:i})}}),{width:1,height:this.ratio/t,placements:n,pages:r}}};function ga(e,t,n,r,i,a,o={}){let s=ca(r),c=[],l=[];for(let r=0;r<s;r++){let u=t.map((e,t)=>t).filter(e=>Math.min(s-1,Math.max(0,n[e]??0))===r);l.push(u),c.push(u.length===0?null:ia(e,u.map(e=>t[e]),i,Ei(la(a,r)),o))}return new ha(c,l,i)}function _a(e,t,n,r,i,a,o,s={}){let c=Ei(a),l;for(let a=0;a<Math.max(1,o);a++){let a=Math.floor(c.random()*2**32)>>>0,o=ga(e,t,n,r,i,a,s),u=ta(o.toLayout(),t);(!l||na(u,l.score))&&(l={page:o,seed:a,score:u})}let u=l;return{page:u.page,seed:u.seed}}function va(e,t){let n=e.pages?.[t];return n?{width:1,height:e.height/n.w,placements:e.placements.filter(e=>e.page===t).map(e=>({photoIndex:e.photoIndex,cell:{x:(e.cell.x-n.x)/n.w,y:e.cell.y/n.w,w:e.cell.w/n.w,h:e.cell.h/n.w}}))}:e}function ya(e){return(e.pages??[]).map((e,t)=>t).filter(t=>e.placements.some(e=>e.page===t))}function ba(e,t,n){let r=String(t).length;return Array.from({length:t},(t,i)=>`${e}_${String(i+1).padStart(r,`0`)}.${n}`)}var xa={columns:1,rows:1},Sa={zoom:1,x:.5,y:.5},Ca=(e,t,n)=>Math.min(n,Math.max(t,e));function wa(e){let t=(e,t)=>Number.isFinite(e)?e:t;return{zoom:Ca(t(e.zoom,1),1,5),x:Ca(t(e.x,.5),0,1),y:Ca(t(e.y,.5),0,1)}}function Ta(e){return e===void 0||e.zoom===Sa.zoom&&e.x===Sa.x&&e.y===Sa.y}function Ea(e,t,n,r,i=1){let a=Math.max(n/e,r/t)*Math.max(1,i),o=e*a,s=t*a;return{w:o,h:s,spareX:Math.max(0,o-n),spareY:Math.max(0,s-r)}}function Da(e,t,n,r,i,a,o){let s=Ea(r,i,a,o,e.zoom);return wa({zoom:e.zoom,x:s.spareX>0?e.x-t/s.spareX:e.x,y:s.spareY>0?e.y-n/s.spareY:e.y})}function Oa(e,t,n,r,i,a){let o=Ca(t,1,5),s=Ea(n,r,i,a,e.zoom),c=Ea(n,r,i,a,o),l=t=>{let n=t===`x`?s.w:s.h,r=t===`x`?s.spareX:s.spareY,o=t===`x`?i:a;return(e[t]*r+o/2)/n},u=e=>{let t=e===`x`?c.w:c.h,n=e===`x`?c.spareX:c.spareY,r=e===`x`?i:a;return n>0?(l(e)*t-r/2)/n:.5};return wa({zoom:o,x:u(`x`),y:u(`y`)})}var ka=1080;function Aa(e){if(e==null||!Number.isFinite(e))return 0;let t=Math.floor(e);return t<2?0:Math.min(20,t)}function ja(e,t){let n=[];for(let r=1;r<t;r++)n.push(e*r/t);return n}function Ma(e,t){return Array.from({length:e},(e,n)=>({x:n*t,y:0,w:t,h:t}))}function Na(e,t,n){let r=String(t).length;return Array.from({length:t},(t,i)=>`${e}_${String(i+1).padStart(r,`0`)}.${n}`)}var Pa=`# PhotoCollage translation file
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
"%(imgname)s".`,{imgname:e.name})}),null}finally{i?.(++c,s.length)}}))).filter(e=>e!==null)}var uo=`collage-creator`,fo=`files`,po=`meta`,mo=`session`;function ho(){return new Promise((e,t)=>{let n=indexedDB.open(uo,1);n.onupgradeneeded=()=>{n.result.createObjectStore(fo),n.result.createObjectStore(po)},n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error??Error(`could not open storage`))})}function go(e){return new Promise((t,n)=>{e.onsuccess=()=>t(e.result),e.onerror=()=>n(e.error??Error(`storage request failed`))})}function _o(e){return new Promise((t,n)=>{e.oncomplete=()=>t(),e.onerror=()=>n(e.error??Error(`storage transaction failed`)),e.onabort=()=>n(e.error??Error(`storage transaction aborted`))})}async function vo(e,t){let n=await ho();try{let r=new Set((await go(n.transaction(fo,`readonly`).objectStore(fo).getAllKeys())).map(String)),i=[];for(let[e,n]of t)r.has(e)||i.push([e,{name:n.name,type:n.type,lastModified:n.lastModified,data:await n.arrayBuffer()}]);let a=n.transaction([fo,po],`readwrite`),o=a.objectStore(fo);for(let e of r)t.has(e)||o.delete(e);for(let[e,t]of i)o.put(t,e);a.objectStore(po).put(e,mo),await _o(a)}finally{n.close()}}async function yo(e){let t=await ho();try{let n=t.transaction([fo,po],`readonly`),r=To(await go(n.objectStore(po).get(mo)),e);if(!r)return null;let i=new Map;for(let{key:e}of r.photos){let t=await go(n.objectStore(fo).get(e));t?.data instanceof ArrayBuffer&&typeof t.name==`string`&&i.set(e,new File([t.data],t.name,{type:t.type??``,lastModified:t.lastModified??0}))}return{session:r,files:i}}finally{t.close()}}function bo(e){let t=e;return typeof t==`object`&&!!t&&(t.columns===1||t.columns===2)&&(t.rows===1||t.rows===2||t.rows===3)}function xo(e){let t=e;return typeof t==`object`&&!!t&&typeof t.pages==`number`&&typeof t.perPage==`number`}function So(e){let t=e;return typeof t==`object`&&!!t&&[t.zoom,t.x,t.y].every(e=>typeof e==`number`&&Number.isFinite(e))}function Co(e,t,n){let r=Aa(typeof e==`number`?e:void 0);return r>0&&typeof t==`number`&&typeof n==`number`&&t===r*n?r:0}function wo(e,t){let n=typeof e==`object`&&e?e:{},r=(e,t,n,r)=>typeof e==`number`&&Number.isFinite(e)&&e>=t&&e<=n?e:r;return{width:Math.round(r(n.width,1,1e6,t.width)),height:Math.round(r(n.height,1,1e6,t.height)),borderWidth:r(n.borderWidth,0,.2,t.borderWidth),borderColor:typeof n.borderColor==`string`&&/^#[0-9a-f]{6}$/i.test(n.borderColor)?n.borderColor:t.borderColor,cornerStyle:n.cornerStyle===`slight`||n.cornerStyle===`rounded`?n.cornerStyle:`none`,outerBorder:typeof n.outerBorder==`boolean`?n.outerBorder:t.outerBorder,splitImages:Co(n.splitImages,n.width,n.height),format:n.format===`jpeg`?`jpeg`:`png`,jpegQuality:r(n.jpegQuality,.1,1,t.jpegQuality)}}function To(e,t){let n=e;if(typeof n!=`object`||!n||n.v!==1||!Array.isArray(n.photos))return null;let r=[];for(let e of n.photos){if(typeof e?.key!=`string`)continue;let t={key:e.key,span:bo(e.span)?e.span:{...xa}};So(e.crop)&&!Ta(e.crop)&&(t.crop=wa(e.crop)),typeof e.page==`number`&&Number.isInteger(e.page)&&e.page>=0&&(t.page=Math.min(19,e.page)),r.push(t)}let i=n.seed;return{v:1,photos:r,seed:typeof i==`number`&&Number.isInteger(i)&&i>=0&&i<=4294967295?i:0,columns:typeof n.columns==`number`&&n.columns>=1?Math.floor(n.columns):void 0,layoutStyle:n.layoutStyle===`gallery`?`gallery`:`mosaic`,...xo(n.book)?{book:{pages:ca(n.book.pages),perPage:sa(n.book.perPage)}}:{},settings:wo(n.settings,t)}}var Eo=101010256,Do=33639248,Oo=67324752;function ko(e){return/\.zip$/i.test(e.name)||e.type===`application/zip`||e.type===`application/x-zip-compressed`}var Ao={avif:`image/avif`,bmp:`image/bmp`,gif:`image/gif`,heic:`image/heic`,heif:`image/heif`,jpeg:`image/jpeg`,jpg:`image/jpeg`,png:`image/png`,webp:`image/webp`};async function jo(e,t,n){return new DataView(await e.slice(t,n).arrayBuffer())}function Mo(e,t){return new Date(1980+(t>>9),(t>>5&15)-1,t&31,e>>11,e>>5&63,(e&31)*2).getTime()}function No(e){return e.endsWith(`/`)||e.startsWith(`__MACOSX/`)||e.includes(`/__MACOSX/`)?!1:!e.split(`/`).some(e=>e.startsWith(`.`))}async function Po(e){let t=await jo(e,Math.max(0,e.size-22-65535),e.size),n=-1;for(let e=t.byteLength-22;e>=0;e--)if(t.getUint32(e,!0)===Eo){n=e;break}if(n<0)throw Error(`not a zip file`);let r=t.getUint16(n+10,!0),i=t.getUint32(n+12,!0),a=t.getUint32(n+16,!0);if(a===4294967295||a+i>e.size)throw Error(`unsupported zip file`);let o=await jo(e,a,a+i),s=new TextDecoder,c=[],l=[],u=[],d=0;for(let t=0;t<r;t++){if(d+46>o.byteLength||o.getUint32(d,!0)!==Do)throw Error(`bad zip directory`);let t=o.getUint16(d+8,!0),n=o.getUint16(d+10,!0),r=o.getUint16(d+12,!0),i=o.getUint16(d+14,!0),a=o.getUint32(d+20,!0),f=o.getUint16(d+28,!0),p=o.getUint16(d+30,!0),m=o.getUint16(d+32,!0),h=o.getUint32(d+42,!0),g=s.decode(new Uint8Array(o.buffer,d+46,f));if(d+=46+f+p+m,!No(g))continue;let _=g.split(`/`).pop()??g,v=Ao[_.split(`.`).pop()?.toLowerCase()??``];if(!v){l.push(_);continue}if(t&1||n!==0&&n!==8||a===4294967295){u.push(_);continue}let y=await jo(e,h,h+30);if(y.getUint32(0,!0)!==Oo)throw Error(`bad zip entry`);let b=h+30+y.getUint16(26,!0)+y.getUint16(28,!0),x=e.slice(b,b+a),S=n===0?x:await new Response(x.stream().pipeThrough(new DecompressionStream(`deflate-raw`))).blob();c.push(new File([S],_,{type:v,lastModified:Mo(r,i)}))}return{files:c,others:l,unreadable:u}}var Fo=(()=>{let e=new Uint32Array(256);for(let t=0;t<256;t++){let n=t;for(let e=0;e<8;e++)n=n&1?3988292384^n>>>1:n>>>1;e[t]=n>>>0}return e})();function Io(e){let t=4294967295;for(let n of e)t=Fo[(t^n)&255]^t>>>8;return(t^4294967295)>>>0}function Lo(e){let t=Math.max(1980,e.getFullYear());return{time:e.getHours()<<11|e.getMinutes()<<5|e.getSeconds()>>1,date:t-1980<<9|e.getMonth()+1<<5|e.getDate()}}function Ro(e,t=new Date){let n=new TextEncoder,r=Lo(t),i=[],a=[],o=0;for(let t of e){let e=n.encode(t.name),s=Io(t.data),c=t.data.length,l=new DataView(new ArrayBuffer(30));l.setUint32(0,67324752,!0),l.setUint16(4,20,!0),l.setUint16(6,2048,!0),l.setUint16(8,0,!0),l.setUint16(10,r.time,!0),l.setUint16(12,r.date,!0),l.setUint32(14,s,!0),l.setUint32(18,c,!0),l.setUint32(22,c,!0),l.setUint16(26,e.length,!0),l.setUint16(28,0,!0),i.push(new Uint8Array(l.buffer),e,t.data);let u=new DataView(new ArrayBuffer(46));u.setUint32(0,33639248,!0),u.setUint16(4,20,!0),u.setUint16(6,20,!0),u.setUint16(8,2048,!0),u.setUint16(10,0,!0),u.setUint16(12,r.time,!0),u.setUint16(14,r.date,!0),u.setUint32(16,s,!0),u.setUint32(20,c,!0),u.setUint32(24,c,!0),u.setUint16(28,e.length,!0),u.setUint32(42,o,!0),a.push(new Uint8Array(u.buffer),e),o+=30+e.length+c}let s=a.reduce((e,t)=>e+t.length,0),c=new DataView(new ArrayBuffer(22));c.setUint32(0,101010256,!0),c.setUint16(8,e.length,!0),c.setUint16(10,e.length,!0),c.setUint32(12,s,!0),c.setUint32(16,o,!0);let l=[...i,...a,new Uint8Array(c.buffer)],u=new Uint8Array(l.reduce((e,t)=>e+t.length,0)),d=0;for(let e of l)u.set(e,d),d+=e.length;return u}function zo(e){return new Blob([Ro(e)],{type:`application/zip`})}function Bo(e){let t=e.sizes.shift(),n=Math.max(Math.ceil(t[0]),1),r=Math.max(Math.ceil(t[1]),1),i=[n-1,r-1,1,1],a=performance.now(),o=typeof WorkerGlobalScope<`u`&&self instanceof WorkerGlobalScope,s,c;o?(s=new OffscreenCanvas(1,1),c=new OffscreenCanvas(n,r)):(s=document.createElement(`canvas`),s.width=1,s.height=1,c=document.createElement(`canvas`),c.width=n,c.height=r);let l=s.getContext(`2d`),u=c.getContext(`2d`);u&&(u.fillRect.apply(u,i),l.drawImage(c,n-1,r-1,1,1,0,0,1,1));let d=l&&l.getImageData(0,0,1,1).data[3]!==0,f=parseInt(performance.now()-a);return[s,c].forEach((e=>{e.height=0,e.width=0})),o?(postMessage({width:n,height:r,testTime:f,isTestPass:d}),!d&&e.sizes.length&&setTimeout((()=>{Bo(e)}),0)):d?e.onSuccess({width:n,height:r,testTime:f}):(e.onError({width:n,height:r,testTime:f}),e.sizes.length&&setTimeout((()=>{Bo(e)}),0)),d}var Vo={area:[16384,14188,11402,11180,10836,8192,4096,1],height:[8388607,65535,32767,16384,8192,4096,1],width:[4194303,65535,32767,16384,8192,4096,1]},Ho={max:null,min:1,sizes:[],step:1024,useWorker:!1,onError:Function.prototype,onSuccess:Function.prototype},Uo={};function Wo(e){let t=e.width===e.height,n=e.height===1,r=e.width===1,i=[];if(!e.width||!e.height)e.sizes.forEach((e=>{let a=t||n?e:1,o=t||r?e:1;i.push([a,o])}));else{let a=e.min||Ho.min,o=e.step||Ho.step,s=Math.max(e.width,e.height);for(;s>=a;){let e=t||n?s:1,a=t||r?s:1;i.push([e,a]),s-=o}}return i}function Go(e){let t=typeof window<`u`,n=t&&`Promise`in window,r=t&&`HTMLCanvasElement`in window,i=t&&`OffscreenCanvas`in window,a=URL.createObjectURL(new Blob([])).slice(-36),o=performance.now(),{onError:s,onSuccess:c,...l}=e,u=()=>parseInt(performance.now()-o),d=null;if(!r)return!1;if(e.useWorker&&i){let e=`\n            var canvasTest = ${Bo.toString()};\n            onmessage = function(e) {\n                canvasTest(e.data);\n            };\n        `,t=new Blob([e],{type:`application/javascript`}),n=URL.createObjectURL(t);d=new Worker(n),URL.revokeObjectURL(n),d.onmessage=function(e){let{width:t,height:n,testTime:r,isTestPass:i}=e.data,o={width:t,height:n,testTime:r,totalTime:u()};i?(Uo[a].onSuccess(o),delete Uo[a]):Uo[a].onError(o)}}if(n)return new Promise((t=>{let n={...e,onError(n){let{width:r,height:i,testTime:a}=n,o={width:r,height:i,testTime:a,totalTime:u()},c;if(e.sizes.length===0)c=!0;else{let[[t,n]]=e.sizes.slice(-1);c=r===t&&i===n}s(o),c&&t({...o,success:!1})},onSuccess(e){let{width:n,height:r,testTime:i}=e,a={width:n,height:r,testTime:i,totalTime:u()};c(a),t({...a,success:!0})}};if(d){let{onError:e,onSuccess:t}=n;Uo[a]={onError:e,onSuccess:t},d.postMessage(l)}else Bo(n)}));if(d)Uo[a]={onError:s,onSuccess:c},d.postMessage(l);else return Bo(e)}var Ko={maxArea(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=Wo({width:e.max,height:e.max,min:e.min,step:e.step,sizes:[...Vo.area]});return Go({...Ho,...e,sizes:t})},maxHeight(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=Wo({width:1,height:e.max,min:e.min,step:e.step,sizes:[...Vo.height]});return Go({...Ho,...e,sizes:t})},maxWidth(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=Wo({width:e.max,height:1,min:e.min,step:e.step,sizes:[...Vo.width]});return Go({...Ho,...e,sizes:t})},test(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t={...Ho,...e};return t.sizes=[...t.sizes],t.width&&t.height&&(t.sizes=[[t.width,t.height]]),Go(t)}},qo={maxSide:4096,maxArea:16777216};async function Jo(){try{let[e,t,n]=await Promise.all([Ko.maxArea(),Ko.maxWidth(),Ko.maxHeight()]);return e.success?{maxArea:e.width*e.height,maxSide:Math.max(Math.min(t.success?t.width:0,n.success?n.height:0),e.width)}:qo}catch{return qo}}function Yo(e,t,n){let r=Math.min(1,n.maxSide/Math.max(e,t),Math.sqrt(n.maxArea/(e*t)));return r>=1?{width:e,height:t,clamped:!1}:{width:Math.max(1,Math.floor(e*r)),height:Math.max(1,Math.floor(t*r)),clamped:!0}}function Xo(e,t,n){return e.placements.map(({cell:r})=>{let i=Math.round(r.x/e.width*t),a=Math.round(r.y/e.height*n),o=Math.round((r.x+r.w)/e.width*t),s=Math.round((r.y+r.h)/e.height*n);return{x:i,y:a,w:o-i,h:s-a}})}function Zo(e,t,n){return e<=0?0:Math.max(1,Math.round(e*Math.max(t,n)))}function Qo(e,t,n,r){let i=Math.min(1,Math.max(n/e,r/t));return{width:Math.max(1,Math.ceil(e*i)),height:Math.max(1,Math.ceil(t*i))}}var $o={slight:.08,rounded:.25};function es(e,t,n){return e===`slight`||e===`rounded`?Math.min(t,n)*$o[e]:0}function ts(e,t,n,r,i=!0){let a=Math.floor(r/2),o=r-a,s=i?r:0,c=e.x<=0?s:o,l=e.y<=0?s:o,u=e.x+e.w>=t?s:a,d=e.y+e.h>=n?s:a,f=e.w-c-u,p=e.h-l-d;return{x:f>0?e.x+c:e.x+e.w/2,y:p>0?e.y+l:e.y+e.h/2,w:Math.max(0,f),h:Math.max(0,p)}}var ns={topLeft:!1,topRight:!1,bottomRight:!1,bottomLeft:!1};function rs(e,t,n,r){if(r)return ns;let i=e.x<=0,a=e.y<=0,o=e.x+e.w>=t,s=e.y+e.h>=n;return{topLeft:i||a,topRight:o||a,bottomRight:o||s,bottomLeft:i||s}}function is(e,t,n,r=ns){e.beginPath();let i=es(n,t.w,t.h);if(i<=0){e.rect(t.x,t.y,t.w,t.h);return}let a=r.topLeft?0:i,o=r.topRight?0:i,s=r.bottomRight?0:i,c=r.bottomLeft?0:i,l=t.x+t.w,u=t.y+t.h;e.moveTo(t.x+a,t.y),e.lineTo(l-o,t.y),o>0?e.arcTo(l,t.y,l,t.y+o,o):e.lineTo(l,t.y),e.lineTo(l,u-s),s>0?e.arcTo(l,u,l-s,u,s):e.lineTo(l,u),e.lineTo(t.x+c,u),c>0?e.arcTo(t.x,u,t.x,u-c,c):e.lineTo(t.x,u),e.lineTo(t.x,t.y+a),a>0?e.arcTo(t.x,t.y,t.x+a,t.y,a):e.lineTo(t.x,t.y),e.closePath()}function as(e,t,n,r){e.fillStyle=r!==void 0&&r.corners!==`none`?r.color:`#ffffff`,e.fillRect(0,0,t,n)}function os(e,t,n,r,i,a,o,s,c){if(s.corners===`none`){ss(e,t,n,r,i,c);return}let l=ts(i,a,o,s.border,s.outer);l.w<=0||l.h<=0||(e.save(),is(e,l,s.corners,rs(i,a,o,s.outer)),e.clip(),ss(e,t,n,r,l,c),e.restore())}function ss(e,t,n,r,i,a){if(i.w<=0||i.h<=0)return;let{w:o,h:s,spareX:c,spareY:l}=Ea(n,r,i.w,i.h,a?.zoom);e.save(),e.beginPath(),e.rect(i.x,i.y,i.w,i.h),e.clip(),e.imageSmoothingEnabled=!0,e.imageSmoothingQuality=`high`,e.drawImage(t,i.x-c*(a?.x??.5),i.y-l*(a?.y??.5),o,s),e.restore()}function cs(e,t,n,r,i,a){if(i<=0)return;e.save(),e.beginPath(),e.rect(0,0,n,r),e.clip(),e.fillStyle=a;let o=Math.floor(i/2);for(let a of t)a.x>0&&e.fillRect(a.x-o,a.y-o,i,a.h+i),a.y>0&&e.fillRect(a.x-o,a.y-o,a.w+i,i),a.x+a.w<n&&e.fillRect(a.x+a.w-o,a.y-o,i,a.h+i),a.y+a.h<r&&e.fillRect(a.x-o,a.y+a.h-o,a.w+i,i);e.restore()}function ls(e,t,n,r,i){let{border:a,color:o}=i;a<=0||i.corners!==`none`||(cs(e,t,n,r,a,o),i.outer&&(e.fillStyle=o,e.fillRect(0,0,n,a),e.fillRect(0,r-a,n,a),e.fillRect(0,0,a,r),e.fillRect(n-a,0,a,r)))}function us(e){return e===`jpeg`?`image/jpeg`:`image/png`}function ds(e){return e===`jpeg`?`jpg`:`png`}async function fs(e){let t=await ps(e),{settings:n}=e,r=n.splitImages;if(r<2)return t[0];let i=Na(e.baseName??`collage`,r,ds(n.format));return zo(await Promise.all(t.map(async(e,t)=>({name:i[t],data:new Uint8Array(await e.arrayBuffer())}))))}async function ps(e){let{layout:t,photos:n,settings:r,pool:i,signal:a,onProgress:o}=e,{width:s,height:c}=r,l=new OffscreenCanvas(s,c),u=l.getContext(`2d`);if(!u)throw Error(`2D canvas is not available`);let d={corners:r.cornerStyle,border:Zo(r.borderWidth,s,c),color:r.borderColor,outer:r.outerBorder},f=Xo(t,s,c);as(u,s,c,d);let p=()=>i.terminate();a?.aborted&&p(),a?.addEventListener(`abort`,p,{once:!0});try{let e=0;if(o?.(0,f.length),await Promise.all(t.placements.map(async(t,r)=>{let a=n[t.photoIndex],l=f[r];if(!a||!l)return;let p=Math.max(1,a.crop?.zoom??1),m=Qo(a.width,a.height,l.w*p,l.h*p),h=await i.run({kind:`cell`,file:a.file,...m});if(!h.ok||h.kind!==`cell`)throw Error(h.ok?`unexpected response`:h.error);try{os(u,h.bitmap,h.bitmap.width,h.bitmap.height,l,s,c,d,a.crop)}finally{h.bitmap.close()}o?.(++e,f.length)})),a?.aborted)throw new DOMException(`Cancelled`,`AbortError`);ls(u,f,s,c,d);let p={type:us(r.format),quality:r.format===`jpeg`?r.jpegQuality:void 0},m=r.splitImages;if(m<2)return[await l.convertToBlob(p)];let h=[];for(let e of Ma(m,c)){if(a?.aborted)throw new DOMException(`Cancelled`,`AbortError`);let t=new OffscreenCanvas(e.w,e.h),n=t.getContext(`2d`);if(!n)throw Error(`2D canvas is not available`);n.drawImage(l,e.x,e.y,e.w,e.h,0,0,e.w,e.h),h.push(await t.convertToBlob(p))}return h}finally{a?.removeEventListener(`abort`,p)}}var ms=class{size;workers=[];idle=[];queue=[];running=new Map;nextId=1;terminated=!1;readyCount=0;resolveReady=()=>{};ready=new Promise(e=>{this.resolveReady=e});constructor(e=hs()){this.size=e;for(let t=0;t<e;t++){let t=new Worker(new URL(new URL(`export.worker-DmYFRvHx.js`,import.meta.url).href,``+import.meta.url),{type:`module`});t.onmessage=n=>{n.data.kind===`ready`?++this.readyCount===e&&this.resolveReady():this.onDone(t,n.data)},t.onerror=e=>this.onCrash(t,e.message),this.workers.push(t),this.idle.push(t)}}run(e){return this.terminated?Promise.reject(new DOMException(`Pool terminated`,`AbortError`)):new Promise((t,n)=>{this.queue.push({req:e,resolve:t,reject:n}),this.pump()})}terminate(){this.terminated=!0;let e=new DOMException(`Cancelled`,`AbortError`);for(let t of this.queue)t.reject(e);for(let{job:t}of this.running.values())t.reject(e);this.queue=[],this.running.clear();for(let e of this.workers)e.terminate();this.workers=[],this.idle=[]}pump(){for(;this.idle.length&&this.queue.length;){let e=this.idle.pop(),t=this.queue.shift(),n=this.nextId++;this.running.set(e,{id:n,job:t}),e.postMessage({...t.req,id:n})}}onDone(e,t){let n=this.running.get(e);n&&n.id===t.id&&(this.running.delete(e),this.idle.push(e),n.job.resolve(t),this.pump())}onCrash(e,t){let n=this.running.get(e);n&&(this.running.delete(e),this.idle.push(e),n.job.reject(Error(t||`Worker error`)),this.pump())}};function hs(){return Math.max(2,Math.min(4,navigator.hardwareConcurrency||2))}function gs(e,t,n,r){let i=Math.min(n/e,r/t);return{width:Math.max(1,Math.floor(e*i)),height:Math.max(1,Math.floor(t*i))}}function _s(e,t,n,r){let{layout:i}=r;return i.pages?vs(e,t,n,r):ys(e,t,n,r)}function vs(e,t,n,r){let{layout:i}=r,a=Array(i.placements.length);return(i.pages??[]).forEach((o,s)=>{let c=Math.round(o.x*t),l=Math.max(1,Math.round((o.x+o.w)*t)-c),u=i.placements.flatMap((e,t)=>e.page===s?[t]:[]);e.save(),e.translate(c,0),e.beginPath(),e.rect(0,0,l,n),e.clip();let d=ys(e,l,n,{...r,layout:va(i,s)});e.restore(),d.forEach((e,t)=>{let n=u[t];n!==void 0&&(a[n]={x:e.x+c,y:e.y,w:e.w,h:e.h})})}),a}function ys(e,t,n,{layout:r,thumbs:i,crops:a,settings:o}){let s={corners:o.cornerStyle,border:Zo(o.borderWidth,t,n),color:o.borderColor,outer:o.outerBorder},c=Xo(r,t,n);return as(e,t,n,s),r.placements.forEach((r,o)=>{let l=i[r.photoIndex],u=c[o],d=a?.[r.photoIndex];l&&u&&os(e,l,l.width,l.height,u,t,n,s,d)}),ls(e,c,t,n,s),c}function bs(e,t,n){e.save(),e.strokeStyle=n,e.lineWidth=4,e.strokeRect(t.x+2,t.y+2,t.w-4,t.h-4),e.restore()}var xs=3,Ss=36,Cs=10;function ws(e,t){e.save(),e.scale(t,t),e.lineWidth=1.2,e.setLineDash([]),e.beginPath(),e.moveTo(-2.6,-3),e.lineTo(2.4,7),e.moveTo(2.6,-3),e.lineTo(-2.4,7),e.stroke();for(let t of[-3.4,3.4])e.beginPath(),e.arc(t,-5.4,2.3,0,Math.PI*2),e.stroke();e.restore()}function Ts(e,t,n,r,i,a){let o=ja(t.w,n);if(o.length===0)return;e.save(),e.strokeStyle=i,e.fillStyle=i,e.lineWidth=Math.max(1,r),e.lineCap=`butt`;for(let n of o){let i=Math.round(t.x+n)+.5;for(let n of[!0,!1]){let a=n?t.y-xs*r:t.y+t.h+xs*r,o=n?-1:1;e.setLineDash([4*r,3*r]),e.beginPath(),e.moveTo(i,a),e.lineTo(i,a+o*Cs*r),e.moveTo(i,a+o*26*r),e.lineTo(i,a+o*Ss*r),e.stroke(),e.save(),e.translate(i,a+o*18*r),n||e.rotate(Math.PI),ws(e,r),e.restore()}}let s=o[0],c=Math.round(t.x+s)+8*r,l=t.x+t.w-c;e.font=`${12*r}px system-ui, sans-serif`,e.measureText(a).width<=l&&(e.textAlign=`left`,e.textBaseline=`alphabetic`,e.fillText(a,c,t.y-44*r)),e.restore()}var Es={zoom:1,panX:0,panY:0},Ds=.5,Os=48;function ks(e){return Number.isFinite(e)?Math.min(8,Math.max(Ds,e)):1}function As(e){return e.zoom===1&&e.panX===0&&e.panY===0}function js(e,t){return{w:e.w*t.zoom,h:e.h*t.zoom}}function Ms(e,t,n){let r=js(t,n);return{x:(e.w-r.w)/2+n.panX,y:(e.h-r.h)/2+n.panY}}function Ns(e,t,n){let r=js(n,e),i=Math.min(Os,r.w/2,t.w/2),a=Math.min(Os,r.h/2,t.h/2),o=i-r.w-(t.w-r.w)/2,s=t.w-i-(t.w-r.w)/2,c=a-r.h-(t.h-r.h)/2,l=t.h-a-(t.h-r.h)/2;return{zoom:e.zoom,panX:Math.min(s,Math.max(o,e.panX)),panY:Math.min(l,Math.max(c,e.panY))}}function Ps(e,t,n,r,i){return Ns({...e,panX:e.panX+t,panY:e.panY+n},r,i)}function Fs(e,t,n,r,i){let a=ks(e.zoom*t),o=js(i,e),s=Ms(r,i,e),c=(n.x-s.x)/o.w,l=(n.y-s.y)/o.h,u=js(i,{...e,zoom:a}),d=n.x-c*u.w,f=n.y-l*u.h;return Ns({zoom:a,panX:d-(r.w-u.w)/2,panY:f-(r.h-u.h)/2},r,i)}function Is(e){return Math.round(e.zoom*100)}var Ls=[{label:`800 × 600`,width:800,height:600},{label:`600 × 800`,width:600,height:800},{label:`1600 × 1200`,width:1600,height:1200},{label:`1200 × 1600`,width:1200,height:1600},{label:`A4 portrait (300 DPI)`,width:2480,height:3508},{label:`A4 landscape (300 DPI)`,width:3508,height:2480},{label:`A3 portrait (300 DPI)`,width:3508,height:4961},{label:`A3 landscape (300 DPI)`,width:4961,height:3508},{label:`A2 portrait (300 DPI)`,width:4961,height:7016},{label:`A2 landscape (300 DPI)`,width:7016,height:4961},{label:`B1 portrait (300 DPI)`,width:8350,height:11811},{label:`B1 landscape (300 DPI)`,width:11811,height:8350},{label:`Square (1080 × 1080)`,width:1080,height:1080}];function Rs(e,t){return Ls.findIndex(n=>n.width===e&&n.height===t)}var zs=[{id:`screen`,label:`Screen`,group:`screen`,width:1600,height:1200},{id:`small`,label:`Small`,group:`screen`,width:800,height:600},{id:`square`,label:`Square`,group:`screen`,width:1080,height:1080},{id:`a4`,label:`A4`,group:`print`,width:3508,height:2480},{id:`a3`,label:`A3`,group:`print`,width:4961,height:3508},{id:`a2`,label:`A2`,group:`print`,width:7016,height:4961},{id:`b1`,label:`B1`,group:`print`,width:11811,height:8350}];function Bs(e,t){return t===`portrait`?{width:e.height,height:e.width}:{width:e.width,height:e.height}}function Vs(e,t){for(let n of zs){if(n.width===e&&n.height===t)return{choice:n,orientation:e===t?`square`:`landscape`};if(n.height===e&&n.width===t)return{choice:n,orientation:`portrait`}}}function Hs(e,t){return e===t?`square`:t>e?`portrait`:`landscape`}var Us=`seed`,Ws=4294967295;function Gs(e){let t=new URLSearchParams(e).get(Us);if(t===null||!/^\d{1,10}$/.test(t))return;let n=Number(t);return n<=Ws?n:void 0}function Ks(e,t){let n=new URL(e);return n.searchParams.set(Us,String(t)),n.toString()}var qs=`collage-creator.language`,Js=`collage-web.language`;function Ys(){try{return localStorage.getItem(qs)??localStorage.getItem(Js)}catch{return null}}function Xs(){try{let e=navigator.languages;return e?.length?e:navigator.language?[navigator.language]:[]}catch{return[]}}function Zs(e){try{localStorage.setItem(qs,e)}catch{}}var Qs=1e4,$s=6e3;function ec(e,t){let n=URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.download=t,document.body.append(r),r.click(),r.remove(),setTimeout(()=>URL.revokeObjectURL(n),6e4)}function tc(e){let t=[];return e?.columns===2&&t.push(Z(`wider`)),e&&e.rows>1&&t.push(`${Z(`taller`)} ×${e.rows}`),t.join(` · `)}var Q=new class{#e=L([]);get photos(){return G(this.#e)}set photos(e){R(this.#e,e)}#t=L(Ht(Gs(location.search)??Oi()));get seed(){return G(this.#t)}set seed(e){R(this.#t,e,!0)}#n=L(void 0);get columns(){return G(this.#n)}set columns(e){R(this.#n,e,!0)}#r=L(`mosaic`);get layoutStyle(){return G(this.#r)}set layoutStyle(e){R(this.#r,e,!0)}#i=L(1);get pageCount(){return G(this.#i)}set pageCount(e){R(this.#i,e,!0)}#a=F(()=>this.pageCount>1);get book(){return G(this.#a)}set book(e){R(this.#a,e)}#o=L(null);get posterBox(){return G(this.#o)}set posterBox(e){R(this.#o,e)}#s=L(null);get page(){return G(this.#s)}set page(e){R(this.#s,e)}#c=L(0);get pageRev(){return G(this.#c)}set pageRev(e){R(this.#c,e,!0)}#l=L(Ht({width:1600,height:1200,borderWidth:.005,borderColor:`#ffffff`,cornerStyle:`none`,outerBorder:!0,splitImages:0,format:`png`,jpegQuality:.92}));get settings(){return G(this.#l)}set settings(e){R(this.#l,e,!0)}#u=L(!1);get customSize(){return G(this.#u)}set customSize(e){R(this.#u,e,!0)}#d=L(!1);get portrait(){return G(this.#d)}set portrait(e){R(this.#d,e,!0)}#f=L(qo);get limits(){return G(this.#f)}set limits(e){R(this.#f,e)}#p=L(``);get sizeNote(){return G(this.#p)}set sizeNote(e){R(this.#p,e,!0)}#m=L(0);get sizeEpoch(){return G(this.#m)}set sizeEpoch(e){R(this.#m,e,!0)}#h=L(0);get restoreEpoch(){return G(this.#h)}set restoreEpoch(e){R(this.#h,e,!0)}#g=L(`photos`);get tab(){return G(this.#g)}set tab(e){R(this.#g,e,!0)}#_=L(!1);get sheetOpen(){return G(this.#_)}set sheetOpen(e){R(this.#_,e,!0)}#v=L(!1);get menuOpen(){return G(this.#v)}set menuOpen(e){R(this.#v,e,!0)}#y=L(0);get riseToken(){return G(this.#y)}set riseToken(e){R(this.#y,e,!0)}#b=L(!1);get narrow(){return G(this.#b)}set narrow(e){R(this.#b,e,!0)}#x=L(`pan`);get mode(){return G(this.#x)}set mode(e){R(this.#x,e,!0)}#S=L(null);get selected(){return G(this.#S)}set selected(e){R(this.#S,e,!0)}#C=L(new Set);get alsoSelected(){return G(this.#C)}set alsoSelected(e){R(this.#C,e)}#w=L(null);get cropFor(){return G(this.#w)}set cropFor(e){R(this.#w,e,!0)}#T=L(0);get revealToken(){return G(this.#T)}set revealToken(e){R(this.#T,e,!0)}#E=L(0);get focused(){return G(this.#E)}set focused(e){R(this.#E,e,!0)}#D=L(Es);get view(){return G(this.#D)}set view(e){R(this.#D,e)}#O=L(Ht({w:0,h:0}));get viewport(){return G(this.#O)}set viewport(e){R(this.#O,e,!0)}#k=L(!1);get spaceHeld(){return G(this.#k)}set spaceHeld(e){R(this.#k,e,!0)}#A=L(!1);get canvasFocused(){return G(this.#A)}set canvasFocused(e){R(this.#A,e,!0)}#j=L(!1);get focusRing(){return G(this.#j)}set focusRing(e){R(this.#j,e,!0)}#M=L(null);get removed(){return G(this.#M)}set removed(e){R(this.#M,e)}removedPageCount=null;#N=L(``);get status(){return G(this.#N)}set status(e){R(this.#N,e,!0)}#P=L([]);get messages(){return G(this.#P)}set messages(e){R(this.#P,e)}#F=L(null);get notice(){return G(this.#F)}set notice(e){R(this.#F,e)}#I=L(!1);get noticeDetailsOpen(){return G(this.#I)}set noticeDetailsOpen(e){R(this.#I,e,!0)}#L=L(null);get restoring(){return G(this.#L)}set restoring(e){R(this.#L,e,!0)}#R=L(Ht(to()));get lang(){return G(this.#R)}set lang(e){R(this.#R,e,!0)}#z=L(null);get dialog(){return G(this.#z)}set dialog(e){R(this.#z,e,!0)}#B=L(null);get confirming(){return G(this.#B)}set confirming(e){R(this.#B,e)}#V=L(0);get progress(){return G(this.#V)}set progress(e){R(this.#V,e,!0)}#H=L(!1);get persistReady(){return G(this.#H)}set persistReady(e){R(this.#H,e,!0)}importPool=new ms(2);exportPool=new ms;#U=F(()=>this.photos.length>0);get hasPhotos(){return G(this.#U)}set hasPhotos(e){R(this.#U,e)}#W=F(()=>(this.pageRev,this.page?this.page.toLayout():null));get layout(){return G(this.#W)}set layout(e){R(this.#W,e)}#G=F(()=>(this.pageRev,this.page?.noCols));get columnsInUse(){return G(this.#G)}set columnsInUse(e){R(this.#G,e)}#K=F(()=>this.layout?Math.round(ta(this.layout,this.photos).cutOff*100):0);get cropPercent(){return G(this.#K)}set cropPercent(e){R(this.#K,e)}#q=F(()=>this.selected===null?void 0:this.photos[this.selected]);get selectedPhoto(){return G(this.#q)}set selectedPhoto(e){R(this.#q,e)}#J=F(()=>this.settings.splitImages>1);get isSplit(){return G(this.#J)}set isSplit(e){R(this.#J,e)}#Y=F(()=>this.selectedPhoto?.bookPage??0);get selectedPage(){return G(this.#Y)}set selectedPage(e){R(this.#Y,e)}#X=F(()=>{if(this.selected===null)return[];let e=this.alsoSelected,t=this.photos.flatMap((t,n)=>n!==this.selected&&e.has(t.id)?[n]:[]);return[this.selected,...t]});get selection(){return G(this.#X)}set selection(e){R(this.#X,e)}#Z=F(()=>this.selection.length>1);get multiSelected(){return G(this.#Z)}set multiSelected(e){R(this.#Z,e)}#Q=F(()=>ua(this.photos.map(e=>e.bookPage??0),this.pageCount));get pageCounts(){return G(this.#Q)}set pageCounts(e){R(this.#Q,e)}#$=F(()=>{if(this.isSplit)return`post`;let e=Vs(this.settings.width,this.settings.height);return this.customSize||!e?`custom`:e.choice.id});get activeSize(){return G(this.#$)}set activeSize(e){R(this.#$,e)}#ee=F(()=>this.spaceHeld?`pan`:this.mode);get activeMode(){return G(this.#ee)}set activeMode(e){R(this.#ee,e)}#te=F(()=>this.photos.map(e=>e.colour));get photoColours(){return G(this.#te)}set photoColours(e){R(this.#te,e)}statusTimer;noticeTimer;sizeTimer;pendingSize=null;restoringDone=Promise.resolve();fileInput=null;replaceUrl=!0;persistWarned=!1;get ratio(){return this.settings.height/this.settings.width}addMessage(e){this.messages=[...this.messages,e].slice(-8)}clearMessages(){this.messages=[]}setStatus(e){this.status=e,clearTimeout(this.statusTimer),e&&(this.statusTimer=setTimeout(()=>{this.status=``},$s))}hideNotice(){clearTimeout(this.noticeTimer),this.notice=null,this.noticeDetailsOpen=!1}showNotice(e){if(this.hideNotice(),e.length===0)return;let t=t=>e.filter(e=>e.reason===t).length,n=t(`duplicate`),r=t(`not-image`),i=t(`unreadable`),a=[];n&&a.push(Z(`%(n)s already added`,{n})),r&&a.push(Z(`%(n)s not an image`,{n:r})),i&&a.push(Z(`%(n)s could not be opened`,{n:i}));let o=n===e.length;this.notice={summary:e.length===1?Z(`1 file was not added`):Z(`%(n)s files were not added`,{n:e.length}),reasons:a.join(`, `),items:e.map(e=>{let t=e.reason===`duplicate`?Z(`already added`):e.reason===`not-image`?Z(`not an image`):Z(`could not be opened`);return`${e.name}: ${t}`}),kind:o?`info`:`error`},o&&(this.noticeTimer=setTimeout(()=>this.hideNotice(),Qs))}initLanguage(){let e=Ys(),t=e?Qa(e):$a(Xs());this.lang=eo(t),document.documentElement.lang=this.lang.replace(`_`,`-`)}chooseLanguage(e){this.lang=eo(e),Zs(this.lang),document.documentElement.lang=this.lang.replace(`_`,`-`)}closeMenu(){this.menuOpen=!1}setTab(e,t){let n=this.narrow,r=!n&&e===`save`?`photos`:e,i=this.sheetOpen,a=this.tab,o=n&&t&&i&&this.tab===r,s=n&&!o&&(t||i);this.tab=r,this.sheetOpen=s,s&&(this.closeMenu(),r===a&&i||this.riseToken++)}relayout(e=`single`,t=!1){if(t||this.clearSelection(),this.focused=0,this.photos.length===0)this.page=null;else if(this.book){let t=this.photos.map(e=>e.bookPage??0);if(e===`search`){let e=this.layoutStyle===`gallery`?10:30,n=_a(this.layoutStyle,this.photos,t,this.pageCount,this.ratio,Oi(),e,{columns:this.columns});this.page=n.page,this.seed=n.seed}else this.page=ga(this.layoutStyle,this.photos,t,this.pageCount,this.ratio,this.seed,{columns:this.columns})}else if(e===`search`){let e=aa(this.layoutStyle,this.photos,this.ratio,Oi(),{columns:this.columns});this.page=e.page,this.seed=e.seed}else this.page=ia(this.layoutStyle,this.photos,this.ratio,Ei(this.seed),{columns:this.columns});this.pageRev++,this.status=``,this.syncUrl()}reshape(){this.page?.setTargetRatio(this.ratio),this.pageRev++}shuffle(){this.seed=Oi(),this.relayout()}setSeed(e){let t=Math.floor(e);return!Number.isFinite(t)||t<0||t>4294967295?!1:(this.seed=t,this.relayout(),!0)}chooseLayout(e){this.layoutStyle!==e&&(this.layoutStyle=e,this.relayout(`search`))}get rowSize(){if(!this.book)return{w:this.settings.width,h:this.settings.height};let e=this.pageCount;return{w:(e+(e-1)*oa)*this.settings.width,h:this.settings.height}}withPages(e,t){let n=ua(t.map(e=>e.bookPage??0),Math.max(1,this.pageCount));return e.map(e=>{if(e.bookPage!==void 0&&e.bookPage<this.pageCount)return n[e.bookPage]=(n[e.bookPage]??0)+1,e;let t=Math.max(0,this.pageCount-1);return n[t]=(n[t]??0)+1,{...e,bookPage:t}})}get maxPages(){return 20}setPages(e,t=this.pageCount){this.pageCount=t,this.photos=this.photos.map((t,n)=>({...t,bookPage:e[n]??0}))}addPage(){this.pageCount>=20||(this.page&&!this.book&&(this.page=ha.wrap(this.page,this.photos.length,this.ratio),this.photos=this.photos.map(e=>({...e,bookPage:0}))),this.pageCount++,this.page?.addPage(),this.pageRev++,this.setStatus(Z(`Added page %(n)s.`,{n:this.pageCount})))}askRemovePage(e){!this.book||e<0||e>=this.pageCount||this.confirm({title:Z(`Remove page %(n)s?`,{n:e+1}),text:this.pageCounts[e]?Z(`Its photos move to a neighbouring page. The page's own arrangement is lost.`):Z(`This page is empty.`),action:Z(`Remove page`),run:()=>this.removePage(e)})}confirm(e){this.confirming=e,this.dialog=`confirm`}confirmed(){let e=this.confirming?.run;this.dialog=null,this.confirming=null,e?.()}removePage(e){if(!this.book||this.pageCount<=1||e<0||e>=this.pageCount)return;let t=ma(this.photos.map(e=>e.bookPage??0),e);this.setPages(t,this.pageCount-1),this.relayout(`single`,!1),this.setStatus(Z(`Removed page %(n)s; its photos moved to a neighbouring page.`,{n:e+1}))}movePage(e,t){let n=e+t;!this.book||e<0||n<0||e>=this.pageCount||n>=this.pageCount||(this.setPages(pa(this.photos.map(e=>e.bookPage??0),e,n)),this.page?.movePage(e,n),this.pageRev++,this.setStatus(Z(`Moved page %(a)s to place %(b)s.`,{a:e+1,b:n+1})))}setPageCount(e){let t=ca(e);if(t===this.pageCount)return;t>1&&!this.book&&this.addPage();let n=da(this.photos.length,t);this.setPages(n.pageOf,t),this.relayout(`search`),this.setStatus(Z(`Photos shared evenly across %(n)s page(s).`,{n:t}))}shufflePages(){if(!this.book)return;let e=fa(this.photos.map(e=>e.bookPage??0),Ei(Oi()));this.setPages(e),this.relayout(`search`),this.setStatus(Z(`Photos shuffled between pages.`))}moveSelectedToPage(e){if(!this.book||e<0||e>=this.pageCount)return;let t=new Set(this.selection.flatMap(e=>this.photos[e]?.id??[])),n=this.selectedPhoto;if(!n||t.size===0)return;let r=this.photos.filter(n=>t.has(n.id)&&(n.bookPage??0)!==e).map(t=>({...t,bookPage:e}));if(r.length===0)return;let i=new Set(r.map(e=>e.id)),a=this.photos.filter(e=>!i.has(e.id)),o=0;a.forEach((t,n)=>{(t.bookPage??0)<=e&&(o=n+1)}),a.splice(o,0,...r),this.photos=a,this.relayout(`single`,!1),this.selected=a.findIndex(e=>e.id===n.id),this.alsoSelected=new Set([...t].filter(e=>e!==n.id)),this.setStatus(r.length===1?Z(`Moved %(name)s to page %(n)s.`,{name:r[0]?.name??``,n:e+1}):Z(`Moved %(count)s photos to page %(n)s.`,{count:r.length,n:e+1}))}setColumns(e){e!==this.columns&&(this.columns=e,this.relayout())}stepColumns(e){let t=this.columns??this.page?.noCols??1;this.setColumns(Li(t+e))}syncUrl(){try{let e=Ks(location.href,this.seed);if(e===location.href)return;this.replaceUrl?history.replaceState(null,``,e):history.pushState(null,``,e)}catch{}}onPopState(){let e=Gs(location.search);e!==void 0&&e!==this.seed&&(this.seed=e,this.relayout())}async persist(){let e=new Map(this.photos.map(e=>[so(e.file),e.file]));try{await vo({v:1,photos:this.photos.map(e=>({key:so(e.file),span:e.span??{...xa},...e.crop?{crop:e.crop}:{},...this.book&&e.bookPage!==void 0?{page:e.bookPage}:{}})),seed:this.seed,columns:this.columns,layoutStyle:this.layoutStyle,...this.pageCount>1?{book:{pages:this.pageCount,perPage:6}}:{},settings:Le(this.settings)},e)}catch{if(this.persistWarned)return;this.persistWarned=!0,this.addMessage({kind:`error`,text:Z(`Your work could not be kept for next time: browser storage is unavailable or full.`)})}}async restore(){this.restoring={done:0,total:0};try{let e=await yo(this.settings);if(e){Object.assign(this.settings,e.session.settings),this.columns=e.session.columns,this.layoutStyle=e.session.layoutStyle??`mosaic`;let t=e.session.book;this.pageCount=t?.pages??1,this.restoreEpoch++;let n=e.session.photos.map(t=>e.files.get(t.key)).filter(e=>e!==void 0);this.restoring={done:0,total:n.length};let r=await lo(n,[],this.importPool,e=>this.addMessage(e),(e,t)=>{this.restoring={done:e,total:t}}),i=new Map(e.session.photos.map(e=>[e.key,e]));this.photos=r.map(e=>{let t=i.get(so(e.file));return{...e,span:{...t?.span??xa},...t?.crop?{crop:t.crop}:{},...t?.page===void 0?{}:{bookPage:t.page}}}),this.seed=Gs(location.search)??e.session.seed,this.applySize(this.settings.width,this.settings.height),this.relayout()}}catch{}finally{this.restoring=null,this.persistReady=!0,this.replaceUrl=!1}}start(){this.initLanguage(),this.relayout(),this.restoringDone=this.restore(),Promise.all([this.importPool.ready,this.exportPool.ready]).then(()=>{document.documentElement.dataset.workersReady=`true`}),Jo().then(e=>{this.limits=e,this.applySize(this.settings.width,this.settings.height)})}fitPoster(e=this.viewport,t=!1){let n=this.narrow?12:88,r=this.narrow?104:72,i=(this.settings.splitImages>1?112:0)+(this.book&&!t?96:0),a=t?{w:this.settings.width,h:this.settings.height}:this.rowSize,o=gs(a.w,a.h,Math.max(160,e.w-2*n),Math.max(160,e.h-2*r-i));return{w:o.width,h:o.height}}get isFit(){return As(this.view)}get zoomPercent(){return Is(this.view)}zoomAtCentre(e){let t=this.viewport,n={x:t.w/2,y:t.h/2};this.view=Fs(this.view,e,n,t,this.fitPoster(t))}zoomAtPoint(e,t){this.view=Fs(this.view,e,t,this.viewport,this.fitPoster(this.viewport))}panBy(e,t){this.view=Ps(this.view,e,t,this.viewport,this.fitPoster(this.viewport))}fitView(){this.view=Es}setMode(e){this.mode=e,this.status=``,clearTimeout(this.statusTimer)}setSpaceHeld(e){this.spaceHeld=e}selectPhoto(e){let t=this.photos[e];t&&(this.multiSelected?(this.alsoSelected=new Set,this.selected=e,this.setStatus(Z(`Selected %(name)s.`,{name:t.name}))):this.selected===e?(this.selected=null,this.setStatus(``)):(this.selected=e,this.setStatus(Z(`Selected %(name)s.`,{name:t.name}))))}toggleSelected(e){let t=this.photos[e];if(!t)return;if(this.selected===null){this.selectPhoto(e);return}this.cropFor=null;let n=new Set(this.alsoSelected);if(e===this.selected){let e=this.selection[1];this.selected=e??null;let t=e===void 0?void 0:this.photos[e];t&&n.delete(t.id)}else n.has(t.id)?n.delete(t.id):n.add(t.id);this.alsoSelected=n;let r=this.selection.length;this.setStatus(r>1?Z(`%(n)s photos selected.`,{n:r}):``)}clearSelection(){this.selected=null,this.alsoSelected.size>0&&(this.alsoSelected=new Set)}selectInPhotos(e,t=!1){t?this.toggleSelected(e):this.selectPhoto(e),this.selection.includes(e)&&!this.narrow&&(this.setTab(`photos`,!1),this.revealToken++)}pick(e){let t=this.layout?.placements[e];if(!this.page||!t)return;let n=t.photoIndex;if(this.multiSelected&&this.clearSelection(),this.selected===null)this.selected=n,this.setStatus(Z(`Selected %(name)s. Choose another photo to swap, or press Escape.`,{name:this.photos[n]?.name??``}));else if(this.selected===n)this.selected=null,this.setStatus(``);else{if(this.page.swapPhotos(this.selected,n),this.book){let e=this.selected,t=this.photos[e]?.bookPage??0,r=this.photos[n]?.bookPage??0;this.photos=this.photos.map((i,a)=>a===e?{...i,bookPage:r}:a===n?{...i,bookPage:t}:i)}this.pageRev++,this.setStatus(Z(`Swapped %(a)s and %(b)s.`,{a:this.photos[this.selected]?.name??``,b:this.photos[n]?.name??``})),this.selected=null}}get cropping(){return this.cropFor!==null&&this.cropFor===this.selected}toggleCrop(){this.selected===null||this.multiSelected||(this.cropFor=this.cropping?null:this.selected,this.setStatus(this.cropping?Z(`Drag the photo to move it, scroll to zoom.`):``))}selectedCell(){let e=this.selected;return e===null?void 0:this.layout?.placements.find(t=>t.photoIndex===e)?.cell}writeCrop(e,t){let n=Ta(t)?void 0:wa(t);this.photos=this.photos.map((t,r)=>{if(r!==e)return t;let{crop:i,...a}=t;return n?{...a,crop:n}:a})}panSelectedCrop(e,t){let n=this.selected,r=n===null?void 0:this.photos[n],i=this.selectedCell();n!==null&&r&&i&&this.writeCrop(n,Da(r.crop??Sa,e,t,r.width,r.height,i.w,i.h))}zoomSelectedCrop(e){let t=this.selected,n=t===null?void 0:this.photos[t],r=this.selectedCell();t!==null&&n&&r&&this.writeCrop(t,Oa(n.crop??Sa,e,n.width,n.height,r.w,r.h))}zoomSelectedCropBy(e){let t=this.selectedPhoto?.crop?.zoom??1;this.zoomSelectedCrop(t*e)}resetCrop(){this.selected!==null&&(this.writeCrop(this.selected,Sa),this.setStatus(Z(`%(name)s is back to its default crop.`,{name:this.selectedPhoto?.name??``})))}maxZoom=5;deselect(){this.clearSelection(),this.setStatus(``)}chooseFiles(){this.fileInput?.click()}async addFiles(e){if(e.length===0)return;this.restoring&&this.setStatus(Z(`Your new photos are added once your saved ones are back.`)),await this.restoringDone,this.clearMessages(),this.hideNotice(),this.setStatus(Z(`Please wait`));let t=[],n=await lo(await this.openZips(e,t),this.photos,this.importPool,e=>this.addMessage(e),void 0,e=>t.push(e));if(this.setStatus(``),this.showNotice(t),n.length>0){let e=this.book?this.withPages(n,this.photos):n;this.photos=[...this.photos,...e],this.relayout(`search`)}}async openZips(e,t){let n=[];for(let r of e)if(!ko(r))n.push(r);else try{let e=await Po(r);n.push(...e.files);for(let n of e.others)t.push({reason:`not-image`,name:n});for(let n of e.unreadable)t.push({reason:`unreadable`,name:n})}catch{t.push({reason:`unreadable`,name:r.name})}return n}discardRemoved(){for(let{photo:e}of this.removed??[])e.thumb.close();this.removed=null}removePhotos(e,t){let n=this.photos.map((e,t)=>({photo:e,index:t})).filter(t=>e.has(t.photo.id));n.length!==0&&(this.discardRemoved(),this.removed=n,this.removedPageCount=null,this.photos=this.photos.filter(t=>!e.has(t.id)),this.relayout(`search`),this.setStatus(`${t} ${Z(`Undo remove brings it back.`)}`))}removeSelected(){let e=this.selection.flatMap(e=>this.photos[e]??[]),t=e[0];t&&this.removePhotos(new Set(e.map(e=>e.id)),e.length===1?Z(`Removed %(name)s.`,{name:t.name}):Z(`Removed %(n)s photos.`,{n:e.length}))}askRemoveAll(){let e=this.photos.length;e!==0&&this.confirm({title:Z(`Remove all photos?`),text:this.pageCount>1?Z(`All %(n)s photos are taken out and the book goes back to one page.`,{n:e}):Z(`All %(n)s photos are taken out.`,{n:e}),action:Z(`Remove all`),run:()=>this.removeAll()})}removeAll(){let e=this.photos.length,t=this.pageCount;this.pageCount=1,this.removePhotos(new Set(this.photos.map(e=>e.id)),Z(`Removed all %(n)s photos.`,{n:e})),this.removedPageCount=t}undoRemove(){let e=this.removed;if(!e)return;let t=new Set(this.photos.map(e=>so(e.file))),n=e.filter(e=>!t.has(so(e.photo.file)));for(let t of e)n.includes(t)||t.photo.thumb.close();let r=[...this.photos];for(let e of n)r.splice(Math.min(e.index,r.length),0,e.photo);this.removedPageCount!==null&&(this.pageCount=Math.max(this.pageCount,this.removedPageCount),this.removedPageCount=null),this.photos=r,this.removed=null,this.relayout(`search`),this.setStatus(Z(`Restored %(n)s photo(s).`,{n:n.length}))}setSpan(e,t){this.setSpans([e],t)}setSpans(e,t){let n=this.photos[e[0]??-1];if(!n)return;let r=new Set(e),i=e=>t===`reset`?{...xa}:{...e.span??xa,...t};this.photos=this.photos.map((e,t)=>r.has(t)?{...e,span:i(e)}:e),this.relayout(`single`,!0);let a=tc(i(n)),o=e.length===1?n.name:Z(`%(n)s photos`,{n:e.length});this.setStatus(a?Z(`%(name)s: %(what)s.`,{name:o,what:a}):Z(`%(name)s is back to its normal size.`,{name:o}))}toggleWider(){let e=this.selected;if(e===null)return;let t=this.photos[e]?.span?.columns===2;this.setSpans(this.selection,{columns:t?1:2})}cycleTaller(){let e=this.selected;if(e===null)return;let t=this.photos[e]?.span?.rows??1;this.setSpans(this.selection,{rows:t===1?2:t===2?3:1})}resetSpan(){this.selected!==null&&this.setSpans(this.selection,`reset`)}chooseSize(e,t){this.settings.splitImages=0,this.applySize(e,t)}chooseNamedSize(e){this.customSize=!1;let t=zs.find(t=>t.id===e);if(!t)return;let n=Bs(t,this.portrait?`portrait`:`landscape`);this.chooseSize(n.width,n.height)}chooseCustomSize(){this.customSize=!0,this.sizeEpoch++}chooseInstagramPost(){this.customSize=!1,this.setSplit(3,ka,!0)}turn(e){this.portrait=e;let{width:t,height:n}=this.settings;e&&n<t||!e&&t<n?this.applySize(n,t):this.sizeEpoch++}syncOrientation(){let e=Hs(this.settings.width,this.settings.height);e!==`square`&&(this.portrait=e===`portrait`)}applySize(e,t){if(!Number.isFinite(e)||!Number.isFinite(t)||e<1||t<1){this.sizeEpoch++;return}let n=Yo(Math.round(e),Math.round(t),this.limits);this.settings.width=n.width,this.settings.height=n.height,this.sizeNote=n.clamped?Z(`This browser can only make images up to %(w)s × %(h)s pixels here; using that size.`,{w:n.width,h:n.height}):``,this.settings.splitImages>1?this.setSplit(this.settings.splitImages,this.settings.height,!1):(this.syncOrientation(),this.sizeEpoch++,this.reshape())}commitSize(e,t){clearTimeout(this.sizeTimer),this.pendingSize=null,Yo(Math.round(e),Math.round(t),this.limits).clamped?(this.pendingSize={width:e,height:t},this.sizeTimer=setTimeout(()=>this.flushSize(),600)):this.applySize(e,t)}flushSize(){clearTimeout(this.sizeTimer);let e=this.pendingSize;this.pendingSize=null,e&&this.applySize(e.width,e.height)}setSplit(e,t,n){let r=Aa(e)||3,i=Math.max(16,Math.round(Number.isFinite(t)?t:ka)),a=Yo(r*i,i,this.limits);a.clamped&&(i=Math.max(16,Math.floor(Math.min(a.height,a.width/r)))),this.sizeNote=a.clamped?Z(`This browser can only make images up to %(w)s × %(h)s pixels here; using that size.`,{w:r*i,h:i}):``;let o=r!==this.settings.splitImages;this.settings.splitImages=r,this.settings.width=r*i,this.settings.height=i,this.syncOrientation(),this.sizeEpoch++,n&&(o||!this.page)?this.relayout(`search`):this.reshape()}get splitMin(){return 2}get splitMax(){return 20}async save(e){let t=this.layout;if(!t)return;this.clearMessages(),this.flushSize();let n=Yo(this.settings.width,this.settings.height,this.limits);n.clamped&&this.applySize(n.width,n.height);let r=Le(this.settings),i=new AbortController;this.cancelExport=()=>i.abort(),this.progress=0,this.dialog=`progress`;try{let n=r.format===`jpeg`?`jpg`:`png`;if(t.pages){await this.saveBook(t,r,n,i.signal,e);return}let a=await fs({layout:t,photos:this.photos,settings:r,pool:this.exportPool,signal:i.signal,onProgress:(e,t)=>{this.progress=t?e/t*100:100},baseName:`collage-${this.seed}`}),o=`collage-${this.seed}`;ec(a,r.splitImages>1?`${o}.zip`:`${o}.${n}`)}catch(e){e instanceof DOMException&&e.name===`AbortError`||this.addMessage({kind:`error`,text:`${Z(`An error occurred while rendering image:`)} ${e instanceof Error?e.message:String(e)}`})}finally{this.dialog=null,i.signal.aborted&&(this.exportPool=new ms)}}async saveBook(e,t,n,r,i){let a=ya(e),o=i===void 0?a:a.filter(e=>e===i);if(o.length===0){this.addMessage({kind:`error`,text:Z(`That page has no photos to save.`)});return}if(i===void 0&&o.length<(e.pages?.length??0)){let t=(e.pages??[]).map((e,t)=>t).filter(e=>!a.includes(e));this.addMessage({kind:`info`,text:Z(`Skipped empty page(s): %(list)s.`,{list:t.map(e=>e+1).join(`, `)})})}let s=`book-${this.seed}`,c=t.splitImages>1,l=e.pages?.length??1,u=e=>String(e).padStart(String(l).length,`0`),d=[];for(let[i,a]of o.entries()){let l=await ps({layout:va(e,a),photos:this.photos,settings:t,pool:this.exportPool,signal:r,onProgress:(e,t)=>{this.progress=(i+(t?e/t:1))/o.length*100}});if(c){let e=Na(`${s}_p${u(a+1)}`,l.length,n);for(let[t,n]of l.entries())d.push({name:e[t],blob:n})}else d.push({name:``,blob:l[0]})}if(!c){let e=ba(s,d.length,n);d.forEach((t,n)=>{t.name=e[n]})}if(d.length===1){let e=i===void 0?s:`${s}_page-${(o[0]??0)+1}`;ec(d[0].blob,`${e}.${n}`)}else ec(zo(await Promise.all(d.map(async e=>({name:e.name,data:new Uint8Array(await e.blob.arrayBuffer())})))),`${s}.zip`)}cancelExport=()=>{}};function nc(e){return Array.from({length:12},(t,n)=>e.length===0?void 0:e[n%e.length])}function $(e,t){return Q.lang,Z(e,t)}var rc=q(`<dialog id="progress-dialog" aria-labelledby="progress-title"><h2 id="progress-title"> </h2> <p> </p> <progress id="progress" max="100"></progress> <div class="button-row"><button type="button" id="cancel"> </button></div></dialog> <dialog id="confirm-dialog" aria-labelledby="confirm-title" aria-describedby="confirm-text"><h2 id="confirm-title"> </h2> <p id="confirm-text"> </p> <div class="button-row"><button type="button" id="confirm-cancel"> </button> <button type="button" id="confirm-ok" class="danger"> </button></div></dialog> <dialog id="help-dialog" aria-labelledby="help-title"><h2 id="help-title"> </h2> <h3> </h3> <ul class="help-list"><li><strong> </strong>: <span> </span></li> <li><strong> </strong>: <span> </span></li></ul> <h3> </h3> <ul class="help-list"><li><strong> </strong>: <span> </span></li> <li><strong> </strong>: <span> </span></li> <li><strong> </strong>: <span> </span></li> <li><strong> </strong>: <span> </span></li></ul> <p class="hint help-note"> </p> <div class="button-row"><button type="button" id="help-close" class="primary"> </button></div></dialog> <dialog id="about-dialog" aria-labelledby="about-title"><h2 id="about-title"> </h2> <p><strong>Collage Creator</strong> <span> </span> <a href="https://github.com/adrienverge/PhotoCollage" rel="noopener">PhotoCollage</a>,
    Copyright © 2013–2014 Adrien Vergé, with translations by the contributors credited in the
    NOTICE. It is not the original and is not endorsed by its authors.</p> <p>The changes and additions in this version are Copyright © 2026 John Briggs. It is released under
    the <a href="./LICENSE.txt" rel="noopener">GNU General Public License</a>, version 2 or (at
    your option) any later version (SPDX: GPL-2.0-or-later).</p> <p> </p> <p><span> </span> <a href="https://github.com/briggsyj/CollageCreator" rel="noopener"> </a> · <a href="./NOTICE.txt" rel="noopener">NOTICE</a> · <a href="./THIRD-PARTY-LICENSES.txt" rel="noopener">Third-party licences</a></p> <div class="button-row"><button type="button" id="about-close" class="primary"> </button></div></dialog>`,1);function ic(e,t){Be(t,!0);let n,r,i,a;pn(()=>{let e={progress:n,help:r,about:i,confirm:a};for(let t of Object.keys(e)){let n=e[t];Q.dialog===t&&!n.open?n.showModal():Q.dialog!==t&&n.open&&n.close()}});let o=e=>()=>{Q.dialog===e&&(Q.dialog=null)};var s=rc(),c=en(s),l=z(c),u=B(l,!0),d=V(l,2),f=B(d,!0),p=V(d,2),m=V(p,2),h=z(m),g=B(h,!0);N(m),N(c),xi(c,e=>n=e,()=>n);var _=V(c,2),v=F(()=>o(`confirm`)),y=z(_),b=B(y,!0),x=V(y,2),S=B(x,!0),C=V(x,2),w=z(C),T=B(w,!0),E=V(w,2),ee=B(E,!0);N(C),N(_),xi(_,e=>a=e,()=>a);var D=V(_,2),O=F(()=>o(`help`)),te=z(D),ne=B(te,!0),re=V(te,2),ie=B(re,!0),ae=V(re,2),k=z(ae),oe=z(k),se=B(oe,!0),ce=B(V(oe,2),!0);N(k);var le=V(k,2),A=z(le),ue=B(A,!0),de=B(V(A,2),!0);N(le),N(ae);var fe=V(ae,2),pe=B(fe,!0),me=V(fe,2),j=z(me),he=z(j),M=B(he,!0),ge=B(V(he,2),!0);N(j);var _e=V(j,2),ye=z(_e),be=B(ye,!0),xe=B(V(ye,2),!0);N(_e);var Se=V(_e,2),Ce=z(Se),we=B(Ce,!0),Te=B(V(Ce,2),!0);N(Se);var Ee=V(Se,2),De=z(Ee),Oe=B(De,!0),ke=B(V(De,2),!0);N(Ee),N(me);var Ae=V(me,2),je=B(Ae,!0),Me=V(Ae,2),Ne=z(Me),Pe=B(Ne,!0);N(Me),N(D),xi(D,e=>r=e,()=>r);var Fe=V(D,2),Ie=F(()=>o(`about`)),Le=z(Fe),Re=B(Le,!0),P=V(Le,2),ze=B(V(z(P),2),!0);ve(3),N(P);var He=V(P,4),Ue=B(He,!0),We=V(He,2),Ge=z(We),Ke=B(Ge,!0),qe=B(V(Ge,2),!0);ve(4),N(We);var Je=V(We,2),Ye=z(Je),Xe=B(Ye,!0);N(Je),N(Fe),xi(Fe,e=>i=e,()=>i),H((e,t,n,r,i,a,o,s,c,l,d,m,_,v,y,x,C,D,O,te,re,ae,k,oe,le,A,fe,me,j,he,_e,N)=>{Y(u,e),Y(f,t),pi(p,Q.progress),X(h,`title`,n),Y(g,r),Y(b,Q.confirming?.title??``),Y(S,Q.confirming?.text??``),X(w,`title`,i),Y(T,a),X(E,`title`,o),Y(ee,Q.confirming?.action??``),Y(ne,s),Y(ie,c),Y(se,l),Y(ce,d),Y(ue,m),Y(de,_),Y(pe,v),Y(M,y),Y(ge,x),Y(be,C),Y(xe,D),Y(we,O),Y(Te,te),Y(Oe,re),Y(ke,ae),Y(je,k),X(Ne,`title`,oe),Y(Pe,le),Y(Re,A),Y(ze,fe),Y(Ue,me),Y(Ke,j),Y(qe,he),X(Ye,`title`,_e),Y(Xe,N)},[()=>$(`Please wait`),()=>$(`Performing image computation...`),()=>$(`Stop saving`),()=>$(`Cancel`),()=>$(`Keep things as they are`),()=>$(`Cancel`),()=>Q.confirming?.action??$(`Confirm`),()=>$(`Help`),()=>$(`Moving around`),()=>$(`Pan`),()=>$(`drag the collage to move it. Hold Space to pan from any tool.`),()=>$(`Zoom`),()=>$(`scroll over the collage, or use + and − at the top right. Fit shows it all.`),()=>$(`Changing photos`),()=>$(`Swap`),()=>$(`click a photo, then another, to swap them.`),()=>$(`Select`),()=>$(`click a photo to select it in the Photos step, then make it wider or taller. Shift-click to select several.`),()=>$(`Crop`),()=>$(`select a photo, press Crop, then drag it and zoom to choose which part shows.`),()=>$(`Book`),()=>$(`press Add page under the collage for more pages in a row, each saved as its own image. Swap works between pages.`),()=>$(`Everything runs in your browser. Your photos are never uploaded.`),()=>$(`Close help`),()=>$(`Close`),()=>$(`About`),()=>$(`is an independent, modified web version of`),()=>$(`This program comes with ABSOLUTELY NO WARRANTY; without even the implied warranty of merchantability or fitness for a particular purpose.`),()=>$(`Your photos never leave your device.`),()=>$(`Source code`),()=>$(`Close`),()=>$(`Close`)]),pr(`cancel`,c,e=>e.preventDefault()),K(`click`,h,()=>Q.cancelExport()),pr(`close`,_,function(...e){G(v)?.apply(this,e)}),K(`click`,w,()=>Q.dialog=null),K(`click`,E,()=>Q.confirmed()),pr(`close`,D,function(...e){G(O)?.apply(this,e)}),K(`click`,Ne,()=>Q.dialog=null),pr(`close`,Fe,function(...e){G(Ie)?.apply(this,e)}),K(`click`,Ye,()=>Q.dialog=null),J(e,s),Ve()}mr([`click`]);function ac(e,t){let n=e.parentElement,r=null,i=()=>{r=null,n?.style.removeProperty(`--drag`)},a=t=>{t.target.closest(`button`)||(r=t.clientY,e.setPointerCapture(t.pointerId),n?.classList.remove(`rise`))},o=e=>{r!==null&&n?.style.setProperty(`--drag`,`${Math.max(0,e.clientY-r)}px`)},s=e=>{if(r===null)return;let n=e.clientY-r;i(),n>60&&t()};return e.addEventListener(`pointerdown`,a),e.addEventListener(`pointermove`,o),e.addEventListener(`pointerup`,s),e.addEventListener(`pointercancel`,i),{destroy(){e.removeEventListener(`pointerdown`,a),e.removeEventListener(`pointermove`,o),e.removeEventListener(`pointerup`,s),e.removeEventListener(`pointercancel`,i)}}}function oc(e,t){let n=t,r=e=>n(e);return e.addEventListener(`wheel`,r,{passive:!1}),{update(e){n=e},destroy(){e.removeEventListener(`wheel`,r)}}}function sc(e,t){let n=t;return e.value=t.value,{update(t){t.sticky&&t.again===n.again||(e.value=t.value),n=t}}}var cc=q(`<canvas aria-hidden="true"></canvas>`);function lc(e,t){Be(t,!0);let n;pn(()=>{let e=n.getContext(`2d`);e&&(e.clearRect(0,0,160,160),ss(e,t.bitmap,t.bitmap.width,t.bitmap.height,{x:0,y:0,w:160,h:160}))});var r=cc();X(r,`width`,160),X(r,`height`,160),xi(r,e=>n=e,()=>n),J(e,r),Ve()}var uc=q(`<div class="restoring" role="status"><p><!></p> <progress></progress></div>`),dc=q(`<li> </li>`),fc=q(`<div class="page-head"><h4> <span class="count"> </span></h4> <div class="page-actions"><button type="button" class="icon-btn move-page-left"><svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 15 6-6 6 6"></path></svg></button> <button type="button" class="icon-btn move-page-right"><svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg></button> <button type="button" class="icon-btn remove-page"><svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg></button></div></div>`),pc=q(`<p class="hint"> </p>`),mc=q(`<span class="tag"> </span>`),hc=q(`<li><button type="button" class="tile"><!> <!> <span class="name"> </span></button></li>`),gc=q(`<section class="page-group"><!> <!> <ul class="photo-list"></ul></section>`),_c=q(`<section class="tabpanel" id="panel-photos" role="tabpanel" aria-labelledby="tab-photos"><button type="button" id="add" class="primary wide" aria-describedby="privacy-note"> </button> <p class="drop-tip"> </p> <p id="privacy-note" class="sr-only"> </p> <!> <div id="notices" class="notices" role="status"><svg class="notices-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path></path></svg> <div class="notices-body"><p id="notices-summary" class="notices-summary"> </p> <p id="notices-reasons" class="notices-reasons"> </p> <button type="button" id="notices-details" class="link notices-toggle" aria-controls="notices-list"> </button> <ul id="notices-list" class="notices-list"></ul></div> <button type="button" id="notices-dismiss" class="icon-btn notices-close"><svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg></button></div> <div class="rowhead"><h3 id="photo-count"> </h3> <div><button type="button" id="undo-remove" class="link"> </button> <button type="button" id="remove-all" class="link"> </button></div></div> <p id="empty-hint" class="hint"> </p> <div id="photo-list"></div></section>`);function vc(e,t){Be(t,!0);let n;pn(()=>{if(Q.revealToken===0)return;let e=Q.selected;e!==null&&n.querySelector(`[data-photo="${e}"]`)?.scrollIntoView({block:`nearest`})});let r=F(()=>{let e=Q.photos.map((e,t)=>({photo:e,index:t}));return Q.book?Array.from({length:Q.pageCount},(t,n)=>({page:n,items:e.filter(e=>Math.min(Q.pageCount-1,e.photo.bookPage??0)===n)})):[{page:-1,items:e}]}),i=F(()=>Q.photos.length===1?$(`1 photo`):$(`%(n)s photos`,{n:Q.photos.length}));var a=_c(),o=z(a),s=B(o,!0),c=V(o,2),l=B(c,!0),u=V(c,2),d=B(u,!0),f=V(u,2),p=e=>{var t=uc(),n=z(t),r=z(n),i=e=>{var t=Sr();H(e=>Y(t,e),[()=>$(`Bringing back your photos… %(done)s of %(total)s`,{done:Q.restoring.done,total:Q.restoring.total})]),J(e,t)},a=e=>{var t=Sr();H(e=>Y(t,e),[()=>$(`Looking for your saved photos…`)]),J(e,t)};Nr(r,e=>{Q.restoring.total>0?e(i):e(a,-1)}),N(n);var o=V(n,2);N(t),H((e,t)=>{X(o,`max`,e),pi(o,Q.restoring.total>0?Q.restoring.done:void 0),X(o,`aria-label`,t)},[()=>Math.max(1,Q.restoring.total),()=>$(`Bringing back your photos`)]),J(e,t)};Nr(f,e=>{Q.restoring&&e(p)});var m=V(f,2),h=z(m),g=V(z(h));N(h);var _=V(h,2),v=z(_),y=B(v,!0),b=V(v,2),x=B(b,!0),S=V(b,2),C=B(S,!0),w=V(S,2);Rr(w,20,()=>Q.notice?.items??[],e=>e,(e,t)=>{var n=dc(),r=B(n,!0);H(()=>Y(r,t)),J(e,n)}),N(w),N(_);var T=V(_,2);N(m);var E=V(m,2),ee=z(E),D=B(ee,!0),O=V(ee,2),te=z(O),ne=B(te,!0),re=V(te,2),ie=B(re,!0);N(O),N(E);var ae=V(E,2),k=B(ae,!0),oe=V(ae,2);Rr(oe,21,()=>G(r),e=>e.page,(e,t)=>{var n=gc(),r=z(n),i=e=>{var n=fc(),r=z(n),i=z(r),a=B(V(i));N(r);var o=V(r,2),s=z(o),c=V(s,2),l=V(c,2);N(o),N(n),H((e,n,r,o,u,d,f,p)=>{Y(i,`${e??``} `),Y(a,`· ${n??``}`),X(s,`title`,r),X(s,`aria-label`,o),s.disabled=G(t).page===0,X(c,`title`,u),X(c,`aria-label`,d),c.disabled=G(t).page===Q.pageCount-1,X(l,`title`,f),X(l,`aria-label`,p),l.disabled=Q.pageCount<=1},[()=>$(`Page %(n)s`,{n:G(t).page+1}),()=>G(t).items.length===1?$(`1 photo`):$(`%(n)s photos`,{n:G(t).items.length}),()=>$(`Move page %(n)s up`,{n:G(t).page+1}),()=>$(`Move page %(n)s up`,{n:G(t).page+1}),()=>$(`Move page %(n)s down`,{n:G(t).page+1}),()=>$(`Move page %(n)s down`,{n:G(t).page+1}),()=>$(`Remove page %(n)s`,{n:G(t).page+1}),()=>$(`Remove page %(n)s`,{n:G(t).page+1})]),K(`click`,s,()=>Q.movePage(G(t).page,-1)),K(`click`,c,()=>Q.movePage(G(t).page,1)),K(`click`,l,()=>Q.askRemovePage(G(t).page)),J(e,n)};Nr(r,e=>{G(t).page>=0&&e(i)});var a=V(r,2),o=e=>{var t=pc(),n=B(t,!0);H(e=>Y(n,e),[()=>$(`Drop or move photos here`)]),J(e,t)};Nr(a,e=>{G(t).page>=0&&G(t).items.length===0&&e(o)});var s=V(a,2);Rr(s,21,()=>G(t).items,({photo:e,index:t})=>e.id,(e,t)=>{let n=()=>G(t).photo,r=()=>G(t).index,i=F(()=>tc(n().span)),a=F(()=>G(i)?`${n().name}, ${G(i)}`:n().name);var o=hc(),s=z(o),c=z(s);lc(c,{get bitmap(){return n().thumb}});var l=V(c,2),u=e=>{var t=mc(),n=B(t,!0);H(()=>Y(n,G(i))),J(e,t)};Nr(l,e=>{G(i)&&e(u)});var d=V(l,2),f=B(d,!0);N(s),N(o),H((e,t,i)=>{X(o,`data-photo`,r()),X(s,`title`,e),X(s,`aria-pressed`,t),X(s,`aria-label`,i),X(d,`title`,n().name),Y(f,n().name)},[()=>$(`Select %(name)s (Shift-click to select several)`,{name:n().name}),()=>Q.selection.includes(r()),()=>Q.book?`${G(a)}, ${$(`Page %(n)s`,{n:(n().bookPage??0)+1})}`:G(a)]),K(`click`,s,e=>e.shiftKey||e.metaKey||e.ctrlKey?Q.toggleSelected(r()):Q.selectPhoto(r())),J(e,o)}),N(s),N(n),H(e=>X(n,`aria-label`,e),[()=>G(t).page>=0?$(`Page %(n)s`,{n:G(t).page+1}):void 0]),J(e,n)}),N(oe),xi(oe,e=>n=e,()=>n),N(a),H((e,t,n,r,c,u,f,p,h,_,v,b,E)=>{X(a,`hidden`,Q.tab!==`photos`),X(o,`title`,e),o.disabled=Q.restoring!==null,Y(s,t),Y(l,n),Y(d,r),X(m,`hidden`,Q.notice===null),X(m,`data-kind`,Q.notice?.kind),X(g,`d`,Q.notice?.kind===`error`?`M12 7.5v5.5M12 16.5v.01`:`M12 11v5.5M12 7.5v.01`),Y(y,Q.notice?.summary??``),Y(x,Q.notice?.reasons??``),X(S,`title`,c),X(S,`aria-expanded`,Q.noticeDetailsOpen),Y(C,u),X(w,`hidden`,!Q.noticeDetailsOpen),X(T,`title`,f),X(T,`aria-label`,p),Y(D,G(i)),X(te,`title`,h),te.disabled=Q.removed===null,Y(ne,_),X(re,`title`,v),re.disabled=!Q.hasPhotos,Y(ie,b),X(ae,`hidden`,Q.hasPhotos),Y(k,E)},[()=>$(`Choose photos, or a .zip of them, from this device`),()=>$(`Add images...`),()=>$(`or drop photos or a .zip of them anywhere here`),()=>$(`Everything runs in your browser. Your photos are never uploaded.`),()=>$(`Show or hide the names of the files that were not added`),()=>Q.noticeDetailsOpen?$(`Hide files`):$(`Show files`),()=>$(`Dismiss this notice`),()=>$(`Dismiss`),()=>$(`Put back the photos removed last`),()=>$(`Undo remove`),()=>$(`Take every photo out (asks first)`),()=>$(`Remove all`),()=>$(`No photos yet. Add a few and the collage builds itself.`)]),K(`click`,o,()=>Q.chooseFiles()),K(`click`,S,()=>Q.noticeDetailsOpen=!Q.noticeDetailsOpen),K(`click`,T,()=>Q.hideNotice()),K(`click`,te,()=>Q.undoRemove()),K(`click`,re,()=>Q.askRemoveAll()),J(e,a),Ve()}mr([`click`]);var yc=q(`<button type="button" class="chip"><span> </span> <small> </small></button>`),bc=q(`<p class="group-label"> </p> <!>`,1),xc=q(`<option> </option>`),Sc=q(`<section class="tabpanel" id="panel-poster" role="tabpanel" aria-labelledby="tab-poster"><section aria-labelledby="pages-h" id="pages-block"><h3 id="pages-h"><label for="pages"> </label></h3> <div class="stepper"><button type="button" id="pages-less" class="sq"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path></svg></button> <input id="pages" type="number" min="1" step="1" inputmode="numeric"/> <button type="button" id="pages-more" class="sq"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></button></div> <p class="hint pages-hint"> </p></section> <section aria-labelledby="size-h"><h3 id="size-h"> </h3> <fieldset id="size-choices" class="choices group" aria-labelledby="size-h"><!> <p class="group-label"> </p> <button type="button" class="chip" data-choice="post"><span> </span> <small> </small></button> <button type="button" class="chip wide-chip" data-choice="custom"><span> </span></button></fieldset> <fieldset class="seg group" id="orientation" aria-label="Orientation"><button type="button" id="orient-landscape"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2"></rect></svg> <span> </span></button> <button type="button" id="orient-portrait"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="12" height="18" rx="2"></rect></svg> <span> </span></button></fieldset> <div class="size-row"><label class="field"><span><span> </span> (px)</span> <input id="width" type="number" min="1" step="1" inputmode="numeric"/></label> <span class="times" aria-hidden="true">×</span> <label class="field"><span><span> </span> (px)</span> <input id="height" type="number" min="1" step="1" inputmode="numeric"/></label></div> <div id="split-controls" class="split-controls"><div class="field"><span> </span> <div class="stepper"><button type="button" id="split-less" class="sq" aria-label="Fewer images"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path></svg></button> <input id="split-count" type="number" min="2" max="20" step="1" inputmode="numeric"/> <button type="button" id="split-more" class="sq" aria-label="More images"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></button></div></div> <label class="field"><span> </span> <input id="split-size" type="number" min="16" step="1" inputmode="numeric"/></label> <p id="split-hint" class="hint"> </p></div> <p id="book-size-hint" class="hint"> </p> <p id="size-note" class="hint"> </p> <p id="split-note" class="hint"> </p> <label class="sr-only"><span> </span> <select id="preset" tabindex="-1"><!><option>—</option></select></label></section></section>`);function Cc(e,t){Be(t,!0);let n=F(()=>Q.portrait?`portrait`:`landscape`),r=F(()=>Hs(Q.settings.width,Q.settings.height)),i=F(()=>Rs(Q.settings.width,Q.settings.height)),a={screen:`Screen`,print:`Print`},o=F(()=>[`screen`,`print`].map(e=>({group:e,choices:zs.filter(t=>t.group===e)}))),s=F(()=>Q.settings.splitImages),c=F(()=>Q.settings.height);function l(e){let t=Number(e.querySelector(`#width`).value),n=Number(e.querySelector(`#height`).value);Q.customSize=!0,Q.commitSize(t,n)}let u,d=L(0);var f=Sc(),p=z(f),m=z(p),h=B(z(m),!0);N(m);var g=V(m,2),_=z(g),v=V(_,2);Wr(v,(e,t)=>sc?.(e,t),()=>({value:String(Q.pageCount),again:G(d)}));var y=V(v,2);N(g);var b=B(V(g,2),!0);N(p);var x=V(p,2),S=z(x),C=B(S,!0),w=V(S,2),T=z(w);Rr(T,17,()=>G(o),({group:e,choices:t})=>e,(e,t)=>{let r=()=>G(t).group,i=()=>G(t).choices;var o=bc(),s=en(o),c=B(s,!0);Rr(V(s,2),17,i,e=>e.id,(e,t)=>{let r=F(()=>Bs(G(t),G(n)));var i=yc(),a=z(i),o=B(a,!0),s=B(V(a,2));N(i),H((e,n)=>{X(i,`data-choice`,G(t).id),X(i,`title`,e),X(i,`aria-pressed`,Q.activeSize===G(t).id),Y(o,n),Y(s,`${G(r).width??``} × ${G(r).height??``}`)},[()=>`${$(G(t).label)}: ${G(r).width} × ${G(r).height} px`,()=>$(G(t).label)]),K(`click`,i,()=>Q.chooseNamedSize(G(t).id)),J(e,i)}),H(e=>Y(c,e),[()=>$(a[r()])]),J(e,o)});var E=V(T,2),ee=B(E,!0),D=V(E,2),O=z(D),te=B(O,!0),ne=B(V(O,2),!0);N(D);var re=V(D,2),ie=B(z(re),!0);N(re),N(w);var ae=V(w,2),k=z(ae),oe=B(V(z(k),2),!0);N(k);var se=V(k,2),ce=B(V(z(se),2),!0);N(se),N(ae);var le=V(ae,2),A=z(le),ue=z(A),de=B(z(ue),!0);ve(),N(ue);var fe=V(ue,2);Wr(fe,(e,t)=>sc?.(e,t),()=>({value:String(Q.settings.width),again:Q.sizeEpoch})),N(A);var pe=V(A,4),me=z(pe),j=B(z(me),!0);ve(),N(me);var he=V(me,2);Wr(he,(e,t)=>sc?.(e,t),()=>({value:String(Q.settings.height),again:Q.sizeEpoch})),N(pe),N(le),xi(le,e=>u=e,()=>u);var M=V(le,2),ge=z(M),_e=z(ge),ye=B(_e,!0),be=V(_e,2),xe=z(be),Se=V(xe,2);Wr(Se,(e,t)=>sc?.(e,t),()=>({value:String(G(s)),again:Q.sizeEpoch}));var Ce=V(Se,2);N(be),N(ge);var we=V(ge,2),Te=z(we),Ee=B(Te,!0),De=V(Te,2);Wr(De,(e,t)=>sc?.(e,t),()=>({value:String(G(c)),again:Q.sizeEpoch})),N(we);var Oe=B(V(we,2),!0);N(M);var ke=V(M,2),Ae=B(ke,!0),je=V(ke,2),Me=B(je,!0),Ne=V(je,2),Pe=B(Ne,!0),Fe=V(Ne,2),Ie=z(Fe),Le=B(Ie,!0),Re=V(Ie,2),P=z(Re);Rr(P,19,()=>Ls,e=>e.label,(e,t,n)=>{var r=xc(),i=B(r,!0),a={};H(e=>{Y(i,G(t).label),a!==(a=e)&&(r.value=(r.__value=a)??``)},[()=>String(G(n))]),J(e,r)});var ze=V(P);ze.value=ze.__value=`custom`,N(Re),Wr(Re,(e,t)=>sc?.(e,t),()=>({value:G(i)>=0?String(G(i)):`custom`,again:Q.sizeEpoch})),N(Fe),N(x),N(f),H((e,t,n,i,a,o,c,l,u,d,p,m,g,x,S,w,T,E,O,ae,le,A,ue,pe,me,ge,_e)=>{X(f,`hidden`,Q.tab!==`poster`),Y(h,e),X(_,`title`,t),X(_,`aria-label`,n),_.disabled=Q.pageCount<=1,X(v,`max`,Q.maxPages),X(y,`title`,i),X(y,`aria-label`,a),y.disabled=Q.pageCount>=Q.maxPages,Y(b,o),Y(C,c),Y(ee,l),X(D,`title`,u),X(D,`aria-pressed`,Q.activeSize===`post`),Y(te,d),Y(ne,p),X(re,`title`,m),X(re,`aria-pressed`,Q.activeSize===`custom`),Y(ie,g),X(k,`title`,x),X(k,`aria-pressed`,G(r)===`landscape`),k.disabled=G(s)>1,Y(oe,S),X(se,`title`,w),X(se,`aria-pressed`,G(r)===`portrait`),se.disabled=G(s)>1,Y(ce,T),Y(de,E),fe.disabled=G(s)>1,Y(j,O),he.disabled=G(s)>1,X(M,`hidden`,G(s)<=1),Y(ye,ae),X(xe,`title`,le),xe.disabled=G(s)<=Q.splitMin,X(Ce,`title`,A),Ce.disabled=G(s)>=Q.splitMax,Y(Ee,ue),Y(Oe,pe),X(ke,`hidden`,!Q.book),Y(Ae,me),Y(Me,Q.sizeNote),X(Ne,`hidden`,G(s)<=1),Y(Pe,ge),Y(Le,_e)},[()=>$(`Pages`),()=>$(`One page fewer; photos are shared evenly again`),()=>$(`Fewer pages`),()=>$(`One page more; photos are shared evenly again`),()=>$(`More pages`),()=>$(`Photos are shared evenly across the pages. To place them yourself, add or remove pages and send photos between them.`),()=>$(`Output image size`),()=>$(`Social`),()=>$(`A wide collage cut into square images for an Instagram carousel`),()=>$(`Instagram post`),()=>$(`Several square images`),()=>$(`Type your own width and height`),()=>$(`Custom`),()=>$(`Wider than tall`),()=>$(`Landscape`),()=>$(`Taller than wide`),()=>$(`Portrait`),()=>$(`Width`),()=>$(`Height`),()=>$(`Number of images`),()=>$(`Fewer square images in the post`),()=>$(`More square images in the post`),()=>$(`Size of each image (px)`),()=>$(`The collage is made as one wide picture and cut into %(n)s squares when you save. Use Columns to change how it is arranged.`,{n:G(s)}),()=>$(`In a book, this is the size of each page.`),()=>$(`Dashed lines mark where the collage is split into %(n)s images of %(px)s × %(px)s pixels. They are saved as a zip, numbered _1 to _%(n)s from left to right.`,{n:G(s),px:G(c)}),()=>$(`Apply a template:`)]),K(`click`,_,()=>Q.setPageCount(Q.pageCount-1)),K(`change`,v,e=>{Q.setPageCount(Number(e.currentTarget.value)),zt(d)}),K(`click`,y,()=>Q.setPageCount(Q.pageCount+1)),K(`click`,D,()=>Q.chooseInstagramPost()),K(`click`,re,()=>{Q.chooseCustomSize(),u.querySelector(`#width`)?.focus()}),K(`click`,k,()=>Q.turn(!1)),K(`click`,se,()=>Q.turn(!0)),K(`input`,fe,e=>l(e.currentTarget.closest(`.size-row`))),K(`change`,fe,e=>l(e.currentTarget.closest(`.size-row`))),K(`input`,he,e=>l(e.currentTarget.closest(`.size-row`))),K(`change`,he,e=>l(e.currentTarget.closest(`.size-row`))),K(`click`,xe,()=>Q.setSplit(G(s)-1,G(c),!0)),K(`change`,Se,e=>{let t=Aa(Number(e.currentTarget.value));t===0?e.currentTarget.value=String(G(s)):Q.setSplit(t,G(c),!0)}),K(`click`,Ce,()=>Q.setSplit(G(s)+1,G(c),!0)),K(`change`,De,e=>{let t=Number(e.currentTarget.value);Number.isFinite(t)&&t>=16?Q.setSplit(G(s),t,!0):e.currentTarget.value=String(G(c))}),K(`change`,Re,e=>{let t=Ls[Number(e.currentTarget.value)];Q.customSize=!1,t&&Q.chooseSize(t.width,t.height)}),J(e,f),Ve()}mr([`click`,`change`,`input`]);var wc=q(`<button type="button" id="save-page" class="wide"> </button>`),Tc=q(`<div class="save-block" id="save-block"><div class="sheet-head only-narrow"><span class="grab" aria-hidden="true"></span> <h2> </h2> <button type="button" id="save-close" class="link"> </button></div> <p id="save-summary" class="meta"> </p> <div class="save-opts"><fieldset class="seg group" id="format-seg" aria-label="Format"><button type="button" id="format-png">PNG</button> <button type="button" id="format-jpeg">JPEG</button></fieldset> <select id="format" class="sr-only" tabindex="-1" aria-label="Format"><option>PNG</option><option>JPEG</option></select> <label class="field" id="quality-field"><span class="rowhead"><span> </span> <output id="quality-output" for="quality"> </output></span> <input id="quality" class="range" type="range" min="10" max="100" step="1"/></label></div> <button type="button" id="save" class="primary wide"> </button> <!></div>`);function Ec(e,t){Be(t,!0);let n=wi(t,`block`,15),r=F(()=>Q.settings.format===`jpeg`?`JPEG`:`PNG`),i=F(()=>Q.pageCounts.filter(e=>e>0).length),a=F(()=>Q.settings.splitImages>1),o=F(()=>G(i)*(G(a)?Q.settings.splitImages:1)),s=F(()=>Q.book&&G(o)>1?$(`ZIP of %(n)s %(kind)s images, %(w)s × %(h)s px each`,{n:G(o),kind:G(r),w:G(a)?Q.settings.height:Q.settings.width,h:Q.settings.height}):Q.settings.splitImages>1?$(`ZIP of %(n)s %(kind)s images, %(px)s × %(px)s px each`,{n:Q.settings.splitImages,kind:G(r),px:Q.settings.height}):`${G(r)}, ${Q.settings.width} × ${Q.settings.height} px`),c=()=>Math.max(0,Q.pageCounts.findIndex(e=>e>0)),l=F(()=>Math.round(Q.settings.jpegQuality*100));var u=Tc(),d=z(u),f=V(z(d),2),p=B(f,!0),m=V(f,2),h=B(m,!0);N(d),Wr(d,(e,t)=>ac?.(e,t),()=>()=>Q.setTab(`save`,!0));var g=V(d,2),_=B(g,!0),v=V(g,2),y=z(v),b=z(y),x=V(b,2);N(y);var S=V(y,2),C=z(S);C.value=C.__value=`png`;var w=V(C);w.value=w.__value=`jpeg`,N(S),Wr(S,(e,t)=>sc?.(e,t),()=>({value:Q.settings.format}));var T=V(S,2),E=z(T),ee=z(E),D=B(ee,!0),O=B(V(ee,2));N(E);var te=V(E,2);let ne;Wr(te,(e,t)=>sc?.(e,t),()=>({value:String(G(l)),again:Q.restoreEpoch,sticky:!0})),N(T),N(v);var re=V(v,2),ie=B(re,!0),ae=V(re,2),k=e=>{var t=wc(),n=B(t,!0);H((e,r)=>{X(t,`title`,e),t.disabled=!Q.hasPhotos,Y(n,r)},[()=>$(`Save only one page`),()=>$(`Save this page`)]),K(`click`,t,()=>void Q.save(Q.selected===null?c():Q.selectedPage)),J(e,t)};Nr(ae,e=>{Q.book&&e(k)}),N(u),xi(u,e=>n(e),()=>n()),H((e,t,n,r,i,a,o,c)=>{Y(p,e),X(m,`title`,t),Y(h,n),Y(_,G(s)),X(b,`title`,r),X(b,`aria-pressed`,Q.settings.format===`png`),X(x,`title`,i),X(x,`aria-pressed`,Q.settings.format===`jpeg`),X(T,`hidden`,Q.settings.format!==`jpeg`),Y(D,a),Y(O,`${G(l)??``}%`),ne=ti(te,``,ne,{"--p":`${(G(l)-10)/90*100}%`}),X(re,`title`,o),re.disabled=!Q.hasPhotos,Y(ie,c)},[()=>$(`Save image`),()=>$(`Close the save options`),()=>$(`Close`),()=>$(`Save as PNG: exact colours, larger files`),()=>$(`Save as JPEG: smaller files`),()=>$(`JPEG quality`),()=>$(`Save the collage as image files`),()=>Q.book?$(`Save book...`):$(`Save poster...`)]),K(`click`,m,()=>Q.setTab(`save`,!0)),K(`click`,b,()=>Q.settings.format=`png`),K(`click`,x,()=>Q.settings.format=`jpeg`),K(`change`,S,e=>Q.settings.format=e.currentTarget.value===`jpeg`?`jpeg`:`png`),K(`input`,te,e=>Q.settings.jpegQuality=Number(e.currentTarget.value)/100),K(`click`,re,()=>void Q.save()),J(e,u),Ve()}mr([`click`,`change`,`input`]);var Dc=q(`<option> </option>`),Oc=q(`<label class="field move-page" for="move-page"><span> </span> <select id="move-page"></select></label>`),kc=q(`<div class="crop-tools" id="crop-tools"><label for="crop-zoom"> </label> <input id="crop-zoom" type="range" min="1" step="0.01"/> <button type="button" id="crop-reset"> </button> <p class="hint"> </p></div>`),Ac=q(`<section class="dock" id="selected-dock"><div class="rowhead"><h3 id="dock-name"> </h3> <button type="button" id="dock-done" class="link"> </button></div> <fieldset id="span-group" class="span-group"><legend class="sr-only"> </legend> <button type="button" id="span-wider"> </button> <button type="button" id="span-taller"> </button> <button type="button" id="span-reset"> </button> <button type="button" id="crop-toggle"> </button> <button type="button" id="remove-selected" class="danger"> </button></fieldset> <!> <!></section>`);function jc(e,t){Be(t,!0);let n=F(()=>Q.selectedPhoto?.span??{columns:1,rows:1}),r=F(()=>Q.selectedPhoto?.crop),i=F(()=>G(r)?.zoom??1),a=F(()=>G(n).rows>1?`${$(`Taller`)} ×${G(n).rows}`:$(`Taller`)),o=F(()=>Q.selection.length),s=F(()=>G(o)>1);var c=Ac(),l=z(c),u=z(l),d=B(u,!0),f=V(u,2),p=B(f,!0);N(l);var m=V(l,2),h=z(m),g=B(h,!0),_=V(h,2),v=B(_,!0),y=V(_,2),b=B(y,!0),x=V(y,2),S=B(x,!0),C=V(x,2),w=B(C,!0),T=V(C,2),E=B(T,!0);N(m);var ee=V(m,2),D=e=>{var t=Oc(),n=z(t),r=B(n,!0),i=V(n,2);Rr(i,20,()=>Array.from({length:Q.pageCount},(e,t)=>t),e=>e,(e,t)=>{var n=Dc(),r=B(n,!0),i={};H((e,t)=>{Y(r,e),i!==(i=t)&&(n.value=(n.__value=i)??``)},[()=>$(`Page %(n)s`,{n:t+1}),()=>String(t)]),J(e,n)}),N(i);var a;ai(i),N(t),H((e,t)=>{Y(r,e),a!==(a=t)&&(i.value=(i.__value=a)??``,ii(i,a))},[()=>$(`Page`),()=>String(Q.selectedPage)]),K(`change`,i,e=>Q.moveSelectedToPage(Number(e.currentTarget.value))),J(e,t)};Nr(ee,e=>{Q.book&&e(D)});var O=V(ee,2),te=e=>{var t=kc(),n=z(t),a=B(n,!0),o=V(n,2);fi(o);var s=V(o,2),c=B(s,!0),l=B(V(s,2),!0);N(t),H((e,t,n,u)=>{Y(a,e),X(o,`max`,Q.maxZoom),pi(o,G(i)),X(s,`title`,t),s.disabled=!G(r),Y(c,n),Y(l,u)},[()=>$(`Zoom`),()=>$(`Show the middle of the photo again`),()=>$(`Reset crop`),()=>$(`Drag the photo to move it, scroll or use the slider to zoom.`)]),K(`input`,o,e=>Q.zoomSelectedCrop(Number(e.currentTarget.value))),K(`click`,s,()=>Q.resetCrop()),J(e,t)};Nr(O,e=>{Q.cropping&&e(te)}),N(c),H((e,t,r,i,o,l,u,m,h,ee,D,O,te,ne)=>{X(c,`aria-label`,e),X(c,`hidden`,!Q.selectedPhoto),Y(d,t),X(f,`title`,r),Y(p,i),Y(g,o),X(_,`title`,l),X(_,`aria-pressed`,G(n).columns===2),Y(v,u),X(y,`title`,m),Y(b,G(a)),X(x,`title`,h),x.disabled=!G(s)&&G(n).columns===1&&G(n).rows===1,Y(S,ee),X(C,`title`,D),C.disabled=G(s),X(C,`aria-pressed`,Q.cropping),Y(w,O),X(T,`title`,te),Y(E,ne)},[()=>G(s)?$(`Selected photos`):$(`Selected photo`),()=>G(s)?$(`%(n)s photos selected`,{n:G(o)}):Q.selectedPhoto?.name??``,()=>G(s)?$(`Deselect the photos`):$(`Deselect the photo`),()=>$(`Done`),()=>$(`Size of the selected photo`),()=>G(s)?$(`Give these photos two columns`):$(`Give this photo two columns`),()=>$(`Wider`),()=>G(s)?$(`Give these photos more rows`):$(`Give this photo more rows`),()=>G(s)?$(`Back to their normal size`):$(`Back to its normal size`),()=>$(`Normal size`),()=>G(s)?$(`Crop works on one photo at a time`):$(`Choose which part of the photo shows`),()=>$(`Crop`),()=>G(s)?$(`Take these photos out of the collage`):$(`Take this photo out of the collage`),()=>G(s)?$(`Remove %(n)s photos`,{n:G(o)}):$(`Remove selected photo`)]),K(`click`,f,()=>Q.deselect()),K(`click`,_,()=>Q.toggleWider()),K(`click`,y,()=>Q.cycleTaller()),K(`click`,x,()=>Q.resetSpan()),K(`click`,C,()=>Q.toggleCrop()),K(`click`,T,()=>Q.removeSelected()),J(e,c),Ve()}mr([`click`,`change`,`input`]);var Mc=q(`<button type="button"></button>`),Nc=q(`<button type="button"><span></span></button>`),Pc=q(`<section class="tabpanel" id="panel-style" role="tabpanel" aria-labelledby="tab-style"><section class="panel-card" aria-labelledby="layout-h"><h3 id="layout-h" class="card-title"> </h3> <fieldset class="cards layout-cards group" id="layout-cards" aria-labelledby="layout-h"><button type="button" class="card" id="layout-mosaic"><span class="card-head"><svg viewBox="0 0 40 30" aria-hidden="true"><rect x="1" y="1" width="8" height="12" rx="1.5"></rect><rect x="1" y="15" width="8" height="14" rx="1.5"></rect><rect x="11" y="1" width="8" height="16" rx="1.5"></rect><rect x="11" y="19" width="8" height="10" rx="1.5"></rect><rect x="21" y="1" width="8" height="9" rx="1.5"></rect><rect x="21" y="12" width="8" height="17" rx="1.5"></rect><rect x="31" y="1" width="8" height="13" rx="1.5"></rect><rect x="31" y="16" width="8" height="13" rx="1.5"></rect></svg> <b> </b></span> <small> </small></button> <button type="button" class="card" id="layout-gallery"><span class="card-head"><svg viewBox="0 0 40 30" aria-hidden="true"><rect x="1" y="1" width="17" height="16" rx="1.5"></rect><rect x="1" y="19" width="8" height="10" rx="1.5"></rect><rect x="11" y="19" width="7" height="10" rx="1.5"></rect><rect x="20" y="1" width="19" height="9" rx="1.5"></rect><rect x="20" y="12" width="9" height="17" rx="1.5"></rect><rect x="31" y="12" width="8" height="17" rx="1.5"></rect></svg> <b> </b></span> <small> </small></button></fieldset> <div id="columns-block" class="columns-block"><div class="inline-row"><label for="columns"> </label> <div class="stepper mini"><button type="button" id="columns-less" class="sq" aria-label="Fewer columns"><svg class="ico16" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path></svg></button> <input id="columns" type="number" min="1" step="1" inputmode="numeric"/> <button type="button" id="columns-more" class="sq" aria-label="More columns"><svg class="ico16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></button> <button type="button" id="columns-auto" class="mini-btn"> </button></div></div> <p id="columns-note" class="hint sr-only"> </p></div> <p id="gallery-note" class="hint"> </p> <div class="inline-row"><span id="crop-note" class="trim"> </span> <button type="button" id="regenerate" class="mini-btn"><svg class="ico16" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"></path><path d="M20 4v7h-7"></path></svg> <span> </span></button></div> <button type="button" id="shuffle-pages" class="mini-btn"><svg class="ico16" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h11l-3-3M20 17H9l3 3"></path></svg> <span> </span></button></section> <section class="panel-card" aria-labelledby="border-h"><h3 id="border-h" class="card-title"> </h3> <div class="inline-row"><span id="bw-h"> </span> <input id="border-width" class="range" type="range" min="0" max="20" step="0.1" aria-labelledby="bw-h"/> <output id="border-output" for="border-width"> </output></div> <div class="inline-row"><span id="bc-h"> </span> <fieldset class="swatches group" id="swatches" aria-labelledby="bc-h"><!> <input id="border-color" class="custom-swatch" type="color"/></fieldset></div> <div class="inline-row"><span id="cs-h"> </span> <fieldset class="seg corners-seg group" id="corner-cards" aria-labelledby="cs-h"></fieldset></div> <label class="sr-only"><span> </span> <select id="corner-style" tabindex="-1"><option> </option><option> </option><option> </option></select></label> <label class="switch" for="outer-border"><span> </span> <input id="outer-border" type="checkbox"/></label></section> <details id="technical" class="technical"><summary> </summary> <label class="field"><span> </span> <input id="seed" type="number" min="0" max="4294967295" step="1" inputmode="numeric"/></label> <p class="hint"> </p></details></section>`);function Fc(e,t){Be(t,!0);let n=[{name:`White`,color:`#ffffff`},{name:`Black`,color:`#111111`},{name:`Cream`,color:`#f1e7d0`},{name:`Sage`,color:`#a3b18a`},{name:`Dusty blue`,color:`#8aa1b5`},{name:`Terracotta`,color:`#c8785a`}],r=[{value:`none`,label:`Square`},{value:`slight`,label:`Slight`},{value:`rounded`,label:`Rounded`}],i=F(()=>Q.layoutStyle===`gallery`),a=F(()=>Math.round(Q.settings.borderWidth*1e3)/10),o=(e,t,n)=>`${Math.min(100,Math.max(0,(e-t)/(n-t)*100))}%`,s=L(0);function c(e){let t=e.trim();Q.setColumns(t===``?void 0:Li(Number(t)))}function l(e){let t=Number(e);Q.settings.borderWidth=Number.isFinite(t)?Math.min(20,Math.max(0,t))/100:0}var u=Pc(),d=z(u),f=z(d),p=B(f,!0),m=V(f,2),h=z(m),g=z(h),_=B(V(z(g),2),!0);N(g);var v=B(V(g,2),!0);N(h);var y=V(h,2),b=z(y),x=B(V(z(b),2),!0);N(b);var S=B(V(b,2),!0);N(y),N(m);var C=V(m,2),w=z(C),T=z(w),E=B(T,!0),ee=V(T,2),D=z(ee),O=V(D,2);Wr(O,(e,t)=>sc?.(e,t),()=>({value:Q.columns===void 0?``:String(Q.columns),again:G(s)}));var te=V(O,2),ne=V(te,2),re=B(ne,!0);N(ee),N(w);var ie=B(V(w,2),!0);N(C);var ae=V(C,2),k=B(ae,!0),oe=V(ae,2),se=z(oe),ce=B(se,!0),le=V(se,2),A=B(V(z(le),2),!0);N(le),N(oe);var ue=V(oe,2),de=B(V(z(ue),2),!0);N(ue),N(d);var fe=V(d,2),pe=z(fe),me=B(pe,!0),j=V(pe,2),he=z(j),M=B(he,!0),ge=V(he,2);let _e;Wr(ge,(e,t)=>sc?.(e,t),()=>({value:String(G(a)),again:Q.restoreEpoch,sticky:!0}));var ve=B(V(ge,2));N(j);var ye=V(j,2),be=z(ye),xe=B(be,!0),Se=V(be,2),Ce=z(Se);Rr(Ce,17,()=>n,({name:e,color:t})=>t,(e,t)=>{let n=()=>G(t).name,r=()=>G(t).color;var i=Mc();let a;H(e=>{X(i,`data-color`,r()),X(i,`aria-label`,n()),X(i,`title`,n()),X(i,`aria-pressed`,e),a=ti(i,``,a,{background:r()})},[()=>Q.settings.borderColor.toLowerCase()===r()]),K(`click`,i,()=>Q.settings.borderColor=r()),J(e,i)});var we=V(Ce,2);fi(we),N(Se),N(ye);var Te=V(ye,2),Ee=z(Te),De=B(Ee,!0),Oe=V(Ee,2);Rr(Oe,21,()=>r,({value:e,label:t})=>e,(e,t)=>{let n=()=>G(t).value,r=()=>G(t).label;var i=Nc(),a=B(i);H((e,t)=>{X(i,`data-corner`,n()),X(i,`title`,e),X(i,`aria-label`,t),X(i,`aria-pressed`,Q.settings.cornerStyle===n()),$r(a,1,`shape ${n()??``}`)},[()=>$(r()),()=>$(r())]),K(`click`,i,()=>Q.settings.cornerStyle=n()),J(e,i)}),N(Oe),N(Te);var ke=V(Te,2),Ae=z(ke),je=B(Ae,!0),Me=V(Ae,2),Ne=z(Me),Pe=B(Ne,!0);Ne.value=Ne.__value=`none`;var Fe=V(Ne),Ie=B(Fe,!0);Fe.value=Fe.__value=`slight`;var Le=V(Fe),Re=B(Le,!0);Le.value=Le.__value=`rounded`,N(Me),Wr(Me,(e,t)=>sc?.(e,t),()=>({value:Q.settings.cornerStyle})),N(ke);var P=V(ke,2),ze=z(P),He=B(ze,!0),Ue=V(ze,2);fi(Ue),N(P),N(fe);var We=V(fe,2),Ge=z(We),Ke=B(Ge,!0),qe=V(Ge,2),Je=z(qe),Ye=B(Je,!0),Xe=V(Je,2);Wr(Xe,(e,t)=>sc?.(e,t),()=>({value:String(Q.seed)})),N(qe);var Ze=B(V(qe,2),!0);N(We),N(u),H((e,t,n,r,o,s,c,l,d,f,m,g,b,w,T,ee,oe,fe,pe,j,N,ye,be,Se,Ce,Te,Ee,Oe,ke,Ae,Me,Ne,Fe,Le,ze,Be,Ve,We,Ge,qe)=>{X(u,`hidden`,Q.tab!==`style`),Y(p,e),X(h,`title`,t),X(h,`aria-pressed`,!G(i)),Y(_,n),Y(v,r),X(y,`title`,o),X(y,`aria-pressed`,G(i)),Y(x,s),Y(S,c),X(C,`hidden`,G(i)),Y(E,l),X(D,`title`,d),X(O,`max`,100),X(O,`placeholder`,f),X(O,`title`,m),X(te,`title`,g),X(ne,`title`,b),X(ne,`hidden`,Q.columns===void 0),Y(re,w),Y(ie,T),X(ae,`hidden`,!G(i)),Y(k,ee),X(se,`title`,oe),Y(ce,fe),X(le,`title`,pe),Y(A,j),X(ue,`title`,N),X(ue,`hidden`,!Q.book),Y(de,ye),Y(me,be),X(he,`title`,Se),Y(M,Ce),X(ge,`title`,Te),_e=ti(ge,``,_e,{"--p":Ee}),Y(ve,`${G(a)??``}%`),Y(xe,Oe),X(we,`aria-label`,ke),X(we,`title`,Ae),pi(we,Q.settings.borderColor),Y(De,Me),Y(je,Ne),Y(Pe,Fe),Y(Ie,Le),Y(Re,ze),X(P,`title`,Be),Y(He,Ve),mi(Ue,Q.settings.outerBorder),Y(Ke,We),Y(Ye,Ge),Y(Ze,qe)},[()=>$(`Arrangement`),()=>$(`Mosaic: photos fill columns of different heights`),()=>$(`Mosaic`),()=>$(`Photos fill columns of different heights.`),()=>$(`Gallery: one panel per photo`),()=>$(`Gallery`),()=>$(`The collage is split into panels, one per photo.`),()=>$(`Columns`),()=>$(`One column fewer`),()=>Q.columnsInUse===void 0?$(`Auto`):$(`Auto · %(n)s`,{n:Q.columnsInUse}),()=>$(`Type a number of columns, or leave empty for automatic`),()=>$(`One column more`),()=>$(`Let the layout choose the columns`),()=>$(`Auto`),()=>Q.columnsInUse===void 0?``:$(`Columns in use: %(n)s`,{n:Q.columnsInUse}),()=>$(`Gallery sizes its panels itself.`),()=>$(`Lower means more of each photo is visible.`),()=>Q.layout?$(`%(pct)s% of each photo is trimmed to fit.`,{pct:Q.cropPercent}):``,()=>$(`Try a new arrangement of the same photos`),()=>$(`Shuffle`),()=>$(`Mix the photos between the pages, keeping how many each has`),()=>$(`Shuffle photos between pages`),()=>$(`Border`),()=>$(`A share of the collage's longer side. 0 removes the border.`),()=>$(`Thickness`),()=>$(`A share of the collage's longer side. 0 removes the border.`),()=>o(G(a),0,20),()=>$(`Colour`),()=>$(`Custom colour`),()=>$(`Custom colour`),()=>$(`Corners`),()=>$(`Corner style`),()=>$(`None`),()=>$(`Slightly rounded`),()=>$(`Rounded`),()=>$(`Turn off to keep the border only between photos.`),()=>$(`Around the edge`),()=>$(`Technical configuration`),()=>$(`Seed`),()=>$(`The same photos, seed and number of columns always give the same layout. When photos are added, the seed of the best of 30 tries is shown here.`)]),K(`click`,h,()=>Q.chooseLayout(`mosaic`)),K(`click`,y,()=>Q.chooseLayout(`gallery`)),K(`click`,D,()=>Q.stepColumns(-1)),K(`input`,O,e=>c(e.currentTarget.value)),K(`change`,O,e=>{c(e.currentTarget.value),zt(s)}),K(`click`,te,()=>Q.stepColumns(1)),K(`click`,ne,()=>Q.setColumns(void 0)),K(`click`,le,()=>Q.shuffle()),K(`click`,ue,()=>Q.shufflePages()),K(`input`,ge,e=>l(e.currentTarget.value)),K(`input`,we,e=>Q.settings.borderColor=e.currentTarget.value),K(`change`,Me,e=>{let t=e.currentTarget.value;Q.settings.cornerStyle=t===`slight`||t===`rounded`?t:`none`}),K(`change`,Ue,e=>Q.settings.outerBorder=e.currentTarget.checked),K(`change`,Xe,e=>{Q.setSeed(Number(e.currentTarget.value))||(e.currentTarget.value=String(Q.seed))}),J(e,u),Ve()}mr([`click`,`input`,`change`]);var Ic=q(`<option> </option>`),Lc=q(`<aside class="side panel" aria-label="Controls"><div class="brand"><h1>Collage Creator</h1> <div class="brand-actions"><button type="button" id="help-open-head" class="icon-btn help-btn" aria-haspopup="dialog" aria-label="Help">?</button> <button type="button" id="menu-open" class="icon-btn menu-btn" aria-controls="util" aria-label="Menu: language and about"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"></path></svg></button></div></div> <div id="tabs" role="tablist" aria-label="Settings"><button type="button" role="tab" id="tab-photos" aria-controls="panel-photos"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><circle cx="9" cy="10" r="1.5"></circle><path d="m21 16-5-5-9 8"></path></svg> <span><span class="num">1.</span><span> </span></span></button> <button type="button" role="tab" id="tab-poster" aria-controls="panel-poster"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M12 3v18M3 12h9M12 8h9"></path></svg> <span><span class="num">2.</span><span> </span></span></button> <button type="button" role="tab" id="tab-style" aria-controls="panel-style"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5S14 15 15 15h2a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"></path></svg> <span><span class="num">3.</span><span> </span></span></button> <button type="button" role="tab" id="tab-save" class="tab-save" aria-controls="save-block"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"></path></svg> <span> </span></button></div> <div class="sheet" id="sheet"><div class="sheet-head"><span class="grab" aria-hidden="true"></span> <h2 id="sheet-title"> </h2> <button type="button" id="sheet-close" class="link"> </button></div> <!> <!> <!></div> <!> <!> <div class="util" id="util"><div class="util-row"><label class="inline"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"></path></svg> <span class="sr-only"> </span> <select id="language"></select></label> <button type="button" id="about-open" class="link"> </button></div></div></aside>`);function Rc(e,t){Be(t,!0);let n={photos:`Photos`,poster:`Poster`,style:`Style`,save:`Save image`},r,i=L(void 0),a,o=L(!1);pn(()=>{if(Q.riseToken===0)return;let e=Q.tab===`save`?G(i):r;e&&(e.classList.remove(`rise`),e.offsetWidth,e.classList.add(`rise`))}),pn(()=>{Q.tab,r.scrollTop=0,R(o,!1)});function s(e){if(e.key!==`ArrowRight`&&e.key!==`ArrowLeft`)return;let t=[...a.querySelectorAll(`[role="tab"]`)].filter(e=>e.offsetParent!==null),n=t.map(e=>e.id.replace(`tab-`,``)),r=n[(n.indexOf(Q.tab)+(e.key===`ArrowRight`?1:-1)+n.length)%n.length];r&&(e.preventDefault(),Q.setTab(r,!1),t[n.indexOf(r)]?.focus())}function c(e){try{let t=e.replace(`_`,`-`);return new Intl.DisplayNames([t],{type:`language`}).of(t)??e}catch{return e}}let l=e=>e===Q.tab&&(!Q.narrow||Q.sheetOpen);var u=Lc();pr(`click`,Kt,e=>{Q.menuOpen&&(e.target instanceof Node&&e.target.closest?.(`#util`)||Q.closeMenu())});var d=z(u),f=V(z(d),2),p=z(f),m=V(p,2);N(f),N(d);var h=V(d,2);let g;var _=z(h),v=V(z(_),2),y=B(V(z(v)),!0);N(v),N(_);var b=V(_,2),x=V(z(b),2),S=B(V(z(x)),!0);N(x),N(b);var C=V(b,2),w=V(z(C),2),T=B(V(z(w)),!0);N(w),N(C);var E=V(C,2),ee=B(V(z(E),2),!0);N(E),N(h),xi(h,e=>a=e,()=>a);var D=V(h,2),O=z(D),te=V(z(O),2),ne=B(te,!0),re=V(te,2),ie=B(re,!0);N(O),Wr(O,(e,t)=>ac?.(e,t),()=>()=>Q.setTab(Q.tab,!0));var ae=V(O,2);vc(ae,{});var k=V(ae,2);Cc(k,{}),Fc(V(k,2),{}),N(D),xi(D,e=>r=e,()=>r);var oe=V(D,2);jc(oe,{});var se=V(oe,2);Ec(se,{get block(){return G(i)},set block(e){R(i,e,!0)}});var ce=V(se,2),le=z(ce),A=z(le),ue=V(z(A),2),de=B(ue,!0),fe=V(ue,2);Rr(fe,20,()=>Ya,e=>e,(e,t)=>{var n=Ic(),r=B(n,!0),i={};H(e=>{Y(r,e),i!==(i=t)&&(n.value=(n.__value=i)??``)},[()=>c(t)]),J(e,n)}),N(fe);var pe;ai(fe),N(A);var me=V(A,2),j=B(me,!0);N(le),N(ce),N(u),H((e,t,n,r,i,a,s,c,l,u,d,f,v,x,w,D,O,te,ae,k)=>{X(p,`title`,e),X(m,`title`,t),X(m,`aria-expanded`,Q.menuOpen),g=$r(h,1,`tabs`,null,g,{lifted:G(o)}),X(_,`title`,n),X(_,`aria-selected`,r),X(_,`tabindex`,Q.tab===`photos`?0:-1),Y(y,i),X(b,`title`,a),X(b,`aria-selected`,s),X(b,`tabindex`,Q.tab===`poster`?0:-1),Y(S,c),X(C,`title`,l),X(C,`aria-selected`,u),X(C,`tabindex`,Q.tab===`style`?0:-1),Y(T,d),X(E,`title`,f),X(E,`aria-selected`,v),X(E,`tabindex`,Q.tab===`save`?0:-1),Y(ee,x),Y(ne,w),X(re,`title`,D),Y(ie,O),Y(de,te),pe!==(pe=Q.lang)&&(fe.value=(fe.__value=pe)??``,ii(fe,pe)),X(me,`title`,ae),Y(j,k)},[()=>$(`Help`),()=>$(`Language and about`),()=>$(`Add and arrange photos`),()=>l(`photos`),()=>$(`Photos`),()=>$(`Pages, output size and shape`),()=>l(`poster`),()=>$(`Poster`),()=>$(`Layout, borders and corners`),()=>l(`style`),()=>$(`Style`),()=>$(`Save the collage`),()=>l(`save`),()=>$(`Save`),()=>$(n[Q.tab]),()=>$(`Close this panel`),()=>$(`Close`),()=>$(`Language`),()=>$(`About Collage Creator`),()=>$(`About`)]),K(`click`,p,()=>Q.dialog=`help`),K(`click`,m,e=>{e.stopPropagation(),Q.menuOpen=!Q.menuOpen}),K(`keydown`,h,s),K(`click`,_,()=>Q.setTab(`photos`,!0)),K(`click`,b,()=>Q.setTab(`poster`,!0)),K(`click`,C,()=>Q.setTab(`style`,!0)),K(`click`,E,()=>Q.setTab(`save`,!0)),pr(`scroll`,D,()=>R(o,r.scrollTop>1)),K(`click`,re,()=>Q.setTab(Q.tab,!0)),K(`change`,fe,e=>Q.chooseLanguage(e.currentTarget.value)),K(`click`,me,()=>Q.dialog=`about`),J(e,u),Ve()}mr([`click`,`keydown`,`change`]);var zc=q(`<span class="page-label"> <span class="page-count"> </span></span>`),Bc=q(`<div role="group"><!> <button type="button" class="icon-btn page-left"><svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"></path></svg></button> <button type="button" class="icon-btn page-right"><svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"></path></svg></button> <button type="button" class="icon-btn page-save"><svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"></path></svg></button> <button type="button" class="icon-btn page-remove"><svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg></button></div>`),Vc=q(`<button type="button" id="add-page-tile" class="add-page"><svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg> <span> </span></button>`),Hc=q(`<!> <!>`,1);function Uc(e,t){Be(t,!0);let n=F(()=>Q.posterBox),r=F(()=>Q.layout?.pages??[]),i=F(()=>Q.isSplit?66:10),a=F(()=>Q.isSplit?68:12),o=F(()=>G(n)?{left:G(n).x+G(n).w,top:G(n).y+G(n).h+G(a)}:null),s=L(null),c=F(()=>G(s)??G(o));var l=Hc(),u=en(l),d=e=>{var t=Cr();Rr(en(t),17,()=>G(r),Pr,(e,t,a)=>{let o=F(()=>G(t).w*G(n).w),s=F(()=>Q.pageCounts[a]??0);var c=Cr(),l=en(c),u=e=>{var c=Bc();let l,u;var d=z(c),f=e=>{var t=zc(),n=z(t),r=B(V(n));N(t),H(e=>{Y(n,`${e??``} `),Y(r,`· ${G(s)??``}`)},[()=>$(`Page %(n)s`,{n:a+1})]),J(e,t)};Nr(d,e=>{G(o)>=190&&e(f)});var p=V(d,2);p.disabled=a===0;var m=V(p,2),h=V(m,2),g=V(h,2);N(c),H((e,d,f,_,v,y,b,x,S)=>{l=$r(c,1,`page-pill`,null,l,{compact:G(o)<190}),X(c,`aria-label`,e),u=ti(c,``,u,{left:`${G(n).x+(G(t).x+G(t).w/2)*G(n).w}px`,top:`${G(n).y-G(i)}px`}),X(p,`title`,d),X(p,`aria-label`,f),X(m,`title`,_),X(m,`aria-label`,v),m.disabled=a===G(r).length-1,X(h,`title`,y),X(h,`aria-label`,b),h.disabled=G(s)===0,X(g,`title`,x),X(g,`aria-label`,S)},[()=>$(`Page %(n)s of %(total)s`,{n:a+1,total:G(r).length}),()=>$(`Move page %(n)s left`,{n:a+1}),()=>$(`Move page %(n)s left`,{n:a+1}),()=>$(`Move page %(n)s right`,{n:a+1}),()=>$(`Move page %(n)s right`,{n:a+1}),()=>$(`Save page %(n)s`,{n:a+1}),()=>$(`Save page %(n)s`,{n:a+1}),()=>$(`Remove page %(n)s`,{n:a+1}),()=>$(`Remove page %(n)s`,{n:a+1})]),K(`click`,p,()=>Q.movePage(a,-1)),K(`click`,m,()=>Q.movePage(a,1)),K(`click`,h,()=>void Q.save(a)),K(`click`,g,()=>Q.askRemovePage(a)),J(e,c)};Nr(l,e=>{G(o)>=136&&e(u)}),J(e,c)}),J(e,t)};Nr(u,e=>{G(n)&&Q.hasPhotos&&Q.book&&e(d)});var f=V(u,2),p=e=>{var t=Vc();let n;var r=B(V(z(t),2),!0);N(t),H((e,i)=>{X(t,`title`,e),n=ti(t,``,n,{left:`${G(c)?.left??0}px`,top:`min(${G(c)?.top??0}px, var(--add-page-floor))`}),Y(r,i)},[()=>$(`Add a blank page after the last one`),()=>$(`Add page`)]),pr(`pointerenter`,t,()=>R(s,G(o),!0)),pr(`pointerleave`,t,()=>R(s,null)),K(`click`,t,()=>Q.addPage()),J(e,t)};Nr(f,e=>{G(n)&&Q.hasPhotos&&Q.pageCount<Q.maxPages&&e(p)}),J(e,l),Ve()}mr([`click`]);var Wc=q(`<div class="restoring-stage" role="status"><progress></progress> <h2> </h2> <p> </p></div>`),Gc=q(`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><circle cx="9" cy="10" r="1.5"></circle><path d="m21 16-5-5-9 8"></path></svg> <h2> </h2> <p> </p> <button type="button" id="add-empty"> </button>`,1),Kc=q(`<div id="canvas-box"><canvas id="preview" tabindex="0" role="application" aria-label="Collage preview. Use arrow keys to move between photos, Enter to pick one and Enter on another to swap them, Delete to remove the photo, Escape to cancel. Plus and minus zoom, Shift and arrow keys pan, zero fits the window. With a mouse, drag to pan, scroll to zoom, or choose Swap to click two photos and swap them."></canvas> <!> <section id="empty-state" class="empty" aria-label="Drop photos here"><!></section></div>`);function qc(e,t){Be(t,!0);let n,r,i=L(0),a=L(0),o=L(!1),s=[],c={x:0,y:0},l=1,u=!1,d=-1,f=null,p=!1,m=null,h=!1,g=F(()=>Q.fitPoster({w:G(i),h:G(a)},!0));pn(()=>{Q.viewport={w:G(i),h:G(a)}});function _(e){return e.placements.map((e,t)=>({i:t,page:e.page??0,y:Math.round(e.cell.y*1e3),x:e.cell.x})).sort((e,t)=>e.page-t.page||e.y-t.y||e.x-t.x).map(e=>e.i)}function v(){u||(u=!0,r.dataset.pending=`1`,requestAnimationFrame(()=>{u=!1;try{y()}finally{r.dataset.pending=`0`}}))}function y(){let e={w:n.clientWidth,h:n.clientHeight},t=Q.fitPoster(e),i=Math.min(window.devicePixelRatio||1,2);r.width=Math.max(1,Math.round(e.w*i)),r.height=Math.max(1,Math.round(e.h*i));let a=r.getContext(`2d`);if(!a)return;let o=js(t,Q.view),u=Ms(e,t,Q.view),d=Math.max(1,Math.round(o.w*i)),f=Math.max(1,Math.round(o.h*i)),p=Math.round(u.x*i),m=Math.round(u.y*i);c={x:p,y:m},l=d,r.dataset.poster=[p,m,d,f].map(e=>(e/i).toFixed(1)).join(`,`);let h=Q.selectedPhoto?.crop;r.dataset.crop=h?[h.zoom,h.x,h.y].map(e=>e.toFixed(3)).join(`,`):``;let g=Q.layout;if(!g){s=[],Q.posterBox!==null&&(Q.posterBox=null);return}let v={x:p/i,y:m/i,w:d/i,h:f/i},y=Q.posterBox;y&&y.x===v.x&&y.y===v.y&&y.w===v.w&&y.h===v.h||(Q.posterBox=v),a.save(),a.shadowColor=`rgba(0, 0, 0, 0.35)`,a.shadowBlur=12*i,a.shadowOffsetY=2*i,a.fillStyle=`#ffffff`;for(let e of g.pages??[{x:0,w:1}]){let t=Math.round(e.x*d);a.fillRect(p+t,m,Math.round((e.x+e.w)*d)-t,f)}a.restore(),a.save(),a.translate(p,m);let x=Le(Q.settings);s=_s(a,d,f,{layout:g,thumbs:Q.photos.map(e=>e.thumb),crops:Q.photos.map(e=>e.crop),settings:x});let S=_(g)[Q.focused];if(Q.canvasFocused&&Q.focusRing&&S!==void 0){let e=s[S];e&&bs(a,e,`#ff9d00`)}for(let e of Q.selection){let t=g.placements.findIndex(t=>t.photoIndex===e),n=s[t];n&&bs(a,n,`#1f5fbf`)}if(a.restore(),g.pages&&b(a,g,{x:p,y:m,w:d,h:f},i),x.splitImages>1){let e=getComputedStyle(document.documentElement).getPropertyValue(`--sub`).trim()||`#3b3b37`;(g.pages??[{x:0,w:1}]).forEach((t,n)=>{let r=Math.round(t.x*d);Ts(a,{x:p+r,y:m,w:Math.round((t.x+t.w)*d)-r,h:f},x.splitImages,i,e,n>0?``:Z(`Cut along the dashed lines: the collage is split into %(n)s images for the post.`,{n:x.splitImages}))})}}function b(e,t,n,r){let i=getComputedStyle(document.documentElement).getPropertyValue(`--sub`).trim()||`#3b3b37`,a=t.pages??[];e.save(),e.fillStyle=i,e.font=`${13*r}px system-ui, sans-serif`,e.textAlign=`center`,e.textBaseline=`top`,a.forEach((t,a)=>{let o=n.x+Math.round(t.x*n.w),s=Math.round((t.x+t.w)*n.w)-Math.round(t.x*n.w);(Q.pageCounts[a]??0)===0&&(e.setLineDash([6*r,4*r]),e.strokeStyle=i,e.lineWidth=1.5*r,e.strokeRect(o+.5*r,n.y+.5*r,s-r,n.h-r),e.setLineDash([]),e.fillText(Z(`Drop or move photos here`),o+s/2,n.y+n.h/2,s-16*r))});let o=Q.selected===null?void 0:Q.selectedPhoto?.bookPage,s=o===void 0?void 0:a[o];if(s){let t=n.x+Math.round(s.x*n.w),i=Math.round((s.x+s.w)*n.w)-Math.round(s.x*n.w);e.strokeStyle=`#1f5fbf`,e.lineWidth=3*r,e.strokeRect(t-2*r,n.y-2*r,i+4*r,n.h+4*r)}e.restore()}pn(()=>{Q.layout,Q.photos,Le(Q.settings),Q.view,Q.selection,Q.pageCounts,Q.cropping,Q.focused,Q.canvasFocused,Q.focusRing,Q.narrow,Q.lang,G(i),G(a),v()});function x(e,t){let n=r.getBoundingClientRect(),i=(e-n.left)/n.width*r.width-c.x,a=(t-n.top)/n.height*r.height-c.y;return s.findIndex(e=>i>=e.x&&i<e.x+e.w&&a>=e.y&&a<e.y+e.h)}function S(){f=null,R(o,!1)}function C(e){return Q.layout?.placements[e]?.photoIndex}function w(e){r.focus(),Q.focusRing=!1;let t=(Q.layout?_(Q.layout):[]).indexOf(x(e.clientX,e.clientY));if(t>=0&&(Q.focused=t),Q.cropping){let t=C(x(e.clientX,e.clientY));t===Q.selected?(m={x:e.clientX,y:e.clientY},r.setPointerCapture(e.pointerId),e.preventDefault()):t!==void 0&&(h=!0,Q.selectPhoto(t))}else Q.spaceHeld||Q.mode===`pan`?(f={x:e.clientX,y:e.clientY},r.setPointerCapture(e.pointerId),R(o,!0),e.preventDefault()):d=x(e.clientX,e.clientY)}function T(e){if(m){let t=r.getBoundingClientRect(),n=r.width/t.width/l;Q.panSelectedCrop((e.clientX-m.x)*n,(e.clientY-m.y)*n),m={x:e.clientX,y:e.clientY};return}if(!f)return;let t=e.clientX-f.x,n=e.clientY-f.y;f={x:e.clientX,y:e.clientY},Q.panBy(t,n)}function E(e){if(h){h=!1;return}if(m||Q.cropping){m=null;return}if(f){S();return}let t=x(e.clientX,e.clientY);if(!(t<0)){if(Q.mode===`select`){let n=C(t);n!==void 0&&Q.selectInPhotos(n,e.shiftKey)}else d>=0&&d!==t&&Q.selected===null&&Q.pick(d),Q.pick(t),d=-1}}function ee(e){e.preventDefault();let t=e.deltaMode===1?16:e.deltaMode===2?400:1,n=Math.exp(-e.deltaY*t*(e.ctrlKey?.01:.0015));if(Q.cropping){Q.zoomSelectedCropBy(n);return}let i=r.getBoundingClientRect();Q.zoomAtPoint(n,{x:e.clientX-i.left,y:e.clientY-i.top})}function D(e){return e instanceof HTMLInputElement||e instanceof HTMLSelectElement||e instanceof HTMLTextAreaElement||e instanceof HTMLButtonElement}function O(e){Q.setSpaceHeld(e),e||S()}function te(e){if(e.code!==`Space`)return;let t=p&&e.target instanceof HTMLButtonElement;D(e.target)&&!t||!p&&document.activeElement!==r||(e.preventDefault(),e.repeat||O(!0))}function ne(e){e.code===`Space`&&(Q.spaceHeld&&e.preventDefault(),O(!1))}function re(e){if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`z`){e.preventDefault(),Q.undoRemove();return}if(e.key===`+`||e.key===`=`){e.preventDefault(),Q.cropping?Q.zoomSelectedCropBy(1.25):Q.zoomAtCentre(1.25);return}if(e.key===`-`||e.key===`_`){e.preventDefault(),Q.cropping?Q.zoomSelectedCropBy(.8):Q.zoomAtCentre(.8);return}if(e.key===`0`){e.preventDefault(),Q.fitView();return}if(e.shiftKey&&e.key.startsWith(`Arrow`)){e.preventDefault();let t=e.key===`ArrowLeft`?40:e.key===`ArrowRight`?-40:0,n=e.key===`ArrowUp`?40:e.key===`ArrowDown`?-40:0;Q.panBy(t,n);return}if(Q.cropping&&e.key.startsWith(`Arrow`)){e.preventDefault();let t=.01,n=e.key===`ArrowLeft`?-.01:e.key===`ArrowRight`?t:0,r=e.key===`ArrowUp`?-.01:e.key===`ArrowDown`?t:0;Q.panSelectedCrop(n,r);return}let t=Q.layout;if(!t)return;let n=_(t);if((e.key.startsWith(`Arrow`)||e.key===`Enter`)&&(Q.focusRing=!0),e.key===`Delete`||e.key===`Backspace`){if(Q.selected!==null){e.preventDefault(),Q.removeSelected();return}let r=Q.selected??t.placements[n[Q.focused]??-1]?.photoIndex,i=r===void 0?void 0:Q.photos[r];e.preventDefault(),i&&Q.removePhotos(new Set([i.id]),Z(`Removed %(name)s.`,{name:i.name}));return}if(e.key===`ArrowRight`||e.key===`ArrowDown`)Q.focused=(Q.focused+1)%n.length;else if(e.key===`ArrowLeft`||e.key===`ArrowUp`)Q.focused=(Q.focused-1+n.length)%n.length;else if(e.key===`Enter`){let e=n[Q.focused];e!==void 0&&Q.pick(e)}else if(e.key===`Escape`)Q.deselect();else return;e.preventDefault();let r=t.placements[n[Q.focused]],i=Q.photos[r?.photoIndex??-1]?.name;i&&e.key.startsWith(`Arrow`)&&Q.setStatus(t.pages?Z(`%(name)s, page %(n)s of %(total)s`,{name:i,n:(r?.page??0)+1,total:t.pages.length}):i)}var ie=Kc();pr(`keydown`,Gt,te),pr(`keyup`,Gt,ne),pr(`blur`,Gt,()=>O(!1));let ae;var k=z(ie);xi(k,e=>r=e,()=>r),Wr(k,(e,t)=>oc?.(e,t),()=>ee);var oe=V(k,2);Uc(oe,{});var se=V(oe,2);let ce;var le=z(se),A=e=>{var t=Wc(),n=z(t),r=V(n,2),i=B(r,!0),a=B(V(r,2),!0);N(t),H((e,t,r,o)=>{X(n,`max`,e),pi(n,Q.restoring.total>0?Q.restoring.done:void 0),X(n,`aria-label`,t),Y(i,r),Y(a,o)},[()=>Math.max(1,Q.restoring.total),()=>$(`Bringing back your photos`),()=>Q.restoring.total>0?$(`Bringing back your photos… %(done)s of %(total)s`,{done:Q.restoring.done,total:Q.restoring.total}):$(`Looking for your saved photos…`),()=>$(`You can add more once they are back.`)]),J(e,t)},ue=e=>{var t=Gc(),n=V(en(t),2),r=B(n,!0),i=V(n,2),a=B(i,!0),o=V(i,2),s=B(o,!0);H((e,t,n,i)=>{Y(r,e),Y(a,t),X(o,`title`,n),Y(s,i)},[()=>$(`Drop photos here`),()=>$(`Everything runs in your browser. Your photos are never uploaded.`),()=>$(`Choose photos from this device`),()=>$(`Choose photos…`)]),K(`click`,o,()=>Q.chooseFiles()),J(e,t)};Nr(le,e=>{Q.restoring?e(A):e(ue,-1)}),N(se),N(ie),xi(ie,e=>n=e,()=>n),H(()=>{ae=$r(ie,1,`canvas-box`,null,ae,{"pan-mode":Q.mode===`pan`,"pan-ready":Q.spaceHeld,panning:G(o),cropping:Q.cropping}),X(se,`hidden`,Q.hasPhotos),ce=ti(se,``,ce,{"--empty-w":`${G(g).w}px`,"--empty-h":`${G(g).h}px`})}),pr(`pointerenter`,ie,()=>p=!0),pr(`pointerleave`,ie,()=>p=!1),K(`pointerdown`,k,w),K(`pointermove`,k,T),K(`pointerup`,k,E),pr(`pointercancel`,k,()=>{m=null,S()}),K(`keydown`,k,re),pr(`focus`,k,()=>{Q.canvasFocused=!0,Q.focusRing=r.matches(`:focus-visible`)}),pr(`blur`,k,()=>Q.canvasFocused=!1),yi(ie,`clientWidth`,e=>R(i,e)),yi(ie,`clientHeight`,e=>R(a,e)),J(e,ie),Ve()}mr([`pointerdown`,`pointermove`,`pointerup`,`keydown`,`click`]);var Jc=q(`<div class="status"> </div>`),Yc=q(`<div> </div>`),Xc=q(`<main class="stage" aria-label="Preview"><p id="hint" class="pill hint-pill"> </p> <div class="tools" id="tools"><fieldset class="modes group" id="modes" aria-label="Mode"><button type="button" id="mode-pan" aria-keyshortcuts="Space"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"></path></svg> <span> </span></button> <button type="button" id="mode-swap"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"></path></svg> <span> </span></button> <button type="button" id="mode-select"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3v16l4.2-4 3.3 6.2 2.4-1.3-3.3-6.1H19z"></path></svg> <span> </span></button></fieldset> <fieldset class="zoomers group" aria-label="Zoom"><button type="button" id="zoom-in" class="sq" aria-label="Zoom in"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></button> <button type="button" id="zoom-out" class="sq" aria-label="Zoom out"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path></svg></button> <button type="button" id="reset-view" class="sq" aria-label="Fit to window"> </button> <span id="view-zoom" class="zoom-pct" aria-live="off"> </span></fieldset></div> <!> <button type="button" id="help-open" class="help-btn help-fab" aria-haspopup="dialog" aria-label="Help">?</button> <p id="status-line" class="pill status-pill"> </p> <div id="messages" class="sr-only" role="status" aria-live="polite"><!> <!></div></main>`);function Zc(e,t){Be(t,!0);let n=F(()=>{if(!Q.layout)return $(`No photos yet`);let e=Q.photos.length;return[e===1?$(`1 photo`):$(`%(n)s photos`,{n:e}),Q.layoutStyle===`gallery`?$(`Gallery`):$(`%(n)s columns`,{n:Q.columnsInUse??0}),$(`%(pct)s% trimmed`,{pct:Q.cropPercent})].join(` · `)}),r=F(()=>!Q.hasPhotos);var i=Xc(),a=z(i),o=B(a,!0),s=V(a,2),c=z(s),l=z(c),u=B(V(z(l),2),!0);N(l);var d=V(l,2),f=B(V(z(d),2),!0);N(d);var p=V(d,2),m=B(V(z(p),2),!0);N(p),N(c);var h=V(c,2),g=z(h),_=V(g,2),v=V(_,2),y=B(v,!0),b=V(v,2),x=B(b);N(h),N(s);var S=V(s,2);qc(S,{});var C=V(S,2),w=V(C,2),T=B(w,!0),E=V(w,2),ee=z(E),D=e=>{var t=Jc(),n=B(t,!0);H(()=>Y(n,Q.status)),J(e,t)};Nr(ee,e=>{Q.status&&e(D)}),Rr(V(ee,2),17,()=>Q.messages,Pr,(e,t)=>{var n=Yc(),r=B(n,!0);H(()=>{$r(n,1,qr(G(t).kind)),Y(r,G(t).text)}),J(e,n)}),N(E),N(i),H((e,t,i,a,s,c,h,S,w,E,ee,D)=>{Y(o,Q.status),X(l,`title`,e),X(l,`aria-pressed`,Q.activeMode===`pan`),l.disabled=G(r),Y(u,t),X(d,`title`,i),X(d,`aria-pressed`,Q.activeMode===`swap`),d.disabled=G(r),Y(f,a),X(p,`title`,s),X(p,`aria-pressed`,Q.activeMode===`select`),p.disabled=G(r),Y(m,c),X(g,`title`,h),g.disabled=G(r),X(_,`title`,S),_.disabled=G(r),X(v,`title`,w),v.disabled=Q.isFit||G(r),Y(y,E),X(b,`title`,ee),Y(x,`${Q.zoomPercent??``}%`),X(C,`title`,D),Y(T,G(n))},[()=>$(`Pan: drag to move around (hold Space from any tool)`),()=>$(`Pan`),()=>$(`Swap: click two photos to trade places`),()=>$(`Swap`),()=>$(`Select: click a photo to change its size, crop or remove it`),()=>$(`Select`),()=>$(`Zoom in`),()=>$(`Zoom out`),()=>$(`Fit the whole collage in the window`),()=>$(`Fit`),()=>$(`Zoom`),()=>$(`Help`)]),K(`click`,l,()=>Q.setMode(`pan`)),K(`click`,d,()=>Q.setMode(`swap`)),K(`click`,p,()=>Q.setMode(`select`)),K(`click`,g,()=>Q.zoomAtCentre(1.25)),K(`click`,_,()=>Q.zoomAtCentre(.8)),K(`click`,v,()=>Q.fitView()),K(`click`,C,()=>Q.dialog=`help`),J(e,i),Ve()}mr([`click`]);var Qc=q(`<i></i>`),$c=q(`<div class="backdrop" id="backdrop" aria-hidden="true"></div> <div class="app" id="app"><input id="file-input" type="file" accept="image/*,.heic,.heif,.zip,application/zip" multiple="" hidden=""/> <!> <!></div> <!>`,1);function el(e,t){Be(t,!0);let n=F(()=>nc(Q.photoColours)),r;Ti(()=>{let e=window.matchMedia(`(max-width: 760px)`);Q.narrow=e.matches;let t=()=>{Q.narrow=e.matches,Q.setTab(Q.tab,!1)};return e.addEventListener(`change`,t),Q.fileInput=r,Q.setTab(`photos`,!1),Q.start(),document.documentElement.dataset.appReady=`true`,()=>e.removeEventListener(`change`,t)}),pn(()=>{if(!Q.persistReady)return;Q.photos,Q.seed,Q.columns,Q.pageCount,Q.layoutStyle,Le(Q.settings);let e=document.documentElement,t=!0;e.dataset.saving=`true`;let n=setTimeout(()=>{Q.persist().finally(()=>{t&&(e.dataset.saving=`false`)})},250);return()=>{t=!1,clearTimeout(n)}});function i(){let e=Array.from(r.files??[]);r.value=``,Q.addFiles(e)}var a=$c();pr(`popstate`,Gt,()=>Q.onPopState()),pr(`dragover`,Gt,e=>{e.preventDefault(),document.body.classList.add(`dragging`)}),pr(`dragleave`,Gt,e=>{e.relatedTarget||document.body.classList.remove(`dragging`)}),pr(`drop`,Gt,e=>{e.preventDefault(),document.body.classList.remove(`dragging`),Q.addFiles(Array.from(e.dataTransfer?.files??[]))});var o=en(a);Rr(o,21,()=>G(n),Pr,(e,t)=>{var n=Qc();let r;H(()=>r=ti(n,``,r,{"--c":G(t)})),J(e,n)}),N(o);var s=V(o,2),c=z(s);xi(c,e=>r=e,()=>r);var l=V(c,2);Rc(l,{}),Zc(V(l,2),{}),N(s),ic(V(s,2),{}),H((e,t)=>{X(s,`data-tab`,Q.tab),X(s,`data-open`,e),X(s,`data-empty`,t),X(s,`data-menu`,Q.menuOpen?`open`:`closed`)},[()=>String(Q.sheetOpen),()=>String(!Q.hasPhotos)]),K(`change`,c,i),J(e,a),Ve()}mr([`change`]);var tl=document.getElementById(`root`);if(!tl)throw Error(`missing #root`);Or(el,{target:tl});
//# sourceMappingURL=index-Bis6a6pI.js.map