(function(a,e,h,o,s,c,l){"use strict";const{FormIcon:i,FormSection:u,FormSwitchRow:r}=s.Forms,{ScrollView:A}=s.General;e.storage.AlwaysTabsV2??=!0,e.storage.ChatAnimations??=!0,e.storage.FixExperiments??=!0;function E(t){return function(){return h.useProxy(e.storage),React.createElement(A,null,React.createElement(u,{title:"Useful experiments",titleStyleType:"no_border"},React.createElement(r,{label:"Tabs v2",subLabel:"Enable Tabs v2",leading:React.createElement(i,{source:o.getAssetIDByName("ic_mobile_device")}),value:e.storage.AlwaysTabsV2,onValueChange:function(n){e.storage.AlwaysTabsV2=n,t()}}),React.createElement(r,{label:"Chat animations (Android)",subLabel:"Enable chat animations for Android",leading:React.createElement(i,{source:o.getAssetIDByName("ic_chat")}),value:e.storage.ChatAnimations,onValueChange:function(n){e.storage.ChatAnimations=n,t()}})),React.createElement(u,{title:"Misc"},React.createElement(r,{label:"Reload experiments plugin",subLabel:"Reload experiments plugin after 15 seconds",leading:React.createElement(i,{source:o.getAssetIDByName("ic_cog_24px")}),value:e.storage.FixExperiments,onValueChange:function(n){e.storage.FixExperiments=n,t()}})))}}const{toggleTabsUIManually:m}=c.findByProps("toggleTabsUIManually");function y(){return m(e.storage.AlwaysTabsV2),function(){m(!1)}}const{ChatListAnimationExperiment:x}=c.findByProps("ChatListAnimationExperiment");function v(){try{const t=x.getCurrentConfig();return t.shouldAnimateAndroid=e.storage.ChatAnimations,function(){t.shouldAnimateAndroid=!1}}catch{return function(){}}}const f="https://vd-plugins.github.io/proxy/beefers.github.io/strife/Experiments/";function C(){if(!e.storage.FixExperiments)return function(){};if(l.plugins[f])return setTimeout(function(){l.startPlugin(f)},15e3),function(){}}let d=[];function g(){b(),d=[y(),v(),C()]}function b(){d?.forEach(function(t){return t?.()})}g();const R=E(g),T=function(){return b()};return a.onUnload=T,a.settings=R,a})({},vendetta.plugin,vendetta.storage,vendetta.ui.assets,vendetta.ui.components,vendetta.metro,vendetta.plugins);
