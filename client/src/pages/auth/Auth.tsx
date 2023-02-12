import { Outlet, useLocation } from 'react-router-dom';
import { Form, Link } from '../../components';

type Props = {};

export default function Auth({}: Props) {
  const { pathname: path } = useLocation();
  const isSignupPage = path === '/signup';

  return (
    <Form>
      <Form.Body>
        <Outlet />
      </Form.Body>
      <Form.Bottom>
        <Link to={isSignupPage ? '/login' : '/signup'}>
          {isSignupPage ? 'Login' : 'Create New Account'}
        </Link>
      </Form.Bottom>
    </Form>
  );
}
