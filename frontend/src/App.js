import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import InitialQuestion from './component/InitialQuestion';
import Questionnaire from './component/Questionnaire';
import AllSales from './component/AllSales';
import Edit from './component/Edit';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          {/* Static route */}
          <Route path="/" element={<InitialQuestion />} />
          
          {/* Dynamic route for language parameter */}
          <Route path="/q2/:lang" element={<Questionnaire />} />
          
          {/* Other routes */}
          <Route path="/view" element={<AllSales />} />
          <Route path="/update" element={<Edit />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
