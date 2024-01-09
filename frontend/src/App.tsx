import { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Resizable } from 're-resizable';
import Base64 from './pages/Base64';
import Menus, { menuSlugs } from './components/Menus';
import Jwt from './pages/Jwt';
import Url from './pages/Url';

function App() {
  const [width, setWidth] = useState(370);

  return (
    <HashRouter basename="/">
      <div className="flex flex-row">
        <Resizable
          className="resizable"
          size={{ width, height: '100%' }}
          maxWidth={420}
          minWidth={370}
          enable={{ right: true }}
          onResizeStop={(e, direction, ref, d) => {
            setWidth(width + d.width);
          }}
        >
          <Menus />
        </Resizable>
        <div>
          <Routes>
            <Route path={menuSlugs.base64} element={<Base64 />} />
            <Route path={menuSlugs.url} element={<Url />} />
            <Route path={menuSlugs.jwt} element={<Jwt />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
