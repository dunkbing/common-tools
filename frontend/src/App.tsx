import { Resizable } from 're-resizable';
import { useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import Menus, { menuSlugs } from './components/Menus';
import Base64 from './pages/Base64Converter';
import Composerize from './pages/Composerize';
import HTMLViewer from './pages/HTMLViewer';
import JSONTransformer from './pages/JSONTransformer';
import JSONViewer from './pages/JSONViewer';
import Jwt from './pages/JwtDebugger';
import SvgViewer from './pages/SvgViewer';
import UrlEncodeDecode from './pages/UrlEncodeDecode';

function App() {
  const [width, setWidth] = useState(340);

  return (
    <HashRouter basename="/">
      <div className="flex flex-row font-mono text-slate-100">
        <Resizable
          className="resizable"
          size={{
            width,
            height: '100%',
          }}
          maxWidth={390}
          minWidth={270}
          enable={{ right: true }}
          onResizeStop={(e, direction, ref, delta) => {
            setWidth(width + delta.width);
          }}
        >
          <Menus />
        </Resizable>
        <div className="w-full max-h-screen font-mono app">
          <Routes>
            <Route path="/" element={<Navigate to={menuSlugs.jsonViewer} />} />
            <Route path={menuSlugs.jsonViewer} element={<JSONViewer />} />
            <Route
              path={menuSlugs.jsonTransformer}
              element={<JSONTransformer />}
            />
            <Route path={menuSlugs.base64} element={<Base64 />} />
            <Route path={menuSlugs.url} element={<UrlEncodeDecode />} />
            <Route path={menuSlugs.jwt} element={<Jwt />} />
            <Route path={menuSlugs.htmlViewer} element={<HTMLViewer />} />
            <Route path={menuSlugs.htmlToMarkdown} element={<HTMLViewer />} />
            <Route path={menuSlugs.svgViewer} element={<SvgViewer />} />
            <Route path={menuSlugs.composerize} element={<Composerize />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
