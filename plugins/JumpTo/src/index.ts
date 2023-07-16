import { findByName, findByProps } from "@vendetta/metro";
import { React } from "@vendetta/metro/common";
import { after, before } from "@vendetta/patcher";
import { findInReactTree } from "@vendetta/utils";
import JumpReferenceButton from "./ui/JumpReferenceButton";
import JumpStarterSection from "./ui/JumpStarterSection";

const ActionSheet = findByProps("openLazy", "hideActionSheet");
const ForumPostLongPressActionSheet = findByName("ForumPostLongPressActionSheet", false);

let patches = [];

function buildMessageURL(guild, channel, message) {
  return `https://discord.com/channels/${guild}/${channel}/${message}`;
}

export default {
  onLoad: () => {
    const closeSheet = () => ActionSheet.hideActionSheet();
    
    patches = [
      after("default", ForumPostLongPressActionSheet, ([{ thread }], res) => {
        const actions = findInReactTree(res, (t) => t.props?.bottom === true).props.children.props.children[1];
        const firstMessageURL = buildMessageURL(thread.guild_id, thread.id, thread.id);
        
        actions.unshift(JumpStarterSection(actions, firstMessageURL, closeSheet));
      }),
      
      before("openLazy", ActionSheet, (ctx) => {
        const [component, args, actionMessage] = ctx;
        if (args != "MessageLongPressActionSheet") return;
        component.then(instance => {
          const unpatch = after("default", instance, (_, component) => {
            React.useEffect(() => () => { unpatch() }, []); // omg;!!!!!!!!!!!!!
            const [msgProps, buttons] = component.props?.children?.props?.children?.props?.children;

            const message = msgProps?.props?.message ?? actionMessage?.message;
            
            if (!message || !buttons) return;
            if (!message.messageReference?.message_id) return;

            const refButton = buttons.find(b => !!b.props.message);
            
            const reference = message.messageReference;
            const referenceURL = buildMessageURL(reference.guild_id, reference.channel_id, reference.message_id);
            
            buttons.push(JumpReferenceButton(referenceURL, closeSheet));
          });
        });
      })
    ]
  },
  
  onUnload: () => {
    patches.forEach(unpatch => unpatch?.());
  }
}