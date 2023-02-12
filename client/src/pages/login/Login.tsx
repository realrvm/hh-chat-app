import { FormEventHandler, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, Context } from '../../api/auth-api';

import { Button, Input } from '../../components';

import styles from './Login.module.scss';

type Props = {};

export default function Login({}: Props) {
  const { login, user } = useAuth() as Context;
  const userNameRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user]);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (login.isLoading) return;

    const id = userNameRef.current?.value;
    if (!id) {
      return;
    }

    login.mutate(id);
  };

  return (
    <>
      <h1 className={styles.login_title}>Login</h1>
      <form onSubmit={handleSubmit} className={styles.login_form}>
        <label htmlFor="user_name">Username</label>
        <Input id="user_name" required ref={userNameRef} />
        <Button
          disabled={login.isLoading}
          type="submit"
          className={styles.login_btn}
        >
          {login.isLoading ? 'Loading...' : 'Login'}
        </Button>
      </form>
    </>
  );
}
