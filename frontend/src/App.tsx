import { useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Resizable } from 're-resizable';
import Base64 from './pages/Base64Converter';
import Menus, { menuSlugs } from './components/Menus';
import Jwt from './pages/JwtDecoder';
import Url from './pages/Url';
import JSONFormatter from './pages/JSONFormatter';

function App() {
  const [width, setWidth] = useState(370);

  return (
    <HashRouter basename="/">
      <div className="flex flex-row font-mono text-slate-100">
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
        <div className="bg-zinc-700 w-full">
          <Routes>
            <Route
              path="/"
              element={<Navigate to={menuSlugs.jsonFormatter} />}
            />
            <Route path={menuSlugs.jsonFormatter} element={<JSONFormatter />} />
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
