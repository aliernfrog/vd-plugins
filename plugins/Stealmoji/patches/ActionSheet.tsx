import { React } from "@vendetta/metro/common";
import { after, before } from "@vendetta/patcher";
import { General } from "@vendetta/ui/components";
import { findInReactTree } from "@vendetta/utils";
import openEmojiActionSheet from "../lib/utils/openEmojiActionSheet";
import { LazyActionSheet } from "../modules";

const { TouchableOpacity } = General;

export default () => before("openLazy", LazyActionSheet, ([lazySheet, name]) => {
    if (name != "MessageReactions") return;
    lazySheet.then(module => {
      const unpatchSheet = after("default", module, (_, sheet) => {
        React.useEffect(() => unpatchSheet, []);
        
        const unpatchView = after("type", sheet?.props?.children, (_, view) => {
          React.useEffect(() => unpatchView, []);
          
          if (!view?.props?.header) return;
          const unpatchHeader = after("type", view.props.header, (_, header) => {
            React.useEffect(() => unpatchHeader, []);
            
            const row = findInReactTree(header, (c) => c?.props?.tabs?.length);
            if (!row) return;
            const { tabs, onSelect } = row.props;
            console.log(tabs);
            row.props.tabs = tabs.map((tab, i) => (
              <TouchableOpacity
                onPress={() => onSelect(tab.props.index ?? i)}
                onLongPress={() => {
                  const { emoji } = tab.props.reaction;
                  openEmojiActionSheet(emoji);
                }}
              >{tab}</TouchableOpacity>
            ));
          });
        })
      });
    });
});