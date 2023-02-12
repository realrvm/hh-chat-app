import { LinkProps, Link as RouterLink } from 'react-router-dom';

import styles from './Link.module.scss';

export default function Link({ children, className, ...rest }: LinkProps) {
  return (
    <RouterLink {...rest} className={`${[styles.link, className].join(' ')}`}>
      {children}
    </RouterLink>
  );
}
