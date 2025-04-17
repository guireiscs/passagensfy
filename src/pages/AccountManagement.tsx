import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This component is now just a redirect to the profile page
const AccountManagement: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/account/profile');
  }, [navigate]);
  
  return null;
};

export default AccountManagement;