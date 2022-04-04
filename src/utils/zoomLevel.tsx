import React, { createContext, useContext, useState } from 'react';

export type ZoomLevel = {
  intervalWidth: number;
  itemHeight: number;
  rowGutter: number;
  itemGutter: number;
};

const INITIAL_ZOOM_LEVEL_INDEX = 2;
const ZOOM_LEVELS: ZoomLevel[] = [
  {
    intervalWidth: 30,
    itemHeight: 20,
    rowGutter: 5,
    itemGutter: 5,
  },
  {
    intervalWidth: 40,
    itemHeight: 30,
    rowGutter: 5,
    itemGutter: 5,
  },
  {
    intervalWidth: 50,
    itemHeight: 35,
    rowGutter: 7,
    itemGutter: 5,
  },

  {
    intervalWidth: 60,
    itemHeight: 40,
    rowGutter: 9,
    itemGutter: 5,
  },
  {
    intervalWidth: 70,
    itemHeight: 45,
    rowGutter: 11,
    itemGutter: 5,
  },
  {
    intervalWidth: 80,
    itemHeight: 50,
    rowGutter: 15,
    itemGutter: 5,
  },
  {
    intervalWidth: 100,
    itemHeight: 50,
    rowGutter: 15,
    itemGutter: 7,
  },
  {
    intervalWidth: 120,
    itemHeight: 50,
    rowGutter: 15,
    itemGutter: 10,
  },
  {
    intervalWidth: 140,
    itemHeight: 50,
    rowGutter: 15,
    itemGutter: 12,
  },
  {
    intervalWidth: 160,
    itemHeight: 50,
    rowGutter: 15,
    itemGutter: 15,
  },
  {
    intervalWidth: 180,
    itemHeight: 50,
    rowGutter: 15,
    itemGutter: 20,
  },
];

const ZoomLevelContext = createContext<any>(null);

export const ZoomLevelProvider = ({ children }: {children: JSX.Element}) => {
  const [zoomLevelIndex, setZoomLevelIndex] = useState<number>(INITIAL_ZOOM_LEVEL_INDEX);
  const zoomLevel = ZOOM_LEVELS[zoomLevelIndex];
  const canZoomOut = zoomLevelIndex !== 0;
  const canZoomIn = zoomLevelIndex !== ZOOM_LEVELS.length - 1;

  return (
    <ZoomLevelContext.Provider value={{zoomLevel, canZoomOut, canZoomIn, setZoomLevelIndex}}>
      {children}
    </ZoomLevelContext.Provider>
  )
}

export const useZoomLevel = () => useContext(ZoomLevelContext);