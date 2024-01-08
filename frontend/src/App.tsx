import { HashRouter, Route, Routes } from 'react-router-dom';
import Base64 from './pages/Base64';

function App() {
  return (
    <div id="App">
      <h1 className="text-3xl font-mono font-bold underline">Hello world!</h1>
      <HashRouter basename="/">
        <Routes>
          <Route path="/base64" element={<Base64 />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
