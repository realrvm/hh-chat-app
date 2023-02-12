import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth, Context } from '../../api/auth-api';

type Props = {};

export default function Root({}: Props) {
  const { user } = useAuth() as Context;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  return <Outlet />;
}
