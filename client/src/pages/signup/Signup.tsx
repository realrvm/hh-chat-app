import { FormEventHandler, useRef } from 'react';

import { useAuth, Context } from '../../api/auth-api';
import { Button, Input } from '../../components';

import styles from './Signup.module.scss';

type Props = {};

export default function Signup({}: Props) {
  const { signup } = useAuth() as Context;
  const userNameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (signup.isLoading) return;

    const id = userNameRef.current?.value;
    const name = nameRef.current?.value;
    const image = imgRef.current?.value;
    if (!id || !name) {
      return;
    }

    signup.mutate({ id, name, image });
  };

  return (
    <>
      <h1 className={styles.signup_title}>Sign Up</h1>
      <form onSubmit={handleSubmit} className={styles.signup_form}>
        <label htmlFor="user_name">Username</label>
        <Input id="user_name" pattern="\S*" required ref={userNameRef} />
        <label htmlFor="name">Name</label>
        <Input id="name" required ref={nameRef} />
        <label htmlFor="img">Image</label>
        <Input id="img" ref={imgRef} type="url" />
        <Button
          disabled={signup.isLoading}
          type="submit"
          className={styles.signup_btn}
        >
          {signup.isLoading ? 'Loading...' : 'Sign Up'}
        </Button>
      </form>
    </>
  );
}
