import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

import { getUser, listUserStories, getWorkflow } from "./api/shortcut";

import { Item } from "./utils/timelineItems";
import Timeline from "./components/Timeline";
import moment from "moment";
import { stringToColour } from "./utils/gradients";
import Stories from "./Stories";

const User = () => {
  let { id } = useParams();
  const [stories, setStories] = useState<any>([]);

  useEffect(() => {
    const getStories = async function () {
      const response = await listUserStories(id);
      setStories(response);
    };
    getStories();
  }, []);
  
  return (
    <Stories stories={stories} groupByEpic={true}/>
  );
};

export default User;
