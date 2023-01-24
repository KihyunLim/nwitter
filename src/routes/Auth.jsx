import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { authService } from 'fbase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');
  const onChange = (event) => {
    const { target: { name, value } } = event;

    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  }
  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      let data = undefined;
      if (newAccount) {
        data = await createUserWithEmailAndPassword(authService, email, password);
      } else {
        data = await signInWithEmailAndPassword(authService, email, password);
      }

      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  }
  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <div>
      <div className="authContainer">
        <FontAwesomeIcon
          icon={faTwitter}
          color={"#04AAFF"}
          size="3x"
          style={{ marginBottom: 30 }}
        />
        <form onSubmit={onSubmit} className="container">
          <input type="email" name="email" className="authInput" placeholder='Email' required value={email} onChange={onChange} />
          <input type="password" name="password" className="authInput" placeholder='Password' required value={password} onChange={onChange} />
          <input type="submit" className="authInput authSubmit" value={newAccount ? "Create Account" : "Sign In"} />
          {error && <span className="authError">{error}</span>}
        </form>
        <span onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span>
      </div>
    </div>
  )
};

export default Auth;