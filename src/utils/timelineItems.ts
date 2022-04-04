import moment from "moment";

export type StatusEnum = 'done' | 'started' | 'unstarted';

export type PullRequest = any;

export type Item = {
  id: number;
  start: string;
  end: string;
  name: string;
  gradient?: any;
  groupId?: number;
  url?: string;
  status?: StatusEnum;
  estimate?: number;
  owner?: ShortcutOwner;
  pullRequestOpenedAt?: string;
  pullRequests: PullRequest[];
  shortcutUserId?: string;
  shortcutEpicId?: string;
};

export type ShortcutOwner = any;

export const sortItemsByStartDate = (items: Item[]) => {
  return items.slice().sort((a, b) => {
    return a.start >= b.start ? 1 : -1;
  });
};

export const LOADING_ITEM = {
  id: 0,
  start: moment().format(),
  end: moment().format(),
  name: "Loading",
  groupId: 0,
  pullRequests: [],
};

export const groupItemsIntoRows = (items: Item[]): Item[][] => {
  if (items.length === 0) {
    return [
      [
        LOADING_ITEM,
      ],
    ];
  }

  const names = items.reduce((acc: { [key: string]: boolean }, item) => {
    const group = item.groupId || "Unassigned";
    if (!acc[group]) {
      acc[group] = true;
    }
    return acc;
  }, {});



  const groups = Object.keys(names).reduce(
    (acc: { [key: string]: Item[][] }, name) => {
      acc[name] = [[]];
      return acc;
    },
    {}
  );

  items.map((item: Item) => {
    const groupId = item.groupId || "Unassigned";
    
    let rows = groups[groupId];
    for (let i = 0; i < rows.length; i++) {
        if (
          rows[i].length === 0 || moment(rows[i][rows[i].length - 1].end).add(18, 'hours').isBefore(moment(item.start))
        ) {
          rows[i] = [...rows[i], item];
          groups[groupId] = rows;
          return
        }
    }

    // The current item can't fit in any rows, so we add
      // a new one
      groups[groupId] = [...rows, [item]];
      return
  })

  const unassigned = groups["Unassigned"];
  delete groups["Unassigned"];

  // adds an extra row in between each group
  const rows = Object.values(groups).map(group => group.concat([[]])).flat().concat(unassigned);
  return rows;
};

export const getItemWithLastEndDate = (items: Item[]) => {
  if (items.length === 0) {
    return {
      id: 0,
      start: moment().format(),
      end: moment().format(),
      name: "Loading",
    };
  }
  return items.reduce((last: Item, item: Item) => {
    if (!last.end || moment(item.end).isSameOrAfter(moment(last.end))) {
      return item;
    }
    return last;
  });
};


export const commentsFromGithubComments = (githubComments: any[]) => {
  return githubComments.map(comment => ({
    id: comment.id,
    created_at: comment.created_at,
    body: comment.body,
    user: comment.user.login,
  }))
}


export const commitsFromGithubCommits = (githubCommits: any[]) => {
  return githubCommits.map(commit => ({
    id: commit.sha,
    created_at: commit.commit?.committer?.date,
    message: commit.commit?.message,
    user: commit.commit?.committer?.name,
  }))
}