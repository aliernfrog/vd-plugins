(function(n,o,a,c){"use strict";const d=a.findByName("ChatInput"),i=c.after("render",d.prototype,function(){for(var t=arguments.length,r=new Array(t),e=0;e<t;e++)r[e]=arguments[e];try{r[1].props.children[2].props.children.props.children[1].props.canSendVoiceMessage=!1}catch(p){o.logger.error("Failed to hide voice message button",p)}}),s=function(){return i()};return n.onUnload=s,n})({},vendetta,vendetta.metro,vendetta.patcher);