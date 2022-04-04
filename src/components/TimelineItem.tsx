/* eslint-disable import/no-anonymous-default-export */
import React, { useRef, useState, memo } from "react";
import styled from "@emotion/styled";
import { CSSTransition } from "react-transition-group";
import { StatusEnum } from "../utils/timelineItems";
import { hexToRgb } from "../utils/gradients";
import { BORDER_RADIUS } from "../utils/constants";

const CONTENT_PADDING = 10;
const ANIMATION_DURATION = 500;
const DRAG_BORDER_WIDTH = 1;

type TimelineItemProps = {
  index: number;
  width: number;
  showInnerIndicator?: boolean;
  innerIndicatorWidth: number;
  showDashedIndicator?:boolean;
  dashedIndicatorWidth: number;
  height: number;
  offset: number;
  content: JSX.Element;
  gradient?: any;
  url?: string;
  status?: StatusEnum;
  start: string;
  tooltip?: JSX.Element;
  onDragEnd: (leftOffset: number, rightOffset: number) => void;
  onContentChange: (content: string) => void;
};

const InnerIndicator = styled.div<{
  width: number;
  isFullWidth: boolean;
}>(
  (props) => ({ width: props.width }),
  {
    borderRadius: BORDER_RADIUS,
    height: "100%",
    background: "rgba(255, 255, 255, 0.2)",
    position: "absolute",
  },
  (props) =>
    props.isFullWidth
      ? {}
      : {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }
);

const DashedIndicator = styled.div<{
  width: number;
  isFullWidth: boolean;
}>(
  (props) => ({ width: props.width }),
  {
    borderRadius: BORDER_RADIUS,
    height: "100%",
    // borderColor: "rgba(255, 255, 255, 0.5)",
    // borderStyle: 'dashed',
    background: "rgba(0, 0, 0, 0.2)",
    position: "absolute",
  },
  (props) =>
    props.isFullWidth
      ? {}
      : {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }
);

const TimelineItemContainer = styled.div<{
  offset: number;
  width: number;
  index: number;
  height: number;
  isDragging: boolean;
  gradient?: any;
  status?: StatusEnum;
}>(
  (props) => {
    const rgb = hexToRgb(props.gradient ? props.gradient[0] : "#000000");
    return {
      width: props.width,
      height: props.height,
      left:
        props.offset +
        (props.status === "unstarted" ? -1 * DRAG_BORDER_WIDTH : 0),
      position: "absolute",
      borderRadius: BORDER_RADIUS,
      background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`,
      boxShadow: "0px 0px 5px -1px rgba(0, 0, 0, 0.2)",
      color: "white",
      fontSize: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      transition: `width ${ANIMATION_DURATION}ms, left ${ANIMATION_DURATION}ms`,
      cursor: 'pointer',
    };
  },
  (props) => {
    let baseStyle: { [key: string]: string | number } = {
      border: `1px solid rgba(255, 255, 255, 0.1)`,
    };
    const rgb = hexToRgb(props.gradient ? props.gradient[0] : "#000000");

    if (props.status === "done") {
      baseStyle = {
        ...baseStyle,
        background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`,
        border: `1px solid black`,
      };
    }

    if (props.status === "unstarted") {
      baseStyle = {
        ...baseStyle,
        border: `${DRAG_BORDER_WIDTH}px dashed white`,
        zIndex: 2,
        top: -1 * DRAG_BORDER_WIDTH,
      };
    }

    return baseStyle;
  }
  // props.isDragging && {
  //   border: `${DRAG_BORDER_WIDTH}px dashed white`,
  //   top: -1 * DRAG_BORDER_WIDTH,
  //   opacity: 0.75,
  //   zIndex: 2,
  //   // We need to disable the animation
  //   // when dragging, otherwise the
  //   // drag has a delay
  //   transition: "none",
  // }
);

const TimelineItemContent = styled.div({
  padding: `0 ${CONTENT_PADDING}px`,
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  letterSpacing: "0.8px",
  fontWeight: 300,
  flex: 1,
  outline: "none",
  cursor: "pointer",
  zIndex: 100,
});

