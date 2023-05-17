import React, { useContext, useState } from 'react';
import './auth-modal.css';
import FullscreenModal from '../fullscreen-modal/fullscreen-modal';
import AuthService from '../../services/auth-service';
import { UserContext } from '../../user/user-context';
import {AiFillCloseCircle} from 'react-icons/ai'

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
      <div className="flex flex-col justify-center items-center h-screen">
      <div className="shadow-md h-[500px] max-h-[600px] min-h-[400px] w-[450px] flex flex-col items-center justify-around bg-white dark:bg-gray-800 rounded-md relative">
      <h1 className="text-3xl dark:text-custom-purple-50 select-none mt-3">Sign in to your account</h1>
      <form>
        <div className="flex flex-col justify-center items-center h-auto w-auto">
          <label className='relative cursor-pointer'>
            <input
              type="text"
              placeholder="Input"
              className='myInput mb-10 h-10 w-80 px-6 text-xl text-black bg-white border-gray-600 border-2 rounded-lg border-opacity-50 outline-none focus:border-blue-500 placeholder-gray-300 placeholder-opacity-0 transition duration-200'
              onChange={(ev) => setEmail(ev.target.value)}
            />
            <span className='text-1xl text-black text-opacity-80 bg-white absolute left-5 top-2 px-2 rounded-md transition duration-200 input-text'>Email</span>
          </label>
          <label className='relative cursor-pointer'>
            <input
              type="password"
              placeholder="Input"
              className='h-10 w-80 px-6 text-xl text-black bg-white border-gray-600 border-2 rounded-lg border-opacity-50 outline-none focus:border-blue-500 placeholder-gray-300 placeholder-opacity-0 transition duration-200'
              onChange={(ev) => setPassword(ev.target.value)}
            />
            <span className='text-1xl text-black text-opacity-80 bg-white absolute left-5 top-2 px-2 py-0 transition rounded-md duration-200 input-text'>Password</span>
          </label>
        </div>

      </form>
      <div className='absolute top-0 right-0 bg-white w-4 h-4 rounded-full'></div>
      <span
        onClick={() => onClose()}
      className='absolute top-0 right-0 translate-x-[6.5px] cursor-pointer translate-y-[-6.5px]'><AiFillCloseCircle size={25} color='red' />
      </span>

      <div className="w-1/2 h-10 ">
        <button
        onClick={() => onSubmit()}
        className="bg-custom-purple-700 w-full h-12 rounded-md text-white transition-all duration-150 hover:bg-custom-purple-500">
          Sign in
        </button>
      </div>
      <div className="flex justify-around w-full">
        <a href='/' className="text-custom-purple-700 cursor-pointer dark:text-custom-purple-200">Forgot password?</a>
      </div>
      <div className="pb-5 dark:text-custom-purple-300">
        <span className='select-none'>Don't you have an account yet?<a href='/' className="text-blue-600 ml-2 cursor-pointer">Sign Up</a></span>
      </div>
      </div>

      </div>
    </FullscreenModal>
  );
};

export default AuthModal;
