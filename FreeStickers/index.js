(function(c,i,g,n,v,m,U,w){"use strict";const{getChannel:b}=i.findByStoreName("ChannelStore"),s="https://media.discordapp.net/stickers/{stickerId}.{extension}?size=160";function E(e,o){if(!e.guild_id)return!0;const t=b(o).guild_id;return e.guild_id==t}function A(e,o){return e.replace("{stickerId}",o.id).replace("{extension}","png")}const{FormInput:C,FormRow:F,FormSection:k,FormSwitchRow:L,FormText:x}=w.Forms,{ScrollView:P}=w.General;n.storage.stickerURL??=s;function T(){return U.useProxy(n.storage),React.createElement(P,null,React.createElement(k,{title:"Sticker URL",titleStyleType:"no_border"},React.createElement(C,{placeholder:s,value:n.storage.stickerURL,onChange:function(e){n.storage.stickerURL=e==""?s:e}}),React.createElement(x,{style:{paddingHorizontal:14}},["URL to use for stickers.","{stickerId} will be replaced with sticker ID","{extension} will be replaced with extension (currently always 'png')"].join(`
`))),React.createElement(k,{title:"Misc"},React.createElement(L,{label:"Show warning dialog for APNG stickers",subLabel:"This will only appear once",value:!n.storage.acknowledgedApng,onValueChange:function(e){n.storage.acknowledgedApng=!e}}),React.createElement(F,{label:"Restore default configuration",onPress:function(){n.storage.stickerURL=s,n.storage.acknowledgedApng=!1,m.showToast("Restored default configuration.")}})))}const p=i.find(function(e){return e.default?.canUseAnimatedEmojis}),l=i.findByProps("sendMessage","receiveMessage"),{getStickerById:I}=i.findByStoreName("StickersStore"),h="canUseStickersEverywhere",z="canUseCustomStickersEverywhere",G=p?.default[h]?h:z;async function N(e,o){let t=new FormData;t.append("new-image-url",e);let a=await fetch("https://ezgif.com/apng-to-gif",{method:"POST",body:t}),d=a.url.split("/").pop();t=new FormData,t.append("file",d),t.append("size","160"),a=await fetch(`https://ezgif.com/apng-to-gif/${d}?ajax=true`,{method:"POST",body:t});let u=`https:${(await a.text()).split('<img src="')[1].split('" style=')[0]}`;l.sendMessage(o,{content:u})}const _=[g.instead(G,p.default,function(){return!0}),g.instead("sendStickers",l,function(e,o){const[t,a,d,u]=e,f=a.map(function(r){return I(r)}).filter(function(r){return!E(r,t)});if(!f.length)return o(...e);const y=async function(r){r&&(n.storage.acknowledgedApng=!0);for(const S of f){const R=A(n.storage.stickerURL,S);S.format_type===2?(m.showToast("Converting APNG sticker to GIF.."),await N(R,t)):l.sendMessage(t,{content:R},null,u)}};f.find(function(r){return r.format_type==2})&&!n.storage.acknowledgedApng?v.showConfirmationAlert({title:"APNG Stickers",content:"APNG stickers will be converted to GIF using Ezgif and an Ezgif link will be sent in chat. Do you want to continue?",confirmText:"Continue",cancelText:"Cancel",onConfirm:function(){y(!0)}}):y()})],M=T,B=function(){return _.forEach(function(e){return e?.()})};return c.onUnload=B,c.settings=M,c})({},vendetta.metro,vendetta.patcher,vendetta.plugin,vendetta.ui.alerts,vendetta.ui.toasts,vendetta.storage,vendetta.ui.components);
