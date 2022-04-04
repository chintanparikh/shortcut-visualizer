import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

import { getUser, listEpicStories, getWorkflow, listGroupStories } from "./api/shortcut";

import { Item } from "./utils/timelineItems";
import Timeline from "./components/Timeline";
import moment from "moment";
import { stringToColour } from "./utils/gradients";
import Stories from "./Stories";

const Group = () => {
  let { id } = useParams();
  const [stories, setStories] = useState<any>([]);

  useEffect(() => {
    const getStories = async function () {
      const response = await listGroupStories(id);
      setStories(response.data);
    };
    getStories();
  }, []);
  
  return (
    <Stories stories={stories} />
  );
};

export default Group;
