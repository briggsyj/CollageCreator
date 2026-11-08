(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=Array.isArray,t=Array.prototype.indexOf,n=Array.prototype.includes,r=Array.from,i=Object.defineProperty,a=Object.getOwnPropertyDescriptor,o=Object.getOwnPropertyDescriptors,s=Object.prototype,c=Array.prototype,l=Object.getPrototypeOf,u=Object.isExtensible,d=()=>{};function f(e){for(var t=0;t<e.length;t++)e[t]()}function p(){var e,t;return{promise:new Promise((n,r)=>{e=n,t=r}),resolve:e,reject:t}}var m=1024,h=2048,g=4096,_=8192,v=16384,y=32768,b=1<<25,x=65536,S=1<<19,C=1<<20,w=1<<25,ee=1<<21,te=1<<22,ne=1<<23,T=Symbol(`$state`),E=Symbol(`component`),re=Symbol(`legacy props`),ie=Symbol(``),ae=Symbol(`attributes`),oe=Symbol(`class`),se=Symbol(`style`),ce=Symbol(`text`),le=Symbol(`form reset`),ue=new class extends Error{name=`StaleReactionError`;message="The reaction that called `getAbortSignal()` was re-run or destroyed"},de=!!globalThis.document?.contentType&&globalThis.document.contentType.includes(`xml`),fe={},D=Symbol(`uninitialized`),pe=`http://www.w3.org/1999/xhtml`;function me(){console.warn(`https://svelte.dev/e/derived_inert`)}function he(e){console.warn(`https://svelte.dev/e/hydration_mismatch`)}function O(){console.warn(`https://svelte.dev/e/select_multiple_invalid_value`)}function ge(){console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`)}var k=!1;function _e(e){k=e}var A;function ve(e){if(e===null)throw he(),fe;return A=e}function ye(){return ve(nn(A))}function j(e){if(k){if(nn(A)!==null)throw he(),fe;A=e}}function be(e=1){if(k){for(var t=e,n=A;t--;)n=nn(n);A=n}}function xe(e=!0){for(var t=0,n=A;;){if(n.nodeType===8){var r=n.data;if(r===`]`){if(t===0)return n;--t}else(r===`[`||r===`[!`||r[0]===`[`&&!isNaN(Number(r.slice(1))))&&(t+=1)}var i=nn(n);e&&n.remove(),n=i}}function Se(e){if(!e||e.nodeType!==8)throw he(),fe;return e.data}function Ce(e){return e===this.v}function we(e,t){return e==e?e!==t||typeof e==`object`&&!!e||typeof e==`function`:t==t}function Te(e){return!we(e,this.v)}function Ee(e){throw Error(`https://svelte.dev/e/lifecycle_outside_component`)}function De(){throw Error(`https://svelte.dev/e/async_derived_orphan`)}function Oe(e,t,n){throw Error(`https://svelte.dev/e/each_key_duplicate`)}function ke(e){throw Error(`https://svelte.dev/e/effect_in_teardown`)}function Ae(){throw Error(`https://svelte.dev/e/effect_in_unowned_derived`)}function je(e){throw Error(`https://svelte.dev/e/effect_orphan`)}function Me(){throw Error(`https://svelte.dev/e/effect_update_depth_exceeded`)}function Ne(e){throw Error(`https://svelte.dev/e/props_invalid_value`)}function Pe(){throw Error(`https://svelte.dev/e/state_descriptors_fixed`)}function Fe(){throw Error(`https://svelte.dev/e/state_prototype_fixed`)}function Ie(){throw Error(`https://svelte.dev/e/state_unsafe_mutation`)}function Le(){throw Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`)}var Re=[];function ze(e,t=!1,n=!1){return Be(e,new Map,``,Re,null,n)}function Be(t,n,r,i,a=null,o=!1){if(typeof t==`object`&&t){var c=n.get(t);if(c!==void 0)return c;if(t instanceof Map)return new Map(t);if(t instanceof Set)return new Set(t);if(e(t)){var u=Array(t.length);n.set(t,u),a!==null&&n.set(a,u);for(var d=0;d<t.length;d+=1){var f=t[d];d in t&&(u[d]=Be(f,n,r,i,null,o))}return u}if(l(t)===s){u={},n.set(t,u),a!==null&&n.set(a,u);for(var p of Object.keys(t))u[p]=Be(t[p],n,r,i,null,o);return u}if(t instanceof Date)return t.getTime(),structuredClone(t);if(typeof t.toJSON==`function`&&!o)return Be(t.toJSON(),n,r,i,t)}if(t instanceof EventTarget)return t;try{return structuredClone(t)}catch{return t}}var Ve=null;function He(e){Ve=e}function Ue(e,t=!1,n){Ve={p:Ve,i:!1,c:null,e:null,s:e,x:null,r:V,l:null}}function We(e){var t=Ve,n=t.e;if(n!==null){t.e=null;for(var r of n)_n(r)}return e!==void 0&&(t.x=e),t.i=!0,Ve=t.p,Ge(e)}function Ge(e={}){return i(e,E,{value:!0}),e}function Ke(){return!0}var qe=[];function Je(){var e=qe;qe=[],f(e)}function Ye(e){if(qe.length===0&&!bt){var t=qe;queueMicrotask(()=>{t===qe&&Je()})}qe.push(e)}var Xe=~(h|g|m);function Ze(e,t){e.f=e.f&Xe|t}function Qe(e){e.f&512||e.deps===null?Ze(e,m):Ze(e,g)}function $e(e,t,n){e.f&2048?t.add(e):e.f&4096&&n.add(e),Ze(e,m)}var et=!1;function tt(){et||(et=!0,document.addEventListener(`reset`,e=>{Promise.resolve().then(()=>{if(!e.defaultPrevented)for(let t of e.target.elements)t[le]?.()})},{capture:!0}))}function nt(e){var t=B,n=V;Bn(null),Vn(null);try{return e()}finally{Bn(t),Vn(n)}}function rt(e,t,n,r){let i=Ke()?st:ut;var a=e.filter(e=>!e.settled),o=t.map(i);if(n.length===0&&a.length===0){r(o);return}var s=V,c=it(),l=a.length===1?a[0].promise:a.length>1?Promise.all(a.map(e=>e.promise)):null;function u(e){if(!(s.f&16384)){c();try{r([...o,...e])}catch(e){un(e,s)}at()}}var d=ot();if(n.length===0){l.then(()=>u([])).finally(d);return}function f(){Promise.all(n.map(e=>lt(e))).then(u).catch(e=>un(e,s)).finally(d)}l?l.then(()=>{s.f&16384?d():(c(),f(),at())}):f()}function it(){var e=V,t=B,n=Ve,r=N;return function(i=!0){Vn(e),Bn(t),He(n),i&&!(e.f&16384)&&(r?.activate(),r?.apply())}}function at(e=!0){Vn(null),Bn(null),He(null),e&&N?.deactivate()}function ot(){var e=V,t=e.b,n=N,r=!!t?.is_rendered();return t?.update_pending_count(1,n),n.increment(r,e),()=>{t?.update_pending_count(-1,n),n.decrement(r,e)}}function st(e){var t=2|h;return V!==null&&(V.f|=S),{ctx:Ve,deps:null,effects:null,equals:Ce,f:t,fn:e,reactions:null,rv:0,v:D,wv:0,parent:V,ac:null}}var ct=Symbol(`obsolete`);function lt(e,t,n){let r=V;r===null&&De();var i=void 0,a=It(D),o=!B,s=new Set;return xn(()=>{var t=V,n=p();i=n.promise;try{Promise.resolve(e()).then(n.resolve,e=>{e!==ue&&n.reject(e)}).finally(at)}catch(e){n.reject(e),at()}var c=N;if(o){if(t.f&32768)var l=ot();if(r.b?.is_rendered())c.async_deriveds.get(t)?.reject(ct);else for(let e of s.values())e.reject(ct);s.add(n),c.async_deriveds.set(t,n)}let u=(e,t=void 0)=>{l?.(),s.delete(n),t!==ct&&(c.activate(),t?(a.f|=ne,Bt(a,t)):(a.f&8388608&&(a.f^=ne),Bt(a,e)),c.deactivate())};n.promise.then(u,e=>u(null,e||`unknown`))}),hn(()=>{for(let e of s)e.reject(ct)}),new Promise(e=>{function t(n){function r(){n===i?e(a):t(i)}n.then(r,r)}t(i)})}function M(e){let t=st(e);return Un(t),t}function ut(e){let t=st(e);return t.equals=Te,t}function dt(e){var t=e.effects;if(t!==null){e.effects=null;for(var n=0;n<t.length;n+=1)On(t[n])}}function ft(e){var t,n=V,r=e.parent;if(!Ln&&r!==null&&e.v!==D&&r.f&24576)return me(),e.v;Vn(r);try{dt(e),t=tr(e)}finally{Vn(n)}return t}function pt(e){var t=ft(e);!e.equals(t)&&(e.wv=Qn(),(!N?.is_fork||e.deps===null)&&(N===null?e.v=t:(N.capture(e,t,!0),_t?.capture(e,t,!0)),e.deps===null))?Ze(e,m):Ln||(vt===null?Qe(e):(mn()||N?.is_fork)&&vt.set(e,t))}function mt(e){if(e.effects!==null)for(let t of e.effects)(t.teardown||t.ac)&&(t.teardown?.(),t.ac!==null&&nt(()=>{t.ac.abort(ue),t.ac=null}),t.fn!==null&&(t.teardown=d),ir(t,0),En(t))}function ht(e){if(e.effects!==null)for(let t of e.effects)t.teardown&&t.fn!==null&&ar(t)}var gt=null,N=null,_t=null,vt=null,yt=null,bt=!1,xt=!1,St=null,Ct=null,wt=0,Tt=1,Et=class e{id=Tt++;#e=!1;linked=!0;#t=null;#n=null;async_deriveds=new Map;current=new Map;previous=new Map;#r=new Set;#i=new Set;#a=0;#o=new Map;#s=null;#c=[];#l=[];#u=new Set;#d=new Set;#f=new Map;#p=new Set;is_fork=!1;#m=!1;constructor(){gt===null?gt=this:(gt.#n=this,this.#t=gt),gt=this}#h(){if(this.is_fork)return!0;for(let n of this.#o.keys()){for(var e=n,t=!1;e.parent!==null;){if(this.#f.has(e)){t=!0;break}e=e.parent}if(!t)return!0}return!1}skip_effect(e){this.#f.has(e)||this.#f.set(e,{d:[],m:[]}),this.#p.delete(e)}unskip_effect(e,t=e=>this.schedule(e)){var n=this.#f.get(e);if(n){this.#f.delete(e);for(var r of n.d)Ze(r,h),t(r);for(r of n.m)Ze(r,g),t(r)}this.#p.add(e)}#g(){var e=[];for(let i of this.#c)if(!(i.f&16384||!(i.f&6144))){for(var t=i,n=!1;t.parent!==null;){t=t.parent;var r=t.f;if(r&96){if(!(r&1024)){n=!0;break}t.f^=m}}n||e.push(t)}return this.#c=[],e}#_(){this.#e=!0;for(let e of this.#u)this.#d.delete(e),Ze(e,h),this.schedule(e);for(let e of this.#d)Ze(e,g),this.schedule(e);this.apply();for(var t=St=[],n=[],r=Ct=[];this.#c.length>0;){wt++>1e3&&(this.#S(),Dt());for(let e of this.#g())try{this.#v(e,t,n)}catch(t){throw Mt(e),this.#h()||this.discard(),t}}if(N=null,r.length>0){var i=e.ensure();for(let e of r)i.schedule(e)}if(St=null,Ct=null,this.#h()){this.#x(n),this.#x(t);for(let[e,t]of this.#f)jt(e,t);r.length>0&&N.#_();return}let a=this.#y();if(a)this.#x(n),this.#x(t),a.#b(this);else{this.#u.clear(),this.#d.clear();for(let e of this.#r)e(this);this.#r.clear(),_t=this,kt(n),kt(t),_t=null,this.#s?.resolve();var o=N;if(this.#a===0&&(this.#c.length===0||o!==null)&&this.#S(),this.#c.length>0){if(o!==null){for(let e of this.#c)o.#c.push(e);this.#c=[]}else o=this}o!==null&&(Pt.clear(),o.#_())}}#v(e,t,n){e.f^=m;for(var r=e.first;r!==null;){var i=r.f,a=!!(i&96);if(!(a&&i&1024||i&8192||this.#f.has(r))&&r.fn!==null){a?r.f^=m:i&4?t.push(r):$n(r)&&(i&16&&this.#d.add(r),ar(r));var o=r.first;if(o!==null){r=o;continue}}for(;r!==null;){var s=r.next;if(s!==null){r=s;break}r=r.parent}}}#y(){for(var e=this.#t;e!==null;){if(!e.is_fork){for(let[t,[,n]]of this.current)if(e.current.has(t)&&!n)return e}e=e.#t}return null}#b(e){for(let[t,n]of e.current)!this.previous.has(t)&&e.previous.has(t)&&this.previous.set(t,e.previous.get(t)),this.current.set(t,n);for(let[t,n]of e.async_deriveds){let e=this.async_deriveds.get(t);e&&n.promise.then(e.resolve).catch(e.reject)}e.async_deriveds.clear(),this.transfer_effects(e.#u,e.#d);let t=e=>{var n=e.reactions;if(n!==null&&!(e.f&2&&!(e.f&6144)))for(let e of n){var r=e.f;if(r&2)t(e);else{var i=e;r&4194320&&!this.async_deriveds.has(i)&&(this.#d.delete(i),Ze(i,h),this.schedule(i))}}};for(let e of this.current.keys())t(e);this.oncommit(()=>e.discard()),e.#S(),N=this,this.#_()}#x(e){for(var t=0;t<e.length;t+=1)$e(e[t],this.#u,this.#d)}capture(e,t,n=!1){e.v!==D&&!this.previous.has(e)&&this.previous.set(e,e.v),e.f&8388608||(this.current.set(e,[t,n]),vt?.set(e,t)),this.is_fork||(e.v=t)}activate(){N=this}deactivate(){N=null,vt=null}flush(){try{xt=!0,N=this,this.#_()}finally{wt=0,yt=null,St=null,Ct=null,xt=!1,N=null,vt=null,Pt.clear()}}discard(){for(let e of this.#i)e(this);this.#i.clear();for(let e of this.async_deriveds.values())e.reject(ct);this.#S(),this.#s?.resolve()}register_created_effect(e){this.#l.push(e)}increment(e,t){if(this.#a+=1,e){let e=this.#o.get(t)??0;this.#o.set(t,e+1)}}decrement(e,t){if(--this.#a,e){let e=this.#o.get(t)??0;e===1?this.#o.delete(t):this.#o.set(t,e-1)}this.#m||(this.#m=!0,Ye(()=>{this.#m=!1,this.linked&&this.flush()}))}transfer_effects(e,t){for(let t of e)this.#u.add(t);for(let e of t)this.#d.add(e);e.clear(),t.clear()}oncommit(e){this.#r.add(e)}ondiscard(e){this.#i.add(e)}settled(){return(this.#s??=p()).promise}static ensure(){if(N===null){let t=N=new e;!xt&&Ye(()=>{t.#e||t.flush()})}return N}apply(){vt=null}schedule(e){yt=e,e.b?.is_pending&&e.f&16777228&&!(e.f&32768)?e.b.defer_effect(e):this.#c.push(e)}#S(){if(this.linked){var e=this.#t,t=this.#n;e===null||(e.#n=t),t===null?gt=e:t.#t=e,this.linked=!1}}};function Dt(){try{Me()}catch(e){un(e,yt)}}var Ot=null;function kt(e){var t=e.length;if(t!==0){for(var n=0;n<t;){var r=e[n++];if(!(r.f&24576)&&$n(r)&&(Ot=new Set,ar(r),r.deps===null&&r.first===null&&r.nodes===null&&r.teardown===null&&r.ac===null&&An(r),Ot?.size>0)){Pt.clear();for(let e of Ot){if(e.f&24576)continue;let t=[e],n=e.parent;for(;n!==null;)Ot.has(n)&&(Ot.delete(n),t.push(n)),n=n.parent;for(let e=t.length-1;e>=0;e--){let n=t[e];n.f&24576||ar(n)}}Ot.clear()}}Ot=null}}function At(e){N.schedule(e)}function jt(e,t){if(!(e.f&32&&e.f&1024)){e.f&2048?t.d.push(e):e.f&4096&&t.m.push(e),Ze(e,m);for(var n=e.first;n!==null;)jt(n,t),n=n.next}}function Mt(e){Ze(e,m);for(var t=e.first;t!==null;)Mt(t),t=t.next}var Nt=new Set,Pt=new Map,Ft=!1;function It(e,t){return{f:0,v:e,reactions:null,equals:Ce,rv:0,wv:0}}function P(e,t){let n=It(e,t);return Un(n),n}function Lt(e,t=!1,n=!0){let r=It(e);return t||(r.equals=Te),r}function F(e,t,n=!1){return B!==null&&(!zn||B.f&131072)&&Ke()&&B.f&4325394&&(Hn===null||!Hn.has(e))&&Ie(),Bt(e,n?Gt(t):t,Ct)}var Rt=null,zt=0;function Bt(e,t,n=null){if(!e.equals(t)){Ln?Pt.set(e,t):Pt.has(e)||Pt.set(e,e.v);var r=Et.ensure();if(r.capture(e,t),e.f&2){let t=e;e.f&2048&&ft(t),vt===null&&Qe(t)}e.wv=Qn(),Rt=null,zt=0,Wt(e,h,n),Rt=null,Ke()&&V!==null&&V.f&1024&&!(V.f&96)&&(Kn===null?qn([e]):Kn.push(e)),!r.is_fork&&Nt.size>0&&!Ft&&Vt()}return t}function Vt(){Ft=!1;for(let e of Nt){e.f&1024&&Ze(e,g);let t;try{t=$n(e)}catch{t=!0}t&&ar(e)}Nt.clear()}function Ht(e,t=1){var n=H(e),r=t===1?n++:n--;return F(e,n),r}function Ut(e){F(e,e.v+1)}function Wt(e,t,n){var r=e.reactions;if(r!==null){var i=Ke(),a=r.length;if(zt+=a,zt>1e5&&Rt===null&&(Rt=new Set),Rt!==null){if(Rt.has(e))return;Rt.add(e)}for(var o=0;o<a;o++){var s=r[o],c=s.f;if(i||s!==V){var l=(c&h)===0;if(l&&Ze(s,t),c&131072)Nt.add(s);else if(c&2){var u=s;vt?.delete(u),Wt(u,g,n)}else if(l){var d=s;c&16&&Ot!==null&&Ot.add(d),n===null?At(d):n.push(d)}}}}}function Gt(t){if(typeof t!=`object`||!t||T in t||E in t)return t;let n=l(t);if(n!==s&&n!==c)return t;var r=new Map,i=e(t),o=P(0),u=null,d=Xn,f=e=>{if(Xn===d)return e();var t=B,n=Xn;Bn(null),Zn(d);var r=e();return Bn(t),Zn(n),r};return i&&r.set(`length`,P(t.length,u)),new Proxy(t,{defineProperty(e,t,n){`value`in n&&n.configurable!==!1&&n.enumerable!==!1&&n.writable!==!1||Pe();var i=r.get(t);return i===void 0?f(()=>{var e=P(n.value,u);return r.set(t,e),e}):F(i,n.value,!0),!0},deleteProperty(e,t){var n=r.get(t);if(n===void 0){if(t in e){let e=f(()=>P(D,u));r.set(t,e),Ut(o)}}else F(n,D),Ut(o);return!0},get(e,n,i){if(n===T)return t;var o=r.get(n),s=n in e;if(o===void 0&&(!s||a(e,n)?.writable)&&(o=f(()=>P(Gt(s?e[n]:D),u)),r.set(n,o)),o!==void 0){var c=H(o);return c===D?void 0:c}return Reflect.get(e,n,i)},getOwnPropertyDescriptor(e,t){this.has?.(e,t);var n=Reflect.getOwnPropertyDescriptor(e,t),i=r.get(t);if(i!==void 0){var a=H(i);if(a===D)return;if(n&&`value`in n)n.value=a;else return{enumerable:!0,configurable:!0,value:a,writable:!0}}return n},has(e,t){if(t===T)return!0;var n=r.get(t),i=n!==void 0&&n.v!==D||Reflect.has(e,t);return(n!==void 0||V!==null&&(!i||a(e,t)?.writable))&&(n===void 0&&(n=f(()=>P(i?Gt(e[t]):D,u)),r.set(t,n)),H(n)===D)?!1:i},set(e,t,n,s){var c=r.get(t),l=t in e;if(i&&t===`length`)for(var d=n;d<c.v;d+=1){var p=r.get(d+``);p===void 0?d in e&&(p=f(()=>P(D,u)),r.set(d+``,p)):F(p,D)}if(c===void 0)(!l||a(e,t)?.writable)&&(c=f(()=>P(void 0,u)),F(c,Gt(n)),r.set(t,c));else{l=c.v!==D;var m=f(()=>Gt(n));F(c,m)}var h=Reflect.getOwnPropertyDescriptor(e,t);if(h?.set&&h.set.call(s,n),!l){if(i&&typeof t==`string`){var g=r.get(`length`),_=Number(t);Number.isInteger(_)&&_>=g.v&&F(g,_+1)}Ut(o)}return!0},ownKeys(e){H(o);var t=Reflect.ownKeys(e).filter(e=>{var t=r.get(e);return t===void 0||t.v!==D});for(var[n,i]of r)i.v!==D&&!(n in e)&&t.push(n);return t},setPrototypeOf(){Fe()}})}function Kt(e){try{if(typeof e==`object`&&e&&T in e)return e[T]}catch{}return e}function qt(e,t){return Object.is(Kt(e),Kt(t))}var Jt,Yt,Xt,Zt,Qt;function $t(){if(Jt===void 0){Jt=window,Yt=document,Xt=/Firefox/.test(navigator.userAgent);var e=Element.prototype,t=Node.prototype,n=Text.prototype;Zt=a(t,`firstChild`).get,Qt=a(t,`nextSibling`).get,u(e)&&(e[oe]=void 0,e[ae]=null,e[se]=void 0,e.__e=void 0),u(n)&&(n[ce]=void 0)}}function en(e=``){return document.createTextNode(e)}function tn(e){return Zt.call(e)}function nn(e){return Qt.call(e)}function I(e,t){if(!k)return tn(e);var n=tn(A);if(n===null)n=A.appendChild(en());else if(t&&n.nodeType!==3){var r=en();return n?.before(r),ve(r),r}return t&&cn(n),ve(n),n}function rn(e,t=!1){if(!k){var n=tn(e);return n instanceof Comment&&n.data===``?nn(n):n}if(t){if(A?.nodeType!==3){var r=en();return A?.before(r),ve(r),r}cn(A)}return A}function L(e,t=!1){if(!k)return tn(e);var n=I(e,t);return j(e),n}function R(e,t=1,n=!1){let r=k?A:e;for(var i;t--;)i=r,r=nn(r);if(!k)return r;if(n){if(r?.nodeType!==3){var a=en();return r===null?i?.after(a):r.before(a),ve(a),a}cn(r)}return ve(r),r}function an(e){e.textContent=``}function on(){return!1}function sn(e,t,n){return t==null||t===`http://www.w3.org/1999/xhtml`?n?document.createElement(e,{is:n}):document.createElement(e):n?document.createElementNS(t,e,{is:n}):document.createElementNS(t,e)}function cn(e){if(e.nodeValue.length<65536)return;let t=e.nextSibling;for(;t!==null&&t.nodeType===3;)t.remove(),e.nodeValue+=t.nodeValue,t=e.nextSibling}function ln(e){var t=V;if(t===null)return B.f|=ne,e;if(!(t.f&32768)&&!(t.f&4))throw e;un(e,t)}function un(e,t){if(e===fe)throw e;if(!(t!==null&&t.f&16384)){for(;t!==null;){if(t.f&128&&!(t.f&33570816)){if(!(t.f&32768))throw e;try{t.b.error(e);return}catch(t){e=t}}t=t.parent}throw e}}function dn(e){V===null&&(B===null&&je(e),Ae()),Ln&&ke(e)}function fn(e,t){var n=t.last;n===null?t.last=t.first=e:(n.next=e,e.prev=n,t.last=e)}function pn(e,t){var n=V;n!==null&&n.f&8192&&(e|=_);var r={ctx:Ve,deps:null,nodes:null,f:e|h|512,first:null,fn:t,last:null,next:null,parent:n,b:n&&n.b,prev:null,teardown:null,wv:0,ac:null};N?.register_created_effect(r);var i=r;if(e&4)St===null?Et.ensure().schedule(r):St.push(r);else if(t!==null){try{ar(r)}catch(e){throw On(r),e}i.deps===null&&i.teardown===null&&i.nodes===null&&i.first===i.last&&!(i.f&524288)&&(i=i.first,e&16&&e&65536&&i!==null&&(i.f|=x))}if(i!==null&&(i.parent=n,n!==null&&fn(i,n),B!==null&&B.f&2&&!(e&64))){var a=B;(a.effects??=[]).push(i)}return r}function mn(){return B!==null&&!zn}function hn(e){let t=pn(8,null);return Ze(t,m),t.teardown=e,t}function gn(e){dn(`$effect`);var t=V.f;if(!B&&t&32&&Ve!==null&&!Ve.i){var n=Ve;(n.e??=[]).push(e)}else return _n(e)}function _n(e){return pn(4|C,e)}function vn(e){Et.ensure();let t=pn(64|S,e);return()=>{On(t)}}function yn(e){Et.ensure();let t=pn(64|S,e);return(e={})=>new Promise(n=>{e.outro?jn(t,()=>{On(t),n(void 0)}):(On(t),n(void 0))})}function bn(e){return pn(4,e)}function xn(e){return pn(te|S,e)}function Sn(e,t=0){return pn(8|t,e)}function z(e,t=[],n=[],r=[]){rt(r,t,n,t=>{pn(8,()=>{e(...t.map(H))})})}function Cn(e,t=0){return pn(16|t,e)}function wn(e){return pn(32|S,e)}function Tn(e){var t=e.teardown;if(t!==null){let n=Ln,r=B;Rn(!0),Bn(null);try{t.call(null)}catch(t){un(t,e.parent)}finally{Rn(n),Bn(r)}}}function En(e,t=!1){var n=e.first;for(e.first=e.last=null;n!==null;){let e=n.ac;e!==null&&nt(()=>{e.abort(ue)});var r=n.next;n.f&64?n.parent=null:On(n,t),n=r}}function Dn(e){for(var t=e.first;t!==null;){var n=t.next;t.f&32||On(t),t=n}}function On(e,t=!0){var n=!1;(t||e.f&262144)&&e.nodes!==null&&e.nodes.end!==null&&(kn(e.nodes.start,e.nodes.end),n=!0),e.f|=b,En(e,t&&!n),ir(e,0);var r=e.nodes&&e.nodes.t;if(r!==null)for(let e of r)e.stop();Tn(e),e.f^=b,e.f|=v;var i=e.parent;i!==null&&i.first!==null&&An(e),e.next=e.prev=e.teardown=e.ctx=e.deps=e.fn=e.nodes=e.ac=e.b=null}function kn(e,t){for(;e!==null;){var n=e===t?null:nn(e);e.remove(),e=n}}function An(e){var t=e.parent,n=e.prev,r=e.next;n!==null&&(n.next=r),r!==null&&(r.prev=n),t!==null&&(t.first===e&&(t.first=r),t.last===e&&(t.last=n))}function jn(e,t,n=!0){var r=[];e.f|=256,Mn(e,r,!0);var i=()=>{n&&On(e),t&&t()},a=r.length;if(a>0){var o=()=>--a||i();for(var s of r)s.out(o)}else i()}function Mn(e,t,n){if(!(e.f&8192)){e.f^=_;var r=e.nodes&&e.nodes.t;if(r!==null)for(let e of r)(e.is_global||n)&&t.push(e);for(var i=e.first;i!==null;){var a=i.next;if(!(i.f&64)){var o=!!(i.f&65536)||!!(i.f&32)&&!!(e.f&16);Mn(i,t,o?n:!1)}i=a}}}function Nn(e){e.f&=-257,Pn(e,!0)}function Pn(e,t){if(!(e.f&256)&&e.f&8192){e.f^=_,e.f&1024||(Ze(e,h),Et.ensure().schedule(e));for(var n=e.first;n!==null;){var r=n.next,i=!!(n.f&65536)||!!(n.f&32);Pn(n,i?t:!1),n=r}var a=e.nodes&&e.nodes.t;if(a!==null)for(let e of a)(e.is_global||t)&&e.in()}}function Fn(e,t){if(e.nodes)for(var n=e.nodes.start,r=e.nodes.end;n!==null;){var i=n===r?null:nn(n);t.append(n),n=i}}var In=null,Ln=!1;function Rn(e){Ln=e}var B=null,zn=!1;function Bn(e){B=e}var V=null;function Vn(e){V=e}var Hn=null;function Un(e){B!==null&&(B.f&2097152||B.f&2)&&(Hn??=new Set).add(e)}var Wn=null,Gn=0,Kn=null;function qn(e){Kn=e}var Jn=1,Yn=0,Xn=Yn;function Zn(e){Xn=e}function Qn(){return++Jn}function $n(e){var t=e.f;if(t&2048)return!0;if(t&4096){for(var n=e.deps,r=n.length,i=0;i<r;i++){var a=n[i];if($n(a)&&pt(a),a.wv>e.wv)return!0}t&512&&vt===null&&Ze(e,m)}return!1}function er(e,t,n=!0){var r=e.reactions;if(r!==null&&!(Hn!==null&&Hn.has(e)))for(var i=0;i<r.length;i++){var a=r[i];a.f&2?er(a,t,!1):t===a&&(n?Ze(a,h):a.f&1024&&Ze(a,g),At(a))}}function tr(e){var t=Wn,n=Gn,r=Kn,i=B,a=Hn,o=Ve,s=zn,c=Xn,l=e.f;Wn=null,Gn=0,Kn=null,B=l&96?null:e,Hn=null,He(e.ctx),zn=!1,Xn=++Yn,e.ac!==null&&(nt(()=>{e.ac.abort(ue)}),e.ac=null);try{e.f|=ee;var u=e.fn,d=u();e.f|=y;var f=nr(e);if(Ke()&&Kn!==null&&!zn&&f!==null&&!(e.f&6146))for(var p=0;p<Kn.length;p++)er(Kn[p],e);if(i!==null&&i!==e){if(Yn++,i.deps!==null)for(let e=0;e<n;e+=1)i.deps[e].rv=Yn;if(t!==null)for(let e of t)e.rv=Yn;Kn!==null&&(r===null?r=Kn:r.push(...Kn))}return e.f&8388608&&(e.f^=ne),d}catch(t){return nr(e),ln(t)}finally{e.f^=ee,Wn=t,Gn=n,Kn=r,B=i,Hn=a,He(o),zn=s,Xn=c}}function nr(e){var t=e.deps,n=N?.is_fork;if(Wn!==null){var r;if(n||ir(e,Gn),t!==null&&Gn>0)for(t.length=Gn+Wn.length,r=0;r<Wn.length;r++)t[Gn+r]=Wn[r];else e.deps=t=Wn;if(mn()&&e.f&512)for(r=Gn;r<t.length;r++)(t[r].reactions??=[]).push(e)}else!n&&t!==null&&Gn<t.length&&(ir(e,Gn),t.length=Gn);return t}function rr(e,r){let i=r.reactions;if(i!==null){var a=t.call(i,e);if(a!==-1){var o=i.length-1;o===0?i=r.reactions=null:(i[a]=i[o],i.pop())}}if(i===null&&r.f&2&&(Wn===null||!n.call(Wn,r))){var s=r;s.f&512&&(s.f^=512),s.v!==D&&Qe(s),s.ac!==null&&nt(()=>{s.ac.abort(ue),s.ac=null,Ze(s,h)}),mt(s),ir(s,0)}}function ir(e,t){var n=e.deps;if(n!==null)for(var r=t;r<n.length;r++)rr(e,n[r])}function ar(e){var t=e.f;if(!(t&16384)){Ze(e,m);var n=V;V=e;try{t&16777232?Dn(e):En(e),Tn(e);var r=tr(e);e.teardown=typeof r==`function`?r:null,e.wv=Jn}finally{V=n}}}function H(e){var t=!!(e.f&2);if(In?.add(e),B!==null&&!zn&&!(V!==null&&V.f&16384)&&(Hn===null||!Hn.has(e))){var r=B.deps;if(B.f&2097152)e.rv<Yn&&(e.rv=Yn,Wn===null&&r!==null&&r[Gn]===e?Gn++:Wn===null?Wn=[e]:Wn.push(e));else{B.deps??=[],n.call(B.deps,e)||B.deps.push(e);var i=e.reactions;i===null?e.reactions=[B]:n.call(i,B)||i.push(B)}}if(Ln&&Pt.has(e))return Pt.get(e);if(t){var a=e;if(Ln){var o=a.v;return(!(a.f&1024)&&a.reactions!==null||sr(a))&&(o=ft(a)),Pt.set(a,o),o}var s=!(a.f&512)&&!zn&&B!==null&&!!(B.f&512),c=(a.f&y)===0;$n(a)&&(s&&(a.f|=512),pt(a)),s&&!c&&(ht(a),or(a))}if(vt?.has(e))return vt.get(e);if(e.f&8388608)throw e.v;return e.v}function or(e){if(e.f|=512,e.deps!==null)for(let r of e.deps){var t=r.reactions;t===null?r.reactions=[e]:n.call(t,e)||t.push(e),r.f&2&&!(r.f&512)&&(ht(r),or(r))}}function sr(e){if(e.v===D)return!0;if(e.deps===null)return!1;for(let t of e.deps)if(Pt.has(t)||t.f&2&&sr(t))return!0;return!1}function cr(e){var t=zn;try{return zn=!0,e()}finally{zn=t}}function lr(e){if(!(typeof e!=`object`||!e||e instanceof EventTarget)){if(T in e)ur(e);else if(!Array.isArray(e))for(let t in e){let n=e[t];typeof n==`object`&&n&&T in n&&ur(n)}}}function ur(e,t=new Set){if(typeof e==`object`&&e&&!(e instanceof EventTarget)&&!t.has(e)){t.add(e),e instanceof Date&&e.getTime();for(let n in e)try{ur(e[n],t)}catch{}let n=l(e);if(n!==Object.prototype&&n!==Array.prototype&&n!==Map.prototype&&n!==Set.prototype&&n!==Date.prototype){let t=o(n);for(let n in t){let r=t[n].get;if(r)try{r.call(e)}catch{}}}}}[...`allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback`.split(`.`)];var dr=[`touchstart`,`touchmove`];function fr(e){return dr.includes(e)}var pr=Symbol(`events`),mr=new Set,hr=new Set;function gr(e,t,n,r={}){function i(e){if(r.capture||xr.call(t,e),!e.cancelBubble)return nt(()=>n?.call(this,e))}return e.startsWith(`pointer`)||e.startsWith(`touch`)||e===`wheel`?(i.__removed=!1,Ye(()=>{i.__removed||t.addEventListener(e,i,r)})):t.addEventListener(e,i,r),i}function _r(e,t,n,r,i){var a={capture:r,passive:i},o=gr(e,t,n,a);(t===document.body||t===window||t===document||t instanceof HTMLMediaElement)&&hn(()=>{o.__removed=!0,t.removeEventListener(e,o,a)})}function U(e,t,n){(t[pr]??={})[e]=n}function vr(e){for(var t=0;t<e.length;t++)mr.add(e[t]);for(var n of hr)n(e)}var yr=null,br=!1;function xr(e){var t=this,n=t.ownerDocument,r=e.type,a=e.composedPath?.()||[],o=a[0]||e.target;yr=e,br||(br=!0,setTimeout(()=>{br=!1,yr=null}));var s=0,c=yr===e&&e[pr];if(c){var l=a.indexOf(c);if(l!==-1&&(t===document||t===window)){e[pr]=t;return}var u=a.indexOf(t);if(u===-1)return;l<=u&&(s=l)}if(o=a[s]||e.target,o!==t){i(e,`currentTarget`,{configurable:!0,get(){return o||n}});var d=B,f=V;Bn(null),Vn(null);try{for(var p,m=[];o!==null&&o!==t;){try{var h=o[pr]?.[r];h==null||o.disabled&&e.target!==o||h.call(o,e)}catch(e){p?m.push(e):p=e}if(e.cancelBubble)break;s++,o=s<a.length?a[s]:null}if(p){for(let e of m)queueMicrotask(()=>{throw e});throw p}}finally{e[pr]=t,delete e.currentTarget,Bn(d),Vn(f)}}}var Sr=globalThis?.window?.trustedTypes&&globalThis.window.trustedTypes.createPolicy(`svelte-trusted-html`,{createHTML:e=>e});function Cr(e){return Sr?.createHTML(e)??e}function wr(e){var t=sn(`template`);return t.innerHTML=Cr(e.replaceAll(`<!>`,`<!---->`)),t.content}function Tr(e,t){var n=V;n.nodes===null&&(n.nodes={start:e,end:t,a:null,t:null})}function W(e,t){var n=!!(t&1),r=!!(t&2),i,a=!e.startsWith(`<!>`);return()=>{if(k)return Tr(A,null),A;i===void 0&&(i=wr(a?e:`<!>`+e),n||(i=tn(i)));var t=r||Xt?document.importNode(i,!0):i.cloneNode(!0);if(n){var o=tn(t),s=t.lastChild;Tr(o,s)}else Tr(t,t);return t}}function Er(e=``){if(!k){var t=en(e+``);return Tr(t,t),t}var n=A;return n.nodeType===3?cn(n):(n.before(n=en()),ve(n)),Tr(n,n),n}function Dr(){if(k)return Tr(A,null),A;var e=document.createDocumentFragment(),t=document.createComment(``),n=en();return e.append(t,n),Tr(t,n),e}function G(e,t){if(k){var n=V;n.f&32768&&n.nodes.end!==null||(n.nodes.end=A),ye()}else e!==null&&e.before(t)}function Or(e){let t=0,n=It(0),r;return()=>{mn()&&(H(n),Sn(()=>(t===0&&(r=cr(()=>e(()=>Ut(n)))),t+=1,()=>{Ye(()=>{--t,t===0&&(r?.(),r=void 0,Ut(n))})})))}}var kr=x|S;function Ar(e,t,n,r){new jr(e,t,n,r)}var jr=class{parent;is_pending=!1;transform_error;#e;#t=k?A:null;#n;#r;#i;#a=null;#o=null;#s=null;#c=null;#l=0;#u=0;#d=!1;#f=new Set;#p=new Set;#m=null;#h=Or(()=>(this.#m=It(this.#l),()=>{this.#m=null}));constructor(e,t,n,r){this.#e=e,this.#n=t,this.#r=e=>{var t=V;t.b=this,t.f|=128,n(e)},this.parent=V.b,this.transform_error=r??this.parent?.transform_error??(e=>e),this.#i=Cn(()=>{if(k){let e=Se(this.#t);ye();let t=e===`[!`;if(e.startsWith(`[?`)){let t=JSON.parse(e.slice(2));this.#_(t)}else t?this.#b():this.#g()}else this.#x()},kr),k&&(this.#e=A)}#g(){try{this.#a=wn(()=>this.#r(this.#e))}catch(e){this.error(e)}}#_(e){let t=this.#n.failed,{reset:n,invoke_onerror:r}=this.#v(e);Ye(r),t&&(this.#s=wn(()=>{t(this.#e,()=>e,()=>n)}))}#v(e){var t=!1,n=!1;let r=()=>{this.#y()||(t?ge():(t=!0,n&&Le(),this.#s!==null&&jn(this.#s,()=>{this.#s=null}),this.#C(()=>{this.#x()})))};return{reset:r,invoke_onerror:()=>{if(!this.#y())try{n=!0,this.#n.onerror?.(e,r),n=!1}catch(e){un(e,this.#i&&this.#i.parent)}}}}#y(){return(this.#i.f&(v|b))!==0}#b(){let e=this.#n.pending;e&&(this.is_pending=!0,this.#o=wn(()=>e(this.#e)),Ye(()=>{if(!this.#y()){var e=this.#c=document.createDocumentFragment(),t=en(),n=!1;e.append(t),this.#a=this.#C(()=>{try{return wn(()=>this.#r(t))}catch(e){try{this.error(e),n=!0}catch(e){un(e,this.#i.parent)}return null}}),this.#a===null?(this.#c=null,n&&this.#S(N)):this.#u===0&&(this.#e.before(e),this.#c=null,jn(this.#o,()=>{this.#o=null}),this.#S(N))}}))}#x(){try{if(this.is_pending=this.has_pending_snippet(),this.#u=0,this.#l=0,this.#a=wn(()=>{this.#r(this.#e)}),this.#u>0){var e=this.#c=document.createDocumentFragment();Fn(this.#a,e);let t=this.#n.pending;this.#o=wn(()=>t(this.#e))}else this.#S(N)}catch(e){this.error(e)}}#S(e){this.is_pending=!1,e.transfer_effects(this.#f,this.#p)}defer_effect(e){$e(e,this.#f,this.#p)}is_rendered(){return!this.is_pending&&(!this.parent||this.parent.is_rendered())}has_pending_snippet(){return!!this.#n.pending}#C(e){var t=V,n=B,r=Ve;Vn(this.#i),Bn(this.#i),He(this.#i.ctx);try{return Et.ensure(),e()}finally{Vn(t),Bn(n),He(r)}}#w(e,t){this.has_pending_snippet()?(this.#u+=e,this.#u===0&&(this.#S(t),this.#o&&jn(this.#o,()=>{this.#o=null}),this.#c&&=(this.#e.before(this.#c),null))):this.parent&&this.parent.#w(e,t)}update_pending_count(e,t){this.#w(e,t),this.#l+=e,!(!this.#m||this.#d)&&(this.#d=!0,Ye(()=>{this.#d=!1,this.#m&&Bt(this.#m,this.#l)}))}get_effect_pending(){return this.#h(),H(this.#m)}error(e){if(e===fe||!this.#n.onerror&&!this.#n.failed)throw e;N?.is_fork?(this.#a&&N.skip_effect(this.#a),this.#o&&N.skip_effect(this.#o),this.#s&&N.skip_effect(this.#s),N.oncommit(()=>{this.#y()||this.#T(e)})):this.#T(e)}#T(e){this.#a&&=(On(this.#a),null),this.#o&&=(On(this.#o),null),this.#s&&=(On(this.#s),null),k&&(ve(this.#t),be(),ve(xe()));let t=this.#n.failed,n=e=>{if(this.#y())return;let{reset:n,invoke_onerror:r}=this.#v(e);r(),t&&!this.#y()&&(this.#s=this.#C(()=>{try{return wn(()=>{var r=V;r.b=this,r.f|=128,t(this.#e,()=>e,()=>n)})}catch(e){return un(e,this.#i.parent),null}}))};Ye(()=>{if(!this.#y()){var t;try{t=this.transform_error(e)}catch(e){un(e,this.#i&&this.#i.parent);return}typeof t==`object`&&t&&typeof t.then==`function`?t.then(n,e=>un(e,this.#i&&this.#i.parent)):n(t)}})}};function K(e,t){var n=t==null?``:typeof t==`object`?`${t}`:t;n!==(e[ce]??=e.nodeValue)&&(e[ce]=n,e.nodeValue=`${n}`)}function Mr(e,t){return Pr(e,t)}var Nr=new Map;function Pr(e,{target:t,anchor:n,props:i={},events:a,context:o,intro:s=!0,transformError:c}){$t();var l=void 0,u=yn(()=>{var s=n??t.appendChild(en());Ar(s,{pending:()=>{}},t=>{Ue({});var n=Ve;if(o&&(n.c=o),a&&(i.$$events=a),k&&Tr(t,null),l=e(t,i)||Ge(),k&&(V.nodes.end=A,A===null||A.nodeType!==8||A.data!==`]`))throw he(),fe;We()},c);var u=new Set,d=e=>{for(var n=0;n<e.length;n++){var r=e[n];if(!u.has(r)){u.add(r);var i=fr(r);for(let e of[t,document]){var a=Nr.get(e);a===void 0&&(a=new Map,Nr.set(e,a));var o=a.get(r);o===void 0?(e.addEventListener(r,xr,{passive:i}),a.set(r,1)):a.set(r,o+1)}}}};return d(r(mr)),hr.add(d),()=>{for(var e of u)for(let n of[t,document]){var r=Nr.get(n),i=r.get(e);--i==0?(n.removeEventListener(e,xr),r.delete(e),r.size===0&&Nr.delete(n)):r.set(e,i)}hr.delete(d),s!==n&&s.parentNode?.removeChild(s)}});return Fr.set(l,u),l}var Fr=new WeakMap,Ir=class{anchor;#e=new Map;#t=new Map;#n=new Map;#r=new Set;#i=!0;constructor(e,t=!0){this.anchor=e,this.#i=t}#a=e=>{if(this.#e.has(e)){var t=this.#e.get(e),n=this.#t.get(t);if(n)Nn(n),this.#r.delete(t);else{var r=this.#n.get(t);r&&(Nn(r.effect),this.#t.set(t,r.effect),this.#n.delete(t),r.fragment.lastChild.remove(),this.anchor.before(r.fragment),n=r.effect)}for(let[t,n]of this.#e){if(this.#e.delete(t),t===e)break;let r=this.#n.get(n);r&&(On(r.effect),this.#n.delete(n))}for(let[e,r]of this.#t){if(e===t||this.#r.has(e))continue;let i=()=>{if(Array.from(this.#e.values()).includes(e)){var t=document.createDocumentFragment();Fn(r,t),t.append(en()),this.#n.set(e,{effect:r,fragment:t})}else On(r);this.#r.delete(e),this.#t.delete(e)};this.#i||!n?(this.#r.add(e),jn(r,i,!1)):i()}}};#o=e=>{this.#e.delete(e);let t=Array.from(this.#e.values());for(let[e,n]of this.#n)t.includes(e)||(On(n.effect),this.#n.delete(e))};ensure(e,t){var n=N,r=on();if(t&&!this.#t.has(e)&&!this.#n.has(e)){if(r){var i=document.createDocumentFragment(),a=en();i.append(a),this.#n.set(e,{effect:wn(()=>t(a)),fragment:i})}else this.#t.set(e,wn(()=>t(this.anchor)))}if(this.#e.set(n,e),r){for(let[t,r]of this.#t)t===e?n.unskip_effect(r):n.skip_effect(r);for(let[t,r]of this.#n)t===e?n.unskip_effect(r.effect):n.skip_effect(r.effect);n.oncommit(this.#a),n.ondiscard(this.#o)}else k&&(this.anchor=A),this.#a(n)}};function Lr(e,t,n=!1){var r;k&&(r=A,ye());var i=new Ir(e),a=n?x:0;function o(e,t){if(k){var n=Se(r);if(e!==parseInt(n.substring(1))){var a=xe();ve(a),i.anchor=a,_e(!1),i.ensure(e,t),_e(!0);return}}i.ensure(e,t)}Cn(()=>{var e=!1;t((t,n=0)=>{e=!0,o(n,t)}),e||o(-1,null)},a)}function Rr(e,t){return t}function zr(e,t,n){for(var i=[],a=t.length,o,s=t.length,c=0;c<a;c++){let n=t[c];jn(n,()=>{if(o){if(o.pending.delete(n),o.done.add(n),o.pending.size===0){var t=e.outrogroups;Br(e,r(o.done)),t.delete(o),t.size===0&&(e.outrogroups=null)}}else--s},!1)}if(s===0){var l=i.length===0&&n!==null&&e.pending.size===0;if(l){var u=n,d=u.parentNode;an(d),d.append(u),e.items.clear()}Br(e,t,!l)}else o={pending:new Set(t),done:new Set},(e.outrogroups??=new Set).add(o)}function Br(e,t,n=!0){var r;if(e.pending.size>0){r=new Set;for(let t of e.pending.values())for(let n of t)r.add(e.items.get(n).e)}for(var i=0;i<t.length;i++){var a=t[i];r?.has(a)?(a.f|=w,Fn(a,document.createDocumentFragment())):On(t[i],n)}}var Vr;function Hr(t,n,i,a,o,s=null){var c=t,l=new Map;if(n&4){var u=t;c=k?ve(tn(u)):u.appendChild(en())}k&&ye();var d=null,f=ut(()=>{var t=i();return e(t)?t:t==null?[]:r(t)}),p=new Map,m=!0;function h(e){if(!(_.effect.f&16384)){_.pending.delete(e);var t=H(f);_.fallback=d,Wr(_,t,c,n,a),d!==null&&(t.length===0?d.f&33554432?(d.f^=w,Kr(d,null,c)):Nn(d):jn(d,()=>{d=null}))}}function g(e){_.pending.delete(e)}var _={effect:Cn(()=>{var e=H(f),t=e.length;let r=!1;k&&Se(c)===`[!`!=(t===0)&&(c=xe(),ve(c),_e(!1),r=!0);for(var u=new Set,_=N,v=on(),y=0;y<t;y+=1){k&&A.nodeType===8&&A.data===`]`&&(c=A,r=!0,_e(!1));var b=e[y],x=a(b,y),S=m?null:l.get(x);S?(S.v&&Bt(S.v,b),S.i&&Bt(S.i,y),v&&_.unskip_effect(S.e)):(S=Gr(l,m?c:Vr??=en(),b,x,y,o,n,i),m||(S.e.f|=w),l.set(x,S)),u.add(x)}if(t===0&&s&&!d&&(m?d=wn(()=>s(c)):(d=wn(()=>s(Vr??=en())),d.f|=w)),t>u.size&&Oe(``,``,``),k&&t>0&&ve(xe()),!m){if(p.set(_,u),v){for(let[e,t]of l)u.has(e)||_.skip_effect(t.e);_.oncommit(h),_.ondiscard(g)}else h(_)}r&&_e(!0),H(f)}),flags:n,items:l,pending:p,outrogroups:null,fallback:d};m=!1,k&&(c=A)}function Ur(e){for(;e!==null&&!(e.f&32);)e=e.next;return e}function Wr(e,t,n,i,a){var o=!!(i&8),s=t.length,c=e.items,l=Ur(e.effect.first),u,d=null,f,p=[],m=[],h,g,_,v;if(o)for(v=0;v<s;v+=1)h=t[v],g=a(h,v),_=c.get(g).e,_.f&33554432||(_.nodes?.a?.measure(),(f??=new Set).add(_));for(v=0;v<s;v+=1){if(h=t[v],g=a(h,v),_=c.get(g).e,e.outrogroups!==null)for(let t of e.outrogroups)t.pending.delete(_),t.done.delete(_);if(_.f&8192&&(Nn(_),o&&(_.nodes?.a?.unfix(),(f??=new Set).delete(_))),_.f&33554432){if(_.f^=w,_===l)Kr(_,null,n);else{var y=d?d.next:l;_===e.effect.last&&(e.effect.last=_.prev),_.prev&&(_.prev.next=_.next),_.next&&(_.next.prev=_.prev),qr(e,d,_),qr(e,_,y),Kr(_,y,n),d=_,p=[],m=[],l=Ur(d.next);continue}}if(_!==l){if(u!==void 0&&u.has(_)){if(p.length<m.length){var b=m[0],x;d=b.prev;var S=p[0],C=p[p.length-1];for(x=0;x<p.length;x+=1)Kr(p[x],b,n);for(x=0;x<m.length;x+=1)u.delete(m[x]);qr(e,S.prev,C.next),qr(e,d,S),qr(e,C,b),l=b,d=C,--v,p=[],m=[]}else u.delete(_),Kr(_,l,n),qr(e,_.prev,_.next),qr(e,_,d===null?e.effect.first:d.next),qr(e,d,_),d=_;continue}for(p=[],m=[];l!==null&&l!==_;)(u??=new Set).add(l),m.push(l),l=Ur(l.next);if(l===null)continue}_.f&33554432||p.push(_),d=_,l=Ur(_.next)}if(e.outrogroups!==null){for(let t of e.outrogroups)t.pending.size===0&&(Br(e,r(t.done)),e.outrogroups?.delete(t));e.outrogroups.size===0&&(e.outrogroups=null)}if(l!==null||u!==void 0){var ee=[];if(u!==void 0)for(_ of u)_.f&8192||ee.push(_);for(;l!==null;)!(l.f&8192)&&l!==e.fallback&&ee.push(l),l=Ur(l.next);var te=ee.length;if(te>0){var ne=i&4&&s===0?n:null;if(o){for(v=0;v<te;v+=1)ee[v].nodes?.a?.measure();for(v=0;v<te;v+=1)ee[v].nodes?.a?.fix()}zr(e,ee,ne)}}o&&Ye(()=>{if(f!==void 0)for(_ of f)_.nodes?.a?.apply()})}function Gr(e,t,n,r,i,a,o,s){var c=o&1?o&16?It(n):Lt(n,!1,!1):null,l=o&2?It(i):null;return{v:c,i:l,e:wn(()=>(a(t,c??n,l??i,s),()=>{e.delete(r)}))}}function Kr(e,t,n){if(e.nodes)for(var r=e.nodes.start,i=e.nodes.end,a=t&&!(t.f&33554432)?t.nodes.start:n;r!==null;){var o=nn(r);if(a.before(r),r===i)return;r=o}}function qr(e,t,n){t===null?e.effect.first=n:t.next=n,n===null?e.effect.last=t:n.prev=t}function Jr(e,t,n){bn(()=>{var r=cr(()=>t(e,n?.())||{});if(n&&r?.update){var i=!1,a={};Sn(()=>{var e=n();lr(e),i&&we(a,e)&&(a=e,r.update(e))}),i=!0}if(r?.destroy)return()=>r.destroy()})}function Yr(e){var t,n,r=``;if(typeof e==`string`||typeof e==`number`)r+=e;else if(typeof e==`object`){if(Array.isArray(e)){var i=e.length;for(t=0;t<i;t++)e[t]&&(n=Yr(e[t]))&&(r&&(r+=` `),r+=n)}else for(n in e)e[n]&&(r&&(r+=` `),r+=n)}return r}function Xr(){for(var e,t,n=0,r=``,i=arguments.length;n<i;n++)(e=arguments[n])&&(t=Yr(e))&&(r&&(r+=` `),r+=t);return r}function Zr(e){return typeof e==`object`?Xr(e):e??``}var Qr=[...` 	
\r\f\xA0\v﻿`];function $r(e,t,n){var r=e==null?``:``+e;if(t&&(r=r?r+` `+t:t),n){for(var i of Object.keys(n))if(n[i])r=r?r+` `+i:i;else if(r.length)for(var a=i.length,o=0;(o=r.indexOf(i,o))>=0;){var s=o+a;(o===0||Qr.includes(r[o-1]))&&(s===r.length||Qr.includes(r[s]))?r=(o===0?``:r.substring(0,o))+r.substring(s+1):o=s}}return r===``?null:r}function ei(e,t=!1){var n=t?` !important;`:`;`,r=``;for(var i of Object.keys(e)){var a=e[i];a!=null&&a!==``&&(r+=` `+i+`: `+a+n)}return r}function ti(e){return e[0]!==`-`||e[1]!==`-`?e.toLowerCase():e}function ni(e,t){if(t){var n=``,r,i;if(Array.isArray(t)?(r=t[0],i=t[1]):r=t,e){e=String(e).replaceAll(/\/\*.*?\*\//g,``).trim();var a=!1,o=0,s=!1,c=[];r&&c.push(...Object.keys(r).map(ti)),i&&c.push(...Object.keys(i).map(ti));var l=0,u=-1;let t=e.length;for(var d=0;d<t;d++){var f=e[d];if(s?f===`/`&&e[d-1]===`*`&&(s=!1):a?a===f&&(a=!1):f===`/`&&e[d+1]===`*`?s=!0:f===`"`||f===`'`?a=f:f===`(`?o++:f===`)`&&o--,!s&&a===!1&&o===0){if(f===`:`&&u===-1)u=d;else if(f===`;`||d===t-1){if(u!==-1){var p=ti(e.substring(l,u).trim());if(!c.includes(p)){f!==`;`&&d++;var m=e.substring(l,d).trim();n+=` `+m+`;`}}l=d+1,u=-1}}}}return r&&(n+=ei(r)),i&&(n+=ei(i,!0)),n=n.trim(),n===``?null:n}return e==null?null:String(e)}function ri(e,t,n,r,i,a){var o=e[oe];if(k||o!==n||o===void 0){var s=$r(n,r,a);k&&s===e.getAttribute(`class`)||(s==null?e.removeAttribute(`class`):t?e.className=s:e.setAttribute(`class`,s)),e[oe]=n}else if(a&&i!==a)for(var c in a){var l=!!a[c];(i==null||l!==!!i[c])&&e.classList.toggle(c,l)}return a}function ii(e,t={},n,r){for(var i in n){var a=n[i];t[i]!==a&&(n[i]==null?e.style.removeProperty(i):e.style.setProperty(i,a,r))}}function ai(e,t,n,r){var i=e[se];if(k||i!==t){var a=ni(t,r);k&&a===e.getAttribute(`style`)||(a==null?e.removeAttribute(`style`):e.style.cssText=a),e[se]=t}else r&&(Array.isArray(r)?(ii(e,n?.[0],r[0]),ii(e,n?.[1],r[1],`important`)):ii(e,n,r));return r}function oi(e,t){t?e.hasAttribute(`selected`)||e.setAttribute(`selected`,``):e.removeAttribute(`selected`)}function si(t,n){var r=t.__defaultValue,i=t.multiple,a=i?r??[]:null;if(!i||e(a)){var o=t.selectedIndex,s=n&&i?new Set(t.selectedOptions):null;for(var c of t.options){var l=ui(c);oi(c,i?a.includes(l):qt(l,r))}if(n){if(s!==null)for(c of t.options){var u=s.has(c);c.selected!==u&&(c.selected=u)}else t.selectedIndex!==o&&(t.selectedIndex=o)}}}function ci(t,n,r=!1){if(t.multiple){if(n==null)return;if(!e(n))return O();for(var i of t.options)i.selected=n.includes(ui(i))}else{for(i of t.options)if(qt(ui(i),n)){i.selected=!0;return}r&&n===void 0||(t.selectedIndex=-1)}}function li(e){var t=new MutationObserver(t=>{t.every(di)||(`__defaultValue`in e&&si(e,!1),`__value`in e&&ci(e,e.__value))});t.observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:[`value`]}),hn(()=>{t.disconnect()})}function ui(e){return`__value`in e?e.__value:e.value}function di(e){if(e.target.closest(`selectedcontent`)!==null)return!0;if(e.type===`childList`){var t=[...e.addedNodes,...e.removedNodes];return t.length>0&&t.every(e=>e.nodeName===`SELECTEDCONTENT`)}return!1}var fi=Symbol(`is custom element`),pi=Symbol(`is html`),mi=de?`link`:`LINK`,hi=de?`progress`:`PROGRESS`;function gi(e){if(k){var t=!1,n=()=>{if(!t){if(t=!0,e.hasAttribute(`value`)){var n=e.value;q(e,`value`,null),e.value=n}if(e.hasAttribute(`checked`)){var r=e.checked;q(e,`checked`,null),e.checked=r}}};e[le]=n,Ye(n),tt()}}function _i(e,t){var n=yi(e);n.value!==(n.value=t??void 0)&&(e.value!==t||t===0&&e.nodeName===hi)&&(e.value=t??``)}function vi(e,t){var n=yi(e);n.checked!==(n.checked=t??void 0)&&(e.checked=t)}function q(e,t,n,r){var i=yi(e);k&&(i[t]=e.getAttribute(t),t===`src`||t===`srcset`||t===`href`&&e.nodeName===mi)||i[t]!==(i[t]=n)&&(t===`loading`&&(e[ie]=n),n==null?e.removeAttribute(t):typeof n!=`string`&&xi(e).has(t)?e[t]=n:e.setAttribute(t,n))}function yi(e){return e[ae]??={[fi]:e.nodeName.includes(`-`),[pi]:e.namespaceURI===pe}}var bi=new Map;function xi(e){var t=e.getAttribute(`is`)||e.nodeName,n=bi.get(t);if(n)return n;bi.set(t,n=new Set);for(var r,i=e,a=Element.prototype;a!==i;){for(var s in r=o(i),r)r[s].set&&s!==`innerHTML`&&s!==`textContent`&&s!==`innerText`&&n.add(s);i=l(i)}return n}var Si=new class e{#e=new WeakMap;#t;#n;static entries=new WeakMap;constructor(e){this.#n=e}observe(e,t){var n=this.#e.get(e)||new Set;return n.add(t),this.#e.set(e,n),this.#r().observe(e,this.#n),()=>{var n=this.#e.get(e);n.delete(t),n.size===0&&(this.#e.delete(e),this.#t.unobserve(e))}}#r(){return this.#t??=new ResizeObserver(t=>{for(var n of t){e.entries.set(n.target,n);for(var r of this.#e.get(n.target)||[])r(n)}})}}({box:`border-box`});function Ci(e,t,n){var r=Si.observe(e,()=>n(e[t]));bn(()=>(cr(()=>n(e[t])),r))}function wi(e,t){return e===t||e?.[T]===t}function Ti(e=Ge(),t,n,r){var i=Ve.r,a=V;return bn(()=>{var o,s;return Sn(()=>{o=s,s=r?.()||[],cr(()=>{wi(n(...s),e)||(t(e,...s),o&&wi(n(...o),e)&&t(null,...o))})}),()=>{let r=a;for(;r!==i&&r.parent!==null&&r.parent.f&33554432;)r=r.parent;let o=()=>{s&&wi(n(...s),e)&&t(null,...s)},c=r.teardown;r.teardown=()=>{o(),c?.()}}}),e}var Ei=!1;function Di(e){var t=Ei;try{return Ei=!1,[e(),Ei]}finally{Ei=t}}function Oi(e,t,n,r){var i=!0,o=!!(n&8),s=!!(n&16),c=r,l=!0,u=void 0,d=()=>s&&i?(u??=st(r),H(u)):(l&&(l=!1,c=s?cr(r):r),c);let f;if(o){var p=T in e||re in e;f=a(e,t)?.set??(p&&t in e?n=>e[t]=n:void 0)}var m,h=!1;o?[m,h]=Di(()=>e[t]):m=e[t],m===void 0&&r!==void 0&&(m=d(),f&&(i&&Ne(t),f(m)));var g=i?()=>{var n=e[t];return n===void 0?d():(l=!0,n)}:()=>{var n=e[t];return n!==void 0&&(c=void 0),n===void 0?c:n};if(i&&!(n&4))return g;if(f){var _=e.$$legacy;return(function(e,t){return arguments.length>0?((!i||!t||_||h)&&f(t?g():e),e):g()})}var v=!1,y=(n&1?st:ut)(()=>(v=!1,g()));o&&H(y);var b=V;return(function(e,t){if(arguments.length>0){let n=t?H(y):i&&o?Gt(e):e;return F(y,n),v=!0,c!==void 0&&(c=n),e}return Ln&&v||b.f&16384?y.v:H(y)})}function ki(e){Ve===null&&Ee(`onMount`),gn(()=>{let t=cr(e);if(typeof t==`function`)return t})}function Ai(){return[globalThis.navigator,globalThis.document].map(e=>e?.modelContext).find(e=>typeof e?.registerTool==`function`)}function ji(){return Ai()!==void 0}function Mi(e){let t=Ai();if(!t)return()=>{};let n=new AbortController,r=[];for(let i of e)try{t.registerTool(i,{signal:n.signal}),r.push(i.name)}catch{try{t.registerTool(i),r.push(i.name)}catch{}}return()=>{n.abort();for(let e of r)try{t.unregisterTool?.(e)}catch{}}}var Ni=`# PhotoCollage translation file
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
`,Pi=`# PhotoCollage translation file
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
`,Fi=`# PhotoCollage translation file
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
`,Ii=`# PhotoCollage translation file
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
`,Li=`# PhotoCollage translation file
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
`,Ri=`# PhotoCollage translation file
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
`,zi=`# PhotoCollage translation file
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
`,Bi=`# PhotoCollage translation file
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
`,Vi=`# PhotoCollage translation file
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
`,Hi=`# PhotoCollage translation file
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
`,Ui=`# PhotoCollage translation file
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
`;function Wi(e){return e.trim().slice(1,-1).replace(/\\(n|t|"|\\)/g,(e,t)=>t===`n`?`
`:t===`t`?`	`:t)}function Gi(e){let t={},n=null,r=null,i=null,a=!1,o=!1,s=()=>{n!==null&&r!==null&&n!==``&&r!==``&&!a&&(t[n]=r),n=r=i=null,a=!1};for(let t of e.split(/\r?\n/)){let e=t.trim();e.startsWith(`#,`)?e.includes(`fuzzy`)&&(o=!0):e.startsWith(`#`)||(e.startsWith(`msgid_plural`)||e.startsWith(`msgstr[`)?i=null:e.startsWith(`msgid `)?(s(),a=o,o=!1,n=Wi(e.slice(6)),i=`id`):e.startsWith(`msgstr `)?(r=Wi(e.slice(7)),i=`str`):e.startsWith(`"`)?i===`id`&&n!==null?n+=Wi(e):i===`str`&&r!==null&&(r+=Wi(e)):e===``&&s())}return s(),t}var Ki=Object.assign({"./po/bg.po":Ni,"./po/cs.po":Pi,"./po/de.po":Fi,"./po/es.po":Ii,"./po/fr.po":Li,"./po/it.po":Ri,"./po/nl.po":zi,"./po/pl.po":Bi,"./po/pt_BR.po":Vi,"./po/ru.po":Hi,"./po/uk.po":Ui}),qi={};for(let[e,t]of Object.entries(Ki)){let n=/\/([^/]+)\.po$/.exec(e)?.[1];n&&(qi[n]=Gi(t))}var Ji=[`en`,...Object.keys(qi).sort()],Yi=`en`;function Xi(e){if(!e)return;let t=e.replace(`-`,`_`).toLowerCase(),n=Ji.find(e=>e.toLowerCase()===t);if(n)return n;let r=t.split(`_`)[0];return Ji.find(e=>e.toLowerCase()===r)??Ji.find(e=>e.split(`_`)[0]?.toLowerCase()===r)}function Zi(e){return Xi(e)??`en`}function Qi(e){for(let t of e??[]){let e=Xi(t);if(e)return e}return`en`}function $i(e){return Yi=Zi(e),Yi}function ea(){return Yi}function J(e,t){let n=qi[Yi]?.[e]??e;return t?n.replace(/%\((\w+)\)s/g,(e,n)=>n in t?String(t[n]):e):n}function ta(e,t){let n=e;if(!n||!Number.isInteger(n.page)||!Number.isInteger(n.position))return{ok:!1,code:`bad-value`,message:`A photo is { page, position }, counting from 1.`};let r=t[n.page-1];if(!r)return{ok:!1,code:`no-such-page`,message:`There is no page ${n.page}; the collage has ${t.length}.`};let i=r[n.position-1];return i===void 0?{ok:!1,code:`no-such-photo`,message:`Page ${n.page} has ${r.length} photo(s); there is no position ${n.position}. Read the state again.`}:{ok:!0,index:i}}function na(e,t){if(!Array.isArray(e)||e.length===0)return{ok:!1,code:`bad-value`,message:`Give at least one photo as { page, position }.`};let n=[];for(let r of e){let e=ta(r,t);if(!e.ok)return e;n.includes(e.index)||n.push(e.index)}return{ok:!0,indices:n}}function ra(e,t,n){return typeof e==`number`&&Number.isInteger(e)&&e>=t&&e<=n?e:void 0}function ia(e,t,n){return typeof e==`number`&&Number.isFinite(e)&&e>=t&&e<=n?e:void 0}var Y=(e,t)=>({status:`done`,message:e,data:t}),aa=e=>({status:`waiting`,message:e}),X=(e,t)=>({status:`refused`,code:e,message:t});function oa(e){let t=e.status===`refused`?{ok:!1,status:e.status,code:e.code,message:e.message}:{ok:!0,status:e.status,message:e.message,data:e.data};return{content:[{type:`text`,text:JSON.stringify(t)}],...e.status===`refused`?{isError:!0}:{}}}function sa(e){return e.placements.map((e,t)=>({i:t,page:e.page??0,y:Math.round(e.cell.y*1e3),x:e.cell.x})).sort((e,t)=>e.page-t.page||e.y-t.y||e.x-t.x).map(e=>e.i)}var ca=.1;function la(e){return Math.min(100,Math.max(0,e))/100*ca}function ua(e){return Math.round(e/ca*100)}function da(e,t){return e===t?`square`:t>e?`portrait`:`landscape`}function fa(e){return{pages:Array.from({length:e.pageCount},(t,n)=>({page:n+1,photos:e.photos.filter(e=>e.page===n+1).sort((e,t)=>e.position-t.position).map(e=>({position:e.position,name:e.name,size:`${e.width}x${e.height}`,orientation:da(e.width,e.height),...e.selected?{selected:!0}:{},...e.wider?{wider:!0}:{},...e.taller?{taller:!0}:{},...e.cropped?{cropped:!0}:{}}))})),selection:e.photos.filter(e=>e.selected).map(e=>({page:e.page,position:e.position})),layout:e.layout,style:{borderPercent:ua(e.style.borderWidth),borderColor:e.style.borderColor,corners:e.style.corners,outerBorder:e.style.outerBorder},size:{width:e.size.width,height:e.size.height,orientation:e.size.portrait?`portrait`:`landscape`,named:e.size.named,instagramPostImages:e.size.postImages>1?e.size.postImages:null},pageCount:e.pageCount,view:e.view,save:e.save,ui:e.ui,canUndoRemove:e.canUndoRemove}}function pa(e){let t=Array.from({length:e.pageCount},()=>[]),n=e.layout,r=new Set;if(n)for(let i of sa(n)){let a=n.placements[i];if(!a||r.has(a.photoIndex))continue;r.add(a.photoIndex);let o=e.book?e.photos[a.photoIndex]?.bookPage??0:0;t[Math.min(o,t.length-1)]?.push(a.photoIndex)}return e.photos.forEach((n,i)=>{if(r.has(i))return;let a=e.book?n.bookPage??0:0;t[Math.min(a,t.length-1)]?.push(i)}),t}function ma(e){let t=pa(e),n=new Set(e.selection),r=[];t.forEach((t,i)=>{t.forEach((t,a)=>{let o=e.photos[t];o&&r.push({name:o.name,width:o.width,height:o.height,page:i+1,position:a+1,selected:n.has(t),wider:(o.span?.columns??1)>1,taller:(o.span?.rows??1)>1,cropped:o.crop!==void 0})})});let i=e.settings;return{photos:r,layout:{style:e.layoutStyle,columns:e.columns??`auto`,columnsInUse:e.columnsInUse??null,seed:e.seed},style:{borderWidth:i.borderWidth,borderColor:i.borderColor,corners:i.cornerStyle,outerBorder:i.outerBorder},size:{width:i.width,height:i.height,portrait:da(i.width,i.height)===`portrait`,named:e.activeSize,postImages:i.splitImages},pageCount:e.pageCount,pageCounts:[...e.pageCounts],view:{tab:e.tab,tool:e.activeMode,zoomPercent:e.zoomPercent,fit:e.isFit},save:{format:i.format,quality:Math.round(i.jpegQuality*100),saving:e.dialog===`progress`,progress:Math.round(e.progress),last:e.lastSave},ui:{language:e.lang,dialog:e.dialog,pendingQuestion:e.pendingQuestion,confirmationOutcome:e.confirmationOutcome,notices:[e.notice?.summary,...e.messages.map(e=>e.text)].filter(e=>typeof e==`string`).slice(0,5)},canUndoRemove:e.removed!==null}}function ha(e){return{app:e,pages:()=>pa(e),busy(){if(e.dialog===`confirm`)return X(`busy`,J(`A question is open for the person; wait for their answer.`));if(e.dialog===`progress`)return X(`busy`,J(`A save is running; wait for it or cancel it.`))},photo(t){let n=ta(t,pa(e));return n.ok?{index:n.index}:X(n.code,n.message)},photos(t){let n=na(t,pa(e));return n.ok?{indices:n.indices}:X(n.code,n.message)}}}var ga=e=>`status`in e;function Z(e,t,n,r,i={}){return{name:e,description:t,inputSchema:{type:`object`,properties:n,...i.required?{required:i.required}:{},additionalProperties:!1},...i.readOnly?{annotations:{readOnlyHint:!0}}:{},async execute(e){try{return oa(await r(e??{}))}catch(e){return oa(X(`bad-value`,e instanceof Error?e.message:String(e)))}}}}var _a={type:`object`,description:`A photo: its page and its position on that page, both counting from 1.`,properties:{page:{type:`integer`,minimum:1},position:{type:`integer`,minimum:1}},required:[`page`,`position`],additionalProperties:!1},va={type:`array`,items:_a,minItems:1,description:`Photos, each as { page, position }.`};function ya(e){let t=e>>>0,n=()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296};return{random:n,choice(e){return e[Math.floor(n()*e.length)]}}}function ba(e,t){for(let n=e.length-1;n>0;n--){let r=Math.floor(t.random()*(n+1));[e[n],e[r]]=[e[r],e[n]]}}function xa(){let e=new Uint32Array(1);return crypto.getRandomValues(e),e[0]}var Sa=class{index;ratio;forceSpan;constructor(e,t,n=!1){this.index=e,this.ratio=t,this.forceSpan=n}},Ca=class{get x(){return this.parents[0].x}get w(){return this.parents.reduce((e,t)=>e+t.w,0)}get ratio(){return this.h/this.w}get wantedRatio(){return this.photo.ratio}topNeighbor(){let e;for(let t of this.parents[0].cells){if(this===t)return e;e=t}}bottomNeighbor(){let e,t=this.parents[0].cells;for(let n=t.length-1;n>=0;n--){let r=t[n];if(this===r)return e;e=r}}},wa=class extends Ca{parents;photo;extent=null;h;constructor(e,t){super(),this.parents=e,this.photo=t,this.h=this.w*this.wantedRatio}get y(){let e;for(let t of this.parents[0].cells){if(this===t)return e?e.y+e.h:0;e=t}throw Error(`cell is not in its parent column`)}scale(e){this.h*=e}isExtension(){return!1}toString(){return`[${Math.trunc(this.w)} ${Math.trunc(this.h)}${this.extent?`--`:`]`}`}},Ta=class extends Ca{origin;constructor(e){super(),this.origin=e,e.extent=this}get parents(){return[this.origin.parents[1]]}get photo(){return this.origin.photo}get y(){return this.origin.y}get h(){return this.origin.h}scale(){}isExtension(){return!0}toString(){return`------]`}},Ea=class{parent;w;cells=[];constructor(e,t){this.parent=e,this.w=t}get h(){let e=this.cells[this.cells.length-1];return e?e.y+e.h:0}get x(){let e=0;for(let t of this.parent.cols){if(this===t)break;e+=t.w}return e}scale(e){this.w*=e;for(let t of this.cells)t.scale(e)}leftNeighbor(){let e;for(let t of this.parent.cols){if(this===t)return e;e=t}}rightNeighbor(){let e,t=this.parent.cols;for(let n=t.length-1;n>=0;n--){let r=t[n];if(this===r)return e;e=r}}adjustHeight(e){let t=[{y:0,h:0,cells:[]}];for(let e of this.cells){let n=t[t.length-1];e.isExtension()?(n.h=e.y-n.y,t.push({y:e.y+e.h,h:0,cells:[]})):n.cells.push(e)}let n=t[t.length-1];n.h=e-n.y;for(let e of t){if(e.cells.length===0)continue;let t=e.h/e.cells.reduce((e,t)=>e+t.h,0);for(let n of e.cells)n.h*=t}}};function Da(e){let t=Math.round(e);return Math.abs(e%1)===.5&&t%2!=0?t-1:t}var Oa=class{targetRatio;rng;spans;cols=[];constructor(e,t,n,r,i=`any`){this.targetRatio=t,this.rng=r,this.spans=i;let a=e/n;for(let e=0;e<n;e++)this.cols.push(new Ea(this,a))}get noCols(){return this.cols.length}get w(){return this.cols.reduce((e,t)=>e+t.w,0)}get h(){return Math.max(0,...this.cols.map(e=>e.h))}toString(){let e=[],t=0,n=!1;for(;!n;){e.push(``),n=!0;for(let r of this.cols){let i=r.cells.map(e=>e.toString()),a=i.length?i:[``],o=Math.max(...a.map(e=>e.length));r!==this.cols[this.cols.length-1]&&(o+=1);let s=` `.repeat(o),c=a[t];c!==void 0&&(s=c+` `.repeat(o-c.length),t<a.length-1&&(n=!1)),e[e.length-1]+=s}t++}return e.join(`
`)}nextFreeCol(){let e=Math.min(...this.cols.map(e=>e.h));return this.rng.choice(this.cols.filter(t=>t.h===e))}addCellSingleCol(e,t){e.cells.push(new wa([e],t))}canJoin(e,t){let[n,r]=e.h<=t.h?[e,t]:[t,e];if(r.h-n.h<1e-9)return!0;let i=n.cells[n.cells.length-1];return i instanceof wa&&i.extent===null}level(e,t){let[n,r]=e.h<=t.h?[e,t]:[t,e],i=n.cells[n.cells.length-1];i instanceof wa&&i.extent===null&&(i.h+=r.h-n.h)}addCellMultiCol(e,t,n){this.level(e,t);let r=new wa([e,t],n),i=new Ta(r);e.cells.push(r),t.cells.push(i)}addCell(e){let t=this.nextFreeCol(),n=t.leftNeighbor(),r=t.rightNeighbor();if(e.forceSpan&&this.spans!==`none`){let i=[n,r].filter(e=>e!==void 0);i.sort((e,n)=>Number(this.canJoin(t,n))-Number(this.canJoin(t,e))||Math.abs(t.h-e.h)-Math.abs(t.h-n.h));let a=i[0];if(a!==void 0){a===n?this.addCellMultiCol(a,t,e):this.addCellMultiCol(t,a,e);return}}if(this.spans===`any`&&2*this.rng.random()>e.ratio){if(n&&Math.abs(t.h-n.h)<.5*t.w&&this.canJoin(n,t)){this.addCellMultiCol(n,t,e);return}if(r&&Math.abs(t.h-r.h)<.5*t.w&&this.canJoin(t,r)){this.addCellMultiCol(t,r,e);return}}this.addCellSingleCol(t,e)}removeEmptyCols(){for(let e=this.cols.length-1;e>=0;e--)this.cols[e].cells.length===0&&this.cols.splice(e,1)}removeBottomHoles(){for(let e=0;e<=this.cols.length&&this.removeBottomHolesPass();e++);}removeBottomHolesPass(){let e=!1;for(let t of this.cols){let n=t.cells[t.cells.length-1];if(!n||n===t.cells[0])continue;let r=n.topNeighbor(),i=t.leftNeighbor(),a=t.rightNeighbor();if(n instanceof wa&&!n.extent)r instanceof wa&&r.extent&&r.extent.bottomNeighbor()===void 0?(a.cells.push(new Ta(n)),n.parents=[t,a],e=!0):r instanceof Ta&&r.origin.bottomNeighbor()===void 0&&(t.cells.splice(t.cells.indexOf(n),1),i.cells.push(n),t.cells.push(new Ta(n)),n.parents=[i,t],e=!0);else if(n instanceof wa&&n.extent&&n.extent.bottomNeighbor()===void 0){let o=n.extent,s=o.topNeighbor();if(s instanceof wa&&s.extent&&s.extent.bottomNeighbor()===void 0){let r=a.rightNeighbor();t.cells.splice(t.cells.indexOf(n),1),a.cells.splice(a.cells.indexOf(o),1),a.cells.push(n),r.cells.push(o),n.parents=[a,r],e=!0}else r instanceof Ta&&r.origin.bottomNeighbor()===void 0&&(t.cells.splice(t.cells.indexOf(n),1),a.cells.splice(a.cells.indexOf(o),1),i.cells.push(n),t.cells.push(o),n.parents=[i,t],e=!0)}}return e}adjustColsHeights(){let e=this.w*this.targetRatio;for(let t of this.cols)t.adjustHeight(e)}adjust(){this.removeEmptyCols(),this.removeBottomHoles(),this.removeEmptyCols(),this.adjustColsHeights()}tiles(){let e=this.toLayout(),t=e.width*e.height,n=1e-9*Math.max(1,e.placements.length),r=0;for(let{cell:t}of e.placements){if(!(t.w>n&&t.h>n))return!1;r+=t.w*t.h}return Math.abs(r-t)<=1e-9*Math.max(1,t)}setTargetRatio(e){this.targetRatio=e,this.adjustColsHeights()}swapPhotos(e,t){let n=this.photoCells(),r=n.find(t=>t.photo.index===e),i=n.find(e=>e.photo.index===t);r&&i&&([r.photo,i.photo]=[i.photo,r.photo])}photoCells(){return this.cols.flatMap(e=>e.cells.filter(e=>!e.isExtension()))}toLayout(){let e=this.w>0?1/this.w:1;return{width:1,height:this.targetRatio,placements:this.photoCells().map(t=>({photoIndex:t.photo.index,cell:{x:t.x*e,y:t.y*e,w:t.w*e,h:t.h*e}}))}}};function ka(e,t){let n=e.length;if(n===0)return 1;let r=e.reduce((e,t)=>e+t.height/t.width,0)/n,i=2*n;return Math.max(1,Da(Math.sqrt(r/t*i)))}function Aa(e){if(e!=null&&Number.isFinite(e))return Math.min(100,Math.max(1,Math.floor(e)))}function ja(e,t,n,r={}){if(e.length===0)return new Oa(1,t,1,n);let i=Aa(r.columns)??ka(e,t);e.some(e=>e.span?.columns===2)&&(i=Math.max(i,2));let a=e.map(e=>e.height/e.width*(e.span?.rows??1)),o=(n,r)=>{let o=new Oa(1,t,i,n,r),s=a.map((e,t)=>t);ba(s,n);for(let t of s)o.addCell(new Sa(t,a[t],e[t]?.span?.columns===2));return o.adjust(),o},s=o(n,`any`);for(let e=1;!s.tiles()&&e<Ma;e++)s=o(ya(Math.floor(n.random()*2**32)>>>0),`any`);for(let e=0;!s.tiles()&&e<4*Ma;e++)s=o(ya(Math.floor(n.random()*2**32)>>>0),`asked`);return s.tiles()||(s=o(ya(Math.floor(n.random()*2**32)>>>0),`none`)),s}var Ma=8,Na=.04,Pa=.8;function Fa(e){let{first:t,second:n}=e;e.weight=t.weight+n.weight,e.count=t.count+n.count;let r,i=t.weight/t.count,a=n.weight/n.count;if(e.direction===`side`){let o=i/t.ratio,s=a/n.ratio;e.ratio=1/(1/t.ratio+1/n.ratio),r=o/(o+s)}else{let o=i*t.ratio,s=a*n.ratio;e.ratio=t.ratio+n.ratio,r=o/(o+s)}let o=t.weight/(t.weight+n.weight);r=Pa*r+.19999999999999996*o,e.share=Math.min(.96,Math.max(Na,r))}function Ia(e,t,n){let r={kind:`cut`,direction:n,first:e,second:t,ratio:1,weight:1,count:1,share:.5};return Fa(r),r}function La(e){e.kind!==`leaf`&&(La(e.first),La(e.second),Fa(e))}function Ra(e,t){let n=e.span;return{kind:`leaf`,photoIndex:t,ratio:e.height/e.width,weight:(n?.columns??1)*(n?.rows??1),count:1}}function za(e,t,n){let r=e.length,i=e.map((e,t)=>Ra(e,t));ba(i,n);let a=Math.log(t);for(;i.length>1;){let e=1/0,t=[];for(let n=0;n+1<i.length;n++){let r=i[n].count+i[n+1].count;r<e?(e=r,t=[n]):r===e&&t.push(n)}let o=n.choice(t),s=i[o],c=i[o+1],l=a*(s.count+c.count)/r,u=Ia(s,c,`side`),d=Ia(s,c,`stack`),f=Math.abs(Math.log(u.ratio)-l)<=Math.abs(Math.log(d.ratio)-l),p=n.random()<.15?!f:f;i.splice(o,2,p?u:d)}let o=i[0];return Ua(o,t,n),o}function Ba(e,t=[]){return e.kind===`cut`&&(t.push(e),Ba(e.first,t),Ba(e.second,t)),t}function Va(e,t,n,r){e.kind===`leaf`?r.push(t*n/e.weight):e.direction===`side`?(Va(e.first,t*e.share,n,r),Va(e.second,t*(1-e.share),n,r)):(Va(e.first,t,n*e.share,r),Va(e.second,t,n*(1-e.share),r))}function Ha(e,t){let n=[];Va(e,1,t,n);let r=n.map(e=>Math.log(e)),i=r.reduce((e,t)=>e+t,0)/r.length,a=Math.sqrt(r.reduce((e,t)=>e+(t-i)**2,0)/r.length);return 3*Math.abs(Math.log(e.ratio)-Math.log(t))+a}function Ua(e,t,n){if(e.kind===`leaf`)return;let r=Ba(e),i=Ga(e),a=Math.min(1500,Math.max(150,Math.round(6e4/i.length))),o=Ha(e,t);for(let s=0;s<a&&o>.001;s++)if(n.random()<.5){let i=n.choice(r),a=()=>{i.direction=i.direction===`side`?`stack`:`side`,La(e)};a();let s=Ha(e,t);s<=o?o=s:a()}else if(i.length>1){let r=n.choice(i),a=n.choice(i);if(r===a)continue;Wa(r,a),La(e);let s=Ha(e,t);s<=o?o=s:(Wa(r,a),La(e))}}function Wa(e,t){[e.photoIndex,t.photoIndex]=[t.photoIndex,e.photoIndex],[e.ratio,t.ratio]=[t.ratio,e.ratio],[e.weight,t.weight]=[t.weight,e.weight]}function Ga(e,t=[]){return e.kind===`leaf`?t.push(e):(Ga(e.first,t),Ga(e.second,t)),t}function Ka(e,t,n){if(e.kind===`leaf`)n.push({photoIndex:e.photoIndex,cell:t});else if(e.direction===`side`){let r=t.w*e.share;Ka(e.first,{x:t.x,y:t.y,w:r,h:t.h},n),Ka(e.second,{x:t.x+r,y:t.y,w:t.w-r,h:t.h},n)}else{let r=t.h*e.share;Ka(e.first,{x:t.x,y:t.y,w:t.w,h:r},n),Ka(e.second,{x:t.x,y:t.y+r,w:t.w,h:t.h-r},n)}}var qa=class{root;ratio;constructor(e,t){this.root=e,this.ratio=t}setTargetRatio(e){this.ratio=e}swapPhotos(e,t){if(!this.root)return;let n=Ga(this.root),r=n.find(t=>t.photoIndex===e),i=n.find(e=>e.photoIndex===t);r&&i&&([r.photoIndex,i.photoIndex]=[i.photoIndex,r.photoIndex])}toLayout(){let e=[];return this.root&&Ka(this.root,{x:0,y:0,w:1,h:this.ratio},e),{width:1,height:this.ratio,placements:e}}};function Ja(e,t,n){return e.length===0?new qa(null,t):new qa(za(e,t,n),t)}function Ya(e,t){let n=e.width*e.height,r=0,i=0;for(let{photoIndex:n,cell:a}of e.placements){r+=a.w*a.h;let e=t[n];if(!e||a.w<=0||a.h<=0){i+=1;continue}let o=e.height/e.width,s=a.h/a.w;i+=1-Math.min(s/o,o/s)}return{uncovered:n>0?Math.max(0,1-r/n):0,cutOff:e.placements.length>0?i/e.placements.length:0}}function Xa(e,t){return Math.abs(e.uncovered-t.uncovered)>1e-6?e.uncovered<t.uncovered:e.cutOff<t.cutOff}function Za(e,t,n,r){let i=Math.max(1,Math.floor(r)),a=ya(n),o;for(let n=0;n<i;n++){let n=Math.floor(a.random()*2**32)>>>0,r=e(ya(n)),s=Ya(r.toLayout(),t);(!o||Xa(s,o.score))&&(o={page:r,seed:n,score:s,tried:i})}return o}function Qa(e,t,n,r,i={}){return e===`gallery`?Ja(t,n,r):ja(t,n,r,i)}function $a(e,t,n,r,{tries:i=e===`gallery`?10:30,...a}={}){return Za(r=>Qa(e,t,n,r,a),t,r,i)}var eo=.04;function to(e){return e==null||!Number.isFinite(e)?6:Math.min(20,Math.max(1,Math.floor(e)))}function no(e){return e==null||!Number.isFinite(e)?1:Math.min(20,Math.max(1,Math.floor(e)))}function ro(e,t){return e+Math.imul(t,2654435761)>>>0}function io(e,t){let n=Array(t).fill(0);for(let r of e){let e=Math.min(t-1,Math.max(0,r));n[e]=(n[e]??0)+1}return n}function ao(e,t){let n=no(t),r=Math.floor(e/n),i=e%n,a=[];for(let e=0;e<n;e++){let t=r+ +(e<i);for(let n=0;n<t;n++)a.push(e)}return{pageOf:a,pages:n}}function oo(e,t){let n=[...e];for(let e=n.length-1;e>0;e--){let r=Math.floor(t.random()*(e+1));[n[e],n[r]]=[n[r],n[e]]}return n}function so(e,t,n){return e.map(e=>e===t?n:t<n&&e>t&&e<=n?e-1:t>n&&e>=n&&e<t?e+1:e)}function co(e,t){let n=t>0?t-1:0;return e.map(e=>e===t?t>0?n:0:e>t?e-1:e)}var lo=class e{subs;maps;ratio;constructor(e,t,n){this.subs=e,this.maps=t,this.ratio=n}static wrap(t,n,r){return new e([t],[Array.from({length:n},(e,t)=>t)],r)}get pageCount(){return this.subs.length}pageOfPhoto(e){return this.maps.findIndex(t=>t.includes(e))}setTargetRatio(e){this.ratio=e;for(let t of this.subs)t?.setTargetRatio(e)}swapPhotos(e,t){let n=this.pageOfPhoto(e),r=this.pageOfPhoto(t);if(n<0||r<0)return;let i=this.maps[n],a=this.maps[r],o=i.indexOf(e),s=a.indexOf(t);n===r?this.subs[n]?.swapPhotos(o,s):(i[o]=t,a[s]=e)}addPage(){this.subs.push(null),this.maps.push([])}movePage(e,t){let[n]=this.subs.splice(e,1),[r]=this.maps.splice(e,1);this.subs.splice(t,0,n??null),this.maps.splice(t,0,r??[])}toLayout(){let e=this.subs.length,t=e+(e-1)*eo,n=[],r=[];return this.subs.forEach((e,i)=>{let a=i*1.04;if(r.push({x:a/t,w:1/t}),!e)return;let o=this.maps[i];for(let r of e.toLayout().placements){let{x:e,y:s,w:c,h:l}=r.cell;n.push({photoIndex:o[r.photoIndex],cell:{x:(a+e)/t,y:s/t,w:c/t,h:l/t},page:i})}}),{width:1,height:this.ratio/t,placements:n,pages:r}}};function uo(e,t,n,r,i,a,o={}){let s=no(r),c=[],l=[];for(let r=0;r<s;r++){let u=t.map((e,t)=>t).filter(e=>Math.min(s-1,Math.max(0,n[e]??0))===r);l.push(u),c.push(u.length===0?null:Qa(e,u.map(e=>t[e]),i,ya(ro(a,r)),o))}return new lo(c,l,i)}function fo(e,t,n,r,i,a,o,s={}){let c=ya(a),l;for(let a=0;a<Math.max(1,o);a++){let a=Math.floor(c.random()*2**32)>>>0,o=uo(e,t,n,r,i,a,s),u=Ya(o.toLayout(),t);(!l||Xa(u,l.score))&&(l={page:o,seed:a,score:u})}let u=l;return{page:u.page,seed:u.seed}}function po(e,t){let n=e.pages?.[t];return n?{width:1,height:e.height/n.w,placements:e.placements.filter(e=>e.page===t).map(e=>({photoIndex:e.photoIndex,cell:{x:(e.cell.x-n.x)/n.w,y:e.cell.y/n.w,w:e.cell.w/n.w,h:e.cell.h/n.w}}))}:e}function mo(e){return(e.pages??[]).map((e,t)=>t).filter(t=>e.placements.some(e=>e.page===t))}function ho(e,t,n){let r=String(t).length;return Array.from({length:t},(t,i)=>`${e}_${String(i+1).padStart(r,`0`)}.${n}`)}function go(e){let{app:t}=e,n=e=>ra(e,1,t.pageCount),r=()=>t.dialog===`confirm`?aa(J(`Waiting for the person to confirm.`)):Y(J(`Done.`));return[Z(`add_page`,J(`Add a blank page after the last one.`),{},()=>e.busy()||(t.hasPhotos?t.pageCount>=20?X(`out-of-range`,J(`The most is %(n)s pages.`,{n:20})):(t.addPage(),Y(J(`Added page %(n)s.`,{n:t.pageCount}))):X(`no-photos`,J(`Add photos first.`)))),Z(`move_page`,J(`Move a page one place left or right, with its photos.`),{page:{type:`integer`,minimum:1},direction:{type:`string`,enum:[`left`,`right`]}},r=>{let i=e.busy();if(i)return i;let a=n(r.page);if(a===void 0||!t.book)return X(`no-such-page`,J(`There are %(n)s page(s).`,{n:t.pageCount}));let o=r.direction===`left`?-1:+(r.direction===`right`);return o===0?X(`bad-value`,J(`Direction is left or right.`)):a-1+o<0||a-1+o>=t.pageCount?X(`out-of-range`,J(`That page is already at the end.`)):(t.movePage(a-1,o),Y(J(`Moved.`)))},{required:[`page`,`direction`]}),Z(`set_page_count`,J(`Set the number of pages (1 to 20); the photos are shared evenly across them, in order.`),{count:{type:`integer`,minimum:1,maximum:20}},n=>{let r=e.busy();if(r)return r;let i=ra(n.count,1,20);return i===void 0?X(`out-of-range`,J(`Pages: 1 to %(n)s.`,{n:20})):(t.setPageCount(i),Y(J(`%(n)s page(s).`,{n:i})))},{required:[`count`]}),Z(`remove_page`,J(`Remove a page; its photos move to a neighbouring page. The person is asked first.`),{page:{type:`integer`,minimum:1}},i=>{let a=e.busy();if(a)return a;let o=n(i.page);return o===void 0||!t.book?X(`no-such-page`,J(`There is no page to remove there.`)):(t.askRemovePage(o-1),r())},{required:[`page`]}),Z(`shuffle_layout`,J(`Make a new arrangement within each page, photos keeping their page. Asks the person first after hand edits.`),{},()=>e.busy()||(t.hasPhotos?(t.askShuffle(!1),r()):X(`no-photos`,J(`There are no photos.`)))),Z(`shuffle_between_pages`,J(`Mix the photos between pages, keeping each page's count. Needs two or more pages.`),{},()=>e.busy()||(t.book?(t.askShuffle(!0),r()):X(`not-supported`,J(`There is only one page.`))))]}function _o(e){let{app:t}=e;return[Z(`set_tool`,J(`Choose the preview tool: select (pick photos), swap (click two photos to swap them) or pan.`),{tool:{type:`string`,enum:[`select`,`swap`,`pan`]}},e=>e.tool!==`select`&&e.tool!==`swap`&&e.tool!==`pan`?X(`bad-value`,J(`The tool is select, swap or pan.`)):(t.setMode(e.tool),Y(J(`Tool: %(tool)s.`,{tool:e.tool}))),{required:[`tool`]}),Z(`select_photos`,J(`Select photos. With add set, they join the current selection; otherwise they replace it.`),{photos:va,add:{type:`boolean`}},n=>{let r=e.photos(n.photos);return ga(r)?r:(t.selectMany(n.add===!0?[...t.selection,...r.indices]:r.indices),Y(J(`%(n)s photo(s) selected.`,{n:t.selection.length})))},{required:[`photos`]}),Z(`clear_selection`,J(`Let go of the selection.`),{},()=>(t.deselect(),Y(J(`Nothing is selected.`)))),Z(`swap_photos`,J(`Swap two photos, also across pages.`),{a:_a,b:_a},n=>{let r=e.busy();if(r)return r;let i=e.photo(n.a);if(ga(i))return i;let a=e.photo(n.b);if(ga(a))return a;if(i.index===a.index)return X(`bad-value`,J(`Choose two different photos.`));let o=t.layout?.placements??[],s=o.findIndex(e=>e.photoIndex===i.index),c=o.findIndex(e=>e.photoIndex===a.index);return s<0||c<0?X(`busy`,J(`The photos are still being arranged.`)):(t.deselect(),t.pick(s),t.pick(c),Y(J(`Swapped.`)))},{required:[`a`,`b`]}),Z(`resize_photo`,J(`Give photos more room: columns 1 or 2 (wider) and rows 1 to 3 (taller), or reset them to their normal size.`),{photos:va,columns:{type:`integer`,enum:[1,2]},rows:{type:`integer`,enum:[1,2,3]},reset:{type:`boolean`}},n=>{let r=e.busy();if(r)return r;let i=e.photos(n.photos);if(ga(i))return i;if(n.reset===!0)return t.setSpans(i.indices,`reset`),Y(J(`Back to normal size.`));let a=n.columns===1||n.columns===2?n.columns:void 0,o=n.rows===1||n.rows===2||n.rows===3?n.rows:void 0;return a===void 0&&o===void 0?X(`bad-value`,J(`Give columns, rows or reset.`)):(t.setSpans(i.indices,{...a?{columns:a}:{},...o?{rows:o}:{}}),Y(J(`Resized.`)))},{required:[`photos`]}),Z(`crop_photo`,J(`Open crop mode on one photo and set its zoom (1 and up) and the way it is moved inside its cell (x and y, as shares of the collage width). reset goes back to the default crop; finish ends crop mode.`),{photo:_a,zoom:{type:`number`,minimum:1,maximum:t.maxZoom},x:{type:`number`},y:{type:`number`},reset:{type:`boolean`},finish:{type:`boolean`}},n=>{let r=e.busy();if(r)return r;let i=e.photo(n.photo);if(ga(i))return i;if(t.multiSelected)return X(`crop-needs-one-photo`,J(`Cropping works on one photo; clear the selection first.`));if(t.cropPhoto(i.index),n.reset===!0&&t.resetCrop(),n.zoom!==void 0){let e=ia(n.zoom,1,t.maxZoom);if(e===void 0)return X(`out-of-range`,J(`Zoom is from 1 to %(max)s.`,{max:t.maxZoom}));t.zoomSelectedCrop(e)}let a=ia(n.x??0,-10,10),o=ia(n.y??0,-10,10);return a===void 0||o===void 0?X(`out-of-range`,J(`Move by a small amount.`)):((a!==0||o!==0)&&t.panSelectedCrop(a,o),n.finish===!0&&(t.cropFor=null),Y(J(`Cropping.`)))},{required:[`photo`]}),Z(`remove_photos`,J(`Remove photos. The person is asked first; Undo remove brings them back.`),{photos:va},n=>{let r=e.busy();if(r)return r;let i=e.photos(n.photos);return ga(i)?i:(t.askRemovePhotos(i.indices.flatMap(e=>t.photos[e]??[])),aa(J(`Waiting for the person to confirm the removal.`)))},{required:[`photos`]}),Z(`remove_all_photos`,J(`Remove every photo and go back to one page. The person is asked first.`),{},()=>e.busy()||(t.hasPhotos?(t.askRemoveAll(),aa(J(`Waiting for the person to confirm.`))):X(`no-photos`,J(`There are no photos.`)))),Z(`undo_remove`,J(`Bring back the photos removed last.`),{},()=>t.removed?(t.undoRemove(),Y(J(`Restored.`))):X(`not-supported`,J(`Nothing was removed.`))),Z(`move_photos_to_page`,J(`Move photos to another page (they go last there). Needs two or more pages.`),{photos:va,page:{type:`integer`,minimum:1}},n=>{let r=e.busy();if(r)return r;let i=e.photos(n.photos);if(ga(i))return i;let a=typeof n.page==`number`?n.page:0;return!t.book||!Number.isInteger(a)||a<1||a>t.pageCount?X(`no-such-page`,J(`There are %(n)s page(s); choose one of them.`,{n:t.pageCount})):(t.movePhotosToPage(i.indices.flatMap(e=>t.photos[e]?.id??[]),a-1),Y(J(`Moved to page %(n)s.`,{n:a})))},{required:[`photos`,`page`]})]}var vo=256;async function yo(e){let t=Math.min(1,vo/Math.max(e.width,e.height)),n=Math.max(1,Math.round(e.width*t)),r=Math.max(1,Math.round(e.height*t)),i=new OffscreenCanvas(n,r);i.getContext(`2d`)?.drawImage(e,0,0,n,r);let a=await i.convertToBlob({type:`image/jpeg`,quality:.7}),o=new Uint8Array(await a.arrayBuffer()),s=``;for(let e=0;e<o.length;e+=32768)s+=String.fromCharCode(...o.subarray(e,e+32768));return btoa(s)}function bo(e){let{app:t}=e;return[Z(`get_state`,J(`Read the whole state of the collage: photos by page and position, the selection, layout, style, size, pages, view, saving, language and any question waiting for the person. Read it again after anything that may move photos.`),{},()=>({status:`done`,message:J(`State of the collage.`),data:fa(ma(t))}),{readOnly:!0}),{name:`get_photo_preview`,description:J(`See a small preview image of one photo, by its page and position.`),inputSchema:{type:`object`,properties:_a.properties,required:[`page`,`position`],additionalProperties:!1},annotations:{readOnlyHint:!0},async execute(n){let r=e.photo(n);if(ga(r))return oa(r);let i=t.photos[r.index];return i?{content:[{type:`image`,data:await yo(i.thumb),mimeType:`image/jpeg`},{type:`text`,text:JSON.stringify({ok:!0,name:i.name})}]}:oa({status:`refused`,code:`no-such-photo`,message:`No photo.`})}}]}function xo(e){let{app:t}=e;return[Z(`set_save_format`,J(`Choose the saved format: png, jpeg or pdf (not for an Instagram post), and for jpeg and pdf the picture quality 1 to 100.`),{format:{type:`string`,enum:[`png`,`jpeg`,`pdf`]},quality:{type:`integer`,minimum:1,maximum:100}},n=>{let r=e.busy();if(r)return r;if(n.format!==`png`&&n.format!==`jpeg`&&n.format!==`pdf`)return X(`bad-value`,J(`The format is png, jpeg or pdf.`));if(n.format===`pdf`&&t.isSplit)return X(`not-supported`,J(`PDF is not offered for an Instagram post.`));let i=n.quality===void 0?void 0:ra(n.quality,1,100);return n.quality!==void 0&&i===void 0?X(`out-of-range`,J(`Quality is 1 to 100.`)):(t.settings.format=n.format,i!==void 0&&(t.settings.jpegQuality=i/100,t.restoreEpoch++),Y(J(`Format: %(f)s.`,{f:n.format})))},{required:[`format`]}),Z(`save`,J(`Save the collage as the app does: one image, a zip of images for several pages or an Instagram post. page saves just that page. It starts the save and returns; read get_state for progress and the file saved.`),{page:{type:`integer`,minimum:1}},n=>{let r=e.busy();if(r)return r;if(!t.hasPhotos)return X(`no-photos`,J(`There are no photos to save.`));let i;if(n.page!==void 0){let e=ra(n.page,1,t.pageCount);if(e===void 0||!t.book)return X(`no-such-page`,J(`There are %(n)s page(s).`,{n:t.pageCount}));i=e-1}return t.save(i),Y(J(`Saving started; read the state for progress.`))}),Z(`cancel_save`,J(`Cancel a save that is running.`),{},()=>t.dialog===`progress`?(t.cancelExport(),Y(J(`Cancelled.`))):X(`not-supported`,J(`No save is running.`)))]}var So=1080;function Co(e){if(e==null||!Number.isFinite(e))return 0;let t=Math.floor(e);return t<2?0:Math.min(20,t)}function wo(e,t){let n=[];for(let r=1;r<t;r++)n.push(e*r/t);return n}function To(e,t){return Array.from({length:e},(e,n)=>({x:n*t,y:0,w:t,h:t}))}function Eo(e,t,n){let r=String(t).length;return Array.from({length:t},(t,i)=>`${e}_${String(i+1).padStart(r,`0`)}.${n}`)}var Do=[{label:`800 × 600`,width:800,height:600},{label:`600 × 800`,width:600,height:800},{label:`1600 × 1200`,width:1600,height:1200},{label:`1200 × 1600`,width:1200,height:1600},{label:`A4 portrait (300 DPI)`,width:2480,height:3508},{label:`A4 landscape (300 DPI)`,width:3508,height:2480},{label:`A3 portrait (300 DPI)`,width:3508,height:4961},{label:`A3 landscape (300 DPI)`,width:4961,height:3508},{label:`A2 portrait (300 DPI)`,width:4961,height:7016},{label:`A2 landscape (300 DPI)`,width:7016,height:4961},{label:`B1 portrait (300 DPI)`,width:8350,height:11811},{label:`B1 landscape (300 DPI)`,width:11811,height:8350},{label:`Square (1080 × 1080)`,width:1080,height:1080}];function Oo(e,t){return Do.findIndex(n=>n.width===e&&n.height===t)}var ko=[{id:`screen`,label:`Screen`,group:`screen`,width:1600,height:1200},{id:`small`,label:`Small`,group:`screen`,width:800,height:600},{id:`square`,label:`Square`,group:`screen`,width:1080,height:1080},{id:`a4`,label:`A4`,group:`print`,width:3508,height:2480},{id:`a3`,label:`A3`,group:`print`,width:4961,height:3508},{id:`a2`,label:`A2`,group:`print`,width:7016,height:4961},{id:`b1`,label:`B1`,group:`print`,width:11811,height:8350}];function Ao(e,t){return t===`portrait`?{width:e.height,height:e.width}:{width:e.width,height:e.height}}function jo(e,t){for(let n of ko){if(n.width===e&&n.height===t)return{choice:n,orientation:e===t?`square`:`landscape`};if(n.height===e&&n.width===t)return{choice:n,orientation:`portrait`}}}function Mo(e,t){return e===t?`square`:t>e?`portrait`:`landscape`}var No=65535;function Po(e){let{app:t}=e,n=ko.map(e=>e.id);return[Z(`set_output_size`,J(`Set the output size: a named size (screen, small, square, a4, a3, a2, b1), or a custom width and height in pixels. Named sizes follow the current orientation. Leaves the Instagram post.`),{named:{type:`string`,enum:n},width:{type:`integer`,minimum:1,maximum:No},height:{type:`integer`,minimum:1,maximum:No}},r=>{let i=e.busy();if(i)return i;if(typeof r.named==`string`)return n.includes(r.named)?(t.chooseNamedSize(r.named),Y(J(`Size: %(n)s.`,{n:r.named}))):X(`bad-value`,J(`Sizes: %(list)s.`,{list:n.join(`, `)}));let a=ra(r.width,1,No),o=ra(r.height,1,No);return a===void 0||o===void 0?X(`out-of-range`,J(`Give a named size, or a width and height in pixels.`)):(t.settings.splitImages=0,t.customSize=!0,t.commitSize(a,o),Y(J(`Size: %(w)s × %(h)s.`,{w:t.settings.width,h:t.settings.height})))}),Z(`set_orientation`,J(`Turn the output between landscape and portrait.`),{orientation:{type:`string`,enum:[`landscape`,`portrait`]}},n=>e.busy()||(n.orientation!==`landscape`&&n.orientation!==`portrait`?X(`bad-value`,J(`Orientation is landscape or portrait.`)):(t.turn(n.orientation===`portrait`),Y(J(`Orientation: %(o)s.`,{o:n.orientation})))),{required:[`orientation`]}),Z(`set_instagram_post`,J(`Make the collage an Instagram post: one wide page saved as 2 to 20 square images.`),{images:{type:`integer`,minimum:2,maximum:20},side:{type:`integer`,minimum:16,description:`Pixels per square image.`}},n=>{let r=e.busy();if(r)return r;let i=ra(n.images,2,20);if(i===void 0)return X(`out-of-range`,J(`Images: %(a)s to %(b)s.`,{a:2,b:20}));let a=n.side===void 0?void 0:ra(n.side,16,No);if(n.side!==void 0&&a===void 0)return X(`out-of-range`,J(`The side is from 16 pixels.`));let o=t.isSplit?t.settings.height:So;return t.customSize=!1,t.setSplit(i,a??o,!0),Y(J(`Instagram post of %(n)s images.`,{n:i}))},{required:[`images`]})]}var Fo=[`mosaic`,`gallery`],Io=[`none`,`slight`,`rounded`];function Lo(e){let{app:t}=e;return[Z(`set_layout`,J(`Choose the layout: mosaic (columns of different heights) or gallery (one panel per photo).`),{style:{type:`string`,enum:Fo}},n=>{let r=e.busy();if(r)return r;let i=Fo.find(e=>e===n.style);return i?(t.chooseLayout(i),Y(J(`Layout: %(style)s.`,{style:i}))):X(`bad-value`,J(`The layout is mosaic or gallery.`))},{required:[`style`]}),Z(`set_columns`,J(`Set the number of columns (mosaic only), or auto to let the app decide.`),{columns:{anyOf:[{type:`integer`,minimum:1,maximum:100},{const:`auto`}]}},n=>{let r=e.busy();if(r)return r;if(t.layoutStyle===`gallery`)return X(`not-supported`,J(`Columns only apply to the mosaic layout.`));if(n.columns===`auto`)return t.setColumns(void 0),Y(J(`Columns: automatic.`));let i=ra(n.columns,1,100);return i===void 0?X(`out-of-range`,J(`Columns: 1 to %(n)s, or auto.`,{n:100})):(t.setColumns(i),Y(J(`Columns: %(n)s.`,{n:i})))},{required:[`columns`]}),Z(`set_seed`,J(`Set the arrangement's seed (a whole number); the same seed gives the same arrangement.`),{seed:{type:`integer`,minimum:0}},n=>e.busy()||(typeof n.seed!=`number`||!t.setSeed(n.seed)?X(`out-of-range`,J(`The seed is a whole number from 0 to 4294967295.`)):Y(J(`Seed: %(n)s.`,{n:t.seed}))),{required:[`seed`]}),Z(`set_border`,J(`Set the border: thickness as a percentage 0 to 100 of the slider's range, its colour (any CSS colour) and whether the outer edge has it too. Give any of them.`),{percent:{type:`number`,minimum:0,maximum:100},color:{type:`string`},outer:{type:`boolean`}},n=>{let r=e.busy();if(r)return r;if(n.percent===void 0&&n.color===void 0&&n.outer===void 0)return X(`bad-value`,J(`Give percent, color or outer.`));let i=n.percent===void 0?void 0:ia(n.percent,0,100);return n.percent!==void 0&&i===void 0?X(`out-of-range`,J(`Border thickness is 0 to 100.`)):n.color!==void 0&&(typeof n.color!=`string`||!CSS.supports(`color`,n.color))?X(`bad-value`,J(`That is not a colour.`)):n.outer!==void 0&&typeof n.outer!=`boolean`?X(`bad-value`,J(`outer is true or false.`)):(i!==void 0&&(t.settings.borderWidth=la(i),t.restoreEpoch++),typeof n.color==`string`&&(t.settings.borderColor=n.color),typeof n.outer==`boolean`&&(t.settings.outerBorder=n.outer),Y(J(`Border changed.`)))}),Z(`set_corners`,J(`Set the photos' corners: none (square), slight or rounded.`),{style:{type:`string`,enum:Io}},e=>{let n=Io.find(t=>t===e.style);return n?(t.settings.cornerStyle=n,Y(J(`Corners: %(style)s.`,{style:n}))):X(`bad-value`,J(`Corners are none, slight or rounded.`))},{required:[`style`]})]}var Ro=[`photos`,`poster`,`style`,`save`];function zo(e){let{app:t}=e;return[Z(`open_tab`,J(`Open a step of the sidebar: photos, poster (pages and size), style or save.`),{tab:{type:`string`,enum:Ro}},e=>{let n=Ro.find(t=>t===e.tab);return n?(t.setTab(n,!1),Y(J(`Opened %(tab)s.`,{tab:t.tab}))):X(`bad-value`,J(`Tabs: %(list)s.`,{list:Ro.join(`, `)}))},{required:[`tab`]}),Z(`zoom_view`,J(`Zoom the preview: to a percentage, by a factor, or fit the whole collage.`),{percent:{type:`number`,minimum:1},factor:{type:`number`,exclusiveMinimum:0},fit:{type:`boolean`}},e=>{if(e.fit===!0)return t.fitView(),Y(J(`Fitted.`));let n=e.percent===void 0?void 0:ia(e.percent,1,1e4),r=e.factor===void 0?void 0:ia(e.factor,.01,100);return n===void 0&&r===void 0?X(`bad-value`,J(`Give percent, factor or fit.`)):(t.zoomAtCentre(r??n/Math.max(1,t.zoomPercent)),Y(J(`Zoom: %(n)s%%.`,{n:Math.round(t.zoomPercent)})))}),Z(`pan_view`,J(`Move the preview by dx and dy screen pixels.`),{dx:{type:`number`},dy:{type:`number`}},e=>{let n=ia(e.dx??0,-2e4,2e4),r=ia(e.dy??0,-2e4,2e4);return n===void 0||r===void 0?X(`out-of-range`,J(`Too far.`)):(t.panBy(n,r),Y(J(`Moved.`)))}),Z(`set_language`,J(`Change the language of the app. Codes: %(list)s.`,{list:Ji.join(`, `)}),{code:{type:`string`,enum:Ji}},e=>{let n=Ji.find(t=>t===e.code);return n?(t.chooseLanguage(n),Y(J(`Language: %(code)s.`,{code:n}))):X(`bad-value`,J(`Languages: %(list)s.`,{list:Ji.join(`, `)}))},{required:[`code`]}),Z(`open_dialog`,J(`Open the Help or About dialog.`),{name:{type:`string`,enum:[`help`,`about`]}},n=>e.busy()||(n.name!==`help`&&n.name!==`about`?X(`bad-value`,J(`The dialog is help or about.`)):(t.dialog=n.name,Y(J(`Opened %(name)s.`,{name:n.name})))),{required:[`name`]}),Z(`close_dialog`,J(`Close the Help or About dialog.`),{},()=>t.dialog!==`help`&&t.dialog!==`about`?X(`not-supported`,J(`No Help or About dialog is open.`)):(t.dialog=null,Y(J(`Closed.`))))]}function Bo(e){let t=ha(e);return[...bo(t),..._o(t),...go(t),...Lo(t),...Po(t),...zo(t),...xo(t)]}function Vo(e){if(!ji())return;let t=()=>{};vn(()=>{gn(()=>{e.lang,t(),t=Mi(Bo(e))})}),addEventListener(`pagehide`,()=>t())}typeof window<`u`&&((window.__svelte??={}).v??=new Set).add(`5`);var Ho={columns:1,rows:1},Uo={zoom:1,x:.5,y:.5},Wo=(e,t,n)=>Math.min(n,Math.max(t,e));function Go(e){let t=(e,t)=>Number.isFinite(e)?e:t;return{zoom:Wo(t(e.zoom,1),1,5),x:Wo(t(e.x,.5),0,1),y:Wo(t(e.y,.5),0,1)}}function Ko(e){return e===void 0||e.zoom===Uo.zoom&&e.x===Uo.x&&e.y===Uo.y}function qo(e,t,n,r,i=1){let a=Math.max(n/e,r/t)*Math.max(1,i),o=e*a,s=t*a;return{w:o,h:s,spareX:Math.max(0,o-n),spareY:Math.max(0,s-r)}}function Jo(e,t,n,r,i,a,o){let s=qo(r,i,a,o,e.zoom);return Go({zoom:e.zoom,x:s.spareX>0?e.x-t/s.spareX:e.x,y:s.spareY>0?e.y-n/s.spareY:e.y})}function Yo(e,t,n,r,i,a){let o=Wo(t,1,5),s=qo(n,r,i,a,e.zoom),c=qo(n,r,i,a,o),l=t=>{let n=t===`x`?s.w:s.h,r=t===`x`?s.spareX:s.spareY,o=t===`x`?i:a;return(e[t]*r+o/2)/n},u=e=>{let t=e===`x`?c.w:c.h,n=e===`x`?c.spareX:c.spareY,r=e===`x`?i:a;return n>0?(l(e)*t-r/2)/n:.5};return Go({zoom:o,x:u(`x`),y:u(`y`)})}function Xo(e){let t=0,n=0,r=0,i=0;for(let a=0;a+3<e.length;a+=4){let o=e[a+3]/255;t+=e[a]*o,n+=e[a+1]*o,r+=e[a+2]*o,i+=o}return i===0?`rgb(200, 200, 200)`:`rgb(${Math.round(t/i)}, ${Math.round(n/i)}, ${Math.round(r/i)})`}var Zo=8;function Qo(e){try{let t=new OffscreenCanvas(Zo,Zo).getContext(`2d`,{willReadFrequently:!0});return t?(t.imageSmoothingEnabled=!0,t.imageSmoothingQuality=`high`,t.drawImage(e,0,0,Zo,Zo),Xo(t.getImageData(0,0,Zo,Zo).data)):Xo([])}catch{return Xo([])}}var $o=[`avif`,`bmp`,`gif`,`heic`,`heif`,`jfif`,`jpe`,`jpeg`,`jpg`,`png`,`webp`];function es(e){if(e.type.startsWith(`image/`))return!0;let t=e.name.split(`.`).pop()?.toLowerCase()??``;return $o.includes(t)}function ts(e){return`${e.name}|${e.size}|${e.lastModified}`}var ns=0;async function rs(e,t,n,r,i,a){let o=new Set(t.map(e=>ts(e.file))),s=[];for(let t of e)es(t)?o.has(ts(t))?(a?.({reason:`duplicate`,name:t.name}),r({kind:`info`,text:J(`Skipped %(name)s: it was already added.`,{name:t.name})})):(o.add(ts(t)),s.push(t)):(a?.({reason:`not-image`,name:t.name}),r({kind:`error`,text:J(`Skipped %(name)s: it is not an image.`,{name:t.name})}));let c=0;return(await Promise.all(s.map(async e=>{try{let t=await n.run({kind:`probe`,file:e,thumbMax:480});if(!t.ok||t.kind!==`probe`||t.width<1||t.height<1)throw Error(t.ok?`empty image`:t.error);return{id:`photo-${++ns}`,name:e.name,width:t.width,height:t.height,span:{...Ho},file:e,thumb:t.thumb,colour:Qo(t.thumb)}}catch{return a?.({reason:`unreadable`,name:e.name}),r({kind:`error`,text:J(`This image could not be opened:
"%(imgname)s".`,{imgname:e.name})}),null}finally{i?.(++c,s.length)}}))).filter(e=>e!==null)}var is=`collage-creator`,as=`files`,os=`meta`,ss=`session`;function cs(){return new Promise((e,t)=>{let n=indexedDB.open(is,1);n.onupgradeneeded=()=>{n.result.createObjectStore(as),n.result.createObjectStore(os)},n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error??Error(`could not open storage`))})}function ls(e){return new Promise((t,n)=>{e.onsuccess=()=>t(e.result),e.onerror=()=>n(e.error??Error(`storage request failed`))})}function us(e){return new Promise((t,n)=>{e.oncomplete=()=>t(),e.onerror=()=>n(e.error??Error(`storage transaction failed`)),e.onabort=()=>n(e.error??Error(`storage transaction aborted`))})}async function ds(e,t){let n=await cs();try{let r=new Set((await ls(n.transaction(as,`readonly`).objectStore(as).getAllKeys())).map(String)),i=[];for(let[e,n]of t)r.has(e)||i.push([e,{name:n.name,type:n.type,lastModified:n.lastModified,data:await n.arrayBuffer()}]);let a=n.transaction([as,os],`readwrite`),o=a.objectStore(as);for(let e of r)t.has(e)||o.delete(e);for(let[e,t]of i)o.put(t,e);a.objectStore(os).put(e,ss),await us(a)}finally{n.close()}}async function fs(e){let t=await cs();try{let n=t.transaction([as,os],`readonly`),r=vs(await ls(n.objectStore(os).get(ss)),e);if(!r)return null;let i=new Map;for(let{key:e}of r.photos){let t=await ls(n.objectStore(as).get(e));t?.data instanceof ArrayBuffer&&typeof t.name==`string`&&i.set(e,new File([t.data],t.name,{type:t.type??``,lastModified:t.lastModified??0}))}return{session:r,files:i}}finally{t.close()}}function ps(e){let t=e;return typeof t==`object`&&!!t&&(t.columns===1||t.columns===2)&&(t.rows===1||t.rows===2||t.rows===3)}function ms(e){let t=e;return typeof t==`object`&&!!t&&typeof t.pages==`number`&&typeof t.perPage==`number`}function hs(e){let t=e;return typeof t==`object`&&!!t&&[t.zoom,t.x,t.y].every(e=>typeof e==`number`&&Number.isFinite(e))}function gs(e,t,n){let r=Co(typeof e==`number`?e:void 0);return r>0&&typeof t==`number`&&typeof n==`number`&&t===r*n?r:0}function _s(e,t){let n=typeof e==`object`&&e?e:{},r=(e,t,n,r)=>typeof e==`number`&&Number.isFinite(e)&&e>=t&&e<=n?e:r,i=gs(n.splitImages,n.width,n.height);return{width:Math.round(r(n.width,1,1e6,t.width)),height:Math.round(r(n.height,1,1e6,t.height)),borderWidth:r(n.borderWidth,0,.1,t.borderWidth),borderColor:typeof n.borderColor==`string`&&/^#[0-9a-f]{6}$/i.test(n.borderColor)?n.borderColor:t.borderColor,cornerStyle:n.cornerStyle===`slight`||n.cornerStyle===`rounded`?n.cornerStyle:`none`,outerBorder:typeof n.outerBorder==`boolean`?n.outerBorder:t.outerBorder,splitImages:i,format:n.format===`jpeg`?`jpeg`:n.format===`pdf`&&i<2?`pdf`:`png`,jpegQuality:r(n.jpegQuality,.1,1,t.jpegQuality)}}function vs(e,t){let n=e;if(typeof n!=`object`||!n||n.v!==1||!Array.isArray(n.photos))return null;let r=[];for(let e of n.photos){if(typeof e?.key!=`string`)continue;let t={key:e.key,span:ps(e.span)?e.span:{...Ho}};hs(e.crop)&&!Ko(e.crop)&&(t.crop=Go(e.crop)),typeof e.page==`number`&&Number.isInteger(e.page)&&e.page>=0&&(t.page=Math.min(19,e.page)),r.push(t)}let i=n.seed;return{v:1,photos:r,seed:typeof i==`number`&&Number.isInteger(i)&&i>=0&&i<=4294967295?i:0,columns:typeof n.columns==`number`&&n.columns>=1?Math.floor(n.columns):void 0,layoutStyle:n.layoutStyle===`gallery`?`gallery`:`mosaic`,...ms(n.book)?{book:{pages:no(n.book.pages),perPage:to(n.book.perPage)}}:{},settings:_s(n.settings,t)}}var ys=101010256,bs=33639248,xs=67324752;function Ss(e){return/\.zip$/i.test(e.name)||e.type===`application/zip`||e.type===`application/x-zip-compressed`}var Cs={avif:`image/avif`,bmp:`image/bmp`,gif:`image/gif`,heic:`image/heic`,heif:`image/heif`,jpeg:`image/jpeg`,jpg:`image/jpeg`,png:`image/png`,webp:`image/webp`};async function ws(e,t,n){return new DataView(await e.slice(t,n).arrayBuffer())}function Ts(e,t){return new Date(1980+(t>>9),(t>>5&15)-1,t&31,e>>11,e>>5&63,(e&31)*2).getTime()}function Es(e){return e.endsWith(`/`)||e.startsWith(`__MACOSX/`)||e.includes(`/__MACOSX/`)?!1:!e.split(`/`).some(e=>e.startsWith(`.`))}async function Ds(e){let t=await ws(e,Math.max(0,e.size-22-65535),e.size),n=-1;for(let e=t.byteLength-22;e>=0;e--)if(t.getUint32(e,!0)===ys){n=e;break}if(n<0)throw Error(`not a zip file`);let r=t.getUint16(n+10,!0),i=t.getUint32(n+12,!0),a=t.getUint32(n+16,!0);if(a===4294967295||a+i>e.size)throw Error(`unsupported zip file`);let o=await ws(e,a,a+i),s=new TextDecoder,c=[],l=[],u=[],d=0;for(let t=0;t<r;t++){if(d+46>o.byteLength||o.getUint32(d,!0)!==bs)throw Error(`bad zip directory`);let t=o.getUint16(d+8,!0),n=o.getUint16(d+10,!0),r=o.getUint16(d+12,!0),i=o.getUint16(d+14,!0),a=o.getUint32(d+20,!0),f=o.getUint16(d+28,!0),p=o.getUint16(d+30,!0),m=o.getUint16(d+32,!0),h=o.getUint32(d+42,!0),g=s.decode(new Uint8Array(o.buffer,d+46,f));if(d+=46+f+p+m,!Es(g))continue;let _=g.split(`/`).pop()??g,v=Cs[_.split(`.`).pop()?.toLowerCase()??``];if(!v){l.push(_);continue}if(t&1||n!==0&&n!==8||a===4294967295){u.push(_);continue}let y=await ws(e,h,h+30);if(y.getUint32(0,!0)!==xs)throw Error(`bad zip entry`);let b=h+30+y.getUint16(26,!0)+y.getUint16(28,!0),x=e.slice(b,b+a),S=n===0?x:await new Response(x.stream().pipeThrough(new DecompressionStream(`deflate-raw`))).blob();c.push(new File([S],_,{type:v,lastModified:Ts(r,i)}))}return{files:c,others:l,unreadable:u}}function Os(e){let t=e.sizes.shift(),n=Math.max(Math.ceil(t[0]),1),r=Math.max(Math.ceil(t[1]),1),i=[n-1,r-1,1,1],a=performance.now(),o=typeof WorkerGlobalScope<`u`&&self instanceof WorkerGlobalScope,s,c;o?(s=new OffscreenCanvas(1,1),c=new OffscreenCanvas(n,r)):(s=document.createElement(`canvas`),s.width=1,s.height=1,c=document.createElement(`canvas`),c.width=n,c.height=r);let l=s.getContext(`2d`),u=c.getContext(`2d`);u&&(u.fillRect.apply(u,i),l.drawImage(c,n-1,r-1,1,1,0,0,1,1));let d=l&&l.getImageData(0,0,1,1).data[3]!==0,f=parseInt(performance.now()-a);return[s,c].forEach((e=>{e.height=0,e.width=0})),o?(postMessage({width:n,height:r,testTime:f,isTestPass:d}),!d&&e.sizes.length&&setTimeout((()=>{Os(e)}),0)):d?e.onSuccess({width:n,height:r,testTime:f}):(e.onError({width:n,height:r,testTime:f}),e.sizes.length&&setTimeout((()=>{Os(e)}),0)),d}var ks={area:[16384,14188,11402,11180,10836,8192,4096,1],height:[8388607,65535,32767,16384,8192,4096,1],width:[4194303,65535,32767,16384,8192,4096,1]},As={max:null,min:1,sizes:[],step:1024,useWorker:!1,onError:Function.prototype,onSuccess:Function.prototype},js={};function Ms(e){let t=e.width===e.height,n=e.height===1,r=e.width===1,i=[];if(!e.width||!e.height)e.sizes.forEach((e=>{let a=t||n?e:1,o=t||r?e:1;i.push([a,o])}));else{let a=e.min||As.min,o=e.step||As.step,s=Math.max(e.width,e.height);for(;s>=a;){let e=t||n?s:1,a=t||r?s:1;i.push([e,a]),s-=o}}return i}function Ns(e){let t=typeof window<`u`,n=t&&`Promise`in window,r=t&&`HTMLCanvasElement`in window,i=t&&`OffscreenCanvas`in window,a=URL.createObjectURL(new Blob([])).slice(-36),o=performance.now(),{onError:s,onSuccess:c,...l}=e,u=()=>parseInt(performance.now()-o),d=null;if(!r)return!1;if(e.useWorker&&i){let e=`\n            var canvasTest = ${Os.toString()};\n            onmessage = function(e) {\n                canvasTest(e.data);\n            };\n        `,t=new Blob([e],{type:`application/javascript`}),n=URL.createObjectURL(t);d=new Worker(n),URL.revokeObjectURL(n),d.onmessage=function(e){let{width:t,height:n,testTime:r,isTestPass:i}=e.data,o={width:t,height:n,testTime:r,totalTime:u()};i?(js[a].onSuccess(o),delete js[a]):js[a].onError(o)}}if(n)return new Promise((t=>{let n={...e,onError(n){let{width:r,height:i,testTime:a}=n,o={width:r,height:i,testTime:a,totalTime:u()},c;if(e.sizes.length===0)c=!0;else{let[[t,n]]=e.sizes.slice(-1);c=r===t&&i===n}s(o),c&&t({...o,success:!1})},onSuccess(e){let{width:n,height:r,testTime:i}=e,a={width:n,height:r,testTime:i,totalTime:u()};c(a),t({...a,success:!0})}};if(d){let{onError:e,onSuccess:t}=n;js[a]={onError:e,onSuccess:t},d.postMessage(l)}else Os(n)}));if(d)js[a]={onError:s,onSuccess:c},d.postMessage(l);else return Os(e)}var Ps={maxArea(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=Ms({width:e.max,height:e.max,min:e.min,step:e.step,sizes:[...ks.area]});return Ns({...As,...e,sizes:t})},maxHeight(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=Ms({width:1,height:e.max,min:e.min,step:e.step,sizes:[...ks.height]});return Ns({...As,...e,sizes:t})},maxWidth(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=Ms({width:e.max,height:1,min:e.min,step:e.step,sizes:[...ks.width]});return Ns({...As,...e,sizes:t})},test(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t={...As,...e};return t.sizes=[...t.sizes],t.width&&t.height&&(t.sizes=[[t.width,t.height]]),Ns(t)}},Fs={maxSide:4096,maxArea:16777216};async function Is(){try{let[e,t,n]=await Promise.all([Ps.maxArea(),Ps.maxWidth(),Ps.maxHeight()]);return e.success?{maxArea:e.width*e.height,maxSide:Math.max(Math.min(t.success?t.width:0,n.success?n.height:0),e.width)}:Fs}catch{return Fs}}function Ls(e,t,n){let r=Math.min(1,n.maxSide/Math.max(e,t),Math.sqrt(n.maxArea/(e*t)));return r>=1?{width:e,height:t,clamped:!1}:{width:Math.max(1,Math.floor(e*r)),height:Math.max(1,Math.floor(t*r)),clamped:!0}}var Rs=(()=>{let e=new Uint32Array(256);for(let t=0;t<256;t++){let n=t;for(let e=0;e<8;e++)n=n&1?3988292384^n>>>1:n>>>1;e[t]=n>>>0}return e})();function zs(e){let t=4294967295;for(let n of e)t=Rs[(t^n)&255]^t>>>8;return(t^4294967295)>>>0}function Bs(e){let t=Math.max(1980,e.getFullYear());return{time:e.getHours()<<11|e.getMinutes()<<5|e.getSeconds()>>1,date:t-1980<<9|e.getMonth()+1<<5|e.getDate()}}function Vs(e,t=new Date){let n=new TextEncoder,r=Bs(t),i=[],a=[],o=0;for(let t of e){let e=n.encode(t.name),s=zs(t.data),c=t.data.length,l=new DataView(new ArrayBuffer(30));l.setUint32(0,67324752,!0),l.setUint16(4,20,!0),l.setUint16(6,2048,!0),l.setUint16(8,0,!0),l.setUint16(10,r.time,!0),l.setUint16(12,r.date,!0),l.setUint32(14,s,!0),l.setUint32(18,c,!0),l.setUint32(22,c,!0),l.setUint16(26,e.length,!0),l.setUint16(28,0,!0),i.push(new Uint8Array(l.buffer),e,t.data);let u=new DataView(new ArrayBuffer(46));u.setUint32(0,33639248,!0),u.setUint16(4,20,!0),u.setUint16(6,20,!0),u.setUint16(8,2048,!0),u.setUint16(10,0,!0),u.setUint16(12,r.time,!0),u.setUint16(14,r.date,!0),u.setUint32(16,s,!0),u.setUint32(20,c,!0),u.setUint32(24,c,!0),u.setUint16(28,e.length,!0),u.setUint32(42,o,!0),a.push(new Uint8Array(u.buffer),e),o+=30+e.length+c}let s=a.reduce((e,t)=>e+t.length,0),c=new DataView(new ArrayBuffer(22));c.setUint32(0,101010256,!0),c.setUint16(8,e.length,!0),c.setUint16(10,e.length,!0),c.setUint32(12,s,!0),c.setUint32(16,o,!0);let l=[...i,...a,new Uint8Array(c.buffer)],u=new Uint8Array(l.reduce((e,t)=>e+t.length,0)),d=0;for(let e of l)u.set(e,d),d+=e.length;return u}function Hs(e){return new Blob([Vs(e)],{type:`application/zip`})}function Us(e){return String(Math.round(e*72/300*100)/100)}function Ws(e){if(e.length===0)throw Error(`A PDF needs at least one page`);let t=new TextEncoder,n=[],r=[],i=0,a=e=>{let r=typeof e==`string`?t.encode(e):e;n.push(r),i+=r.length},o=e=>{r[e]=i,a(`${e} 0 obj\n`)};a(`%PDF-1.4
`),a(new Uint8Array([37,226,227,207,211,10]));let s=e=>3+3*e;o(1),a(`<< /Type /Catalog /Pages 2 0 R >>
endobj
`),o(2),a(`<< /Type /Pages /Kids [${e.map((e,t)=>`${s(t)} 0 R`).join(` `)}] /Count ${e.length} >>\nendobj\n`),e.forEach((e,t)=>{let n=Us(e.width),r=Us(e.height),i=`q ${n} 0 0 ${r} 0 0 cm /Im0 Do Q\n`;o(s(t)),a(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${n} ${r}] /Resources << /XObject << /Im0 ${s(t)+2} 0 R >> >> /Contents ${s(t)+1} 0 R >>\nendobj\n`),o(s(t)+1),a(`<< /Length ${i.length} >>\nstream\n${i}endstream\nendobj\n`),o(s(t)+2),a(`<< /Type /XObject /Subtype /Image /Width ${e.width} /Height ${e.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${e.jpeg.length} >>\nstream\n`),a(e.jpeg),a(`
endstream
endobj
`)});let c=r.length,l=r.map((e,t)=>t===0?``:`${String(e).padStart(10,`0`)} 00000 n \n`),u=i;a(`xref\n0 ${c}\n0000000000 65535 f \n${l.join(``)}`),a(`trailer\n<< /Size ${c} /Root 1 0 R >>\nstartxref\n${u}\n%%EOF\n`);let d=new Uint8Array(i),f=0;for(let e of n)d.set(e,f),f+=e.length;return d}function Gs(e,t,n){return e.placements.map(({cell:r})=>{let i=Math.round(r.x/e.width*t),a=Math.round(r.y/e.height*n),o=Math.round((r.x+r.w)/e.width*t),s=Math.round((r.y+r.h)/e.height*n);return{x:i,y:a,w:o-i,h:s-a}})}function Ks(e,t,n){return e<=0?0:Math.max(1,Math.round(e*Math.max(t,n)))}function qs(e,t,n,r){let i=Math.min(1,Math.max(n/e,r/t));return{width:Math.max(1,Math.ceil(e*i)),height:Math.max(1,Math.ceil(t*i))}}var Js={slight:.08,rounded:.25};function Ys(e,t,n){return e===`slight`||e===`rounded`?Math.min(t,n)*Js[e]:0}function Xs(e,t,n,r,i=!0){let a=Math.floor(r/2),o=r-a,s=i?r:0,c=e.x<=0?s:o,l=e.y<=0?s:o,u=e.x+e.w>=t?s:a,d=e.y+e.h>=n?s:a,f=e.w-c-u,p=e.h-l-d;return{x:f>0?e.x+c:e.x+e.w/2,y:p>0?e.y+l:e.y+e.h/2,w:Math.max(0,f),h:Math.max(0,p)}}var Zs={topLeft:!1,topRight:!1,bottomRight:!1,bottomLeft:!1};function Qs(e,t,n,r){if(r)return Zs;let i=e.x<=0,a=e.y<=0,o=e.x+e.w>=t,s=e.y+e.h>=n;return{topLeft:i||a,topRight:o||a,bottomRight:o||s,bottomLeft:i||s}}function $s(e,t,n,r=Zs){e.beginPath();let i=Ys(n,t.w,t.h);if(i<=0){e.rect(t.x,t.y,t.w,t.h);return}let a=r.topLeft?0:i,o=r.topRight?0:i,s=r.bottomRight?0:i,c=r.bottomLeft?0:i,l=t.x+t.w,u=t.y+t.h;e.moveTo(t.x+a,t.y),e.lineTo(l-o,t.y),o>0?e.arcTo(l,t.y,l,t.y+o,o):e.lineTo(l,t.y),e.lineTo(l,u-s),s>0?e.arcTo(l,u,l-s,u,s):e.lineTo(l,u),e.lineTo(t.x+c,u),c>0?e.arcTo(t.x,u,t.x,u-c,c):e.lineTo(t.x,u),e.lineTo(t.x,t.y+a),a>0?e.arcTo(t.x,t.y,t.x+a,t.y,a):e.lineTo(t.x,t.y),e.closePath()}function ec(e,t,n,r){e.fillStyle=r!==void 0&&r.corners!==`none`?r.color:`#ffffff`,e.fillRect(0,0,t,n)}function tc(e,t,n,r,i,a,o,s,c){if(s.corners===`none`){nc(e,t,n,r,i,c);return}let l=Xs(i,a,o,s.border,s.outer);l.w<=0||l.h<=0||(e.save(),$s(e,l,s.corners,Qs(i,a,o,s.outer)),e.clip(),nc(e,t,n,r,l,c),e.restore())}function nc(e,t,n,r,i,a){if(i.w<=0||i.h<=0)return;let{w:o,h:s,spareX:c,spareY:l}=qo(n,r,i.w,i.h,a?.zoom);e.save(),e.beginPath(),e.rect(i.x,i.y,i.w,i.h),e.clip(),e.imageSmoothingEnabled=!0,e.imageSmoothingQuality=`high`,e.drawImage(t,i.x-c*(a?.x??.5),i.y-l*(a?.y??.5),o,s),e.restore()}function rc(e,t,n,r,i,a){if(i<=0)return;e.save(),e.beginPath(),e.rect(0,0,n,r),e.clip(),e.fillStyle=a;let o=Math.floor(i/2);for(let a of t)a.x>0&&e.fillRect(a.x-o,a.y-o,i,a.h+i),a.y>0&&e.fillRect(a.x-o,a.y-o,a.w+i,i),a.x+a.w<n&&e.fillRect(a.x+a.w-o,a.y-o,i,a.h+i),a.y+a.h<r&&e.fillRect(a.x-o,a.y+a.h-o,a.w+i,i);e.restore()}function ic(e,t,n,r,i){let{border:a,color:o}=i;a<=0||i.corners!==`none`||(rc(e,t,n,r,a,o),i.outer&&(e.fillStyle=o,e.fillRect(0,0,n,a),e.fillRect(0,r-a,n,a),e.fillRect(0,0,a,r),e.fillRect(n-a,0,a,r)))}function ac(e){return e===`png`?`image/png`:`image/jpeg`}function oc(e){return e===`jpeg`?`jpg`:e}async function sc(e,t,n){let r=await Promise.all(e.map(async e=>({jpeg:new Uint8Array(await e.arrayBuffer()),width:t,height:n})));return new Blob([Ws(r)],{type:`application/pdf`})}async function cc(e){let t=await lc(e),{settings:n}=e,r=n.splitImages;if(r<2){let e=t[0];return n.format===`pdf`?sc([e],n.width,n.height):e}let i=Eo(e.baseName??`collage`,r,oc(n.format===`pdf`?`jpeg`:n.format));return Hs(await Promise.all(t.map(async(e,t)=>({name:i[t],data:new Uint8Array(await e.arrayBuffer())}))))}async function lc(e){let{layout:t,photos:n,settings:r,pool:i,signal:a,onProgress:o}=e,{width:s,height:c}=r,l=new OffscreenCanvas(s,c),u=l.getContext(`2d`);if(!u)throw Error(`2D canvas is not available`);let d={corners:r.cornerStyle,border:Ks(r.borderWidth,s,c),color:r.borderColor,outer:r.outerBorder},f=Gs(t,s,c);ec(u,s,c,d);let p=()=>i.terminate();a?.aborted&&p(),a?.addEventListener(`abort`,p,{once:!0});try{let e=0;if(o?.(0,f.length),await Promise.all(t.placements.map(async(t,r)=>{let a=n[t.photoIndex],l=f[r];if(!a||!l)return;let p=Math.max(1,a.crop?.zoom??1),m=qs(a.width,a.height,l.w*p,l.h*p),h=await i.run({kind:`cell`,file:a.file,...m});if(!h.ok||h.kind!==`cell`)throw Error(h.ok?`unexpected response`:h.error);try{tc(u,h.bitmap,h.bitmap.width,h.bitmap.height,l,s,c,d,a.crop)}finally{h.bitmap.close()}o?.(++e,f.length)})),a?.aborted)throw new DOMException(`Cancelled`,`AbortError`);ic(u,f,s,c,d);let p={type:ac(r.format),quality:r.format===`png`?void 0:r.jpegQuality},m=r.splitImages;if(m<2)return[await l.convertToBlob(p)];let h=[];for(let e of To(m,c)){if(a?.aborted)throw new DOMException(`Cancelled`,`AbortError`);let t=new OffscreenCanvas(e.w,e.h),n=t.getContext(`2d`);if(!n)throw Error(`2D canvas is not available`);n.drawImage(l,e.x,e.y,e.w,e.h,0,0,e.w,e.h),h.push(await t.convertToBlob(p))}return h}finally{a?.removeEventListener(`abort`,p)}}async function uc(e){let{layout:t,stem:n,ext:r,onlyPage:i}=e,a=mo(t),o=i===void 0?a:a.filter(e=>e===i),s=(t.pages??[]).map((e,t)=>t),c=i===void 0?s.filter(e=>!a.includes(e)):[];if(o.length===0)return{file:null,skipped:c,images:0};let l=e.settings.splitImages>1,u=t.pages?.length??1,d=e=>String(e).padStart(String(u).length,`0`),f=e.settings.format===`pdf`&&!l,p=[],m=[];for(let[i,a]of o.entries()){let s=await lc({layout:po(t,a),photos:e.photos,settings:e.settings,pool:e.pool,signal:e.signal,onProgress:(t,n)=>e.onProgress?.((i+(n?t/n:1))/o.length)});if(f)p.push(s[0]);else if(l){let e=Eo(`${n}_p${d(a+1)}`,s.length,r);for(let[t,n]of s.entries())m.push({name:e[t],blob:n})}else m.push({name:``,blob:s[0]})}if(f){let t=i===void 0?n:`${n}_page-${(o[0]??0)+1}`,{width:r,height:a}=e.settings;return{file:{name:`${t}.pdf`,blob:await sc(p,r,a)},skipped:c,images:p.length}}if(!l){let e=ho(n,m.length,r);m.forEach((t,n)=>{t.name=e[n]})}let h=m[0];if(m.length===1&&h)return{file:{name:`${i===void 0?n:`${n}_page-${(o[0]??0)+1}`}.${r}`,blob:h.blob},skipped:c,images:1};let g=await Promise.all(m.map(async e=>({name:e.name,data:new Uint8Array(await e.blob.arrayBuffer())})));return{file:{name:`${n}.zip`,blob:Hs(g)},skipped:c,images:m.length}}var dc=class{size;workers=[];idle=[];queue=[];running=new Map;nextId=1;terminated=!1;readyCount=0;resolveReady=()=>{};ready=new Promise(e=>{this.resolveReady=e});constructor(e=fc()){this.size=e;for(let t=0;t<e;t++){let t=new Worker(new URL(new URL(`export.worker-DmYFRvHx.js`,import.meta.url).href,``+import.meta.url),{type:`module`});t.onmessage=n=>{n.data.kind===`ready`?++this.readyCount===e&&this.resolveReady():this.onDone(t,n.data)},t.onerror=e=>this.onCrash(t,e.message),this.workers.push(t),this.idle.push(t)}}run(e){return this.terminated?Promise.reject(new DOMException(`Pool terminated`,`AbortError`)):new Promise((t,n)=>{this.queue.push({req:e,resolve:t,reject:n}),this.pump()})}terminate(){this.terminated=!0;let e=new DOMException(`Cancelled`,`AbortError`);for(let t of this.queue)t.reject(e);for(let{job:t}of this.running.values())t.reject(e);this.queue=[],this.running.clear();for(let e of this.workers)e.terminate();this.workers=[],this.idle=[]}pump(){for(;this.idle.length&&this.queue.length;){let e=this.idle.pop(),t=this.queue.shift(),n=this.nextId++;this.running.set(e,{id:n,job:t}),e.postMessage({...t.req,id:n})}}onDone(e,t){let n=this.running.get(e);n&&n.id===t.id&&(this.running.delete(e),this.idle.push(e),n.job.resolve(t),this.pump())}onCrash(e,t){let n=this.running.get(e);n&&(this.running.delete(e),this.idle.push(e),n.job.reject(Error(t||`Worker error`)),this.pump())}};function fc(){return Math.max(2,Math.min(4,navigator.hardwareConcurrency||2))}function pc(e,t,n,r){let i=Math.min(n/e,r/t);return{width:Math.max(1,Math.floor(e*i)),height:Math.max(1,Math.floor(t*i))}}function mc(e,t,n,r){let{layout:i}=r;return i.pages?hc(e,t,n,r):gc(e,t,n,r)}function hc(e,t,n,r){let{layout:i}=r,a=Array(i.placements.length);return(i.pages??[]).forEach((o,s)=>{let c=Math.round(o.x*t),l=Math.max(1,Math.round((o.x+o.w)*t)-c),u=i.placements.flatMap((e,t)=>e.page===s?[t]:[]);e.save(),e.translate(c,0),e.beginPath(),e.rect(0,0,l,n),e.clip();let d=gc(e,l,n,{...r,layout:po(i,s)});e.restore(),d.forEach((e,t)=>{let n=u[t];n!==void 0&&(a[n]={x:e.x+c,y:e.y,w:e.w,h:e.h})})}),a}function gc(e,t,n,{layout:r,thumbs:i,crops:a,settings:o}){let s={corners:o.cornerStyle,border:Ks(o.borderWidth,t,n),color:o.borderColor,outer:o.outerBorder},c=Gs(r,t,n);return ec(e,t,n,s),r.placements.forEach((r,o)=>{let l=i[r.photoIndex],u=c[o],d=a?.[r.photoIndex];l&&u&&tc(e,l,l.width,l.height,u,t,n,s,d)}),ic(e,c,t,n,s),c}function _c(e,t,n){e.save(),e.strokeStyle=n,e.lineWidth=4,e.strokeRect(t.x+2,t.y+2,t.w-4,t.h-4),e.restore()}var vc=3,yc=36,bc=10;function xc(e,t){e.save(),e.scale(t,t),e.lineWidth=1.2,e.setLineDash([]),e.beginPath(),e.moveTo(-2.6,-3),e.lineTo(2.4,7),e.moveTo(2.6,-3),e.lineTo(-2.4,7),e.stroke();for(let t of[-3.4,3.4])e.beginPath(),e.arc(t,-5.4,2.3,0,Math.PI*2),e.stroke();e.restore()}function Sc(e,t,n,r,i,a){let o=wo(t.w,n);if(o.length===0)return;e.save(),e.strokeStyle=i,e.fillStyle=i,e.lineWidth=Math.max(1,r),e.lineCap=`butt`;for(let n of o){let i=Math.round(t.x+n)+.5;for(let n of[!0,!1]){let a=n?t.y-vc*r:t.y+t.h+vc*r,o=n?-1:1;e.setLineDash([4*r,3*r]),e.beginPath(),e.moveTo(i,a),e.lineTo(i,a+o*bc*r),e.moveTo(i,a+o*26*r),e.lineTo(i,a+o*yc*r),e.stroke(),e.save(),e.translate(i,a+o*18*r),n||e.rotate(Math.PI),xc(e,r),e.restore()}}let s=o[0],c=Math.round(t.x+s)+8*r,l=t.x+t.w-c;e.font=`${12*r}px system-ui, sans-serif`,e.measureText(a).width<=l&&(e.textAlign=`left`,e.textBaseline=`alphabetic`,e.fillText(a,c,t.y-44*r)),e.restore()}var Cc={zoom:1,panX:0,panY:0},wc=.5,Tc=48;function Ec(e){return Number.isFinite(e)?Math.min(8,Math.max(wc,e)):1}function Dc(e){return e.zoom===1&&e.panX===0&&e.panY===0}function Oc(e,t){return{w:e.w*t.zoom,h:e.h*t.zoom}}function kc(e,t,n){let r=Oc(t,n);return{x:(e.w-r.w)/2+n.panX,y:(e.h-r.h)/2+n.panY}}function Ac(e,t,n){let r=Oc(n,e),i=Math.min(Tc,r.w/2,t.w/2),a=Math.min(Tc,r.h/2,t.h/2),o=i-r.w-(t.w-r.w)/2,s=t.w-i-(t.w-r.w)/2,c=a-r.h-(t.h-r.h)/2,l=t.h-a-(t.h-r.h)/2;return{zoom:e.zoom,panX:Math.min(s,Math.max(o,e.panX)),panY:Math.min(l,Math.max(c,e.panY))}}function jc(e,t,n,r,i){return Ac({...e,panX:e.panX+t,panY:e.panY+n},r,i)}function Mc(e,t,n,r,i){let a=Ec(e.zoom*t),o=Oc(i,e),s=kc(r,i,e),c=(n.x-s.x)/o.w,l=(n.y-s.y)/o.h,u=Oc(i,{...e,zoom:a}),d=n.x-c*u.w,f=n.y-l*u.h;return Ac({zoom:a,panX:d-(r.w-u.w)/2,panY:f-(r.h-u.h)/2},r,i)}function Nc(e){return Math.round(e.zoom*100)}var Pc=`collage-creator.language`,Fc=`collage-web.language`;function Ic(){try{return localStorage.getItem(Pc)??localStorage.getItem(Fc)}catch{return null}}function Lc(){try{let e=navigator.languages;return e?.length?e:navigator.language?[navigator.language]:[]}catch{return[]}}function Rc(e){try{localStorage.setItem(Pc,e)}catch{}}function zc(e,t){let n=URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.download=t,document.body.append(r),r.click(),r.remove(),setTimeout(()=>URL.revokeObjectURL(n),6e4)}var Bc=1e4;function Vc(e){if(e.length===0)return null;let t=t=>e.filter(e=>e.reason===t).length,n=t(`duplicate`),r=t(`not-image`),i=t(`unreadable`),a=[];return n&&a.push(J(`%(n)s already added`,{n})),r&&a.push(J(`%(n)s not an image`,{n:r})),i&&a.push(J(`%(n)s could not be opened`,{n:i})),{summary:e.length===1?J(`1 file was not added`):J(`%(n)s files were not added`,{n:e.length}),reasons:a.join(`, `),items:e.map(e=>{let t=e.reason===`duplicate`?J(`already added`):e.reason===`not-image`?J(`not an image`):J(`could not be opened`);return`${e.name}: ${t}`}),kind:n===e.length?`info`:`error`}}function Hc(e){let t=[];return e?.columns===2&&t.push(J(`wider`)),e&&e.rows>1&&t.push(`${J(`taller`)} ×${e.rows}`),t.join(` · `)}function Uc(e){let t=e.pageCount>1;return{v:1,photos:e.photos.map(e=>({key:ts(e.file),span:e.span??{...Ho},...e.crop?{crop:e.crop}:{},...t&&e.bookPage!==void 0?{page:e.bookPage}:{}})),seed:e.seed,columns:e.columns,layoutStyle:e.layoutStyle,...t?{book:{pages:e.pageCount,perPage:6}}:{},settings:e.settings}}function Wc(e,t){let n=new Map(t.map(e=>[e.key,e]));return e.map(e=>{let t=n.get(ts(e.file));return{...e,span:{...t?.span??Ho},...t?.crop?{crop:t.crop}:{},...t?.page===void 0?{}:{bookPage:t.page}}})}var Gc=`seed`,Kc=4294967295;function qc(e){let t=new URLSearchParams(e).get(Gc);if(t===null||!/^\d{1,10}$/.test(t))return;let n=Number(t);return n<=Kc?n:void 0}function Jc(e,t){let n=new URL(e);return n.searchParams.set(Gc,String(t)),n.toString()}var Yc=6e3,Q=new class{#e=P([]);get photos(){return H(this.#e)}set photos(e){F(this.#e,e)}#t=P(Gt(qc(location.search)??xa()));get seed(){return H(this.#t)}set seed(e){F(this.#t,e,!0)}#n=P(void 0);get columns(){return H(this.#n)}set columns(e){F(this.#n,e,!0)}#r=P(`mosaic`);get layoutStyle(){return H(this.#r)}set layoutStyle(e){F(this.#r,e,!0)}#i=P(1);get pageCount(){return H(this.#i)}set pageCount(e){F(this.#i,e,!0)}#a=M(()=>this.pageCount>1);get book(){return H(this.#a)}set book(e){F(this.#a,e)}#o=P(null);get posterBox(){return H(this.#o)}set posterBox(e){F(this.#o,e)}#s=P(null);get page(){return H(this.#s)}set page(e){F(this.#s,e)}#c=P(0);get pageRev(){return H(this.#c)}set pageRev(e){F(this.#c,e,!0)}#l=P(Gt({width:1600,height:1200,borderWidth:.005,borderColor:`#ffffff`,cornerStyle:`none`,outerBorder:!0,splitImages:0,format:`png`,jpegQuality:.92}));get settings(){return H(this.#l)}set settings(e){F(this.#l,e,!0)}#u=P(!1);get customSize(){return H(this.#u)}set customSize(e){F(this.#u,e,!0)}#d=P(!1);get portrait(){return H(this.#d)}set portrait(e){F(this.#d,e,!0)}#f=P(Fs);get limits(){return H(this.#f)}set limits(e){F(this.#f,e)}#p=P(``);get sizeNote(){return H(this.#p)}set sizeNote(e){F(this.#p,e,!0)}#m=P(0);get sizeEpoch(){return H(this.#m)}set sizeEpoch(e){F(this.#m,e,!0)}#h=P(0);get restoreEpoch(){return H(this.#h)}set restoreEpoch(e){F(this.#h,e,!0)}#g=P(`photos`);get tab(){return H(this.#g)}set tab(e){F(this.#g,e,!0)}#_=P(!1);get sheetOpen(){return H(this.#_)}set sheetOpen(e){F(this.#_,e,!0)}#v=P(!1);get menuOpen(){return H(this.#v)}set menuOpen(e){F(this.#v,e,!0)}#y=P(0);get riseToken(){return H(this.#y)}set riseToken(e){F(this.#y,e,!0)}#b=P(!1);get narrow(){return H(this.#b)}set narrow(e){F(this.#b,e,!0)}#x=P(`pan`);get mode(){return H(this.#x)}set mode(e){F(this.#x,e,!0)}#S=P(null);get selected(){return H(this.#S)}set selected(e){F(this.#S,e,!0)}#C=P(!1);get arrangedByHand(){return H(this.#C)}set arrangedByHand(e){F(this.#C,e,!0)}#w=P(new Set);get alsoSelected(){return H(this.#w)}set alsoSelected(e){F(this.#w,e)}#T=P(null);get cropFor(){return H(this.#T)}set cropFor(e){F(this.#T,e,!0)}#E=P(0);get revealToken(){return H(this.#E)}set revealToken(e){F(this.#E,e,!0)}#D=P(0);get focused(){return H(this.#D)}set focused(e){F(this.#D,e,!0)}#O=P(Cc);get view(){return H(this.#O)}set view(e){F(this.#O,e)}#k=P(Gt({w:0,h:0}));get viewport(){return H(this.#k)}set viewport(e){F(this.#k,e,!0)}#A=P(!1);get spaceHeld(){return H(this.#A)}set spaceHeld(e){F(this.#A,e,!0)}#j=P(!1);get canvasFocused(){return H(this.#j)}set canvasFocused(e){F(this.#j,e,!0)}#M=P(!1);get focusRing(){return H(this.#M)}set focusRing(e){F(this.#M,e,!0)}#N=P(null);get removed(){return H(this.#N)}set removed(e){F(this.#N,e)}removedPageCount=null;#P=P(``);get status(){return H(this.#P)}set status(e){F(this.#P,e,!0)}#F=P([]);get messages(){return H(this.#F)}set messages(e){F(this.#F,e)}#I=P(null);get notice(){return H(this.#I)}set notice(e){F(this.#I,e)}#L=P(!1);get noticeDetailsOpen(){return H(this.#L)}set noticeDetailsOpen(e){F(this.#L,e,!0)}#R=P(null);get restoring(){return H(this.#R)}set restoring(e){F(this.#R,e,!0)}#z=P(Gt(ea()));get lang(){return H(this.#z)}set lang(e){F(this.#z,e,!0)}#B=P(null);get dialog(){return H(this.#B)}set dialog(e){F(this.#B,e,!0)}#V=P(null);get confirming(){return H(this.#V)}set confirming(e){F(this.#V,e)}#H=P(0);get progress(){return H(this.#H)}set progress(e){F(this.#H,e,!0)}#U=P(null);get confirmState(){return H(this.#U)}set confirmState(e){F(this.#U,e,!0)}#W=P(null);get lastSave(){return H(this.#W)}set lastSave(e){F(this.#W,e)}#G=P(!1);get persistReady(){return H(this.#G)}set persistReady(e){F(this.#G,e,!0)}importPool=new dc(2);exportPool=new dc;#K=M(()=>this.photos.length>0);get hasPhotos(){return H(this.#K)}set hasPhotos(e){F(this.#K,e)}#q=M(()=>(this.pageRev,this.page?this.page.toLayout():null));get layout(){return H(this.#q)}set layout(e){F(this.#q,e)}#J=M(()=>(this.pageRev,this.page?.noCols));get columnsInUse(){return H(this.#J)}set columnsInUse(e){F(this.#J,e)}#Y=M(()=>this.layout?Math.round(Ya(this.layout,this.photos).cutOff*100):0);get cropPercent(){return H(this.#Y)}set cropPercent(e){F(this.#Y,e)}#X=M(()=>this.selected===null?void 0:this.photos[this.selected]);get selectedPhoto(){return H(this.#X)}set selectedPhoto(e){F(this.#X,e)}#Z=M(()=>this.settings.splitImages>1);get isSplit(){return H(this.#Z)}set isSplit(e){F(this.#Z,e)}#Q=M(()=>this.selectedPhoto?.bookPage??0);get selectedPage(){return H(this.#Q)}set selectedPage(e){F(this.#Q,e)}#$=M(()=>{if(this.selected===null)return[];let e=this.alsoSelected,t=this.photos.flatMap((t,n)=>n!==this.selected&&e.has(t.id)?[n]:[]);return[this.selected,...t]});get selection(){return H(this.#$)}set selection(e){F(this.#$,e)}#ee=M(()=>this.selection.length>1);get multiSelected(){return H(this.#ee)}set multiSelected(e){F(this.#ee,e)}#te=M(()=>io(this.photos.map(e=>e.bookPage??0),this.pageCount));get pageCounts(){return H(this.#te)}set pageCounts(e){F(this.#te,e)}#ne=M(()=>{if(this.isSplit)return`post`;let e=jo(this.settings.width,this.settings.height);return this.customSize||!e?`custom`:e.choice.id});get activeSize(){return H(this.#ne)}set activeSize(e){F(this.#ne,e)}#re=M(()=>this.spaceHeld?`pan`:this.mode);get activeMode(){return H(this.#re)}set activeMode(e){F(this.#re,e)}#ie=M(()=>this.photos.map(e=>e.colour));get photoColours(){return H(this.#ie)}set photoColours(e){F(this.#ie,e)}statusTimer;noticeTimer;sizeTimer;pendingSize=null;restoringDone=Promise.resolve();fileInput=null;replaceUrl=!0;persistWarned=!1;get ratio(){return this.settings.height/this.settings.width}addMessage(e){this.messages=[...this.messages,e].slice(-8)}clearMessages(){this.messages=[]}setStatus(e){this.status=e,clearTimeout(this.statusTimer),e&&(this.statusTimer=setTimeout(()=>{this.status=``},Yc))}hideNotice(){clearTimeout(this.noticeTimer),this.notice=null,this.noticeDetailsOpen=!1}showNotice(e){this.hideNotice(),this.notice=Vc(e),this.notice?.kind===`info`&&(this.noticeTimer=setTimeout(()=>this.hideNotice(),Bc))}initLanguage(){let e=Ic(),t=e?Zi(e):Qi(Lc());this.lang=$i(t),document.documentElement.lang=this.lang.replace(`_`,`-`)}chooseLanguage(e){this.lang=$i(e),Rc(this.lang),document.documentElement.lang=this.lang.replace(`_`,`-`)}closeMenu(){this.menuOpen=!1}setTab(e,t){let n=this.narrow,r=!n&&e===`save`?`photos`:e,i=this.sheetOpen,a=this.tab,o=n&&t&&i&&this.tab===r,s=n&&!o&&(t||i);this.tab=r,this.sheetOpen=s,s&&(this.closeMenu(),r===a&&i||this.riseToken++)}relayout(e=`single`,t=!1){if(t||this.clearSelection(),this.arrangedByHand=!1,this.focused=0,this.photos.length===0)this.page=null;else if(this.book){let t=this.photos.map(e=>e.bookPage??0);if(e===`search`){let e=this.layoutStyle===`gallery`?10:30,n=fo(this.layoutStyle,this.photos,t,this.pageCount,this.ratio,xa(),e,{columns:this.columns});this.page=n.page,this.seed=n.seed}else this.page=uo(this.layoutStyle,this.photos,t,this.pageCount,this.ratio,this.seed,{columns:this.columns})}else if(e===`search`){let e=$a(this.layoutStyle,this.photos,this.ratio,xa(),{columns:this.columns});this.page=e.page,this.seed=e.seed}else this.page=Qa(this.layoutStyle,this.photos,this.ratio,ya(this.seed),{columns:this.columns});this.pageRev++,this.status=``,this.syncUrl()}reshape(){this.page?.setTargetRatio(this.ratio),this.pageRev++}shuffle(){this.seed=xa(),this.relayout()}askShuffle(e){let t=()=>e?this.shufflePages():this.shuffle();this.arrangedByHand?this.confirm({title:J(`Shuffle and lose your changes?`),text:J(`You swapped or moved photos by hand. Shuffling arranges them again.`),action:J(`Shuffle`),run:t}):t()}setSeed(e){let t=Math.floor(e);return!Number.isFinite(t)||t<0||t>4294967295?!1:(this.seed=t,this.relayout(),!0)}chooseLayout(e){this.layoutStyle!==e&&(this.layoutStyle=e,this.relayout(`search`))}get rowSize(){if(!this.book)return{w:this.settings.width,h:this.settings.height};let e=this.pageCount;return{w:(e+(e-1)*eo)*this.settings.width,h:this.settings.height}}withPages(e,t){let n=io(t.map(e=>e.bookPage??0),Math.max(1,this.pageCount));return e.map(e=>{if(e.bookPage!==void 0&&e.bookPage<this.pageCount)return n[e.bookPage]=(n[e.bookPage]??0)+1,e;let t=Math.max(0,this.pageCount-1);return n[t]=(n[t]??0)+1,{...e,bookPage:t}})}get maxPages(){return 20}setPages(e,t=this.pageCount){this.pageCount=t,this.photos=this.photos.map((t,n)=>({...t,bookPage:e[n]??0}))}addPage(){this.pageCount>=20||(this.page&&!this.book&&(this.page=lo.wrap(this.page,this.photos.length,this.ratio),this.photos=this.photos.map(e=>({...e,bookPage:0}))),this.pageCount++,this.page?.addPage(),this.pageRev++,this.isFit||this.fitView(),this.setStatus(J(`Added page %(n)s.`,{n:this.pageCount})))}askRemovePage(e){!this.book||e<0||e>=this.pageCount||this.confirm({title:J(`Remove page %(n)s?`,{n:e+1}),text:this.pageCounts[e]?J(`Its photos move to a neighbouring page. The page's own arrangement is lost.`):J(`This page is empty.`),action:J(`Remove page`),run:()=>this.removePage(e)})}confirm(e){this.confirming=e,this.confirmState=`pending`,this.dialog=`confirm`}get pendingQuestion(){return this.dialog===`confirm`&&this.confirming?this.confirming.title:null}get confirmationOutcome(){return this.confirmState===`confirmed`?`confirmed`:this.confirmState===`pending`&&this.dialog!==`confirm`?`cancelled`:null}confirmed(){let e=this.confirming?.run;this.confirmState=`confirmed`,this.dialog=null,this.confirming=null,e?.()}removePage(e){if(!this.book||this.pageCount<=1||e<0||e>=this.pageCount)return;let t=co(this.photos.map(e=>e.bookPage??0),e);this.setPages(t,this.pageCount-1),this.relayout(`single`,!1),this.setStatus(J(`Removed page %(n)s; its photos moved to a neighbouring page.`,{n:e+1}))}movePage(e,t){let n=e+t;!this.book||e<0||n<0||e>=this.pageCount||n>=this.pageCount||(this.setPages(so(this.photos.map(e=>e.bookPage??0),e,n)),this.page?.movePage(e,n),this.pageRev++,this.setStatus(J(`Moved page %(a)s to place %(b)s.`,{a:e+1,b:n+1})))}setPageCount(e){let t=no(e);if(t===this.pageCount)return;t>1&&!this.book&&this.addPage();let n=ao(this.photos.length,t);this.setPages(n.pageOf,t),this.relayout(`search`),this.setStatus(J(`Photos shared evenly across %(n)s page(s).`,{n:t}))}shufflePages(){if(!this.book)return;let e=oo(this.photos.map(e=>e.bookPage??0),ya(xa()));this.setPages(e),this.relayout(`search`),this.setStatus(J(`Photos shuffled between pages.`))}moveSelectedToPage(e){let t=this.selection.flatMap(e=>this.photos[e]?.id??[]);this.movePhotosToPage(t,e)}movePhotosToPage(e,t){if(!this.book||t<0||t>=this.pageCount)return;let n=new Set(e),r=this.selection.flatMap(e=>this.photos[e]?.id??[]),i=this.selectedPhoto?.id,a=this.photos.filter(e=>n.has(e.id)&&(e.bookPage??0)!==t).map(e=>({...e,bookPage:t}));if(a.length===0)return;let o=new Set(a.map(e=>e.id)),s=this.photos.filter(e=>!o.has(e.id)),c=0;if(s.forEach((e,n)=>{(e.bookPage??0)<=t&&(c=n+1)}),s.splice(c,0,...a),this.photos=s,this.relayout(`single`,!1),this.arrangedByHand=!0,i!==void 0){let e=s.findIndex(e=>e.id===i);this.selected=e>=0?e:null,this.alsoSelected=new Set(r.filter(e=>e!==i))}this.setStatus(a.length===1?J(`Moved %(name)s to page %(n)s.`,{name:a[0]?.name??``,n:t+1}):J(`Moved %(count)s photos to page %(n)s.`,{count:a.length,n:t+1}))}setColumns(e){e!==this.columns&&(this.columns=e,this.relayout())}stepColumns(e){let t=this.columns??this.page?.noCols??1;this.setColumns(Aa(t+e))}syncUrl(){try{let e=Jc(location.href,this.seed);if(e===location.href)return;this.replaceUrl?history.replaceState(null,``,e):history.pushState(null,``,e)}catch{}}onPopState(){let e=qc(location.search);e!==void 0&&e!==this.seed&&(this.seed=e,this.relayout())}async persist(){let e=new Map(this.photos.map(e=>[ts(e.file),e.file]));try{await ds(Uc({photos:this.photos,pageCount:this.pageCount,seed:this.seed,columns:this.columns,layoutStyle:this.layoutStyle,settings:ze(this.settings)}),e)}catch{if(this.persistWarned)return;this.persistWarned=!0,this.addMessage({kind:`error`,text:J(`Your work could not be kept for next time: browser storage is unavailable or full.`)})}}async restore(){this.restoring={done:0,total:0};try{let e=await fs(this.settings);if(e){Object.assign(this.settings,e.session.settings),this.columns=e.session.columns,this.layoutStyle=e.session.layoutStyle??`mosaic`;let t=e.session.book;this.pageCount=t?.pages??1,this.restoreEpoch++;let n=e.session.photos.map(t=>e.files.get(t.key)).filter(e=>e!==void 0);this.restoring={done:0,total:n.length};let r=await rs(n,[],this.importPool,e=>this.addMessage(e),(e,t)=>{this.restoring={done:e,total:t}});this.photos=Wc(r,e.session.photos),this.seed=qc(location.search)??e.session.seed,this.applySize(this.settings.width,this.settings.height),this.relayout()}}catch{}finally{this.restoring=null,this.persistReady=!0,this.replaceUrl=!1}}start(){this.initLanguage(),this.relayout(),this.restoringDone=this.restore(),Promise.all([this.importPool.ready,this.exportPool.ready]).then(()=>{document.documentElement.dataset.workersReady=`true`}),Is().then(e=>{this.limits=e,this.applySize(this.settings.width,this.settings.height)})}fitPoster(e=this.viewport,t=!1){let n=this.narrow?12:88,r=this.narrow?104:72,i=(this.settings.splitImages>1?112:0)+(this.book&&!t?96:0),a=t?{w:this.settings.width,h:this.settings.height}:this.rowSize,o=pc(a.w,a.h,Math.max(160,e.w-2*n),Math.max(160,e.h-2*r-i));return{w:o.width,h:o.height}}get isFit(){return Dc(this.view)}get zoomPercent(){return Nc(this.view)}zoomAtCentre(e){let t=this.viewport,n={x:t.w/2,y:t.h/2};this.view=Mc(this.view,e,n,t,this.fitPoster(t))}zoomAtPoint(e,t){this.view=Mc(this.view,e,t,this.viewport,this.fitPoster(this.viewport))}panBy(e,t){this.view=jc(this.view,e,t,this.viewport,this.fitPoster(this.viewport))}fitView(){this.view=Cc}setMode(e){e!==this.mode&&this.deselect(),this.mode=e,this.status=``,clearTimeout(this.statusTimer)}setSpaceHeld(e){this.spaceHeld=e}selectPhoto(e){let t=this.photos[e];t&&(this.cropFor!==e&&(this.cropFor=null),this.multiSelected?(this.alsoSelected=new Set,this.selected=e,this.setStatus(J(`Selected %(name)s.`,{name:t.name}))):this.selected===e?(this.selected=null,this.setStatus(``)):(this.selected=e,this.setStatus(J(`Selected %(name)s.`,{name:t.name}))))}selectMany(e){let t=[...new Set(e)].filter(e=>this.photos[e]);this.cropFor=null;let[n,...r]=t;if(n===void 0){this.deselect();return}this.selected=n,this.alsoSelected=new Set(r.flatMap(e=>this.photos[e]?.id??[]));let i=t.length;this.setStatus(i>1?J(`%(n)s photos selected.`,{n:i}):J(`Selected %(name)s.`,{name:this.photos[n]?.name??``}))}toggleSelected(e){let t=this.photos[e];if(!t)return;if(this.selected===null){this.selectPhoto(e);return}this.cropFor=null;let n=new Set(this.alsoSelected);if(e===this.selected){let e=this.selection[1];this.selected=e??null;let t=e===void 0?void 0:this.photos[e];t&&n.delete(t.id)}else n.has(t.id)?n.delete(t.id):n.add(t.id);this.alsoSelected=n;let r=this.selection.length;this.setStatus(r>1?J(`%(n)s photos selected.`,{n:r}):``)}clearSelection(){this.selected=null,this.cropFor=null,this.alsoSelected.size>0&&(this.alsoSelected=new Set)}selectInPhotos(e,t=!1){t?this.toggleSelected(e):this.selectPhoto(e),this.selection.includes(e)&&!this.narrow&&(this.setTab(`photos`,!1),this.revealToken++)}pick(e){let t=this.layout?.placements[e];if(!this.page||!t)return;let n=t.photoIndex;if(this.multiSelected&&this.clearSelection(),this.selected===null)this.selected=n,this.setStatus(J(`Selected %(name)s. Choose another photo to swap, or press Escape.`,{name:this.photos[n]?.name??``}));else if(this.selected===n)this.selected=null,this.setStatus(``);else{if(this.page.swapPhotos(this.selected,n),this.book){let e=this.selected,t=this.photos[e]?.bookPage??0,r=this.photos[n]?.bookPage??0;this.photos=this.photos.map((i,a)=>a===e?{...i,bookPage:r}:a===n?{...i,bookPage:t}:i)}this.pageRev++,this.arrangedByHand=!0,this.setStatus(J(`Swapped %(a)s and %(b)s.`,{a:this.photos[this.selected]?.name??``,b:this.photos[n]?.name??``})),this.selected=null}}get cropping(){return this.cropFor!==null&&this.cropFor===this.selected}toggleCrop(){this.selected===null||this.multiSelected||(this.cropFor=this.cropping?null:this.selected,this.setStatus(this.cropping?J(`Drag the photo to move it; use the slider to zoom into it.`):``))}cropPhoto(e){this.photos[e]&&(this.multiSelected&&(this.alsoSelected=new Set),this.selected=e,this.cropFor=e,this.setStatus(J(`Drag the photo to move it; use the slider to zoom into it.`)))}selectedCell(){let e=this.selected;return e===null?void 0:this.layout?.placements.find(t=>t.photoIndex===e)?.cell}writeCrop(e,t){let n=Ko(t)?void 0:Go(t);this.photos=this.photos.map((t,r)=>{if(r!==e)return t;let{crop:i,...a}=t;return n?{...a,crop:n}:a})}panSelectedCrop(e,t){let n=this.selected,r=n===null?void 0:this.photos[n],i=this.selectedCell();n!==null&&r&&i&&this.writeCrop(n,Jo(r.crop??Uo,e,t,r.width,r.height,i.w,i.h))}zoomSelectedCrop(e){let t=this.selected,n=t===null?void 0:this.photos[t],r=this.selectedCell();t!==null&&n&&r&&(e<=1&&(n.crop?.zoom??1)>1?this.writeCrop(t,Uo):this.writeCrop(t,Yo(n.crop??Uo,e,n.width,n.height,r.w,r.h)))}resetCrop(){this.selected!==null&&(this.writeCrop(this.selected,Uo),this.setStatus(J(`%(name)s is back to its default crop.`,{name:this.selectedPhoto?.name??``})))}maxZoom=5;deselect(){this.clearSelection(),this.setStatus(``)}chooseFiles(){this.fileInput?.click()}async addFiles(e){if(e.length===0)return;this.restoring&&this.setStatus(J(`Your new photos are added once your saved ones are back.`)),await this.restoringDone,this.clearMessages(),this.hideNotice(),this.setStatus(J(`Please wait`));let t=[],n=await rs(await this.openZips(e,t),this.photos,this.importPool,e=>this.addMessage(e),void 0,e=>t.push(e));if(this.setStatus(``),this.showNotice(t),n.length>0){let e=this.book?this.withPages(n,this.photos):n;this.photos=[...this.photos,...e],this.relayout(`search`)}}async openZips(e,t){let n=[];for(let r of e)if(!Ss(r))n.push(r);else try{let e=await Ds(r);n.push(...e.files);for(let n of e.others)t.push({reason:`not-image`,name:n});for(let n of e.unreadable)t.push({reason:`unreadable`,name:n})}catch{t.push({reason:`unreadable`,name:r.name})}return n}discardRemoved(){for(let{photo:e}of this.removed??[])e.thumb.close();this.removed=null}removePhotos(e,t){let n=this.photos.map((e,t)=>({photo:e,index:t})).filter(t=>e.has(t.photo.id));n.length!==0&&(this.discardRemoved(),this.removed=n,this.removedPageCount=null,this.photos=this.photos.filter(t=>!e.has(t.id)),this.relayout(`search`),this.setStatus(`${t} ${J(`Undo remove brings it back.`)}`))}removeSelected(){this.askRemovePhotos(this.selection.flatMap(e=>this.photos[e]??[]))}askRemovePhotos(e){let t=e[0];if(!t)return;let n=e.length===1;this.confirm({title:n?J(`Remove %(name)s?`,{name:t.name}):J(`Remove %(n)s photos?`,{n:e.length}),text:J(n?`The photo is taken out of the collage. Undo remove brings it back.`:`The photos are taken out of the collage. Undo remove brings them back.`),action:J(`Remove`),run:()=>this.removePhotos(new Set(e.map(e=>e.id)),n?J(`Removed %(name)s.`,{name:t.name}):J(`Removed %(n)s photos.`,{n:e.length}))})}askRemoveAll(){let e=this.photos.length;e!==0&&this.confirm({title:J(`Remove all photos?`),text:this.pageCount>1?J(`All %(n)s photos are taken out and the book goes back to one page.`,{n:e}):J(`All %(n)s photos are taken out.`,{n:e}),action:J(`Remove all`),run:()=>this.removeAll()})}removeAll(){let e=this.photos.length,t=this.pageCount;this.pageCount=1,this.removePhotos(new Set(this.photos.map(e=>e.id)),J(`Removed all %(n)s photos.`,{n:e})),this.removedPageCount=t}undoRemove(){let e=this.removed;if(!e)return;let t=new Set(this.photos.map(e=>ts(e.file))),n=e.filter(e=>!t.has(ts(e.photo.file)));for(let t of e)n.includes(t)||t.photo.thumb.close();let r=[...this.photos];for(let e of n)r.splice(Math.min(e.index,r.length),0,e.photo);this.removedPageCount!==null&&(this.pageCount=Math.max(this.pageCount,this.removedPageCount),this.removedPageCount=null),this.photos=r,this.removed=null,this.relayout(`search`),this.setStatus(J(`Restored %(n)s photo(s).`,{n:n.length}))}setSpan(e,t){this.setSpans([e],t)}setSpans(e,t){let n=this.photos[e[0]??-1];if(!n)return;let r=new Set(e),i=e=>t===`reset`?{...Ho}:{...e.span??Ho,...t};this.photos=this.photos.map((e,t)=>r.has(t)?{...e,span:i(e)}:e),this.relayout(`single`,!0);let a=Hc(i(n)),o=e.length===1?n.name:J(`%(n)s photos`,{n:e.length});this.setStatus(a?J(`%(name)s: %(what)s.`,{name:o,what:a}):J(`%(name)s is back to its normal size.`,{name:o}))}toggleWider(){let e=this.selected;if(e===null)return;let t=this.photos[e]?.span?.columns===2;this.setSpans(this.selection,{columns:t?1:2})}cycleTaller(){let e=this.selected;if(e===null)return;let t=this.photos[e]?.span?.rows??1;this.setSpans(this.selection,{rows:t===1?2:t===2?3:1})}chooseSize(e,t){this.settings.splitImages=0,this.applySize(e,t)}chooseNamedSize(e){this.customSize=!1;let t=ko.find(t=>t.id===e);if(!t)return;let n=Ao(t,this.portrait?`portrait`:`landscape`);this.chooseSize(n.width,n.height)}chooseCustomSize(){this.customSize=!0,this.sizeEpoch++}chooseInstagramPost(){this.customSize=!1,this.setSplit(3,So,!0)}turn(e){this.portrait=e;let{width:t,height:n}=this.settings;e&&n<t||!e&&t<n?this.applySize(n,t):this.sizeEpoch++}syncOrientation(){let e=Mo(this.settings.width,this.settings.height);e!==`square`&&(this.portrait=e===`portrait`)}applySize(e,t){if(!Number.isFinite(e)||!Number.isFinite(t)||e<1||t<1){this.sizeEpoch++;return}let n=Ls(Math.round(e),Math.round(t),this.limits);this.settings.width=n.width,this.settings.height=n.height,this.sizeNote=n.clamped?J(`This browser can only make images up to %(w)s × %(h)s pixels here; using that size.`,{w:n.width,h:n.height}):``,this.settings.splitImages>1?this.setSplit(this.settings.splitImages,this.settings.height,!1):(this.syncOrientation(),this.sizeEpoch++,this.reshape())}commitSize(e,t){clearTimeout(this.sizeTimer),this.pendingSize=null,Ls(Math.round(e),Math.round(t),this.limits).clamped?(this.pendingSize={width:e,height:t},this.sizeTimer=setTimeout(()=>this.flushSize(),600)):this.applySize(e,t)}flushSize(){clearTimeout(this.sizeTimer);let e=this.pendingSize;this.pendingSize=null,e&&this.applySize(e.width,e.height)}setSplit(e,t,n){let r=Co(e)||3,i=Math.max(16,Math.round(Number.isFinite(t)?t:So)),a=Ls(r*i,i,this.limits);a.clamped&&(i=Math.max(16,Math.floor(Math.min(a.height,a.width/r)))),this.sizeNote=a.clamped?J(`This browser can only make images up to %(w)s × %(h)s pixels here; using that size.`,{w:r*i,h:i}):``;let o=r!==this.settings.splitImages;this.settings.splitImages=r,this.settings.format===`pdf`&&(this.settings.format=`png`),this.settings.width=r*i,this.settings.height=i,this.syncOrientation(),this.sizeEpoch++,n&&(o||!this.page)?this.relayout(`search`):this.reshape()}get splitMin(){return 2}get splitMax(){return 20}async save(e){let t=this.layout;if(!t)return;this.clearMessages(),this.flushSize();let n=Ls(this.settings.width,this.settings.height,this.limits);n.clamped&&this.applySize(n.width,n.height);let r=ze(this.settings),i=new AbortController;this.cancelExport=()=>i.abort(),this.progress=0,this.dialog=`progress`;try{let n=oc(r.format);if(t.pages){await this.saveBook(t,r,n,i.signal,e);return}let a=await cc({layout:t,photos:this.photos,settings:r,pool:this.exportPool,signal:i.signal,onProgress:(e,t)=>{this.progress=t?e/t*100:100},baseName:`collage-${this.seed}`}),o=`collage-${this.seed}`,s=r.splitImages>1?`${o}.zip`:`${o}.${n}`;zc(a,s),this.lastSave={file:s,images:Math.max(1,r.splitImages)}}catch(e){e instanceof DOMException&&e.name===`AbortError`||this.addMessage({kind:`error`,text:`${J(`An error occurred while rendering image:`)} ${e instanceof Error?e.message:String(e)}`})}finally{this.dialog=null,i.signal.aborted&&(this.exportPool=new dc)}}async saveBook(e,t,n,r,i){let a=await uc({layout:e,photos:this.photos,settings:t,pool:this.exportPool,signal:r,stem:`book-${this.seed}`,ext:n,onlyPage:i,onProgress:e=>{this.progress=e*100}});a.file?(a.skipped.length>0&&this.addMessage({kind:`info`,text:J(`Skipped empty page(s): %(list)s.`,{list:a.skipped.map(e=>e+1).join(`, `)})}),zc(a.file.blob,a.file.name),this.lastSave={file:a.file.name,images:a.images}):this.addMessage({kind:`error`,text:J(`That page has no photos to save.`)})}cancelExport=()=>{}};function Xc(e){return Array.from({length:12},(t,n)=>e.length===0?void 0:e[n%e.length])}function $(e,t){return Q.lang,J(e,t)}var Zc=W(`<dialog id="progress-dialog" aria-labelledby="progress-title"><h2 id="progress-title"> </h2> <p> </p> <progress id="progress" max="100"></progress> <div class="button-row"><button type="button" id="cancel"> </button></div></dialog> <dialog id="confirm-dialog" aria-labelledby="confirm-title" aria-describedby="confirm-text"><h2 id="confirm-title"> </h2> <p id="confirm-text"> </p> <div class="button-row"><button type="button" id="confirm-cancel"> </button> <button type="button" id="confirm-ok" class="danger"> </button></div></dialog> <dialog id="help-dialog" aria-labelledby="help-title"><h2 id="help-title"> </h2> <h3> </h3> <ul class="help-list"><li><strong> </strong>: <span> </span></li> <li><strong> </strong>: <span> </span></li></ul> <h3> </h3> <ul class="help-list"><li><strong> </strong>: <span> </span></li> <li><strong> </strong>: <span> </span></li> <li><strong> </strong>: <span> </span></li> <li><strong> </strong>: <span> </span></li> <li><strong> </strong>: <span> </span></li></ul> <h3> </h3> <ul class="help-list" id="help-keys"><li><kbd>W</kbd> <span> </span></li> <li><kbd>T</kbd> <span> </span></li> <li><kbd>C</kbd> <span> </span></li> <li><kbd>Enter</kbd> <span> </span></li> <li><kbd>Space</kbd> <span> </span></li></ul> <p class="hint help-note"> </p> <div class="button-row"><button type="button" id="help-close" class="primary"> </button></div></dialog> <dialog id="about-dialog" aria-labelledby="about-title"><h2 id="about-title"> </h2> <p><strong>Collage Creator</strong> <span> </span> <a href="https://github.com/adrienverge/PhotoCollage" rel="noopener">PhotoCollage</a>,
    Copyright © 2013–2014 Adrien Vergé, with translations by the contributors credited in the
    NOTICE. It is not the original and is not endorsed by its authors.</p> <p>The changes and additions in this version are Copyright © 2026 John Briggs. It is released under
    the <a href="./LICENSE.txt" rel="noopener">GNU General Public License</a>, version 2 or (at
    your option) any later version (SPDX: GPL-2.0-or-later).</p> <p> </p> <p><span> </span> <a href="https://github.com/briggsyj/CollageCreator" rel="noopener"> </a> · <a href="./NOTICE.txt" rel="noopener">NOTICE</a> · <a href="./THIRD-PARTY-LICENSES.txt" rel="noopener">Third-party licences</a></p> <div class="button-row"><button type="button" id="about-close" class="primary"> </button></div></dialog>`,1);function Qc(e,t){Ue(t,!0);let n,r,i,a;gn(()=>{let e={progress:n,help:r,about:i,confirm:a};for(let t of Object.keys(e)){let n=e[t];Q.dialog===t&&!n.open?(n.showModal(),t===`confirm`&&n.querySelector(`#confirm-ok`)?.focus()):Q.dialog!==t&&n.open&&n.close()}});let o=e=>()=>{Q.dialog===e&&(Q.dialog=null)};var s=Zc(),c=rn(s),l=I(c),u=L(l,!0),d=R(l,2),f=L(d,!0),p=R(d,2),m=R(p,2),h=I(m),g=L(h,!0);j(m),j(c),Ti(c,e=>n=e,()=>n);var _=R(c,2),v=M(()=>o(`confirm`)),y=I(_),b=L(y,!0),x=R(y,2),S=L(x,!0),C=R(x,2),w=I(C),ee=L(w,!0),te=R(w,2),ne=L(te,!0);j(C),j(_),Ti(_,e=>a=e,()=>a);var T=R(_,2),E=M(()=>o(`help`)),re=I(T),ie=L(re,!0),ae=R(re,2),oe=L(ae,!0),se=R(ae,2),ce=I(se),le=I(ce),ue=L(le,!0),de=L(R(le,2),!0);j(ce);var fe=R(ce,2),D=I(fe),pe=L(D,!0),me=L(R(D,2),!0);j(fe),j(se);var he=R(se,2),O=L(he,!0),ge=R(he,2),k=I(ge),_e=I(k),A=L(_e,!0),ve=L(R(_e,2),!0);j(k);var ye=R(k,2),xe=I(ye),Se=L(xe,!0),Ce=L(R(xe,2),!0);j(ye);var we=R(ye,2),Te=I(we),Ee=L(Te,!0),De=L(R(Te,2),!0);j(we);var Oe=R(we,2),ke=I(Oe),Ae=L(ke,!0),je=L(R(ke,2),!0);j(Oe);var Me=R(Oe,2),Ne=I(Me),Pe=L(Ne,!0),Fe=L(R(Ne,2),!0);j(Me),j(ge);var Ie=R(ge,2),Le=L(Ie,!0),Re=R(Ie,2),ze=I(Re),Be=L(R(I(ze),2),!0);j(ze);var Ve=R(ze,2),He=L(R(I(Ve),2),!0);j(Ve);var Ge=R(Ve,2),Ke=L(R(I(Ge),2),!0);j(Ge);var qe=R(Ge,2),Je=L(R(I(qe),2),!0);j(qe);var Ye=R(qe,2),Xe=L(R(I(Ye),2),!0);j(Ye),j(Re);var Ze=R(Re,2),Qe=L(Ze,!0),$e=R(Ze,2),et=I($e),tt=L(et,!0);j($e),j(T),Ti(T,e=>r=e,()=>r);var nt=R(T,2),rt=M(()=>o(`about`)),it=I(nt),at=L(it,!0),ot=R(it,2),st=L(R(I(ot),2),!0);be(3),j(ot);var ct=R(ot,4),lt=L(ct,!0),ut=R(ct,2),dt=I(ut),ft=L(dt,!0),pt=L(R(dt,2),!0);be(4),j(ut);var mt=R(ut,2),ht=I(mt),gt=L(ht,!0);j(mt),j(nt),Ti(nt,e=>i=e,()=>i),z((e,t,n,r,i,a,o,s,c,l,d,m,_,v,y,x,C,T,E,re,ae,se,ce,le,fe,D,he,ge,k,_e,ye,j,be,xe,we,Te,Oe,ke,Me,Ne)=>{K(u,e),K(f,t),_i(p,Q.progress),q(h,`title`,n),K(g,r),K(b,Q.confirming?.title??``),K(S,Q.confirming?.text??``),q(w,`title`,i),K(ee,a),q(te,`title`,o),K(ne,Q.confirming?.action??``),K(ie,s),K(oe,c),K(ue,l),K(de,d),K(pe,m),K(me,_),K(O,v),K(A,y),K(ve,x),K(Se,C),K(Ce,T),K(Ee,E),K(De,re),K(Ae,ae),K(je,se),K(Pe,ce),K(Fe,le),K(Le,fe),K(Be,D),K(He,he),K(Ke,ge),K(Je,k),K(Xe,_e),K(Qe,ye),q(et,`title`,j),K(tt,be),K(at,xe),K(st,we),K(lt,Te),K(ft,Oe),K(pt,ke),q(ht,`title`,Me),K(gt,Ne)},[()=>$(`Please wait`),()=>$(`Performing image computation...`),()=>$(`Stop saving`),()=>$(`Cancel`),()=>$(`Keep things as they are`),()=>$(`Cancel`),()=>Q.confirming?.action??$(`Confirm`),()=>$(`Help`),()=>$(`Moving around`),()=>$(`Pan`),()=>$(`drag the collage to move it. Hold Space to pan from any tool.`),()=>$(`Zoom`),()=>$(`scroll over the collage, or use + and − at the top right. Fit shows it all.`),()=>$(`Changing photos`),()=>$(`Swap`),()=>$(`drag a photo onto another to swap them, or click one and then the other.`),()=>$(`Select`),()=>$(`click a photo to select it; its actions appear beside the tools. Shift-click to select several.`),()=>$(`Wider and Taller`),()=>$(`give the selected photos more room; press again to go back.`),()=>$(`Crop`),()=>$(`press Crop (or double-click a photo), drag the photo and use the slider to zoom. Zoom all the way out to undo the crop; the tick finishes.`),()=>$(`Book`),()=>$(`press Add page under the collage for more pages in a row, each saved as its own image. Swap works between pages.`),()=>$(`Keyboard`),()=>$(`Wider`),()=>$(`Taller`),()=>$(`Crop`),()=>$(`finish cropping`),()=>$(`hold to pan from any tool`),()=>$(`Everything runs in your browser. Your photos are never uploaded.`),()=>$(`Close help`),()=>$(`Close`),()=>$(`About`),()=>$(`is an independent, modified web version of`),()=>$(`This program comes with ABSOLUTELY NO WARRANTY; without even the implied warranty of merchantability or fitness for a particular purpose.`),()=>$(`Your photos never leave your device.`),()=>$(`Source code`),()=>$(`Close`),()=>$(`Close`)]),_r(`cancel`,c,e=>e.preventDefault()),U(`click`,h,()=>Q.cancelExport()),_r(`close`,_,function(...e){H(v)?.apply(this,e)}),U(`click`,w,()=>Q.dialog=null),U(`click`,te,()=>Q.confirmed()),_r(`close`,T,function(...e){H(E)?.apply(this,e)}),U(`click`,et,()=>Q.dialog=null),_r(`close`,nt,function(...e){H(rt)?.apply(this,e)}),U(`click`,ht,()=>Q.dialog=null),G(e,s),We()}vr([`click`]);function $c(e,t){let n=e.parentElement,r=null,i=0,a=0,o=()=>{r=null,cancelAnimationFrame(a),a=0,n?.classList.remove(`pulling`),n?.style.removeProperty(`--drag`)},s=t=>{t.target.closest(`button`)||(r=t.clientY,e.setPointerCapture(t.pointerId),n?.classList.remove(`rise`),n?.classList.add(`pulling`))},c=e=>{r!==null&&(i=Math.max(0,e.clientY-r),a||=requestAnimationFrame(()=>{a=0,r!==null&&n?.style.setProperty(`--drag`,`${i}px`)}))},l=e=>{if(r===null)return;let n=e.clientY-r;o(),n>60&&t()};return e.addEventListener(`pointerdown`,s),e.addEventListener(`pointermove`,c),e.addEventListener(`pointerup`,l),e.addEventListener(`pointercancel`,o),{destroy(){e.removeEventListener(`pointerdown`,s),e.removeEventListener(`pointermove`,c),e.removeEventListener(`pointerup`,l),e.removeEventListener(`pointercancel`,o)}}}function el(e,t){let n=t,r=e=>n(e);return e.addEventListener(`wheel`,r,{passive:!1}),{update(e){n=e},destroy(){e.removeEventListener(`wheel`,r)}}}function tl(e,t){let n=t;return e.value=t.value,{update(t){t.sticky&&t.again===n.again||(e.value=t.value),n=t}}}var nl=350,rl=8;function il(e,t){let n=t,r=0,i=null,a=!1,o=!1,s={x:0,y:0},c=()=>{clearTimeout(r),i=null},l=e=>{e.pointerType===`touch`&&(i={x:e.clientX,y:e.clientY,id:e.pointerId},s={x:e.clientX,y:e.clientY},r=window.setTimeout(()=>{i&&(a=n.start(s.x,s.y),a&&navigator.vibrate?.(10))},nl))},u=e=>{i&&e.pointerId===i.id&&(s={x:e.clientX,y:e.clientY},a?n.move(e.clientX,e.clientY):Math.hypot(e.clientX-i.x,e.clientY-i.y)>rl&&c())},d=e=>{i&&e.pointerId===i.id&&(a&&(n.end(e.clientX,e.clientY,e.type===`pointerup`),o=e.type===`pointerup`),a=!1,c())},f=e=>{a&&e.preventDefault()},p=e=>{o&&(o=!1,e.preventDefault(),e.stopImmediatePropagation())},m=e=>{(i||a)&&e.preventDefault()};return e.addEventListener(`pointerdown`,l),window.addEventListener(`pointermove`,u),window.addEventListener(`pointerup`,d),window.addEventListener(`pointercancel`,d),e.addEventListener(`touchmove`,f,{passive:!1}),e.addEventListener(`click`,p,!0),e.addEventListener(`contextmenu`,m),{update(e){n=e},destroy(){c(),e.removeEventListener(`pointerdown`,l),window.removeEventListener(`pointermove`,u),window.removeEventListener(`pointerup`,d),window.removeEventListener(`pointercancel`,d),e.removeEventListener(`touchmove`,f),e.removeEventListener(`click`,p,!0),e.removeEventListener(`contextmenu`,m)}}}var al=W(`<canvas aria-hidden="true"></canvas>`);function ol(e,t){Ue(t,!0);let n;gn(()=>{let e=n.getContext(`2d`);e&&(e.clearRect(0,0,160,160),nc(e,t.bitmap,t.bitmap.width,t.bitmap.height,{x:0,y:0,w:160,h:160}))});var r=al();q(r,`width`,160),q(r,`height`,160),Ti(r,e=>n=e,()=>n),G(e,r),We()}var sl=W(`<div class="restoring" role="status"><p><!></p> <progress></progress></div>`),cl=W(`<li> </li>`),ll=W(`<div class="page-head"><h4> <span class="count"> </span></h4> <div class="page-actions"><button type="button" class="icon-btn move-page-left"><svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 15 6-6 6 6"></path></svg></button> <button type="button" class="icon-btn move-page-right"><svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg></button> <button type="button" class="icon-btn remove-page"><svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg></button></div></div>`),ul=W(`<p class="page-empty"> </p>`),dl=W(`<span class="tag"> </span>`),fl=W(`<li><button type="button" class="tile"><!> <!> <span class="name"> </span></button></li>`),pl=W(`<section><!> <!> <ul class="photo-list"></ul></section>`),ml=W(`<section><div class="page-head"><h4> <span class="count"> </span></h4></div> <p class="page-empty"> </p></section>`),hl=W(`<div class="drag-ghost" aria-hidden="true"> </div>`),gl=W(`<section class="tabpanel" id="panel-photos" role="tabpanel" aria-labelledby="tab-photos"><button type="button" id="add" class="primary wide" aria-describedby="privacy-note"> </button> <p class="drop-tip"> </p> <p id="privacy-note" class="sr-only"> </p> <!> <div id="notices" class="notices" role="status"><svg class="notices-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path></path></svg> <div class="notices-body"><p id="notices-summary" class="notices-summary"> </p> <p id="notices-reasons" class="notices-reasons"> </p> <button type="button" id="notices-details" class="link notices-toggle" aria-controls="notices-list"> </button> <ul id="notices-list" class="notices-list"></ul></div> <button type="button" id="notices-dismiss" class="icon-btn notices-close"><svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg></button></div> <div class="rowhead"><h3 id="photo-count"> </h3> <div><button type="button" id="undo-remove" class="link"> </button> <button type="button" id="remove-all" class="link"> </button></div></div> <p id="empty-hint" class="hint"> </p>  <div id="photo-list"><!> <!></div></section> <!>`,1);function _l(e,t){Ue(t,!0);let n;gn(()=>{if(Q.revealToken===0)return;let e=Q.selected;e!==null&&n.querySelector(`[data-photo="${e}"]`)?.scrollIntoView({block:`nearest`})});let r=M(()=>{let e=Q.photos.map((e,t)=>({photo:e,index:t}));return Q.book?Array.from({length:Q.pageCount},(t,n)=>({page:n,items:e.filter(e=>Math.min(Q.pageCount-1,e.photo.bookPage??0)===n)})):[{page:-1,items:e}]}),i=`application/x-collage-photos`,a=P(-1),o=P(!1),s=M(()=>Q.hasPhotos&&Q.pageCount<Q.maxPages);function c(e){let t=Q.photos[e];return t?Q.selection.includes(e)?Q.selection.flatMap(e=>Q.photos[e]?.id??[]):[t.id]:[]}function l(e,t){let n=c(t);n.length!==0&&e.dataTransfer&&(e.dataTransfer.setData(i,JSON.stringify(n)),e.dataTransfer.effectAllowed=`move`,F(o,!0))}function u(e){let t=e.dataTransfer?.getData(i);if(F(a,-1),F(o,!1),!t)return;e.preventDefault(),e.stopPropagation();let n=JSON.parse(t);Array.isArray(n)&&(Q.addPage(),Q.movePhotosToPage(n.map(String),Q.pageCount-1))}let d=[],f=P(null);function p(e,t){let n=document.elementFromPoint(e,t)?.closest(`[data-drop-page]`);return n?Number(n.dataset.dropPage):-1}function m(e){let t=n.closest(`.sheet, .panes, .side`)??n.parentElement;if(!t)return;let r=t.getBoundingClientRect();e<r.top+48?t.scrollTop-=12:e>r.bottom-48&&(t.scrollTop+=12)}function h(e){return{start:(t,n)=>!(Q.book||H(s))||(d=c(e),d.length===0)?!1:(F(o,!0),F(f,{x:t,y:n,count:d.length},!0),!0),move:(e,t)=>{F(f,{x:e,y:t,count:d.length},!0),F(a,p(e,t),!0),m(t)},end:(e,t,n)=>{let r=n?p(e,t):-1;if(F(f,null),F(a,-1),F(o,!1),!(r<0)){if(r>=Q.pageCount)Q.addPage(),Q.movePhotosToPage(d,Q.pageCount-1);else{if(!Q.book)return;Q.movePhotosToPage(d,r)}}}}}function g(e,t){e.dataTransfer?.types.includes(i)&&(e.preventDefault(),e.dataTransfer.dropEffect=`move`,F(a,t,!0))}function _(e,t){let n=e.dataTransfer?.getData(i);if(F(a,-1),!n)return;e.preventDefault(),e.stopPropagation();let r=JSON.parse(n);Array.isArray(r)&&Q.movePhotosToPage(r.map(String),t)}let v=M(()=>Q.photos.length===1?$(`1 photo`):$(`%(n)s photos`,{n:Q.photos.length}));var y=gl(),b=rn(y),x=I(b),S=L(x,!0),C=R(x,2),w=L(C,!0),ee=R(C,2),te=L(ee,!0),ne=R(ee,2),T=e=>{var t=sl(),n=I(t),r=I(n),i=e=>{var t=Er();z(e=>K(t,e),[()=>$(`Bringing back your photos… %(done)s of %(total)s`,{done:Q.restoring.done,total:Q.restoring.total})]),G(e,t)},a=e=>{var t=Er();z(e=>K(t,e),[()=>$(`Looking for your saved photos…`)]),G(e,t)};Lr(r,e=>{Q.restoring.total>0?e(i):e(a,-1)}),j(n);var o=R(n,2);j(t),z((e,t)=>{q(o,`max`,e),_i(o,Q.restoring.total>0?Q.restoring.done:void 0),q(o,`aria-label`,t)},[()=>Math.max(1,Q.restoring.total),()=>$(`Bringing back your photos`)]),G(e,t)};Lr(ne,e=>{Q.restoring&&e(T)});var E=R(ne,2),re=I(E),ie=R(I(re));j(re);var ae=R(re,2),oe=I(ae),se=L(oe,!0),ce=R(oe,2),le=L(ce,!0),ue=R(ce,2),de=L(ue,!0),fe=R(ue,2);Hr(fe,20,()=>Q.notice?.items??[],e=>e,(e,t)=>{var n=cl(),r=L(n,!0);z(()=>K(r,t)),G(e,n)}),j(fe),j(ae);var D=R(ae,2);j(E);var pe=R(E,2),me=I(pe),he=L(me,!0),O=R(me,2),ge=I(O),k=L(ge,!0),_e=R(ge,2),A=L(_e,!0);j(O),j(pe);var ve=R(pe,2),ye=L(ve,!0),be=R(ve,2),xe=I(be);Hr(xe,17,()=>H(r),e=>e.page,(e,t)=>{var n=pl();let r;var i=I(n),c=e=>{var n=ll(),r=I(n),i=I(r),a=L(R(i));j(r);var o=R(r,2),s=I(o),c=R(s,2),l=R(c,2);j(o),j(n),z((e,n,r,o,u,d,f,p)=>{K(i,`${e??``} `),K(a,`· ${n??``}`),q(s,`title`,r),q(s,`aria-label`,o),s.disabled=H(t).page===0,q(c,`title`,u),q(c,`aria-label`,d),c.disabled=H(t).page===Q.pageCount-1,q(l,`title`,f),q(l,`aria-label`,p),l.disabled=Q.pageCount<=1},[()=>$(`Page %(n)s`,{n:H(t).page+1}),()=>H(t).items.length===1?$(`1 photo`):$(`%(n)s photos`,{n:H(t).items.length}),()=>$(`Move page %(n)s up`,{n:H(t).page+1}),()=>$(`Move page %(n)s up`,{n:H(t).page+1}),()=>$(`Move page %(n)s down`,{n:H(t).page+1}),()=>$(`Move page %(n)s down`,{n:H(t).page+1}),()=>$(`Remove page %(n)s`,{n:H(t).page+1}),()=>$(`Remove page %(n)s`,{n:H(t).page+1})]),U(`click`,s,()=>Q.movePage(H(t).page,-1)),U(`click`,c,()=>Q.movePage(H(t).page,1)),U(`click`,l,()=>Q.askRemovePage(H(t).page)),G(e,n)};Lr(i,e=>{H(t).page>=0&&e(c)});var u=R(i,2),d=e=>{var t=ul(),n=L(t,!0);z(e=>K(n,e),[()=>$(`Drop or move photos here`)]),G(e,t)};Lr(u,e=>{H(t).page>=0&&H(t).items.length===0&&e(d)});var f=R(u,2);Hr(f,21,()=>H(t).items,({photo:e,index:t})=>e.id,(e,t)=>{let n=()=>H(t).photo,r=()=>H(t).index,i=M(()=>Hc(n().span)),c=M(()=>H(i)?`${n().name}, ${H(i)}`:n().name);var u=fl(),d=I(u),f=I(d);ol(f,{get bitmap(){return n().thumb}});var p=R(f,2),m=e=>{var t=dl(),n=L(t,!0);z(()=>K(n,H(i))),G(e,t)};Lr(p,e=>{H(i)&&e(m)});var g=R(p,2),_=L(g,!0);j(d),Jr(d,(e,t)=>il?.(e,t),()=>h(r())),j(u),z((e,t,i)=>{q(u,`data-photo`,r()),q(d,`draggable`,Q.book||H(s)),q(d,`title`,e),q(d,`aria-pressed`,t),q(d,`aria-label`,i),q(g,`title`,n().name),K(_,n().name)},[()=>$(`Select %(name)s (Shift-click to select several)`,{name:n().name}),()=>Q.selection.includes(r()),()=>Q.book?`${H(c)}, ${$(`Page %(n)s`,{n:(n().bookPage??0)+1})}`:H(c)]),_r(`dragstart`,d,e=>l(e,r())),_r(`dragend`,d,()=>{F(a,-1),F(o,!1)}),U(`click`,d,e=>e.shiftKey||e.metaKey||e.ctrlKey?Q.toggleSelected(r()):Q.selectPhoto(r())),G(e,u)}),j(f),j(n),z(e=>{r=ri(n,1,`page-group`,null,r,{"drop-target":H(a)===H(t).page&&H(t).page>=0}),q(n,`data-drop-page`,H(t).page>=0?H(t).page:void 0),q(n,`aria-label`,e)},[()=>H(t).page>=0?$(`Page %(n)s`,{n:H(t).page+1}):void 0]),_r(`dragover`,n,e=>H(t).page>=0&&g(e,H(t).page)),_r(`dragleave`,n,e=>{e.currentTarget.contains(e.relatedTarget)||F(a,-1)}),_r(`drop`,n,e=>H(t).page>=0&&_(e,H(t).page)),G(e,n)});var Se=R(xe,2),Ce=e=>{var t=ml();let n;var r=I(t),i=I(r),o=I(i),s=L(R(o));j(i),j(r);var c=L(R(r,2),!0);j(t),z((e,r,i,l)=>{n=ri(t,1,`new-page`,null,n,{"drop-target":H(a)===Q.pageCount}),q(t,`data-drop-page`,Q.pageCount),q(t,`aria-label`,e),K(o,`${r??``} `),K(s,`· ${i??``}`),K(c,l)},[()=>$(`New page`),()=>$(`Page %(n)s`,{n:Q.pageCount+1}),()=>$(`new`),()=>$(`Drop photos here for a new page`)]),_r(`dragover`,t,e=>g(e,Q.pageCount)),_r(`dragleave`,t,e=>{e.currentTarget.contains(e.relatedTarget)||F(a,-1)}),_r(`drop`,t,u),G(e,t)};Lr(Se,e=>{H(s)&&(Q.book||H(o))&&e(Ce)}),j(be),Ti(be,e=>n=e,()=>n),j(b);var we=R(b,2),Te=e=>{var t=hl();let n;var r=L(t,!0);z(e=>{n=ai(t,``,n,{left:`${H(f).x}px`,top:`${H(f).y}px`}),K(r,e)},[()=>H(f).count===1?$(`Moving 1 photo`):$(`Moving %(n)s photos`,{n:H(f).count})]),G(e,t)};Lr(we,e=>{H(f)&&e(Te)}),z((e,t,n,r,i,a,o,s,c,l,u,d,f)=>{q(b,`hidden`,Q.tab!==`photos`),q(x,`title`,e),x.disabled=Q.restoring!==null,K(S,t),K(w,n),K(te,r),q(E,`hidden`,Q.notice===null),q(E,`data-kind`,Q.notice?.kind),q(ie,`d`,Q.notice?.kind===`error`?`M12 7.5v5.5M12 16.5v.01`:`M12 11v5.5M12 7.5v.01`),K(se,Q.notice?.summary??``),K(le,Q.notice?.reasons??``),q(ue,`title`,i),q(ue,`aria-expanded`,Q.noticeDetailsOpen),K(de,a),q(fe,`hidden`,!Q.noticeDetailsOpen),q(D,`title`,o),q(D,`aria-label`,s),K(he,H(v)),q(ge,`title`,c),q(ge,`hidden`,Q.removed===null),K(k,l),q(_e,`title`,u),_e.disabled=!Q.hasPhotos,K(A,d),q(ve,`hidden`,Q.hasPhotos),K(ye,f)},[()=>$(`Choose photos, or a .zip of them, from this device`),()=>$(`Add images...`),()=>$(`or drop photos or a .zip of them anywhere here`),()=>$(`Everything runs in your browser. Your photos are never uploaded.`),()=>$(`Show or hide the names of the files that were not added`),()=>Q.noticeDetailsOpen?$(`Hide files`):$(`Show files`),()=>$(`Dismiss this notice`),()=>$(`Dismiss`),()=>$(`Put back the photos removed last`),()=>$(`Undo remove`),()=>$(`Take every photo out (asks first)`),()=>$(`Remove all`),()=>$(`No photos yet. Add a few and the collage builds itself.`)]),U(`click`,x,()=>Q.chooseFiles()),U(`click`,ue,()=>Q.noticeDetailsOpen=!Q.noticeDetailsOpen),U(`click`,D,()=>Q.hideNotice()),U(`click`,ge,()=>Q.undoRemove()),U(`click`,_e,()=>Q.askRemoveAll()),U(`click`,be,e=>{e.target.closest(`button, select, input, a`)||Q.deselect()}),G(e,y),We()}vr([`click`]);var vl=W(`<button type="button" class="chip"><span> </span> <small> </small></button>`),yl=W(`<p class="group-label"> </p> <!>`,1),bl=W(`<option> </option>`),xl=W(`<section class="tabpanel" id="panel-poster" role="tabpanel" aria-labelledby="tab-poster"><section aria-labelledby="pages-h" id="pages-block"><h3 id="pages-h"><label for="pages"> </label></h3> <div class="stepper"><button type="button" id="pages-less" class="sq"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path></svg></button> <input id="pages" type="number" min="1" step="1" inputmode="numeric"/> <button type="button" id="pages-more" class="sq"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></button></div> <p class="hint pages-hint"> </p></section> <section aria-labelledby="size-h"><h3 id="size-h"> </h3> <fieldset id="size-choices" class="choices group" aria-labelledby="size-h"><!> <p class="group-label"> </p> <button type="button" class="chip" data-choice="post"><span> </span> <small> </small></button> <button type="button" class="chip wide-chip" data-choice="custom"><span> </span></button></fieldset> <fieldset class="seg group" id="orientation" aria-label="Orientation"><button type="button" id="orient-landscape"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2"></rect></svg> <span> </span></button> <button type="button" id="orient-portrait"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="12" height="18" rx="2"></rect></svg> <span> </span></button></fieldset> <div class="size-row"><label class="field"><span><span> </span> (px)</span> <input id="width" type="number" min="1" step="1" inputmode="numeric"/></label> <span class="times" aria-hidden="true">×</span> <label class="field"><span><span> </span> (px)</span> <input id="height" type="number" min="1" step="1" inputmode="numeric"/></label></div> <div id="split-controls" class="split-controls"><div class="field"><span> </span> <div class="stepper"><button type="button" id="split-less" class="sq" aria-label="Fewer images"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path></svg></button> <input id="split-count" type="number" min="2" max="20" step="1" inputmode="numeric"/> <button type="button" id="split-more" class="sq" aria-label="More images"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></button></div></div> <label class="field"><span> </span> <input id="split-size" type="number" min="16" step="1" inputmode="numeric"/></label> <p id="split-hint" class="hint"> </p></div> <p id="book-size-hint" class="hint"> </p> <p id="size-note" class="hint"> </p> <p id="split-note" class="hint"> </p> <label class="sr-only"><span> </span> <select id="preset" tabindex="-1"><!><option>—</option></select></label></section></section>`);function Sl(e,t){Ue(t,!0);let n=M(()=>Q.portrait?`portrait`:`landscape`),r=M(()=>Mo(Q.settings.width,Q.settings.height)),i=M(()=>Oo(Q.settings.width,Q.settings.height)),a={screen:`Screen`,print:`Print`},o=M(()=>[`screen`,`print`].map(e=>({group:e,choices:ko.filter(t=>t.group===e)}))),s=M(()=>Q.settings.splitImages),c=M(()=>Q.settings.height);function l(e){let t=Number(e.querySelector(`#width`).value),n=Number(e.querySelector(`#height`).value);Q.customSize=!0,Q.commitSize(t,n)}let u,d=P(0);var f=xl(),p=I(f),m=I(p),h=L(I(m),!0);j(m);var g=R(m,2),_=I(g),v=R(_,2);Jr(v,(e,t)=>tl?.(e,t),()=>({value:String(Q.pageCount),again:H(d)}));var y=R(v,2);j(g);var b=L(R(g,2),!0);j(p);var x=R(p,2),S=I(x),C=L(S,!0),w=R(S,2),ee=I(w);Hr(ee,17,()=>H(o),({group:e,choices:t})=>e,(e,t)=>{let r=()=>H(t).group,i=()=>H(t).choices;var o=yl(),s=rn(o),c=L(s,!0);Hr(R(s,2),17,i,e=>e.id,(e,t)=>{let r=M(()=>Ao(H(t),H(n)));var i=vl(),a=I(i),o=L(a,!0),s=L(R(a,2));j(i),z((e,n)=>{q(i,`data-choice`,H(t).id),q(i,`title`,e),q(i,`aria-pressed`,Q.activeSize===H(t).id),K(o,n),K(s,`${H(r).width??``} × ${H(r).height??``}`)},[()=>`${$(H(t).label)}: ${H(r).width} × ${H(r).height} px`,()=>$(H(t).label)]),U(`click`,i,()=>Q.chooseNamedSize(H(t).id)),G(e,i)}),z(e=>K(c,e),[()=>$(a[r()])]),G(e,o)});var te=R(ee,2),ne=L(te,!0),T=R(te,2),E=I(T),re=L(E,!0),ie=L(R(E,2),!0);j(T);var ae=R(T,2),oe=L(I(ae),!0);j(ae),j(w);var se=R(w,2),ce=I(se),le=L(R(I(ce),2),!0);j(ce);var ue=R(ce,2),de=L(R(I(ue),2),!0);j(ue),j(se);var fe=R(se,2),D=I(fe),pe=I(D),me=L(I(pe),!0);be(),j(pe);var he=R(pe,2);Jr(he,(e,t)=>tl?.(e,t),()=>({value:String(Q.settings.width),again:Q.sizeEpoch})),j(D);var O=R(D,4),ge=I(O),k=L(I(ge),!0);be(),j(ge);var _e=R(ge,2);Jr(_e,(e,t)=>tl?.(e,t),()=>({value:String(Q.settings.height),again:Q.sizeEpoch})),j(O),j(fe),Ti(fe,e=>u=e,()=>u);var A=R(fe,2),ve=I(A),ye=I(ve),xe=L(ye,!0),Se=R(ye,2),Ce=I(Se),we=R(Ce,2);Jr(we,(e,t)=>tl?.(e,t),()=>({value:String(H(s)),again:Q.sizeEpoch}));var Te=R(we,2);j(Se),j(ve);var Ee=R(ve,2),De=I(Ee),Oe=L(De,!0),ke=R(De,2);Jr(ke,(e,t)=>tl?.(e,t),()=>({value:String(H(c)),again:Q.sizeEpoch})),j(Ee);var Ae=L(R(Ee,2),!0);j(A);var je=R(A,2),Me=L(je,!0),Ne=R(je,2),Pe=L(Ne,!0),Fe=R(Ne,2),Ie=L(Fe,!0),Le=R(Fe,2),Re=I(Le),ze=L(Re,!0),Be=R(Re,2),Ve=I(Be);Hr(Ve,19,()=>Do,e=>e.label,(e,t,n)=>{var r=bl(),i=L(r,!0),a={};z(e=>{K(i,H(t).label),a!==(a=e)&&(r.value=(r.__value=a)??``)},[()=>String(H(n))]),G(e,r)});var He=R(Ve);He.value=He.__value=`custom`,j(Be),Jr(Be,(e,t)=>tl?.(e,t),()=>({value:H(i)>=0?String(H(i)):`custom`,again:Q.sizeEpoch})),j(Le),j(x),j(f),z((e,t,n,i,a,o,c,l,u,d,p,m,g,x,S,w,ee,te,E,se,fe,D,pe,O,ge,ve,ye)=>{q(f,`hidden`,Q.tab!==`poster`),K(h,e),q(_,`title`,t),q(_,`aria-label`,n),_.disabled=Q.pageCount<=1,q(v,`max`,Q.maxPages),q(y,`title`,i),q(y,`aria-label`,a),y.disabled=Q.pageCount>=Q.maxPages,K(b,o),K(C,c),K(ne,l),q(T,`title`,u),q(T,`aria-pressed`,Q.activeSize===`post`),K(re,d),K(ie,p),q(ae,`title`,m),q(ae,`aria-pressed`,Q.activeSize===`custom`),K(oe,g),q(ce,`title`,x),q(ce,`aria-pressed`,H(r)===`landscape`),ce.disabled=H(s)>1,K(le,S),q(ue,`title`,w),q(ue,`aria-pressed`,H(r)===`portrait`),ue.disabled=H(s)>1,K(de,ee),K(me,te),he.disabled=H(s)>1,K(k,E),_e.disabled=H(s)>1,q(A,`hidden`,H(s)<=1),K(xe,se),q(Ce,`title`,fe),Ce.disabled=H(s)<=Q.splitMin,q(Te,`title`,D),Te.disabled=H(s)>=Q.splitMax,K(Oe,pe),K(Ae,O),q(je,`hidden`,!Q.book),K(Me,ge),K(Pe,Q.sizeNote),q(Fe,`hidden`,H(s)<=1),K(Ie,ve),K(ze,ye)},[()=>$(`Pages`),()=>$(`One page fewer; photos are shared evenly again`),()=>$(`Fewer pages`),()=>$(`One page more; photos are shared evenly again`),()=>$(`More pages`),()=>$(`Photos are shared evenly across the pages. To place them yourself, add or remove pages and send photos between them.`),()=>$(`Output image size`),()=>$(`Social`),()=>$(`A wide collage cut into square images for an Instagram carousel`),()=>$(`Instagram post`),()=>$(`Several square images`),()=>$(`Type your own width and height`),()=>$(`Custom`),()=>$(`Wider than tall`),()=>$(`Landscape`),()=>$(`Taller than wide`),()=>$(`Portrait`),()=>$(`Width`),()=>$(`Height`),()=>$(`Number of images`),()=>$(`Fewer square images in the post`),()=>$(`More square images in the post`),()=>$(`Size of each image (px)`),()=>$(`The collage is made as one wide picture and cut into %(n)s squares when you save. Use Columns to change how it is arranged.`,{n:H(s)}),()=>$(`In a book, this is the size of each page.`),()=>$(`Dashed lines mark where the collage is split into %(n)s images of %(px)s × %(px)s pixels. They are saved as a zip, numbered _1 to _%(n)s from left to right.`,{n:H(s),px:H(c)}),()=>$(`Apply a template:`)]),U(`click`,_,()=>Q.setPageCount(Q.pageCount-1)),U(`change`,v,e=>{Q.setPageCount(Number(e.currentTarget.value)),Ht(d)}),U(`click`,y,()=>Q.setPageCount(Q.pageCount+1)),U(`click`,T,()=>Q.chooseInstagramPost()),U(`click`,ae,()=>{Q.chooseCustomSize(),u.querySelector(`#width`)?.focus()}),U(`click`,ce,()=>Q.turn(!1)),U(`click`,ue,()=>Q.turn(!0)),U(`input`,he,e=>l(e.currentTarget.closest(`.size-row`))),U(`change`,he,e=>l(e.currentTarget.closest(`.size-row`))),U(`input`,_e,e=>l(e.currentTarget.closest(`.size-row`))),U(`change`,_e,e=>l(e.currentTarget.closest(`.size-row`))),U(`click`,Ce,()=>Q.setSplit(H(s)-1,H(c),!0)),U(`change`,we,e=>{let t=Co(Number(e.currentTarget.value));t===0?e.currentTarget.value=String(H(s)):Q.setSplit(t,H(c),!0)}),U(`click`,Te,()=>Q.setSplit(H(s)+1,H(c),!0)),U(`change`,ke,e=>{let t=Number(e.currentTarget.value);Number.isFinite(t)&&t>=16?Q.setSplit(H(s),t,!0):e.currentTarget.value=String(H(c))}),U(`change`,Be,e=>{let t=Do[Number(e.currentTarget.value)];Q.customSize=!1,t&&Q.chooseSize(t.width,t.height)}),G(e,f),We()}vr([`click`,`change`,`input`]);var Cl=W(`<option>PDF</option>`),wl=W(`<div class="save-block" id="save-block"><div class="sheet-head only-narrow"><span class="grab" aria-hidden="true"></span> <h2> </h2> <button type="button" id="save-close" class="link"> </button></div> <p id="save-summary" class="meta"> </p> <div class="save-opts"><fieldset class="seg group" id="format-seg" aria-label="Format"><button type="button" id="format-png">PNG</button> <button type="button" id="format-jpeg">JPEG</button> <button type="button" id="format-pdf">PDF</button></fieldset> <select id="format" class="sr-only" tabindex="-1" aria-label="Format"><option>PNG</option><option>JPEG</option><!></select> <label class="field" id="quality-field"><span class="rowhead"><span class="quality-label"> </span> <output id="quality-output" for="quality"> </output></span> <input id="quality" class="range" type="range" min="10" max="100" step="1"/></label></div> <button type="button" id="save" class="primary wide"> </button></div>`);function Tl(e,t){Ue(t,!0);let n=Oi(t,`block`,15),r=M(()=>Q.settings.format===`jpeg`?`JPEG`:Q.settings.format===`pdf`?`PDF`:`PNG`),i=M(()=>Q.pageCounts.filter(e=>e>0).length),a=M(()=>Q.settings.splitImages>1),o=M(()=>H(i)*(H(a)?Q.settings.splitImages:1)),s=M(()=>Q.settings.format===`pdf`?Q.book&&H(i)>1?$(`PDF of %(n)s pages, %(w)s × %(h)s px each`,{n:H(i),w:Q.settings.width,h:Q.settings.height}):`PDF, ${Q.settings.width} × ${Q.settings.height} px`:Q.book&&H(o)>1?$(`ZIP of %(n)s %(kind)s images, %(w)s × %(h)s px each`,{n:H(o),kind:H(r),w:H(a)?Q.settings.height:Q.settings.width,h:Q.settings.height}):Q.settings.splitImages>1?$(`ZIP of %(n)s %(kind)s images, %(px)s × %(px)s px each`,{n:Q.settings.splitImages,kind:H(r),px:Q.settings.height}):`${H(r)}, ${Q.settings.width} × ${Q.settings.height} px`),c=M(()=>Math.round(Q.settings.jpegQuality*100));var l=wl(),u=I(l),d=R(I(u),2),f=L(d,!0),p=R(d,2),m=L(p,!0);j(u),Jr(u,(e,t)=>$c?.(e,t),()=>()=>Q.setTab(`save`,!0));var h=R(u,2),g=L(h,!0),_=R(h,2),v=I(_),y=I(v),b=R(y,2),x=R(b,2);j(v);var S=R(v,2),C=I(S);C.value=C.__value=`png`;var w=R(C);w.value=w.__value=`jpeg`;var ee=R(w),te=e=>{var t=Cl();t.value=t.__value=`pdf`,G(e,t)};Lr(ee,e=>{H(a)||e(te)}),j(S),Jr(S,(e,t)=>tl?.(e,t),()=>({value:Q.settings.format}));var ne=R(S,2),T=I(ne),E=I(T),re=L(E,!0),ie=L(R(E,2));j(T);var ae=R(T,2);let oe;Jr(ae,(e,t)=>tl?.(e,t),()=>({value:String(H(c)),again:Q.restoreEpoch,sticky:!0})),j(ne),j(_);var se=R(_,2),ce=L(se,!0);j(l),Ti(l,e=>n(e),()=>n()),z((e,t,n,r,i,o,l,u,d)=>{K(f,e),q(p,`title`,t),K(m,n),K(g,H(s)),q(y,`title`,r),q(y,`aria-pressed`,Q.settings.format===`png`),q(b,`title`,i),q(b,`aria-pressed`,Q.settings.format===`jpeg`),q(x,`title`,o),q(x,`aria-pressed`,Q.settings.format===`pdf`),q(x,`hidden`,H(a)),q(ne,`hidden`,Q.settings.format===`png`),K(re,l),K(ie,`${H(c)??``}%`),q(ae,`title`,u),oe=ai(ae,``,oe,{"--p":`${(H(c)-10)/90*100}%`}),q(se,`title`,H(s)),se.disabled=!Q.hasPhotos,K(ce,d)},[()=>$(`Save image`),()=>$(`Close the save options`),()=>$(`Close`),()=>$(`Save as PNG: exact colours, larger files`),()=>$(`Save as JPEG: smaller files`),()=>$(`Save as PDF: a document with a page for each page of the collage`),()=>$(`Quality`),()=>$(`JPEG quality (also used for PDF)`),()=>Q.book?$(`Save book...`):$(`Save poster...`)]),U(`click`,p,()=>Q.setTab(`save`,!0)),U(`click`,y,()=>Q.settings.format=`png`),U(`click`,b,()=>Q.settings.format=`jpeg`),U(`click`,x,()=>Q.settings.format=`pdf`),U(`change`,S,e=>Q.settings.format=e.currentTarget.value===`jpeg`?`jpeg`:e.currentTarget.value===`pdf`&&!H(a)?`pdf`:`png`),U(`input`,ae,e=>Q.settings.jpegQuality=Number(e.currentTarget.value)/100),U(`click`,se,()=>void Q.save()),G(e,l),We()}vr([`click`,`change`,`input`]);var El=W(`<option> </option>`),Dl=W(`<label class="field move-page" for="move-page"><span> </span> <select id="move-page"></select></label>`),Ol=W(`<section class="dock" id="selected-dock"><div class="rowhead"><h3 id="dock-name"> </h3> <button type="button" id="dock-done" class="link"> </button></div> <!> <button type="button" id="remove-selected" class="danger wide"> </button></section>`);function kl(e,t){Ue(t,!0);let n=M(()=>Q.selection.length),r=M(()=>H(n)>1);var i=Ol(),a=I(i),o=I(a),s=L(o,!0),c=R(o,2),l=L(c,!0);j(a);var u=R(a,2),d=e=>{var t=Dl(),n=I(t),r=L(n,!0),i=R(n,2);Hr(i,20,()=>Array.from({length:Q.pageCount},(e,t)=>t),e=>e,(e,t)=>{var n=El(),r=L(n,!0),i={};z((e,t)=>{K(r,e),i!==(i=t)&&(n.value=(n.__value=i)??``)},[()=>$(`Page %(n)s`,{n:t+1}),()=>String(t)]),G(e,n)}),j(i);var a;li(i),j(t),z((e,t)=>{K(r,e),a!==(a=t)&&(i.value=(i.__value=a)??``,ci(i,a))},[()=>$(`Page`),()=>String(Q.selectedPage)]),U(`change`,i,e=>Q.moveSelectedToPage(Number(e.currentTarget.value))),G(e,t)};Lr(u,e=>{Q.book&&e(d)});var f=R(u,2),p=L(f,!0);j(i),z((e,t,n,r,a,o)=>{q(i,`aria-label`,e),q(i,`hidden`,!Q.selectedPhoto),K(s,t),q(c,`title`,n),K(l,r),q(f,`title`,a),K(p,o)},[()=>H(r)?$(`Selected photos`):$(`Selected photo`),()=>H(r)?$(`%(n)s photos selected`,{n:H(n)}):Q.selectedPhoto?.name??``,()=>H(r)?$(`Deselect the photos`):$(`Deselect the photo`),()=>$(`Done`),()=>H(r)?$(`Take these photos out of the collage`):$(`Take this photo out of the collage`),()=>H(r)?$(`Remove %(n)s photos`,{n:H(n)}):$(`Remove selected photo`)]),U(`click`,c,()=>Q.deselect()),U(`click`,f,()=>Q.removeSelected()),G(e,i),We()}vr([`click`,`change`]);var Al=W(`<button type="button"></button>`),jl=W(`<button type="button"><span></span></button>`),Ml=W(`<section class="tabpanel" id="panel-style" role="tabpanel" aria-labelledby="tab-style"><section class="panel-card" aria-labelledby="layout-h"><h3 id="layout-h" class="card-title"> </h3> <fieldset class="cards layout-cards group" id="layout-cards" aria-labelledby="layout-h"><button type="button" class="card" id="layout-mosaic"><span class="card-head"><svg viewBox="0 0 40 30" aria-hidden="true"><rect x="1" y="1" width="8" height="12" rx="1.5"></rect><rect x="1" y="15" width="8" height="14" rx="1.5"></rect><rect x="11" y="1" width="8" height="16" rx="1.5"></rect><rect x="11" y="19" width="8" height="10" rx="1.5"></rect><rect x="21" y="1" width="8" height="9" rx="1.5"></rect><rect x="21" y="12" width="8" height="17" rx="1.5"></rect><rect x="31" y="1" width="8" height="13" rx="1.5"></rect><rect x="31" y="16" width="8" height="13" rx="1.5"></rect></svg> <b> </b></span> <small> </small></button> <button type="button" class="card" id="layout-gallery"><span class="card-head"><svg viewBox="0 0 40 30" aria-hidden="true"><rect x="1" y="1" width="17" height="16" rx="1.5"></rect><rect x="1" y="19" width="8" height="10" rx="1.5"></rect><rect x="11" y="19" width="7" height="10" rx="1.5"></rect><rect x="20" y="1" width="19" height="9" rx="1.5"></rect><rect x="20" y="12" width="9" height="17" rx="1.5"></rect><rect x="31" y="12" width="8" height="17" rx="1.5"></rect></svg> <b> </b></span> <small> </small></button></fieldset> <div id="columns-block" class="columns-block"><div class="inline-row"><label for="columns"> </label> <div class="stepper mini"><button type="button" id="columns-less" class="sq" aria-label="Fewer columns"><svg class="ico16" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path></svg></button> <input id="columns" type="number" min="1" step="1" inputmode="numeric"/> <button type="button" id="columns-more" class="sq" aria-label="More columns"><svg class="ico16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></button> <button type="button" id="columns-auto" class="mini-btn"> </button></div></div> <p id="columns-note" class="hint sr-only"> </p></div> <p id="gallery-note" class="hint"> </p> <span id="crop-note" class="trim"> </span> <div class="shuffle-row"><button type="button" id="regenerate" class="mini-btn"><svg class="ico16" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"></path><path d="M20 4v7h-7"></path></svg> <span> </span></button> <button type="button" id="shuffle-pages" class="mini-btn"><svg class="ico16" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h11l-3-3M20 17H9l3 3"></path></svg> <span> </span></button></div></section> <section class="panel-card" aria-labelledby="border-h"><h3 id="border-h" class="card-title"> </h3> <div class="inline-row"><span id="bw-h"> </span> <input id="border-width" class="range" type="range" min="0" max="100" step="1" aria-labelledby="bw-h"/> <output id="border-output" for="border-width"> </output></div> <div class="inline-row"><span id="bc-h"> </span> <fieldset class="swatches group" id="swatches" aria-labelledby="bc-h"><!> <input id="border-color" class="custom-swatch" type="color"/></fieldset></div> <div class="inline-row"><span id="cs-h"> </span> <fieldset class="seg corners-seg group" id="corner-cards" aria-labelledby="cs-h"></fieldset></div> <label class="sr-only"><span> </span> <select id="corner-style" tabindex="-1"><option> </option><option> </option><option> </option></select></label> <label class="switch" for="outer-border"><span> </span> <input id="outer-border" type="checkbox"/></label></section> <details id="technical" class="technical"><summary> </summary> <label class="field"><span> </span> <input id="seed" type="number" min="0" max="4294967295" step="1" inputmode="numeric"/></label> <p class="hint"> </p></details></section>`);function Nl(e,t){Ue(t,!0);let n=[{name:`White`,color:`#ffffff`},{name:`Black`,color:`#111111`},{name:`Cream`,color:`#f1e7d0`},{name:`Sage`,color:`#a3b18a`},{name:`Dusty blue`,color:`#8aa1b5`},{name:`Terracotta`,color:`#c8785a`}],r=[{value:`none`,label:`Square`},{value:`slight`,label:`Slight`},{value:`rounded`,label:`Rounded`}],i=M(()=>Q.layoutStyle===`gallery`),a=M(()=>ua(Q.settings.borderWidth)),o=(e,t,n)=>`${Math.min(100,Math.max(0,(e-t)/(n-t)*100))}%`,s=P(0);function c(e){let t=e.trim();Q.setColumns(t===``?void 0:Aa(Number(t)))}function l(e){let t=Number(e);Q.settings.borderWidth=Number.isFinite(t)?la(t):0}var u=Ml(),d=I(u),f=I(d),p=L(f,!0),m=R(f,2),h=I(m),g=I(h),_=L(R(I(g),2),!0);j(g);var v=L(R(g,2),!0);j(h);var y=R(h,2),b=I(y),x=L(R(I(b),2),!0);j(b);var S=L(R(b,2),!0);j(y),j(m);var C=R(m,2),w=I(C),ee=I(w),te=L(ee,!0),ne=R(ee,2),T=I(ne),E=R(T,2);Jr(E,(e,t)=>tl?.(e,t),()=>({value:Q.columns===void 0?``:String(Q.columns),again:H(s)}));var re=R(E,2),ie=R(re,2),ae=L(ie,!0);j(ne),j(w);var oe=L(R(w,2),!0);j(C);var se=R(C,2),ce=L(se,!0),le=R(se,2),ue=L(le,!0),de=R(le,2),fe=I(de),D=L(R(I(fe),2),!0);j(fe);var pe=R(fe,2),me=L(R(I(pe),2),!0);j(pe),j(de),j(d);var he=R(d,2),O=I(he),ge=L(O,!0),k=R(O,2),_e=I(k),A=L(_e,!0),ve=R(_e,2);let ye;Jr(ve,(e,t)=>tl?.(e,t),()=>({value:String(H(a)),again:Q.restoreEpoch,sticky:!0}));var be=L(R(ve,2));j(k);var xe=R(k,2),Se=I(xe),Ce=L(Se,!0),we=R(Se,2),Te=I(we);Hr(Te,17,()=>n,({name:e,color:t})=>t,(e,t)=>{let n=()=>H(t).name,r=()=>H(t).color;var i=Al();let a;z(e=>{q(i,`data-color`,r()),q(i,`aria-label`,n()),q(i,`title`,n()),q(i,`aria-pressed`,e),a=ai(i,``,a,{background:r()})},[()=>Q.settings.borderColor.toLowerCase()===r()]),U(`click`,i,()=>Q.settings.borderColor=r()),G(e,i)});var Ee=R(Te,2);gi(Ee),j(we),j(xe);var De=R(xe,2),Oe=I(De),ke=L(Oe,!0),Ae=R(Oe,2);Hr(Ae,21,()=>r,({value:e,label:t})=>e,(e,t)=>{let n=()=>H(t).value,r=()=>H(t).label;var i=jl(),a=L(i);z((e,t)=>{q(i,`data-corner`,n()),q(i,`title`,e),q(i,`aria-label`,t),q(i,`aria-pressed`,Q.settings.cornerStyle===n()),ri(a,1,`shape ${n()??``}`)},[()=>$(r()),()=>$(r())]),U(`click`,i,()=>Q.settings.cornerStyle=n()),G(e,i)}),j(Ae),j(De);var je=R(De,2),Me=I(je),Ne=L(Me,!0),Pe=R(Me,2),Fe=I(Pe),Ie=L(Fe,!0);Fe.value=Fe.__value=`none`;var Le=R(Fe),Re=L(Le,!0);Le.value=Le.__value=`slight`;var ze=R(Le),Be=L(ze,!0);ze.value=ze.__value=`rounded`,j(Pe),Jr(Pe,(e,t)=>tl?.(e,t),()=>({value:Q.settings.cornerStyle})),j(je);var Ve=R(je,2),He=I(Ve),Ge=L(He,!0),Ke=R(He,2);gi(Ke),j(Ve),j(he);var qe=R(he,2),Je=I(qe),Ye=L(Je,!0),Xe=R(Je,2),Ze=I(Xe),Qe=L(Ze,!0),$e=R(Ze,2);Jr($e,(e,t)=>tl?.(e,t),()=>({value:String(Q.seed)})),j(Xe);var et=L(R(Xe,2),!0);j(qe),j(u),z((e,t,n,r,o,s,c,l,d,f,m,g,b,w,ee,ne,de,he,O,k,j,xe,Se,we,Te,De,Oe,Ae,je,Me,Pe,Fe,Le,ze,He,Ue,We,qe,Je,Xe)=>{q(u,`hidden`,Q.tab!==`style`),K(p,e),q(h,`title`,t),q(h,`aria-pressed`,!H(i)),K(_,n),K(v,r),q(y,`title`,o),q(y,`aria-pressed`,H(i)),K(x,s),K(S,c),q(C,`hidden`,H(i)),K(te,l),q(T,`title`,d),q(E,`max`,100),q(E,`placeholder`,f),q(E,`title`,m),q(re,`title`,g),q(ie,`title`,b),q(ie,`hidden`,Q.columns===void 0),K(ae,w),K(oe,ee),q(se,`hidden`,!H(i)),K(ce,ne),q(le,`title`,de),K(ue,he),q(fe,`title`,O),K(D,k),q(pe,`title`,j),q(pe,`hidden`,!Q.book),K(me,xe),K(ge,Se),q(_e,`title`,we),K(A,Te),q(ve,`title`,De),ye=ai(ve,``,ye,{"--p":Oe}),K(be,`${H(a)??``}%`),K(Ce,Ae),q(Ee,`aria-label`,je),q(Ee,`title`,Me),_i(Ee,Q.settings.borderColor),K(ke,Pe),K(Ne,Fe),K(Ie,Le),K(Re,ze),K(Be,He),q(Ve,`title`,Ue),K(Ge,We),vi(Ke,Q.settings.outerBorder),K(Ye,qe),K(Qe,Je),K(et,Xe)},[()=>$(`Arrangement`),()=>$(`Mosaic: photos fill columns of different heights`),()=>$(`Mosaic`),()=>$(`Photos fill columns of different heights.`),()=>$(`Gallery: one panel per photo`),()=>$(`Gallery`),()=>$(`The collage is split into panels, one per photo.`),()=>$(`Columns`),()=>$(`One column fewer`),()=>Q.columnsInUse===void 0?$(`Auto`):$(`Auto · %(n)s`,{n:Q.columnsInUse}),()=>$(`Type a number of columns, or leave empty for automatic`),()=>$(`One column more`),()=>$(`Let the layout choose the columns`),()=>$(`Auto`),()=>Q.columnsInUse===void 0?``:$(`Columns in use: %(n)s`,{n:Q.columnsInUse}),()=>$(`Gallery sizes its panels itself.`),()=>$(`Lower means more of each photo is visible.`),()=>Q.layout?$(`%(pct)s% of each photo is trimmed to fit.`,{pct:Q.cropPercent}):``,()=>Q.book?$(`A new arrangement on every page; photos stay on their pages`):$(`Try a new arrangement of the same photos`),()=>Q.book?$(`Shuffle layout within pages`):$(`Shuffle layout`),()=>$(`Mix the photos between the pages, keeping how many each has`),()=>$(`Shuffle all between pages`),()=>$(`Border`),()=>$(`0 removes the border; full is a tenth of the collage's longer side.`),()=>$(`Thickness`),()=>$(`0 removes the border; full is a tenth of the collage's longer side.`),()=>o(H(a),0,100),()=>$(`Colour`),()=>$(`Custom colour`),()=>$(`Custom colour`),()=>$(`Corners`),()=>$(`Corner style`),()=>$(`None`),()=>$(`Slightly rounded`),()=>$(`Rounded`),()=>$(`Turn off to keep the border only between photos.`),()=>$(`Around the edge`),()=>$(`Technical configuration`),()=>$(`Seed`),()=>$(`The same photos, seed and number of columns always give the same layout. When photos are added, the seed of the best of 30 tries is shown here.`)]),U(`click`,h,()=>Q.chooseLayout(`mosaic`)),U(`click`,y,()=>Q.chooseLayout(`gallery`)),U(`click`,T,()=>Q.stepColumns(-1)),U(`input`,E,e=>c(e.currentTarget.value)),U(`change`,E,e=>{c(e.currentTarget.value),Ht(s)}),U(`click`,re,()=>Q.stepColumns(1)),U(`click`,ie,()=>Q.setColumns(void 0)),U(`click`,fe,()=>Q.askShuffle(!1)),U(`click`,pe,()=>Q.askShuffle(!0)),U(`input`,ve,e=>l(e.currentTarget.value)),U(`input`,Ee,e=>Q.settings.borderColor=e.currentTarget.value),U(`change`,Pe,e=>{let t=e.currentTarget.value;Q.settings.cornerStyle=t===`slight`||t===`rounded`?t:`none`}),U(`change`,Ke,e=>Q.settings.outerBorder=e.currentTarget.checked),U(`change`,$e,e=>{Q.setSeed(Number(e.currentTarget.value))||(e.currentTarget.value=String(Q.seed))}),G(e,u),We()}vr([`click`,`input`,`change`]);var Pl=W(`<option> </option>`),Fl=W(`<aside class="side panel" aria-label="Controls"><div class="brand"><h1>Collage Creator</h1> <div class="brand-actions"><button type="button" id="help-open-head" class="icon-btn help-btn" aria-haspopup="dialog" aria-label="Help">?</button> <button type="button" id="menu-open" class="icon-btn menu-btn" aria-controls="util" aria-label="Menu: language and about"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"></path></svg></button></div></div> <div id="tabs" role="tablist" aria-label="Settings"><button type="button" role="tab" id="tab-photos" aria-controls="panel-photos"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><circle cx="9" cy="10" r="1.5"></circle><path d="m21 16-5-5-9 8"></path></svg> <span><span class="num">1.</span><span> </span></span></button> <button type="button" role="tab" id="tab-poster" aria-controls="panel-poster"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M12 3v18M3 12h9M12 8h9"></path></svg> <span><span class="num">2.</span><span> </span></span></button> <button type="button" role="tab" id="tab-style" aria-controls="panel-style"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5S14 15 15 15h2a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"></path></svg> <span><span class="num">3.</span><span> </span></span></button> <button type="button" role="tab" id="tab-save" class="tab-save" aria-controls="save-block"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"></path></svg> <span> </span></button></div> <div class="sheet" id="sheet"><div class="sheet-head"><span class="grab" aria-hidden="true"></span> <h2 id="sheet-title"> </h2> <button type="button" id="sheet-close" class="link"> </button></div> <!> <!> <!></div> <!> <!> <div class="util" id="util"><div class="util-row"><label class="help-btn lang-btn"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"></path></svg> <span class="sr-only"> </span> <select id="language" class="lang-select"></select></label> <button type="button" id="about-open" class="link"> </button></div></div></aside>`);function Il(e,t){Ue(t,!0);let n={photos:`Photos`,poster:`Poster`,style:`Style`,save:`Save image`},r,i=P(void 0),a,o=P(!1);gn(()=>{if(Q.riseToken===0)return;let e=Q.tab===`save`?H(i):r;e&&(e.classList.remove(`rise`),e.offsetWidth,e.classList.add(`rise`))}),gn(()=>{Q.tab,r.scrollTop=0,F(o,!1)});function s(e){if(e.key!==`ArrowRight`&&e.key!==`ArrowLeft`)return;let t=[...a.querySelectorAll(`[role="tab"]`)].filter(e=>e.offsetParent!==null),n=t.map(e=>e.id.replace(`tab-`,``)),r=n[(n.indexOf(Q.tab)+(e.key===`ArrowRight`?1:-1)+n.length)%n.length];r&&(e.preventDefault(),Q.setTab(r,!1),t[n.indexOf(r)]?.focus())}function c(e){try{let t=e.replace(`_`,`-`);return new Intl.DisplayNames([t],{type:`language`}).of(t)??e}catch{return e}}let l=e=>e===Q.tab&&(!Q.narrow||Q.sheetOpen);var u=Fl();_r(`click`,Yt,e=>{Q.menuOpen&&(e.target instanceof Node&&e.target.closest?.(`#util`)||Q.closeMenu())});var d=I(u),f=R(I(d),2),p=I(f),m=R(p,2);j(f),j(d);var h=R(d,2);let g;var _=I(h),v=R(I(_),2),y=L(R(I(v)),!0);j(v),j(_);var b=R(_,2),x=R(I(b),2),S=L(R(I(x)),!0);j(x),j(b);var C=R(b,2),w=R(I(C),2),ee=L(R(I(w)),!0);j(w),j(C);var te=R(C,2),ne=L(R(I(te),2),!0);j(te),j(h),Ti(h,e=>a=e,()=>a);var T=R(h,2),E=I(T),re=R(I(E),2),ie=L(re,!0),ae=R(re,2),oe=L(ae,!0);j(E),Jr(E,(e,t)=>$c?.(e,t),()=>()=>Q.setTab(Q.tab,!0));var se=R(E,2);_l(se,{});var ce=R(se,2);Sl(ce,{}),Nl(R(ce,2),{}),j(T),Ti(T,e=>r=e,()=>r);var le=R(T,2);kl(le,{});var ue=R(le,2),de=e=>{Tl(e,{get block(){return H(i)},set block(e){F(i,e,!0)}})};Lr(ue,e=>{Q.narrow&&e(de)});var fe=R(ue,2),D=I(fe),pe=I(D),me=R(I(pe),2),he=L(me,!0),O=R(me,2);Hr(O,20,()=>Ji,e=>e,(e,t)=>{var n=Pl(),r=L(n,!0),i={};z(e=>{K(r,e),i!==(i=t)&&(n.value=(n.__value=i)??``)},[()=>c(t)]),G(e,n)}),j(O);var ge;li(O),j(pe);var k=R(pe,2),_e=L(k,!0);j(D),j(fe),j(u),z((e,t,n,r,i,a,s,c,l,u,d,f,v,x,w,T,E,re,se,ce,le)=>{q(p,`title`,e),q(m,`title`,t),q(m,`aria-expanded`,Q.menuOpen),g=ri(h,1,`tabs`,null,g,{lifted:H(o)}),q(_,`title`,n),q(_,`aria-selected`,r),q(_,`tabindex`,Q.tab===`photos`?0:-1),K(y,i),q(b,`title`,a),q(b,`aria-selected`,s),q(b,`tabindex`,Q.tab===`poster`?0:-1),K(S,c),q(C,`title`,l),q(C,`aria-selected`,u),q(C,`tabindex`,Q.tab===`style`?0:-1),K(ee,d),q(te,`title`,f),q(te,`aria-selected`,v),q(te,`tabindex`,Q.tab===`save`?0:-1),K(ne,x),K(ie,w),q(ae,`title`,T),K(oe,E),q(pe,`title`,re),K(he,se),ge!==(ge=Q.lang)&&(O.value=(O.__value=ge)??``,ci(O,ge)),q(k,`title`,ce),K(_e,le)},[()=>$(`Help`),()=>$(`Language and about`),()=>$(`Add and arrange photos`),()=>l(`photos`),()=>$(`Photos`),()=>$(`Pages, output size and shape`),()=>l(`poster`),()=>$(`Poster`),()=>$(`Layout, borders and corners`),()=>l(`style`),()=>$(`Style`),()=>$(`Save the collage`),()=>l(`save`),()=>$(`Save`),()=>$(n[Q.tab]),()=>$(`Close this panel`),()=>$(`Close`),()=>`${$(`Language`)}: ${c(Q.lang)}`,()=>$(`Language`),()=>$(`About Collage Creator`),()=>$(`About`)]),U(`click`,p,()=>Q.dialog=`help`),U(`click`,m,e=>{e.stopPropagation(),Q.menuOpen=!Q.menuOpen}),U(`keydown`,h,s),U(`click`,_,()=>Q.setTab(`photos`,!0)),U(`click`,b,()=>Q.setTab(`poster`,!0)),U(`click`,C,()=>Q.setTab(`style`,!0)),U(`click`,te,()=>Q.setTab(`save`,!0)),_r(`scroll`,T,()=>F(o,r.scrollTop>1)),U(`click`,ae,()=>Q.setTab(Q.tab,!0)),U(`change`,O,e=>Q.chooseLanguage(e.currentTarget.value)),U(`click`,k,()=>Q.dialog=`about`),G(e,u),We()}vr([`click`,`keydown`,`change`]);var Ll=W(` <span class="rows-badge"> </span>`,1),Rl=W(`<div class="crop-tools" id="crop-tools"><input id="crop-zoom" type="range" min="1" step="0.01"/> <span class="crop-pct" aria-hidden="true"> </span> <button type="button" id="crop-done" class="crop-done" aria-keyshortcuts="Enter"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg></button></div>`),zl=W(`<fieldset class="photo-actions group" id="photo-actions"><button type="button" id="span-wider" aria-keyshortcuts="W"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="10" rx="2"></rect><path d="M7 12h10M7 12l2-2M7 12l2 2M17 12l-2-2M17 12l-2 2"></path></svg> <span> </span></button> <button type="button" id="span-taller" aria-keyshortcuts="T"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="3" width="10" height="18" rx="2"></rect><path d="M12 7v10M12 7l-2 2M12 7l2 2M12 17l-2-2M12 17l2-2"></path></svg> <span> <!></span></button> <span class="actions-sep" aria-hidden="true"></span> <button type="button" id="crop-toggle" aria-controls="crop-tools" aria-keyshortcuts="C"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2v14a2 2 0 0 0 2 2h14M2 6h14a2 2 0 0 1 2 2v14"></path></svg> <span> </span></button> <!></fieldset>`);function Bl(e,t){Ue(t,!0);let n=M(()=>Q.selectedPhoto?.span??{columns:1,rows:1}),r=M(()=>Q.selectedPhoto?.crop?.zoom??1),i=M(()=>Q.multiSelected);var a=zl(),o=I(a),s=L(R(I(o),2),!0);j(o);var c=R(o,2),l=R(I(c),2),u=I(l,!0),d=R(u),f=e=>{var t=Ll(),r=rn(t,!0);r.nodeValue=` `;var i=L(R(r));z(()=>K(i,`×${H(n).rows??``}`)),G(e,t)};Lr(d,e=>{H(n).rows>1&&e(f)}),j(l),j(c);var p=R(c,4),m=L(R(I(p),2),!0);j(p);var h=R(p,2),g=e=>{var t=Rl(),n=I(t);gi(n);var i=R(n,2),a=L(i),o=R(i,2);j(t),z((e,t,i,s,c)=>{q(n,`max`,Q.maxZoom),_i(n,H(r)),q(n,`aria-label`,e),q(n,`title`,t),K(a,`${i??``}%`),q(o,`title`,s),q(o,`aria-label`,c)},[()=>$(`Zoom into the photo; all the way out undoes the crop`),()=>$(`Zoom into the photo; all the way out undoes the crop`),()=>Math.round(H(r)*100),()=>$(`Done cropping`),()=>$(`Done cropping`)]),U(`input`,n,e=>Q.zoomSelectedCrop(Number(e.currentTarget.value))),U(`click`,o,()=>Q.toggleCrop()),G(e,t)};Lr(h,e=>{Q.cropping&&e(g)}),j(a),z((e,t,r,l,d,f,h)=>{q(a,`aria-label`,e),q(o,`title`,t),q(o,`aria-pressed`,H(n).columns===2),K(s,r),q(c,`title`,l),q(c,`aria-pressed`,H(n).rows>1),K(u,d),q(p,`title`,f),p.disabled=H(i),q(p,`aria-pressed`,Q.cropping),q(p,`aria-expanded`,Q.cropping),K(m,h)},[()=>$(`Photo actions`),()=>H(i)?$(`Give these photos two columns`):$(`Give this photo two columns`),()=>$(`Wider`),()=>H(i)?$(`Give these photos more rows`):$(`Give this photo more rows`),()=>$(`Taller`),()=>H(i)?$(`Select one photo to crop`):Q.cropping?$(`Finish cropping`):$(`Choose which part of the photo shows`),()=>$(`Crop`)]),U(`click`,o,()=>Q.toggleWider()),U(`click`,c,()=>Q.cycleTaller()),U(`click`,p,()=>Q.toggleCrop()),G(e,a),We()}vr([`click`,`input`]);var Vl=W(`<span class="page-label"> <span class="page-count"> </span></span>`),Hl=W(`<div role="group"><!> <button type="button" class="icon-btn page-left"><svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"></path></svg></button> <button type="button" class="icon-btn page-right"><svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"></path></svg></button> <button type="button" class="icon-btn page-save"><svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"></path></svg></button> <button type="button" class="icon-btn page-remove"><svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg></button></div>`),Ul=W(`<button type="button" id="add-page-tile" class="add-page"><svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg> <span> </span></button>`),Wl=W(`<!> <!>`,1);function Gl(e,t){Ue(t,!0);let n=M(()=>Q.posterBox),r=M(()=>Q.layout?.pages??[]),i=M(()=>Q.isSplit?66:10),a=M(()=>Q.isSplit?68:12),o=M(()=>H(n)?{left:H(n).x+H(n).w,top:H(n).y+H(n).h+H(a)}:null),s=P(null),c=M(()=>H(s)??H(o)),l=M(()=>{if(!H(n))return 0;let e=H(r)[H(r).length-1];return e?e.w*H(n).w:H(n).w});var u=Wl(),d=rn(u),f=e=>{var t=Dr();Hr(rn(t),17,()=>H(r),Rr,(e,t,a)=>{let o=M(()=>H(t).w*H(n).w),s=M(()=>Q.pageCounts[a]??0);var c=Dr(),l=rn(c),u=e=>{var c=Hl();let l,u;var d=I(c),f=e=>{var t=Vl(),n=I(t),r=L(R(n));j(t),z(e=>{K(n,`${e??``} `),K(r,`· ${H(s)??``}`)},[()=>$(`Page %(n)s`,{n:a+1})]),G(e,t)};Lr(d,e=>{H(o)>=240&&e(f)});var p=R(d,2);p.disabled=a===0;var m=R(p,2),h=R(m,2),g=R(h,2);j(c),z((e,d,f,_,v,y,b,x,S)=>{l=ri(c,1,`page-pill`,null,l,{compact:H(o)<240}),q(c,`aria-label`,e),u=ai(c,``,u,{left:`${H(n).x+(H(t).x+H(t).w/2)*H(n).w}px`,top:`${H(n).y-H(i)}px`}),q(p,`title`,d),q(p,`aria-label`,f),q(m,`title`,_),q(m,`aria-label`,v),m.disabled=a===H(r).length-1,q(h,`title`,y),q(h,`aria-label`,b),h.disabled=H(s)===0,q(g,`title`,x),q(g,`aria-label`,S)},[()=>$(`Page %(n)s of %(total)s`,{n:a+1,total:H(r).length}),()=>$(`Move page %(n)s left`,{n:a+1}),()=>$(`Move page %(n)s left`,{n:a+1}),()=>$(`Move page %(n)s right`,{n:a+1}),()=>$(`Move page %(n)s right`,{n:a+1}),()=>$(`Save page %(n)s`,{n:a+1}),()=>$(`Save page %(n)s`,{n:a+1}),()=>$(`Remove page %(n)s`,{n:a+1}),()=>$(`Remove page %(n)s`,{n:a+1})]),U(`click`,p,()=>Q.movePage(a,-1)),U(`click`,m,()=>Q.movePage(a,1)),U(`click`,h,()=>void Q.save(a)),U(`click`,g,()=>Q.askRemovePage(a)),G(e,c)};Lr(l,e=>{H(o)>=156&&e(u)}),G(e,c)}),G(e,t)};Lr(d,e=>{H(n)&&Q.hasPhotos&&Q.book&&e(f)});var p=R(d,2),m=e=>{var t=Ul();let n;var r=L(R(I(t),2),!0);j(t),z((e,i)=>{q(t,`title`,e),n=ai(t,``,n,{left:`${H(c)?.left??0}px`,top:`${H(c)?.top??0}px`}),K(r,i)},[()=>$(`Add a blank page after the last one`),()=>$(`Add page`)]),_r(`pointerenter`,t,()=>F(s,H(o),!0)),_r(`pointerleave`,t,()=>F(s,null)),U(`click`,t,()=>Q.addPage()),G(e,t)};Lr(p,e=>{H(n)&&Q.hasPhotos&&Q.pageCount<Q.maxPages&&H(l)>=156&&e(m)}),G(e,u),We()}vr([`click`]);var Kl=W(`<div class="restoring-stage" role="status"><progress></progress> <h2> </h2> <p> </p></div>`),ql=W(`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><circle cx="9" cy="10" r="1.5"></circle><path d="m21 16-5-5-9 8"></path></svg> <h2> </h2> <p> </p> <button type="button" id="add-empty"> </button>`,1),Jl=W(`<div id="canvas-box"><canvas id="preview" tabindex="0" role="application" aria-label="Collage preview. Use arrow keys to move between photos, Enter to pick one and Enter on another to swap them, Delete to remove the photo, Escape to cancel. Plus and minus zoom, Shift and arrow keys pan, zero fits the window. With a mouse, drag to pan, scroll to zoom, or choose Swap to click two photos and swap them."></canvas> <!> <section id="empty-state" class="empty" aria-label="Drop photos here"><!></section></div>`);function Yl(e,t){Ue(t,!0);let n,r,i=P(0),a=P(0),o=P(!1),s=[],c={x:0,y:0},l=1,u=!1,d=-1,f=P(-1),p=null,m={x:0,y:0},h=!1,g=null,_=!1,v=new Map,y=null,b=!1;function x(){let[e,t]=[...v.values()];return!e||!t?null:{dist:Math.hypot(e.x-t.x,e.y-t.y),mid:{x:(e.x+t.x)/2,y:(e.y+t.y)/2}}}function S(e){v.delete(e.pointerId),y&&v.size<2&&(y=null,b=v.size>0)}let C=M(()=>Q.fitPoster({w:H(i),h:H(a)},!0));gn(()=>{Q.viewport={w:H(i),h:H(a)}});function w(){u||(u=!0,r.dataset.pending=`1`,requestAnimationFrame(()=>{u=!1;try{ee()}finally{r.dataset.pending=`0`}}))}function ee(){let e={w:n.clientWidth,h:n.clientHeight},t=Q.fitPoster(e),i=Math.min(window.devicePixelRatio||1,2),a=Math.max(1,Math.round(e.w*i)),o=Math.max(1,Math.round(e.h*i)),u=r.width!==a||r.height!==o;u&&(r.width=a,r.height=o);let d=r.getContext(`2d`);if(!d)return;u||(d.setTransform(1,0,0,1,0,0),d.clearRect(0,0,a,o));let p=getComputedStyle(document.documentElement).getPropertyValue(`--sub`).trim()||`#3b3b37`,m=Oc(t,Q.view),h=kc(e,t,Q.view),g=Math.max(1,Math.round(m.w*i)),_=Math.max(1,Math.round(m.h*i)),v=Math.round(h.x*i),y=Math.round(h.y*i);c={x:v,y},l=g,r.dataset.poster=[v,y,g,_].map(e=>(e/i).toFixed(1)).join(`,`),r.dataset.photos=(Q.layout?.placements??[]).map(e=>Q.photos[e.photoIndex]?.id??`?`).join(`,`);let b=Q.selectedPhoto?.crop;r.dataset.crop=b?[b.zoom,b.x,b.y].map(e=>e.toFixed(3)).join(`,`):``;let x=Q.layout;if(!x){s=[],Q.posterBox!==null&&(Q.posterBox=null);return}let S={x:v/i,y:y/i,w:g/i,h:_/i},C=Q.posterBox;C&&C.x===S.x&&C.y===S.y&&C.w===S.w&&C.h===S.h||(Q.posterBox=S),d.save(),d.shadowColor=`rgba(0, 0, 0, 0.35)`,d.shadowBlur=12*i,d.shadowOffsetY=2*i,d.fillStyle=`#ffffff`;for(let e of x.pages??[{x:0,w:1}]){let t=Math.round(e.x*g);d.fillRect(v+t,y,Math.round((e.x+e.w)*g)-t,_)}d.restore(),d.save(),d.translate(v,y);let w=ze(Q.settings);s=mc(d,g,_,{layout:x,thumbs:Q.photos.map(e=>e.thumb),crops:Q.photos.map(e=>e.crop),settings:w});let ee=sa(x)[Q.focused];if(Q.canvasFocused&&Q.focusRing&&ee!==void 0){let e=s[ee];e&&_c(d,e,`#ff9d00`)}let T=Q.activeMode!==`pan`&&!Q.cropping,E=new Set(Q.selection),ie=s[H(f)];T&&ie&&!E.has(re(H(f))??-1)&&(d.fillStyle=`rgba(0, 0, 0, 0.22)`,d.fillRect(ie.x,ie.y,ie.w,ie.h));for(let e of Q.selection){let t=x.placements.findIndex(t=>t.photoIndex===e),n=s[t];n&&(Q.cropping?_c(d,n,`#1f5fbf`):te(d,n,i,Ys(w.cornerStyle,n.w,n.h)))}if(d.restore(),x.pages&&ne(d,x,{x:v,y,w:g,h:_},i,p),w.splitImages>1){let e=p;(x.pages??[{x:0,w:1}]).forEach((t,n)=>{let r=Math.round(t.x*g);Sc(d,{x:v+r,y,w:Math.round((t.x+t.w)*g)-r,h:_},w.splitImages,i,e,n>0?``:J(`Cut along the dashed lines: the collage is split into %(n)s images for the post.`,{n:w.splitImages}))})}}function te(e,t,n,r){let i=`#1f5fbf`,a=4*n;e.save(),e.lineJoin=`round`,e.strokeStyle=`rgba(255, 255, 255, 0.9)`,e.lineWidth=a+2*n,e.beginPath(),e.roundRect(t.x+a/2,t.y+a/2,t.w-a,t.h-a,r),e.stroke(),e.strokeStyle=i,e.lineWidth=a,e.beginPath(),e.roundRect(t.x+a/2,t.y+a/2,t.w-a,t.h-a,r),e.stroke();let o=Math.min(11*n,Math.min(t.w,t.h)/5);if(o>=5*n){let r=t.x+t.w-a-o-4*n,s=t.y+a+o+4*n;e.shadowColor=`rgba(0, 0, 0, 0.3)`,e.shadowBlur=4*n,e.fillStyle=i,e.beginPath(),e.arc(r,s,o,0,Math.PI*2),e.fill(),e.shadowColor=`transparent`,e.strokeStyle=`#fff`,e.lineWidth=Math.max(1.5*n,o/6),e.stroke(),e.lineCap=`round`,e.beginPath(),e.moveTo(r-o*.42,s+o*.02),e.lineTo(r-o*.1,s+o*.34),e.lineTo(r+o*.45,s-o*.3),e.stroke()}e.restore()}function ne(e,t,n,r,i){let a=t.pages??[];e.save(),e.fillStyle=i,e.font=`${13*r}px system-ui, sans-serif`,e.textAlign=`center`,e.textBaseline=`top`,a.forEach((t,a)=>{let o=n.x+Math.round(t.x*n.w),s=Math.round((t.x+t.w)*n.w)-Math.round(t.x*n.w);if((Q.pageCounts[a]??0)===0){e.setLineDash([6*r,4*r]),e.strokeStyle=i,e.lineWidth=1.5*r,e.strokeRect(o+.5*r,n.y+.5*r,s-r,n.h-r),e.setLineDash([]);let t=J(`Drop or move photos here`);e.measureText(t).width<=s-16*r&&e.fillText(t,o+s/2,n.y+n.h/2)}}),e.restore()}gn(()=>{Q.layout,Q.photos,ze(Q.settings),Q.view,Q.selection,H(f),Q.activeMode,Q.pageCounts,Q.cropping,Q.focused,Q.canvasFocused,Q.focusRing,Q.narrow,Q.lang,H(i),H(a),w()});function T(e,t){let n=r.getBoundingClientRect(),i=(e-n.left)/n.width*r.width-c.x,a=(t-n.top)/n.height*r.height-c.y;return s.findIndex(e=>i>=e.x&&i<e.x+e.w&&a>=e.y&&a<e.y+e.h)}function E(){p=null,F(o,!1)}function re(e){return Q.layout?.placements[e]?.photoIndex}function ie(e){if(e.pointerType===`touch`){if(v.set(e.pointerId,{x:e.clientX,y:e.clientY}),v.size===2){try{r.setPointerCapture(e.pointerId)}catch{}g=null,E(),d=-1,y=x();return}if(v.size>2)return}r.focus(),Q.focusRing=!1;let t=(Q.layout?sa(Q.layout):[]).indexOf(T(e.clientX,e.clientY));if(t>=0&&(Q.focused=t),Q.cropping&&!Q.spaceHeld){let t=re(T(e.clientX,e.clientY));t===Q.selected?(g={x:e.clientX,y:e.clientY},r.setPointerCapture(e.pointerId),e.preventDefault()):t===void 0?Q.spaceHeld||(_=!0,Q.deselect()):(_=!0,Q.selectPhoto(t))}else Q.spaceHeld||Q.mode===`pan`?(p={x:e.clientX,y:e.clientY},m={x:e.clientX,y:e.clientY},r.setPointerCapture(e.pointerId),F(o,!0),e.preventDefault()):d=T(e.clientX,e.clientY)}function ae(e){if(v.has(e.pointerId)&&v.set(e.pointerId,{x:e.clientX,y:e.clientY}),y){let e=x();if(!e||y.dist<=0)return;let t=r.getBoundingClientRect();Q.zoomAtPoint(e.dist/y.dist,{x:e.mid.x-t.left,y:e.mid.y-t.top}),Q.panBy(e.mid.x-y.mid.x,e.mid.y-y.mid.y),y=e;return}if(g){let t=r.getBoundingClientRect(),n=r.width/t.width/l;Q.panSelectedCrop((e.clientX-g.x)*n,(e.clientY-g.y)*n),g={x:e.clientX,y:e.clientY};return}if(!p){e.pointerType!==`touch`&&F(f,Q.activeMode===`pan`?-1:T(e.clientX,e.clientY),!0);return}let t=e.clientX-p.x,n=e.clientY-p.y;p={x:e.clientX,y:e.clientY},Q.panBy(t,n)}function oe(e){let t=y!==null||b;if(S(e),t){v.size===0&&(b=!1),E(),g=null,d=-1;return}if(_){_=!1;return}if(p){Math.hypot(e.clientX-m.x,e.clientY-m.y)<4&&!Q.spaceHeld&&!Q.cropping&&Q.deselect(),E();return}if(g||Q.cropping){g=null;return}let n=T(e.clientX,e.clientY);if(n<0)Q.deselect(),d=-1;else if(Q.mode===`select`){let t=re(n);t!==void 0&&Q.selectInPhotos(t,e.shiftKey)}else d>=0&&d!==n&&Q.selected===null&&Q.pick(d),Q.pick(n),d=-1}function se(e){if(Q.activeMode!==`select`)return;let t=re(T(e.clientX,e.clientY));t!==void 0&&Q.cropPhoto(t)}function ce(e){e.preventDefault();let t=e.deltaMode===1?16:e.deltaMode===2?400:1,n=Math.exp(-e.deltaY*t*(e.ctrlKey?.01:.0015)),i=r.getBoundingClientRect();Q.zoomAtPoint(n,{x:e.clientX-i.left,y:e.clientY-i.top})}function le(e){return e instanceof HTMLInputElement||e instanceof HTMLSelectElement||e instanceof HTMLTextAreaElement||e instanceof HTMLButtonElement}function ue(e){Q.setSpaceHeld(e),e||E()}function de(e){if(e.ctrlKey||e.metaKey||e.altKey||e.repeat||Q.dialog||Q.mode===`swap`||Q.selected===null||e.target instanceof HTMLElement&&(e.target.isContentEditable||e.target.closest(`a, summary`)))return!1;let t=e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement||e.target instanceof HTMLTextAreaElement,n=e.key.toLowerCase();if(t&&e.target instanceof HTMLInputElement&&e.target.type!==`range`||t&&!(e.target instanceof HTMLInputElement))return!1;if(n===`w`)Q.toggleWider();else if(n===`t`)Q.cycleTaller();else if(n===`c`&&!Q.multiSelected)Q.toggleCrop();else if(e.key===`Enter`&&Q.cropping&&!le(e.target))Q.toggleCrop();else return!1;return e.preventDefault(),!0}function fe(e){if(e.code!==`Space`){e.target!==r&&de(e);return}let t=h&&e.target instanceof HTMLButtonElement;le(e.target)&&!t||!h&&document.activeElement!==r||(e.preventDefault(),e.repeat||ue(!0))}function D(e){e.code===`Space`&&(Q.spaceHeld&&e.preventDefault(),ue(!1))}function pe(e){if(de(e))return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`z`){e.preventDefault(),Q.undoRemove();return}if(e.key===`+`||e.key===`=`){e.preventDefault(),Q.zoomAtCentre(1.25);return}if(e.key===`-`||e.key===`_`){e.preventDefault(),Q.zoomAtCentre(.8);return}if(e.key===`0`){e.preventDefault(),Q.fitView();return}if(e.shiftKey&&e.key.startsWith(`Arrow`)){e.preventDefault();let t=e.key===`ArrowLeft`?40:e.key===`ArrowRight`?-40:0,n=e.key===`ArrowUp`?40:e.key===`ArrowDown`?-40:0;Q.panBy(t,n);return}if(Q.cropping&&e.key.startsWith(`Arrow`)){e.preventDefault();let t=.01,n=e.key===`ArrowLeft`?-.01:e.key===`ArrowRight`?t:0,r=e.key===`ArrowUp`?-.01:e.key===`ArrowDown`?t:0;Q.panSelectedCrop(n,r);return}let t=Q.layout;if(!t)return;let n=sa(t);if((e.key.startsWith(`Arrow`)||e.key===`Enter`)&&(Q.focusRing=!0),e.key===`Delete`||e.key===`Backspace`){if(Q.selected!==null){e.preventDefault(),Q.removeSelected();return}let r=Q.selected??t.placements[n[Q.focused]??-1]?.photoIndex,i=r===void 0?void 0:Q.photos[r];e.preventDefault(),i&&Q.askRemovePhotos([i]);return}if(e.key===`ArrowRight`||e.key===`ArrowDown`)Q.focused=(Q.focused+1)%n.length;else if(e.key===`ArrowLeft`||e.key===`ArrowUp`)Q.focused=(Q.focused-1+n.length)%n.length;else if(e.key===`Enter`){let e=n[Q.focused];e!==void 0&&Q.pick(e)}else if(e.key===`Escape`)Q.deselect();else return;e.preventDefault();let r=t.placements[n[Q.focused]],i=Q.photos[r?.photoIndex??-1]?.name;i&&e.key.startsWith(`Arrow`)&&Q.setStatus(t.pages?J(`%(name)s, page %(n)s of %(total)s`,{name:i,n:(r?.page??0)+1,total:t.pages.length}):i)}var me=Jl();_r(`keydown`,Jt,fe),_r(`keyup`,Jt,D),_r(`blur`,Jt,()=>ue(!1));let he;var O=I(me);Ti(O,e=>r=e,()=>r),Jr(O,(e,t)=>el?.(e,t),()=>ce);var ge=R(O,2);Gl(ge,{});var k=R(ge,2);let _e;var A=I(k),ve=e=>{var t=Kl(),n=I(t),r=R(n,2),i=L(r,!0),a=L(R(r,2),!0);j(t),z((e,t,r,o)=>{q(n,`max`,e),_i(n,Q.restoring.total>0?Q.restoring.done:void 0),q(n,`aria-label`,t),K(i,r),K(a,o)},[()=>Math.max(1,Q.restoring.total),()=>$(`Bringing back your photos`),()=>Q.restoring.total>0?$(`Bringing back your photos… %(done)s of %(total)s`,{done:Q.restoring.done,total:Q.restoring.total}):$(`Looking for your saved photos…`),()=>$(`You can add more once they are back.`)]),G(e,t)},ye=e=>{var t=ql(),n=R(rn(t),2),r=L(n,!0),i=R(n,2),a=L(i,!0),o=R(i,2),s=L(o,!0);z((e,t,n,i)=>{K(r,e),K(a,t),q(o,`title`,n),K(s,i)},[()=>$(`Drop photos here`),()=>$(`Everything runs in your browser. Your photos are never uploaded.`),()=>$(`Choose photos from this device`),()=>$(`Choose photos…`)]),U(`click`,o,()=>Q.chooseFiles()),G(e,t)};Lr(A,e=>{Q.restoring?e(ve):e(ye,-1)}),j(k),j(me),Ti(me,e=>n=e,()=>n),z(()=>{he=ri(me,1,`canvas-box`,null,he,{"pan-mode":Q.mode===`pan`,"pan-ready":Q.spaceHeld,panning:H(o),cropping:Q.cropping}),q(k,`hidden`,Q.hasPhotos),_e=ai(k,``,_e,{"--empty-w":`${H(C).w}px`,"--empty-h":`${H(C).h}px`})}),_r(`pointerenter`,me,()=>h=!0),_r(`pointerleave`,me,()=>{h=!1,F(f,-1)}),U(`pointerdown`,O,ie),U(`pointermove`,O,ae),U(`pointerup`,O,oe),U(`dblclick`,O,se),_r(`pointercancel`,O,e=>{S(e),v.size===0&&(b=!1),g=null,E()}),U(`keydown`,O,pe),_r(`focus`,O,()=>{Q.canvasFocused=!0,Q.focusRing=r.matches(`:focus-visible`)}),_r(`blur`,O,()=>Q.canvasFocused=!1),Ci(me,`clientWidth`,e=>F(i,e)),Ci(me,`clientHeight`,e=>F(a,e)),G(e,me),We()}vr([`pointerdown`,`pointermove`,`pointerup`,`dblclick`,`keydown`,`click`]);var Xl=W(`<div class="status"> </div>`),Zl=W(`<div> </div>`),Ql=W(`<main aria-label="Preview"><p id="hint" class="pill hint-pill"> </p> <div class="tools" id="tools"><fieldset class="modes group" id="modes" aria-label="Mode"><button type="button" id="mode-pan" aria-keyshortcuts="Space"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"></path></svg> <span> </span></button> <button type="button" id="mode-swap"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"></path></svg> <span> </span></button> <button type="button" id="mode-select"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3v16l4.2-4 3.3 6.2 2.4-1.3-3.3-6.1H19z"></path></svg> <span> </span></button></fieldset> <!> <fieldset class="zoomers group" aria-label="Zoom"><button type="button" id="zoom-in" class="sq" aria-label="Zoom in"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></button> <button type="button" id="zoom-out" class="sq" aria-label="Zoom out"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path></svg></button> <button type="button" id="reset-view" class="sq" aria-label="Fit to window"> </button> <span id="view-zoom" class="zoom-pct" aria-live="off"> </span></fieldset></div> <!> <!> <button type="button" id="help-open" class="help-btn help-fab" aria-haspopup="dialog" aria-label="Help">?</button> <p id="status-line" class="pill status-pill"> </p> <div id="messages" class="sr-only" role="status" aria-live="polite"><!> <!></div></main>`);function $l(e,t){Ue(t,!0);let n=M(()=>{if(!Q.layout)return $(`No photos yet`);let e=Q.photos.length;return[e===1?$(`1 photo`):$(`%(n)s photos`,{n:e}),Q.layoutStyle===`gallery`?$(`Gallery`):$(`%(n)s columns`,{n:Q.columnsInUse??0}),$(`%(pct)s% trimmed`,{pct:Q.cropPercent})].join(` · `)}),r=M(()=>!Q.hasPhotos),i=M(()=>Q.mode!==`swap`&&Q.selection.length>0),a=P(void 0),o=P(0);gn(()=>{let e=H(a);if(!e)return;let t=new ResizeObserver(()=>F(o,e.offsetHeight,!0));return t.observe(e),()=>t.disconnect()});var s=Ql();let c,l;var u=I(s),d=L(u,!0),f=R(u,2),p=I(f),m=I(p),h=L(R(I(m),2),!0);j(m);var g=R(m,2),_=L(R(I(g),2),!0);j(g);var v=R(g,2),y=L(R(I(v),2),!0);j(v),j(p);var b=R(p,2),x=e=>{Bl(e,{})};Lr(b,e=>{H(i)&&e(x)});var S=R(b,2),C=I(S),w=R(C,2),ee=R(w,2),te=L(ee,!0),ne=R(ee,2),T=L(ne);j(S),j(f);var E=R(f,2);Yl(E,{});var re=R(E,2),ie=e=>{Tl(e,{get block(){return H(a)},set block(e){F(a,e,!0)}})};Lr(re,e=>{Q.narrow||e(ie)});var ae=R(re,2),oe=R(ae,2),se=L(oe,!0),ce=R(oe,2),le=I(ce),ue=e=>{var t=Xl(),n=L(t,!0);z(()=>K(n,Q.status)),G(e,t)};Lr(le,e=>{Q.status&&e(ue)}),Hr(R(le,2),17,()=>Q.messages,Rr,(e,t)=>{var n=Zl(),r=L(n,!0);z(()=>{ri(n,1,Zr(H(t).kind)),K(r,H(t).text)}),G(e,n)}),j(ce),j(s),z((e,t,a,u,f,p,b,x,S,E,re,ie)=>{c=ri(s,1,`stage`,null,c,{acting:H(i)}),l=ai(s,``,l,{"--save-room":`${H(o)}px`}),K(d,Q.status),q(m,`title`,e),q(m,`aria-pressed`,Q.activeMode===`pan`),m.disabled=H(r),K(h,t),q(g,`title`,a),q(g,`aria-pressed`,Q.activeMode===`swap`),g.disabled=H(r),K(_,u),q(v,`title`,f),q(v,`aria-pressed`,Q.activeMode===`select`),v.disabled=H(r),K(y,p),q(C,`title`,b),C.disabled=H(r),q(w,`title`,x),w.disabled=H(r),q(ee,`title`,S),ee.disabled=Q.isFit||H(r),K(te,E),q(ne,`title`,re),K(T,`${Q.zoomPercent??``}%`),q(ae,`title`,ie),K(se,H(n))},[()=>$(`Pan: drag to move around (hold Space from any tool)`),()=>$(`Pan`),()=>$(`Swap: click two photos to trade places`),()=>$(`Swap`),()=>$(`Select: click a photo to change its size, crop or remove it`),()=>$(`Select`),()=>$(`Zoom in`),()=>$(`Zoom out`),()=>$(`Fit the whole collage in the window`),()=>$(`Fit`),()=>$(`Zoom`),()=>$(`Help`)]),U(`click`,m,()=>Q.setMode(`pan`)),U(`click`,g,()=>Q.setMode(`swap`)),U(`click`,v,()=>Q.setMode(`select`)),U(`click`,C,()=>Q.zoomAtCentre(1.25)),U(`click`,w,()=>Q.zoomAtCentre(.8)),U(`click`,ee,()=>Q.fitView()),U(`click`,ae,()=>Q.dialog=`help`),G(e,s),We()}vr([`click`]);var eu=W(`<i></i>`),tu=W(`<div class="backdrop" id="backdrop" aria-hidden="true"></div> <div class="app" id="app"><input id="file-input" type="file" accept="image/*,.heic,.heif,.zip,application/zip" multiple="" hidden=""/> <!> <!></div> <!>`,1);function nu(e,t){Ue(t,!0);let n=M(()=>Xc(Q.photoColours)),r;ki(()=>{let e=window.matchMedia(`(max-width: 760px)`);Q.narrow=e.matches;let t=()=>{Q.narrow=e.matches,Q.setTab(Q.tab,!1)};return e.addEventListener(`change`,t),Q.fileInput=r,Q.setTab(`photos`,!1),Q.start(),document.documentElement.dataset.appReady=`true`,()=>e.removeEventListener(`change`,t)}),gn(()=>{if(!Q.persistReady)return;Q.photos,Q.seed,Q.columns,Q.pageCount,Q.layoutStyle,ze(Q.settings);let e=document.documentElement,t=!0;e.dataset.saving=`true`;let n=setTimeout(()=>{Q.persist().finally(()=>{t&&(e.dataset.saving=`false`)})},250);return()=>{t=!1,clearTimeout(n)}});function i(){let e=Array.from(r.files??[]);r.value=``,Q.addFiles(e)}var a=tu();_r(`popstate`,Jt,()=>Q.onPopState()),_r(`dragover`,Jt,e=>{e.dataTransfer?.types.includes(`Files`)&&(e.preventDefault(),document.body.classList.add(`dragging`))}),_r(`dragleave`,Jt,e=>{e.relatedTarget||document.body.classList.remove(`dragging`)}),_r(`drop`,Jt,e=>{e.dataTransfer?.types.includes(`Files`)&&(e.preventDefault(),document.body.classList.remove(`dragging`),Q.addFiles(Array.from(e.dataTransfer?.files??[])))});var o=rn(a);Hr(o,21,()=>H(n),Rr,(e,t)=>{var n=eu();let r;z(()=>r=ai(n,``,r,{"--c":H(t)})),G(e,n)}),j(o);var s=R(o,2),c=I(s);Ti(c,e=>r=e,()=>r);var l=R(c,2);Il(l,{}),$l(R(l,2),{}),j(s),Qc(R(s,2),{}),z((e,t)=>{q(s,`data-tab`,Q.tab),q(s,`data-open`,e),q(s,`data-empty`,t),q(s,`data-menu`,Q.menuOpen?`open`:`closed`)},[()=>String(Q.sheetOpen),()=>String(!Q.hasPhotos)]),U(`change`,c,i),G(e,a),We()}vr([`change`]);var ru=document.getElementById(`root`);if(!ru)throw Error(`missing #root`);Mr(nu,{target:ru}),Vo(Q);
//# sourceMappingURL=index-DPk0gDxb.js.map