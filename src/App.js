import * as React from 'react';
import { AuthProvider } from './context/AuthContext';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SignIn from "./components/SignIn";
import Chat from "./components/Chat";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Chat />} />
          <Route path={"/signin"} element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
