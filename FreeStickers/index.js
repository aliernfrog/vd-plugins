(function(r,c,s,u){"use strict";const a=s.findByProps("canUseStickersEverywhere"),i=s.findByProps("sendMessage","receiveMessage"),{getStickerById:f}=s.findByStoreName("StickersStore"),o=[];var g={onLoad:function(){if(a.canUseStickersEverywhere())return c.logger.log("User has Nitro, no need to patch stickers");o.push(u.instead("canUseStickersEverywhere",a,function(){return!0})),i.sendStickers,o.push(u.instead("sendStickers",i,function(e){try{const t=e[0],d=e[1].map(function(n){return f(n)}).filter(function(n){return!p(n)});if(!d.length)return;const h=d.map(function(n){return l(n)}).join(`
`);i.sendMessage(t,{content:h})}catch(t){c.logger.error("Failed to fake sticker",t)}}))},onUnload:function(){o.forEach(function(e){return e?.()})}};function p(e){return!(e.format_type==1||e.format_type==2||e.format_type==4)}function l(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"256";return`https://cdn.discordapp.net/stickers/${e.id}.png?size=${t}`}return r.default=g,Object.defineProperty(r,"__esModule",{value:!0}),r})({},vendetta,vendetta.metro,vendetta.patcher);
