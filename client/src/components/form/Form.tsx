import { ReactNode, useEffect } from 'react';
import { Context, useAuth } from '../../api/auth-api';
import { toast, ToastContainer } from 'react-toastify';

import styles from './Form.module.scss';

type Props = { children: ReactNode };

export default function Form({ children }: Props) {
  const { error, check } = useAuth() as Context;

  useEffect(() => {
    error && toast(error, { position: toast.POSITION.BOTTOM_RIGHT });
  }, [check]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.form}>{children}</div>
      <ToastContainer autoClose={2000} />
    </div>
  );
}

Form.Body = function ({ children }: Props) {
  return <div className={styles.form_body}>{children}</div>;
};

Form.Bottom = function ({ children }: Props) {
  return <div className={styles.form_bottom}>{children}</div>;
};
