(function(c,o,s,i,y,l,p){"use strict";const{FormRow:R}=p.Forms,_=o.findByName("Icon");function v(e){return React.createElement(R,{label:"Jump To Reference",leading:React.createElement(_,{source:l.getAssetIDByName("ic_link_24px")}),onPress:function(){return s.url.openDeeplink(e)}})}const{FormRow:E}=p.Forms,P=o.findByName("Icon");function b(e,t){const n=e[0].type;return React.createElement(n,{key:"jumpstartervd"},React.createElement(E,{leading:React.createElement(P,{source:l.getAssetIDByName("ic_link_24px")}),label:"Jump To Starter Message",onPress:function(){return s.url.openDeeplink(t)}}))}const A=o.findByProps("openLazy","hideActionSheet"),B=o.findByName("ForumPostLongPressActionSheet",!1);let m=[];function g(e,t,n){return`https://discord.com/channels/${e}/${t}/${n}`}var k={onLoad:function(){m=[i.after("default",B,function(e,t){let[{thread:n}]=e;const r=y.findInReactTree(t,function(u){return u.props?.bottom===!0}).props.children.props.children[1],a=g(n.guild_id,n.id,n.id);r.unshift(b(r,a))}),i.before("openLazy",A,function(e){const[t,n,r]=e;n=="MessageLongPressActionSheet"&&t.then(function(a){const u=i.after("default",a,function(N,F){s.React.useEffect(function(){return function(){u()}},[]);const[I,h]=F.props?.children?.props?.children?.props?.children,d=I?.props?.message??r?.message;if(!d||!h||!d.messageReference?.message_id)return;const f=d.messageReference,L=g(f.guild_id,f.channel_id,f.message_id);h.push(v(L))})})})]},onUnload:function(){m.forEach(function(e){return e?.()})}};return c.default=k,Object.defineProperty(c,"__esModule",{value:!0}),c})({},vendetta.metro,vendetta.metro.common,vendetta.patcher,vendetta.utils,vendetta.ui.assets,vendetta.ui.components);