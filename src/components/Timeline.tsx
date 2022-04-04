import React, { useState } from "react";
import styled from "@emotion/styled";
import moment from "moment";

import TimelineIntervalGroup from "./TimelineIntervalGroup";
import TimelineItem from "./TimelineItem";

import { DATE_FORMAT } from "../utils/constants";
import {
  sortItemsByStartDate,
  groupItemsIntoRows,
  getItemWithLastEndDate,
  Item,
} from "../utils/timelineItems";
import { useZoomLevel } from "../utils/zoomLevel";
import TimelineTooltip from "./TimelineTooltip";

export type TimelineProps = {
  items: Item[];
  onUpdateItem: (item: Item) => void;
};

const TimelineContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

const TimelineControlContainer = styled.div({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  marginBottom: "10px",
});

const TimelineControlButton = styled.div<{ disabled: boolean }>(
  {
    width: "30px",
    height: "30px",
    borderRadius: "30px",
    background: "white",
    marginRight: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "18px",
  },
  (props) =>
    props.disabled && {
      background: "grey",
      cursor: "default",
    }
);

const TimelineItemRow = styled.div<{
  index: number;
  itemHeight: number;
  rowGutter: number;
}>((props) => ({
  display: "flex",
  position: "relative",
  top: props.index * (props.itemHeight + props.rowGutter) + props.rowGutter,
}));

const Timeline = (props: TimelineProps) => {
  const { zoomLevel, canZoomOut, canZoomIn, setZoomLevelIndex } =
    useZoomLevel();

  const sortedItems = sortItemsByStartDate(props.items);
  const rows = groupItemsIntoRows(sortedItems).filter((row: any) => !!row);
  const lastItem = getItemWithLastEndDate(sortedItems);
  const startDate = moment(sortedItems[0].start, DATE_FORMAT);
  const endDate = (lastItem.end ? moment(lastItem.end, DATE_FORMAT) : moment())
    .add(10, "days")
    .format();

  const rowHeight = zoomLevel.itemHeight + zoomLevel.rowGutter;

  const handleDragEnd = (
    item: Item,
    leftOffset: number,
    rightOffset: number
  ) => {
    const initialStart = moment(item.start, DATE_FORMAT);
    const width = rightOffset - leftOffset;
    const duration =
      (width + 2 * zoomLevel.itemGutter) / zoomLevel.intervalWidth;
    const offset =
      (leftOffset - zoomLevel.itemGutter) / zoomLevel.intervalWidth;
    const start = startDate.add(offset, "days");
    // We use .75 instead of a whole day here because
    // we want to give the user some buffer room so the
    // item snaps to the correct date
    const end = initialStart.add(duration - 0.75, "days");
    props.onUpdateItem({
      ...item,
      start: start.format(DATE_FORMAT),
      end: end.format(DATE_FORMAT),
    });
  };

  return (
    <TimelineContainer>
      <TimelineControlContainer>
        <TimelineControlButton
          disabled={!canZoomOut}
          onClick={() => canZoomOut && setZoomLevelIndex((i: number) => i - 1)}
        >
          -
        </TimelineControlButton>
        <TimelineControlButton
          disabled={!canZoomIn}
          onClick={() => canZoomIn && setZoomLevelIndex((i: number) => i + 1)}
        >
          +
        </TimelineControlButton>
      </TimelineControlContainer>
      <TimelineIntervalGroup
        start={sortedItems[0].start}
        end={endDate}
        intervalWidth={zoomLevel.intervalWidth}
        contentHeight={rows.length * rowHeight + zoomLevel.rowGutter}
      >
        <>
          {rows.map((row: Item[], i: number) => {
            return (
              <TimelineItemRow
                itemHeight={zoomLevel.itemHeight}
                rowGutter={zoomLevel.rowGutter}
                index={i}
                key={`timeline-row-${i}`}
              >
                {row.map((item) => {
                  const start = moment(item.start);
                  const end = moment(item.end);
                  // We add a day so it's inclusive of start and end
                  let duration = end.diff(start, "minutes") / (24 * 60);
                  if (duration < 0.75) {
                    duration += 0.75;
                  }
                  const innerIndicatorEnd = moment(item.pullRequestOpenedAt);
                  const offset = start.diff(startDate, "minutes") / (24 * 60);
                  let innerDuration =
                    innerIndicatorEnd.diff(start, "minutes") / (24 * 60);
                  if (innerDuration < 0.1) {
                    innerDuration += 0.1;
                  }
                  let dashedDuration = moment.duration(item.estimate, 'days').asDays();


                  return (
                    <>
                      <TimelineItem
                        key={`item-${item.id}`}
                        index={item.id}
                        tooltip={
                          <TimelineTooltip
                            height={zoomLevel.itemHeight}
                            pullRequests={item.pullRequests || []}
                            start={item.start}
                            name={item.name}
                            ownerId={item.owner?.profile?.mention_name}
                            ownerName={item.owner?.profile?.name}
                            estimate={item.estimate || 0}
                          />
                        }
                        width={
                          duration * zoomLevel.intervalWidth -
                          2 * zoomLevel.itemGutter
                        }
                        showInnerIndicator={!!item.pullRequestOpenedAt}
                        innerIndicatorWidth={
                          innerDuration * zoomLevel.intervalWidth -
                          2 * zoomLevel.itemGutter
                        }
                        showDashedIndicator={!!item.estimate}
                        dashedIndicatorWidth={
                          dashedDuration * zoomLevel.intervalWidth -
                          2 * zoomLevel.itemGutter
                        }
                        offset={
                          offset * zoomLevel.intervalWidth +
                          zoomLevel.itemGutter
                        }
                        start={item.start}
                        height={zoomLevel.itemHeight}
                        content={
                          <div>
                            {item.name} - {item.estimate}
                          </div>
                        }
                        onContentChange={(content) =>
                          props.onUpdateItem({
                            ...item,
                            name: content,
                          })
                        }
                        onDragEnd={(leftOffset, rightOffset) =>
                          handleDragEnd(item, leftOffset, rightOffset)
                        }
                        gradient={item.gradient}
                        url={item.url}
                        status={item.status}
                      />
                    </>
                  );
                })}
              </TimelineItemRow>
            );
          })}
        </>
      </TimelineIntervalGroup>
    </TimelineContainer>
  );
};

export default Timeline;
