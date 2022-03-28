import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(mentions);
  console.log(props.characters);

  useEffect(() => {
    setSuggestions(getMentions(props.characters, props.locations));
  }, [props.characters, props.locations]);

  function getMentions(characters, locations) {
    let mentions = [];
    if (characters) {
      for (let i = 0; i < characters.length; i++) {
        mentions.push({
          id: characters[i].uid,
          name: characters[i].name,
          folder: characters[i].location,
          avatar: characters[i].img,
          type: "characters",
        });
      }
    }
    if (locations) {
      for (let i = 0; i < locations.length; i++) {
        mentions.push({
          id: locations[i].uid,
          name: locations[i].name,
          folder: locations[i].location,
          avatar: locations[i].img,
          type: "locations",
        });
      }
    }
    return mentions;
  }

  // //const { MentionSuggestions, plugins } = useMemo(() => {
  // let mentionPlugin = createMentionPlugin({
  //   mentionComponent(mentionProps) {
  //     console.log("AAAAA", props.characters);
  //     console.log(mentionProps);
  //     return (
  //       <DraftjsMentionItem
  //         params={props.params}
  //         characters={props.characters}
  //         locations={props.locations}
  //         className={mentionProps.className}
  //         // eslint-disable-next-line no-alert
  //         content={mentionProps.children}
  //         item={mentionProps.mention}
  //       />
  //     );
  //   },
  // });
  // // eslint-disable-next-line no-shadow
  // let { MentionSuggestions } = mentionPlugin;
  // // eslint-disable-next-line no-shadow
  // let plugins = [mentionPlugin];
  // //return { plugins, MentionSuggestions };
  // //eslint-disable-next-line react-hooks/exhaustive-deps
  // //}, []);

  // console.log(mentionPlugin);

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      mentionComponent(mentionProps) {
        console.log(mentionProps);
        return (
          <DraftjsMentionItem
            params={props.params}
            characters={props.characters}
            locations={props.locations}
            className={mentionProps.className}
            // eslint-disable-next-line no-alert
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
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onOpenChange = useCallback((_open) => {
    setOpen(_open);
  }, []);
  const onSearchChange = useCallback(
    ({ value }) => {
      setSuggestions(
        defaultSuggestionsFilter(
          value,
          getMentions(props.characters, props.locations)
        )
      );
    },
    [props.characters, props.locations]
  );

  return (
    <div
      onClick={() => {
        ref.current.focus();
      }}
    >
      <Editor
        readOnly={!!props.readOnly}
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
        //renderEmptyPopup={true}
        // onAddMention={() => {
        //   // get the mention object selected
        // }}
      />
    </div>
  );
}
