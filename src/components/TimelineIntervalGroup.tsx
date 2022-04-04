import React, { memo } from 'react';
import styled from '@emotion/styled'
import moment, { Moment } from 'moment';

import { DATE_FORMAT } from '../utils/constants';
import { enumerateDateRange } from '../utils/dates';

const HEADER_HEIGHT = 45;

const TimelineIntervalGroupContainer = styled.div<{ contentHeight: number }>(props => ({
    height: HEADER_HEIGHT + props.contentHeight,
    display: "flex",
    flexDirection: "row",
    overflowX: "auto",
}));

const TimelineIntervalHeader = styled.div({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    letterSpacing: '2px',
    fontWeight: 100,
    color: "#87879c",
    fontSize: "13px",
    height: HEADER_HEIGHT,
});

const TimelineIntervalBody = styled.span<{ contentHeight: number }>(props => ({
    height: props.contentHeight,
    display: 'block',
}));

const TimelineIntervalContainer = styled.div<{ intervalWidth: number, isWeekend: boolean }>(props => ({
    flex: `0 0 ${props.intervalWidth}px`,
    height: "100%",
    // This is a bit of a hack - what I actually want is to be able
    // to target `&:nth-child(even) > TimelineIntervalBody`, but I can't
    // figure out the syntax for doing this with the emotion object syntax.
    // Will note this as one of the things I would like to change given
    // more time in the README. I hacked around this by making
    // TimelineIntervalBody a span, and TimelineIntervalHeader a div
    "&:nth-of-type(even) > span": {
        background: props.isWeekend ? 'repeating-linear-gradient(45deg, #23232c, #23232c 10px, #292931 10px, #292931 11px)' : "#262630",

    },
    "&:nth-of-type(odd) > span": {
        background: props.isWeekend ? 'repeating-linear-gradient(45deg, #292931, #292931 10px, #23232c 10px, #23232c 11px)' : "#2E2E37",
    },
}));

const ItemsContainer = styled.div<{
    intervalCount: number,
    intervalWidth: number,
    contentHeight: number
}>(props => ({
    marginTop: HEADER_HEIGHT,
    height: props.contentHeight - HEADER_HEIGHT,
    // This sets the children to start at the beginning of the intervals
    position: "relative",
    right: `${props.intervalCount * props.intervalWidth}px`,
}));

type TimelineIntervalGroupProps = {
    start: string,
    end: string,
    children: React.ReactNode,
    intervalWidth: number
    contentHeight: number,
};

type TimelineIntervalProps = {
    date: Moment,
    intervalWidth: number,
    contentHeight: number,
};

const TimelineInterval = memo((props: TimelineIntervalProps) => {
    const isWeekend = props.date.day() % 6 === 0;
    return (
        <TimelineIntervalContainer intervalWidth={props.intervalWidth} isWeekend={isWeekend}>
            <TimelineIntervalHeader>
                <span>{props.date.format("DD")}</span>
                <span>{props.date.format("ddd").toUpperCase()}</span>
            </TimelineIntervalHeader>
            <TimelineIntervalBody
                contentHeight={props.contentHeight}
            />
        </TimelineIntervalContainer>
    )
});

const TimelineIntervalGroup = memo((props: TimelineIntervalGroupProps) => {
    const start = moment(props.start, DATE_FORMAT);
    const end = moment(props.end, DATE_FORMAT);

    const intervals = enumerateDateRange(start, end);

    return (
        <TimelineIntervalGroupContainer contentHeight={props.contentHeight}>
            {
                intervals.map((date, i) => {
                    return (
                        <TimelineInterval
                            date={date}
                            intervalWidth={props.intervalWidth}
                            contentHeight={props.contentHeight}
                            key={`interval-${i}`}
                        />
                    );
                })
            }
            <ItemsContainer
                intervalCount={intervals.length}
                intervalWidth={props.intervalWidth}
                contentHeight={props.contentHeight}
            >
                {props.children}
            </ItemsContainer>
        </TimelineIntervalGroupContainer>
    );
});

export default TimelineIntervalGroup;