import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

import { getUser, listIterationStories, getWorkflow } from "./api/shortcut";

import { Item } from "./utils/timelineItems";
import Timeline from "./components/Timeline";
import moment from "moment";
import { stringToColour } from "./utils/gradients";
import Stories from "./Stories";

const Epic = () => {
  let { id } = useParams();
  const [stories, setStories] = useState<any>([]);

  useEffect(() => {
    const getStories = async function () {
      const response = await listIterationStories(id);
      setStories(response.data);
    };
    getStories();
  }, []);
  
  return (
    <Stories stories={stories} />
  );
};

export default Epic;