// const TimelineItemDragHandler = styled.div<{
//   isHovering: boolean;
//   side: "left" | "right";
// }>(
//   {
//     cursor: "ew-resize",
//     width: "15px",
//     height: "100%",
//     backgroundColor: "rgba(0, 0, 0, 0.25)",
//   },
//   (props) =>
//     props.side === "left" && {
//       borderTopLeftRadius: BORDER_RADIUS,
//       borderBottomLeftRadius: BORDER_RADIUS,
//     },
//   (props) =>
//     props.side === "right" && {
//       borderTopRightRadius: BORDER_RADIUS,
//       borderBottomRightRadius: BORDER_RADIUS,
//     }
// );

export default memo((props: TimelineItemProps) => {
  // const contentRef = useRef() as React.MutableRefObject<ContentEditable>;
  // We'll use ref's here because we don't care about changes affecting rendering,
  // but we do want to persist the value between re-renders
  const initialRightPosition = useRef(0);
  const initialLeftPosition = useRef(0);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isDragging, setIsClicking] = useState<boolean>(false);
  const [rightDragOffset, setRightDragOffset] = useState<number>(0);
  const [leftDragOffset, setLeftDragOffset] = useState<number>(0);

  // const handleDragStart = (event: React.DragEvent, side: "left" | "right") => {
  //   setIsClicking(true);
  //   // Removes the ghost of the drag handler when dragging
  //   event.dataTransfer.setDragImage(new Image(), 0, 0);
  //   (side === "left" ? initialLeftPosition : initialRightPosition).current =
  //     event.pageX;
  // };

  // const handleDragEnd = () => {
  //   setIsClicking(false);
  //   props.onDragEnd(
  //     props.offset + leftDragOffset,
  //     props.offset + leftDragOffset + props.width + rightDragOffset
  //   );
  //   setLeftDragOffset(0);
  //   setRightDragOffset(0);
  // };

  return (
    <>
      {/* <CSSTransition
        in={isHovering}
        classNames="tooltip"
        timeout={ANIMATION_DURATION}
        unmountOnExit
      >
        <TimelineItemTooltip offset={props.offset} index={props.index}>
          {props.content}
        </TimelineItemTooltip>
      </CSSTransition> */}

      <TimelineItemContainer
        offset={props.offset}
        width={props.width}
        index={props.index}
        height={props.height}
        isDragging={isDragging}
        onMouseEnter={() => {
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
        gradient={props.gradient}
        status={props.status || "unstarted"}
        onClick={() => (window as any).open(props.url, "_blank").focus()}
      >
        {props.showInnerIndicator && (
          <InnerIndicator
            width={props.innerIndicatorWidth}
            isFullWidth={props.innerIndicatorWidth === props.width}
          />
        )}
        {props.showDashedIndicator && (
          <DashedIndicator
            width={props.dashedIndicatorWidth}
            isFullWidth={props.dashedIndicatorWidth >= props.width}
          />
        )}
        {/* <TimelineItemDragHandler
          side="left"
          isHovering={isHovering}
          draggable={true}
          onDragStart={(e) => handleDragStart(e, "left")}
          onDrag={(e) =>
            e.pageX !== 0 &&
            setLeftDragOffset(e.pageX - initialLeftPosition.current)
          }
          onDragEnd={handleDragEnd}
        /> */}
        <TimelineItemContent>
          {props.content}
        </TimelineItemContent>
        {/* <TimelineItemDragHandler
          side="right"
          isHovering={isHovering}
          draggable={true}
          onDragStart={(e) => handleDragStart(e, "right")}
          onDrag={(e) =>
            e.pageX !== 0 &&
            setRightDragOffset(e.pageX - initialRightPosition.current)
          }
          onDragEnd={handleDragEnd}
        /> */}
        <CSSTransition
          in={isHovering}
          classNames="tooltip"
          timeout={ANIMATION_DURATION}
          unmountOnExit
        >
          {props.tooltip}
        </CSSTransition>
      </TimelineItemContainer>
    </>
  );
});
