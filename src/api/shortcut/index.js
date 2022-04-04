import { ShortcutClient } from "@useshortcut/client";
import axios from "axios";
import { memoize } from "lodash";

const SHORTCUT_API_TOKEN = "TODO_ADD_TOKEN_HERE";
const API_BASE_URL = "https://api.app.shortcut.com";

const shortcut = new ShortcutClient(SHORTCUT_API_TOKEN);

export const listEpics = memoize(() => {
  return shortcut.listEpics();
});

export const listEpicStories = memoize((epicId) => {
  return shortcut.listEpicStories(epicId);
});

export const listIterationStories = memoize((iterationId) => {
  return shortcut.listIterationStories(iterationId);
});

// export const listUserStories = memoize((username, nextUrl = "", data = []) => {
//   return axios
//     .get(
//       nextUrl
//         ? API_BASE_URL + nextUrl + `?token=${SHORTCUT_API_TOKEN}`
//         : `${API_BASE_URL}/api/v3/search/stories?token=${SHORTCUT_API_TOKEN}`,
//       {
//         params: {
//           query: `owner:${username}`,
//           page_size: 25,
//         },
//       }
//     )
//     .then((response) => {
//       if (!response.data.next) return data;
//       data.push(...response.data.data);
//       return listUserStories(username, response.data.next, data);
//     });

//   // return shortcut.getResource('search/stories', { query: `owner:${username}` })
// });

export const listUserStories = async (username, nextUrl = "") => {
  const url = nextUrl
    ? API_BASE_URL + nextUrl + `&token=${SHORTCUT_API_TOKEN}`
    : `${API_BASE_URL}/api/v3/search/stories?token=${SHORTCUT_API_TOKEN}`;

  const response = await axios.get(url,
    nextUrl.length === 0 ? {
      params: {
        query: `owner:${username}`,
        page_size: 25,
      },
    }: {}
  );

  const data = response.data;
  const items = data.data;

  if (!!data.next) {
    return items.concat(
      await listUserStories(username, data.next)
    );
  } else {
    return items;
  }
};

export const getUser = memoize((userId) => {
  return shortcut.getMember(userId);
});

export const getWorkflow = memoize((workflowId) => {
  return shortcut.getWorkflow(workflowId);
});

export const listGroupStories = memoize((groupId) => {
  return shortcut.listGroupStories(groupId);
});

export const getStory = memoize((storyId) => {
  return shortcut.getStory(storyId);
});
