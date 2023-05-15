import React, { useContext, useState } from 'react';
import './auth-modal.css';

import FullscreenModal from '../fullscreen-modal/fullscreen-modal';
import AuthService from '../../services/auth-service';
import { UserContext } from '../../user/user-context';

enum AuthType {
  SIGNUP,
  SIGNIN,
}

const AuthModal: React.FC<{ isVisible: boolean; onClose: () => void }> = ({
  isVisible,
  onClose,
}) => {
  const [authType, setAuthType] = useState<AuthType>(AuthType.SIGNIN);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const userContext = useContext(UserContext);
  const authService = new AuthService();

  const onSubmit = async () => {
    if (!email.length || !password.length) {
      console.log('AuthModal/onSubmit error: Cannot submit an empty field');
      return;
    }

    const { user, error } = await authService.signin(email, password);

    if (error) {
      console.log('AuthModal/onSubmit error:', error);
      return;
    }

    if (user) {
      userContext.update(user);
      onClose();
    }
  };

  if (!isVisible) return null;
  return (
    <FullscreenModal>
      <div className="authmodal">
        <div className="authmodal-card">
          <input
            placeholder="Insert your email"
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            placeholder="Insert your password"
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button onClick={() => onSubmit()}>Login</button>
        </div>
      </div>
      ;
    </FullscreenModal>
  );
};

export default AuthModal;
