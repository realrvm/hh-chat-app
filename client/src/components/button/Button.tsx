import { DetailedHTMLProps, forwardRef, ButtonHTMLAttributes } from 'react';

import styles from './Button.module.scss';

const Button = forwardRef<
  HTMLButtonElement,
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
>(({ className, children, ...rest }, ref) => {
  return (
    <button {...rest} ref={ref} className={[styles.btn, className].join(' ')}>
      {children}
    </button>
  );
});

export default Button;
