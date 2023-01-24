import React, { useEffect, useState } from "react";
import AppRouter from './Router';
import { authService } from 'fbase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj(Object.assign({}, user));
  };

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setUserObj(user);
      } else {
        setUserObj(null);
      }

      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} refreshUser={refreshUser} />
      ) : (
        "Initializing..."
      )}
    </>
  );
}

export default App;
