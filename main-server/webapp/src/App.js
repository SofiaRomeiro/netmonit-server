import "./app.css"
import React  from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Topbar from "./components/topbar/Topbar";
import Grafana from "./pages/grafana/Grafana";
import Probes from "./pages/probes/Probes";
import PageSettings from "./pages/PageSettings/PageSettings";

function App() {
  return (
      <Router>
          <Topbar />
          <div className="welcome-page">
                <Routes>
                    <Route exact path='/' element={<Grafana/>} />
                    <Route exact path='/grafana' element={<Grafana/>} />
                    <Route exact path='/probes' element={<Probes/>} />
                    <Route exact path='/settings' element={<PageSettings/>} />
                </Routes>
          </div>
      </Router>
  );
}

export default App;
