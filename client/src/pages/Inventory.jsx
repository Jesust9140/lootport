import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Inventory() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/profile?tab=inventory', { replace: true });
  }, [navigate]);

  return null;
}
