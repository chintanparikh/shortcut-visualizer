import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Home from './Home';
import Epic from './Epic';
import Iteration from './Iteration';
import User from './User';
import Group from './Group';
import { useEffect } from "react";
import { ZoomLevelProvider } from "./utils/zoomLevel";

function App() {
  console.log("Test 1")

  return (
    <div className="App">
      <ZoomLevelProvider>
       <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/epics/:id" element={<Epic />} />
            <Route path="/iterations/:id" element={<Iteration />} />
            <Route path="/users/:id" element={<User />} />
            <Route path="/groups/:id" element={<Group />} />
          </Routes>
        </Router>
        </ZoomLevelProvider>
    </div>
  );
}

export default App;
