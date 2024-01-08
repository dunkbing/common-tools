import { SyntheticEvent, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Resizable } from 're-resizable';
import Base64 from './pages/Base64';
import Menus from './components/Menus';
import './App.css'; // Import the resizable styles

function App() {
  const [width, setWidth] = useState(350);

  return (
    <div className="flex flex-row">
      <Resizable
        className="resizable"
        size={{ width, height: '100%' }}
        maxWidth={400}
        minWidth={300}
        enable={{ right: true }}
        onResizeStop={(e, direction, ref, d) => {
          setWidth(width + d.width);
        }}
      >
        <Menus />
      </Resizable>
      <div>
        <HashRouter basename="/">
          <Routes>
            <Route path="/base64" element={<Base64 />} />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
}

export default App;
