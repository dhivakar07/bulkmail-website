import BulkMail from "./Bulkmail";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/bulkmail" element={<BulkMail />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
