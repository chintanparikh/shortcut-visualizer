import styled from "@emotion/styled";
import moment from "moment";
import { off } from "process";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPullRequest, makeRequest } from "../api/github";
import { BORDER_RADIUS } from "../utils/constants";
import {
  commentsFromGithubComments,
  commitsFromGithubCommits,
  PullRequest,
} from "../utils/timelineItems";
import { useZoomLevel } from "../utils/zoomLevel";

export type TimelineTooltipProps = {
  pullRequests: PullRequest[];
  // offset: number,
  // width: number,
  height: number;
  start: string;
  name: string;
  ownerName: string;
  ownerId: string;
  estimate: number;
};

const Container = styled.div({
  position: "absolute",
  "&.tooltip-enter": {
    opacity: "0",
  },
  "&.tooltip-enter-active": {
    opacity: "1",
    transition: `all ${500}ms`,
  },
  "&.tooltip-exit": {
    opacity: "1",
  },
  "&.tooltip-exit-active": {
    opacity: "0",
    transition: `opacity ${500}ms`,
  },
})

const PullRequestInnerContainer = styled.div<{
  height: number;
  bottom: number;
  padding: number;
}>(
  {
    background: "white",
    position: "absolute",
    borderRadius: BORDER_RADIUS,
  },
  (props) => ({
    height: props.height,
    width: `calc(100% - ${props.padding * 2}px)`,
    // left: props.padding,
  })
);

const PullRequestContainer = styled.div<{
  height: number;
  bottom: number;
  padding: number;
  width: number;
  left: number;
}>(
  {
    background: "white",
    // width: "100%",
    position: "absolute",
    borderRadius: BORDER_RADIUS,
    zIndex: 500,
  },
  (props) => ({
    height: props.height,
    top: props.bottom/2,
    // left: -1 * props.padding,
    padding: `0px ${props.padding}px`,
    width: props.width,
    left: props.left + (-1 * props.padding),
  })
);

const TicketInfoContainer = styled.div<{
  height: number;
  bottom: number;
}>(
  {
    whiteSpace: "nowrap",
    background: "white",
    position: "absolute",
    borderRadius: BORDER_RADIUS,
    color: "black",
    display: "flex",
    alignItems: "center",
    padding: "4px 10px",
    zIndex: 1000,
  },
  (props) => ({
    minHeight: props.height,
    bottom: props.bottom/2,
  })
);

const TimelineTooltip = (props: TimelineTooltipProps) => {
  const { pullRequests: initialPullRequests } = props;

  const { zoomLevel } = useZoomLevel();

  const [pullRequests, setPullRequests] =
    useState<PullRequest[]>(initialPullRequests);

  useEffect(() => {
    const getPullRequests = async function () {
      const promises = initialPullRequests.map(async (shortcutPullRequest) => {
        const hydratedPullRequest: PullRequest = (
          await getPullRequest(shortcutPullRequest.number)
        ).data;

        const pullRequest = {
          draft: hydratedPullRequest.draft,
          title: hydratedPullRequest.title,
          created_at: hydratedPullRequest.created_at,
          closed_at: hydratedPullRequest.closed_at,
          comments: [] as any[],
          commits: [] as any[],
        };

        const [githubComments, githubCommits, githubReviewComments] =
          await Promise.all([
            makeRequest(hydratedPullRequest.comments_url),
            makeRequest(hydratedPullRequest.commits_url),
            makeRequest(hydratedPullRequest.review_comments_url),
          ]);

        const comments = commentsFromGithubComments(githubComments);
        const commits = commitsFromGithubCommits(githubCommits);
        pullRequest.commits = commits;
        const reviewComments = commentsFromGithubComments(githubReviewComments);
        pullRequest.comments = comments.concat(reviewComments);

        return pullRequest;
      });

      const promise = Promise.all(promises);
      promise.then((response) => {
        console.log("setting pull request", response);
        setPullRequests(response as PullRequest[]);
        console.log("Set new pull requests");
      });
    };
    getPullRequests();
  }, [initialPullRequests]);

  const pullRequest = pullRequests[0] || {};
  const events = [
    ...(pullRequest.commits || []).map((c: any) => ({
      message: c.message,
      timestamp: c.created_at,
      type: "commit",
    })),
    ...(pullRequest.comments || []).map((c: any) => ({
      message: c.body,
      timestamp: c.created_at,
      type: "comment",
    })),
  ];

  const offsets = events.map((event) => ({
    type: event.type,
    message: event.message,
    offset: moment(event.timestamp).diff(props.start, "minutes"),
  })).sort((a, b) => a.offset - b.offset);


  const offsetDiff = (offsets[offsets.length - 1]?.offset - offsets[0]?.offset) / (24 * 60)
  const firstOffset = offsets[0]?.offset / (24 * 60);

  return (
    <Container>
      <TicketInfoContainer
        height={props.height}
        bottom={props.height + zoomLevel.rowGutter}
      >
        {props.name} - <Link to={`/users/${props.ownerId}`}>{props.ownerName}</Link> - {props.estimate}
      </TicketInfoContainer>
      {!!offsets.length ? (
        <>
          <PullRequestContainer
            height={props.height}
            bottom={props.height + zoomLevel.rowGutter}
            padding={zoomLevel.intervalWidth / 2}
            width={offsetDiff * zoomLevel.intervalWidth}
            left={ (offsets[0]?.offset / (24 * 60)) * zoomLevel.intervalWidth}
          >
            <PullRequestInnerContainer
              height={props.height}
              bottom={props.height + zoomLevel.rowGutter}
              padding={zoomLevel.intervalWidth}
            >
              {offsets.map((offset) => (
                <div
                  style={{
                    width: 10,
                    height: 10,
                    background: offset.type === "comment" ? "red" : "black",
                    position: "absolute",
                    top: `calc(${props.height/2}px - 5px)`,
                    borderRadius: 100,
                    left: ((offset.offset / (24 * 60) - firstOffset)) * zoomLevel.intervalWidth,
                    zIndex: 100,
                  }}
                />
              ))}
            </PullRequestInnerContainer>
          </PullRequestContainer>
        </>
      ) : (
        <></>
      )}
    </Container>
  );
};

export default TimelineTooltip;
