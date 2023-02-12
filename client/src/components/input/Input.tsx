import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from 'react';

import styles from './Input.module.scss';

const Input = forwardRef<
  HTMLInputElement,
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
>(({ className, ...rest }, ref) => {
  return (
    <input
      {...rest}
      ref={ref}
      className={[styles.input, className].join(' ')}
    />
  );
});

export default Input;
