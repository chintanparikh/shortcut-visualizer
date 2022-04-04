import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled'

import { listEpics } from './api/shortcut';

const EpicContainer = styled.div`

  width: 300px;
  border: 1px solid black;
  margin: 10px;
  padding: 10px;
  text-align: center;

`;

const Container = styled.div`


`;

const Home = () => {
  const [epics, setEpics] = useState([]);

  useEffect(() => {
    listEpics().then((epics) => {
      setEpics(epics.data.sort((a, b) => a.state === 'in progress' ? -1 : 1));
    });
  }, [])



  return (
    <Container>
      {epics.length === 0 ? "Loading..." : ""}

      {epics.map((epic) => (
        <Link to={`/epics/${epic.id}`} key={epic.id}>
          <EpicContainer>
            <h2>{epic.name}</h2>
            <p>{epic.state}</p>
          </EpicContainer>
        </Link>
      ))}
    </Container>
  );
}

export default Home;