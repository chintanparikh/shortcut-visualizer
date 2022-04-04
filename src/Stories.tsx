import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

import {
  getUser,
  listEpicStories,
  getWorkflow,
  getStory,
} from "./api/shortcut";

import { Item, LOADING_ITEM } from "./utils/timelineItems";
import Timeline from "./components/Timeline";
import moment from "moment";
import { stringToColour } from "./utils/gradients";
import { toUnicode } from "punycode";

export type StoriesProps = {
  stories: any[];
  groupByEpic?: boolean;
};
const Stories = (props: StoriesProps) => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const getItems = async function () {
      const nonArchivedStories = props.stories.filter(
        (story) => !story.archived
      );
      const newItemsPromises = nonArchivedStories.map(
        async (storySlim: any) => {
          const storyData = await getStory(storySlim.id);
          const story = storyData.data;

          const ownerId = story.owner_ids[0];

          const owner = ownerId ? await getUser(ownerId) : null;
          const name = owner?.data?.profile?.name || "Unassigned";
          const color = stringToColour(
            props.groupByEpic ? (story.epic_id || 0).toString() : name
          );

          const workflow = await getWorkflow(story.workflow_id);
          const workflowStates = workflow.data.states;
          const workflowType = workflowStates.find(
            (state: any) => state.id === story.workflow_state_id
          )?.type;

          const pullRequests =  story.pull_requests || [];
          const pullRequest = pullRequests[0];


          const item = {
            id: story.id,
            start: story.started_at,
            end: story.completed_at,
            name: story.name,
            gradient: [color, color],
            groupId: props.groupByEpic ? (story.epic_id || 0).toString() : name,
            url: story.app_url,
            status: workflowType,
            estimate: story.estimate,
            owner: owner?.data,
            pullRequestOpenedAt: pullRequest?.created_at,
            pullRequests: pullRequests,
            shortcutEpicId: '',
          };

          if (item.start && !item.end) {
            item.end = moment().format();
          }

          if (!item.start) {
            item.start = moment().format();
            item.end = moment(item.start)
              .add(story.estimate || 1, "days")
              .format();
          }

          console.log(item);

          return item;
        }
      );

      const promise = Promise.all(newItemsPromises);
      promise.then((response) => {
        setItems(response as Item[]);
      });
    };
    getItems();
  }, [props.stories]);

  return (
    <div>
      <Timeline
        items={
          items && items.length
            ? items
            : [
                LOADING_ITEM,
              ]
        }
        onUpdateItem={(item) => {}}
      />
    </div>
  );
};

export default Stories;
