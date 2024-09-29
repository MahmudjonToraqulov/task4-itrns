// src/Login.js
import React, { useState } from 'react';
import { login } from '../auth'; // Import register function
import { useNavigate } from 'react-router-dom'; // Use useNavigate
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../../contexts/authContext/index'



const Login = () => {
  const { userLoggedIn } = useAuth()
  const navigate = useNavigate(); // Initialize useHistory
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        if(!isSigningIn) {
            setIsSigningIn(true)
            await login(email, password);
        }
      
      navigate('/home'); // Redirect to User Management
    } catch (error) {
      // Handle specific error messages
      if (error.message === 'User is blocked') {
        setErrorMessage("Sorry! You're blocked."); // Display blocked user message
      } else if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password') {
        setErrorMessage('Password or Email is incorrect.');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
      console.log(error.message);
      setIsSigningIn(false);
    }
    
  };

  return (<>

    <div>
    {/* {userLoggedIn && (<Navigate to={'/home'} replace={true} />)} */}

    <main className="w-full h-screen flex self-center place-content-center place-items-center">
        <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
            <div className="text-center">
                <div className="mt-2">
                    <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Sign In</h3>
                </div>
            </div>
            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                <div>
                    <label className="text-sm text-gray-600 font-bold">
                        Email
                    </label>
                    <input
                        type="email"
                        autoComplete='email'
                        required
                        value={email} onChange={(e) => { setEmail(e.target.value) }}
                        className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                    />
                </div>


                <div>
                    <label className="text-sm text-gray-600 font-bold">
                        Password
                    </label>
                    <input
                        type="password"
                        autoComplete='current-password'
                        required
                        value={password} onChange={(e) => { setPassword(e.target.value) }}
                        className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                    />
                </div>

                {errorMessage && (
                    <span className='text-red-600 font-bold'>{errorMessage}</span>
                )}

                <button
                    type="submit"
                    disabled={isSigningIn}
                    className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isSigningIn ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                >
                    {isSigningIn ? 'Signing In...' : 'Sign In'}
                </button>
            </form>
            <p className="text-center text-sm">Don't have an account? <Link to={'/register'} className="hover:underline font-bold">Sign up</Link></p>
            <div className='flex flex-row text-center w-full'>
                <div className='border-b-2 mb-2.5 mr-2 w-full'></div><div className='text-sm font-bold w-fit'>OR</div><div className='border-b-2 mb-2.5 ml-2 w-full'></div>
            </div>
        </div>
    </main>
    </div></>
  );
};

export default Login;
