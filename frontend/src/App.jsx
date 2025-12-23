import { BrowserRouter, Routes, Route } from "react-router-dom";
import Donate from "./pages/Donate";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/donate" element={<Donate />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
