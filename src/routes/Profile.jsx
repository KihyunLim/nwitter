import React, { useEffect, useState } from "react";
import { signOut, updateProfile } from 'firebase/auth';
import { authService, dbService } from 'fbase';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName || '');
  const onLogOutClick = () => {
    signOut(authService);
    refreshUser();
    history.push('/');
  };
  const getMyNweets = async () => {
    const q = query(collection(dbService, 'nweets'), where('creatorId', '==', userObj.uid), orderBy('createdAt', 'desc'));
    onSnapshot(q, (qs) => {
      const nweetsArray = [];
      qs.forEach((doc) => {
        nweetsArray.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      console.log(nweetsArray);
    });
  };
  const onSubmit = async (event) => {
    event.preventDefault();

    const displayName = userObj.displayName || '';
    if (displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, { displayName: newDisplayName });
      refreshUser();
    }
  }
  const onChange = (event) => {
    const { target: { value } } = event;

    setNewDisplayName(value);
  }

  useEffect(() => {
    getMyNweets();
  }, []);

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input type="text" className="formInput" onChange={onChange} value={newDisplayName} placeholder="Display name" autoFocus />
        <input type="submit" className="formBtn" value="Update Profile" style={{ marginTop: 10 }} />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;