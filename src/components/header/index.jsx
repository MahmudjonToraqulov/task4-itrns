import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    console.log('1 -> ', userLoggedIn);
    return (
        <nav className='flex flex-row gap-x-2 w-full z-20 fixed top-0 left-0 h-12 border-b place-content-end py-8 px-20 items-center bg-black mb-1'>
            {
                userLoggedIn
                    ?
                    <>
                        <button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} className='bg-red-600 hover:bg-red-700 hover:shadow-xl transition duration-300 px-4 py-2 text-white font-medium rounded-lg text-white'>Logout</button>
                    </>
                    :
                    <>
                        <Link className='bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300 px-4 py-2 text-white font-medium rounded-lg text-white' to={'/login'}>Login</Link>
                        <Link className='bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300 px-4 py-2 text-white font-medium rounded-lg text-white'to={'/register'} >Create a New Account</Link>
                    </>
            }

        </nav>
    )
}

export default Header