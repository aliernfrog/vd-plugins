(function(o,s,n,u,d,l,f,g){"use strict";const{FormRow:m}=g.Forms,p=n.findByName("Icon"),{hideActionSheet:h}=n.findByProps("openLazy","hideActionSheet");function y(r,i){const e=f.findInReactTree(r,function(a){return a.props?.bottom===!0}).props.children.props.children[1],t=e[0].type;e.unshift(React.createElement(t,{key:"jumpfirst"},React.createElement(m,{leading:React.createElement(p,{source:l.getAssetIDByName("ic_link_24px")}),label:"Jump to first message",onPress:function(){return h()(d.url.openDeeplink(i))}})))}const F=n.findByName("ForumPostLongPressActionSheet",!1),{useFirstForumPostMessage:v}=n.findByProps("useFirstForumPostMessage");let c;var P={onLoad:function(){c=u.after("default",F,function(r,i){let[{thread:e}]=r;const{firstMessage:t}=v(e);if(!t)return s.logger.log(`Forum thread ${e.id} doesn't have a starter message`);s.logger.log(`First message: ${JSON.stringify(t)}`),s.logger.log(`Thread: ${JSON.stringify(e)}`);const a=`https://discord.com/channels/${e.guild_id}/${e.id}/${t.id}`;y(i,a)})},onUnload:function(){c?.unpatch()}};return o.default=P,Object.defineProperty(o,"__esModule",{value:!0}),o})({},vendetta,vendetta.metro,vendetta.patcher,vendetta.metro.common,vendetta.ui.assets,vendetta.utils,vendetta.ui.components);
