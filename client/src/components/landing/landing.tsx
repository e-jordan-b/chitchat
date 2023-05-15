import React, { useState } from 'react';
import AuthModal from '../auth/auth-modal';

const Landing: React.FC = () => {
  const [showAuth, setShowAuth] = useState<boolean>(false);
  return (
    <>
      <div className="landing">
        <button
          onClick={() => setShowAuth(true)}
          style={{ height: '60px', width: '200px', backgroundColor: 'gray' }}
        ></button>
      </div>
      <AuthModal isVisible={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default Landing;
