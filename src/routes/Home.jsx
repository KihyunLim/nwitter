import React, { useState, useEffect } from "react";
import Nweet from 'components/Nweet';
import { dbService } from 'fbase';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState('');
  const [nweets, setNweets] = useState([]);
  const onSubmit = async (event) => {
    event.preventDefault();
    if (nweet === "") {
      return;
    }

    await addDoc(collection(dbService, 'nweets'), { 
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setNweet('');
  };
  const onChange = (event) => {
    const { target: { value } } = event;

    setNweet(value);
  };

  useEffect(() => {
    const q = query(collection(dbService, 'nweets'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (qs) => {
      const nweetsArray = [];
      qs.forEach((doc) => {
        nweetsArray.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setNweets(nweetsArray);
    });
  }, []);
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="factoryForm">
        <div className="factoryInput__container">
          <input
            className="factoryInput__input"
            value={nweet}
            onChange={onChange}
            type="text"
            placeholder="What's on your mind?"
            maxLength={120}
          />
          <input type="submit" value="&rarr;" className="factoryInput__arrow" />
        </div>
      </form>
      <div style={{ marginTop: 30 }}>
        {nweets.map((nweet) => (
          <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
        ))}
      </div>
    </div>
  )
};

export default Home;