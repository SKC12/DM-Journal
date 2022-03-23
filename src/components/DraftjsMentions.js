import React, { useCallback, useMemo, useRef, useState } from "react";
//import { EditorState } from "draft-js";
import Editor from "@draft-js-plugins/editor";
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from "@draft-js-plugins/mention";
//import editorStyles from "../style/CustomComponentMentionEditor.module.css";
//import mentions from "./Mentions";
import "@draft-js-plugins/mention/lib/plugin.css";
import DraftjsMentionItem from "./DraftsjsMentionItem";

export default function DraftjsMentions(props) {
  const mentions = getMentions(props.characters, props.locations);
  const ref = useRef(null);
  const [editorState, setEditorState] = props.editorStateArray;
  const [open, setOpen] = useState(true);
  const [suggestions, setSuggestions] = useState(mentions);

  function getMentions(characters, locations) {
    let mentions = [];
    if (characters) {
      for (let i = 0; i < characters.length; i++) {
        mentions.push({
          name: characters[i].name,
          folder: characters[i].location,
          avatar: characters[i].img,
        });
      }
    }
    if (locations) {
      for (let i = 0; i < locations.length; i++) {
        mentions.push({
          name: locations[i].name,
          folder: locations[i].location,
          avatar: locations[i].img,
        });
      }
    }
    return mentions;
  }

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      mentionComponent(mentionProps) {
        return (
          <DraftjsMentionItem
            className={mentionProps.className}
            // eslint-disable-next-line no-alert
            onClick={() => alert("Clicked on the Mention!")}
            onMouseOver={() => console.log("TEST")}
            content={mentionProps.children}
            item={mentionProps.mention}
          />
        );
      },
    });
    // eslint-disable-next-line no-shadow
    const { MentionSuggestions } = mentionPlugin;
    // eslint-disable-next-line no-shadow
    const plugins = [mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);

  const onOpenChange = useCallback((_open) => {
    setOpen(_open);
  }, []);
  const onSearchChange = useCallback(
    ({ trigger, value }) => {
      setSuggestions(defaultSuggestionsFilter(value, mentions, trigger));
    },
    [mentions]
  );

  return (
    <div
      //className={editorStyles.editor}
      onClick={() => {
        ref.current.focus();
      }}
    >
      <Editor
        readOnly={!!props.readOnly}
        editorKey={"editor"}
        editorState={editorState}
        onChange={setEditorState}
        plugins={plugins}
        ref={ref}
      />
      <MentionSuggestions
        open={open}
        onOpenChange={onOpenChange}
        suggestions={suggestions}
        onSearchChange={onSearchChange}
        onAddMention={() => {
          // get the mention object selected
        }}
      />
    </div>
  );
}
