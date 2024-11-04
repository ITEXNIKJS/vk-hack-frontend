import{c as D,d as H}from"/build/_shared/chunk-G5LM2ESL.js";import{a as S,b as N}from"/build/_shared/chunk-5LVCCKB6.js";import{b as d,e as W}from"/build/_shared/chunk-G5WX4PPA.js";var k=d(y=>{"use strict";Object.defineProperty(y,"__esModule",{value:!0});y.useBroadcastChannel=void 0;var w=S();function I(e,n,i){let r=(0,w.useRef)(typeof window<"u"&&"BroadcastChannel"in window?new BroadcastChannel(e+"-channel"):null);return R(r,"message",n),R(r,"messageerror",i),(0,w.useCallback)(s=>{var u;(u=r?.current)===null||u===void 0||u.postMessage(s)},[r])}y.useBroadcastChannel=I;function R(e,n,i=()=>{}){(0,w.useEffect)(()=>{let r=e.current;if(r)return r.addEventListener(n,i),()=>r.removeEventListener(n,i)},[e,n,i])}});var x=d(g=>{"use strict";Object.defineProperty(g,"__esModule",{value:!0});g.useCorrectCssTransition=void 0;var U=S();function $(e){let n=document.createElement("style");n.appendChild(document.createTextNode(`* {
       -webkit-transition: none !important;
       -moz-transition: none !important;
       -o-transition: none !important;
       -ms-transition: none !important;
       transition: none !important;
    }`)),document.head.appendChild(n),e(),setTimeout(()=>{let i=window.getComputedStyle(n).transition;document.head.removeChild(n)},0)}function G({disableTransitions:e=!1}={}){return(0,U.useCallback)(n=>{e?$(()=>{n()}):n()},[e])}g.useCorrectCssTransition=G});var p=d(t=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.isTheme=t.useTheme=t.PreventFlashOnWrongTheme=t.ThemeProvider=t.mediaQuery=t.themes=t.Theme=void 0;var f=N(),c=S(),J=k(),K=x(),h;(function(e){e.DARK="dark",e.LIGHT="light"})(h=t.Theme||(t.Theme={}));t.themes=Object.values(h);var O=(0,c.createContext)(void 0);O.displayName="ThemeContext";var j="(prefers-color-scheme: light)",B=()=>window.matchMedia(j).matches?h.LIGHT:h.DARK;t.mediaQuery=typeof window<"u"?window.matchMedia(j):null;function Y({children:e,specifiedTheme:n,themeAction:i,disableTransitionOnThemeChange:r=!1}){let s=(0,K.useCorrectCssTransition)({disableTransitions:r}),[u,T]=(0,c.useState)(()=>n?t.themes.includes(n)?n:null:typeof window!="object"?null:B()),[v,b]=(0,c.useState)(n?"USER":"SYSTEM"),P=(0,J.useBroadcastChannel)("remix-themes",a=>{s(()=>{T(a.data.theme),b(a.data.definedBy)})});(0,c.useEffect)(()=>{if(v==="USER")return()=>{};let a=m=>{s(()=>{T(m.matches?h.LIGHT:h.DARK)})};return t.mediaQuery===null||t.mediaQuery===void 0||t.mediaQuery.addEventListener("change",a),()=>t.mediaQuery===null||t.mediaQuery===void 0?void 0:t.mediaQuery.removeEventListener("change",a)},[s,v]);let E=(0,c.useCallback)(a=>{let m=typeof a=="function"?a(u):a;if(m===null){let M=B();s(()=>{T(M),b("SYSTEM"),P({theme:M,definedBy:"SYSTEM"})}),fetch(`${i}`,{method:"POST",body:JSON.stringify({theme:null})})}else s(()=>{T(m),b("USER"),P({theme:m,definedBy:"USER"})}),fetch(`${i}`,{method:"POST",body:JSON.stringify({theme:m})})},[P,s,u,i]),F=(0,c.useMemo)(()=>[u,E,{definedBy:v}],[u,E,v]);return(0,f.jsx)(O.Provider,{value:F,children:e})}t.ThemeProvider=Y;var z=String.raw`
(() => {
  const theme = window.matchMedia(${JSON.stringify(j)}).matches
    ? 'light'
    : 'dark';
  
  const cl = document.documentElement.classList;
  const dataAttr = document.documentElement.dataset.theme;

  if (dataAttr != null) {
    const themeAlreadyApplied = dataAttr === 'light' || dataAttr === 'dark';
    if (!themeAlreadyApplied) {
      document.documentElement.dataset.theme = theme;
    }
  } else {
    const themeAlreadyApplied = cl.contains('light') || cl.contains('dark');
    if (!themeAlreadyApplied) {
      cl.add(theme);
    }
  }
  
  const meta = document.querySelector('meta[name=color-scheme]');
  if (meta) {
    if (theme === 'dark') {
      meta.content = 'dark light';
    } else if (theme === 'light') {
      meta.content = 'light dark';
    }
  }
})();
`;function V({ssrTheme:e,nonce:n}){let[i]=q();return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)("meta",{name:"color-scheme",content:i==="light"?"light dark":"dark light"}),e?null:(0,f.jsx)("script",{dangerouslySetInnerHTML:{__html:z},nonce:n,suppressHydrationWarning:!0})]})}t.PreventFlashOnWrongTheme=V;function q(){let e=(0,c.useContext)(O);if(e===void 0)throw new Error("useTheme must be used within a ThemeProvider");return e}t.useTheme=q;function X(e){return typeof e=="string"&&t.themes.includes(e)}t.isTheme=X});var L=d(C=>{"use strict";Object.defineProperty(C,"__esModule",{value:!0});C.createThemeSessionResolver=void 0;var Z=p(),ee=e=>async i=>{let r=await e.getSession(i.headers.get("Cookie"));return{getTheme:()=>{let s=r.get("theme");return(0,Z.isTheme)(s)?s:null},setTheme:s=>r.set("theme",s),commit:()=>e.commitSession(r),destroy:()=>e.destroySession(r)}};C.createThemeSessionResolver=ee});var Q=d(_=>{"use strict";Object.defineProperty(_,"__esModule",{value:!0});_.createThemeAction=void 0;var A=(H(),W(D)),te=p(),ne=e=>async({request:i})=>{let r=await e(i),{theme:s}=await i.json();return s?(0,te.isTheme)(s)?(r.setTheme(s),(0,A.json)({success:!0},{headers:{"Set-Cookie":await r.commit()}})):(0,A.json)({success:!1,message:`theme value of ${s} is not a valid theme.`}):(0,A.json)({success:!0},{headers:{"Set-Cookie":await r.destroy()}})};_.createThemeAction=ne});var oe=d(o=>{"use strict";Object.defineProperty(o,"__esModule",{value:!0});o.createThemeAction=o.PreventFlashOnWrongTheme=o.isTheme=o.Theme=o.themes=o.useTheme=o.ThemeProvider=o.createThemeSessionResolver=void 0;var re=L();Object.defineProperty(o,"createThemeSessionResolver",{enumerable:!0,get:function(){return re.createThemeSessionResolver}});var l=p();Object.defineProperty(o,"ThemeProvider",{enumerable:!0,get:function(){return l.ThemeProvider}});Object.defineProperty(o,"useTheme",{enumerable:!0,get:function(){return l.useTheme}});Object.defineProperty(o,"themes",{enumerable:!0,get:function(){return l.themes}});Object.defineProperty(o,"Theme",{enumerable:!0,get:function(){return l.Theme}});Object.defineProperty(o,"isTheme",{enumerable:!0,get:function(){return l.isTheme}});Object.defineProperty(o,"PreventFlashOnWrongTheme",{enumerable:!0,get:function(){return l.PreventFlashOnWrongTheme}});var se=Q();Object.defineProperty(o,"createThemeAction",{enumerable:!0,get:function(){return se.createThemeAction}})});export{oe as a};
