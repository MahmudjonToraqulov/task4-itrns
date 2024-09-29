
import React, { useEffect, useRef, useState } from 'react';
import { db, auth } from '../../firebase/firebase';
import { collection, query, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { faLock, faUnlock, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { deleteUser as firebaseDeleteUser } from 'firebase/auth';
import { useAuth } from '../../contexts/authContext';






const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const selectAllRef = useRef(null); 
  const [currentUserId, setCurrentUserId] = useState(null); // State for current user ID
  
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid); // Set current user ID
      } else {
        setCurrentUserId(null); // User is signed out
      }
    });

    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    });

    return () => {
      unsubscribe();
      unsubscribeAuth(); // Clean up auth listener
    };
  }, []);



  // useEffect(() => {
  //   const q = query(collection(db, "users"));
  //   const unsubscribe = onSnapshot(q, (snapshot) => {
  //     const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //     setUsers(usersData);
  //   });
  //   return () => unsubscribe();
  // }, []);

  const toggleUserSelection = (id) => {
    const newSelectedUsers = new Set(selectedUsers);
    if (newSelectedUsers.has(id)) {
      newSelectedUsers.delete(id);
    } else {
      newSelectedUsers.add(id);
    }
    setSelectedUsers(newSelectedUsers);
  };


  const blockUser = async (userId) => {
    await updateDoc(doc(db, "users", userId), { status: 'blocked' });
    if (userId === currentUserId) {
        await signOut(auth); // Log out the current user
        navigate('/login'); // Redirect to login
    }
  };

  const unblockUser = async (userId) => {
    await updateDoc(doc(db, "users", userId), { status: 'active' });
  };

  const deleteUser = async (userId) => {
    const currentUser = auth.currentUser; // Get the current user
  
    if (!currentUser) {
      throw new Error('No user is currently logged in.');
    }
  
    try {
      // Delete user document from Firestore
      await deleteDoc(doc(db, "users", userId));
  
      // If the user to be deleted is the current user
      if (userId === currentUser.uid) {
        // Delete user from Firebase Authentication
        await firebaseDeleteUser(currentUser);
        
        // Log out the user
        await signOut(auth);
        
        // Redirect to login page
        navigate('/login'); 
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error('Failed to delete user account. ' + error.message);
    }
  };
  

  

  const toggleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set()); // Deselect all
    } else {
      const allUserIds = new Set(users.map(user => user.id));
      setSelectedUsers(allUserIds); // Select all
    }
    console.log(selectedUsers);
  };

  useEffect(() => {
    if (selectAllRef.current) {
      // Update the indeterminate property based on selectedUsers state
      selectAllRef.current.indeterminate = selectedUsers.size > 0 && selectedUsers.size < users.length;
    }
  }, [selectedUsers, users.length]); 

  users.sort((a, b) => {
    return b.lastLoginTime.toMillis() - a.lastLoginTime.toMillis();
  })
 

  return (
    <div className='container mt-20 mx-auto'>
      <h2 className='my-2 text-3xl text-green-700'>User Management</h2>
      <table className="table w-full border-collapse border border-2 border-slate-500 border-spacing-2  hover:border-spacing-2mt-6 mb-2">
        <thead>
          <tr>
            <th className="border border-slate-600 border-2 p-5 	">
                <input 
                    className='scale-150' 
                    type="checkbox" 
                    onChange={toggleSelectAll}
                    checked={selectedUsers.size === users.length}
                    ref={selectAllRef}
                />
            </th>
            <th className="border border-slate-600 border-2 px-2 text-lg" >Name</th>
            <th className="border border-slate-600 border-2 text-lg">Email</th>
            <th className="border border-slate-600 border-2 text-lg">Last Login</th>
            <th className="border border-slate-600 border-2 text-lg">Registration Time</th>
            <th className="border border-slate-600 border-2 text-lg">Status</th>
            <th className="border border-slate-600 border-2 text-lg">Actions</th>
          </tr>
        </thead>
        <tbody>
           {users.map(user => (
            <tr key={user.id}>
              <td className='text-center border border-slate-600 p-5 border-2 '><input className='scale-150' type="checkbox"  onChange={() => toggleUserSelection(user.id)} checked={selectedUsers.has(user.id)} /></td>
              <td className='text-center border border-slate-600 p-2 border-2'>{user.name}</td>
              <td className='text-center border border-slate-600 p-2 border-2'>{user.email}</td>
              <td className='text-center border border-slate-600 p-2 border-2'>{ user.lastLoginTime?.toDate().toString() }</td> 
              <td className='text-center border border-slate-600 p-2 border-2'>{ user.registrationTime?.toDate().toString() }</td>
              <td className={user.status === 'active' ? 'text-center border border-slate-700 p-2 border-2 text-lg font-semibold text-green-700' : 'text-center border border-slate-700 p-2 border-2 text-lg font-semibold text-red-700	'} >{user.status}</td>
              <td className='text-center border border-slate-600 p-2  flex'>
                <button className={user.status === 'active' ? "mx-1 my-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" : "mx-1 my-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"} onClick={() => user.status === 'active' ? blockUser(user.id) : unblockUser(user.id)}>{user.status === 'active' ? (
                    'Block'
                  ) : (
                    <FontAwesomeIcon icon={faUnlock} title="Unblock" />
                  )}</button>
                <button className="mx-1 my-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex items-center justify-between '>
        <div>
          <button className="mx-1 my-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => selectedUsers.forEach(blockUser)}>Block Selected</button>
          <button className="mx-1 my-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => selectedUsers.forEach(unblockUser)}><FontAwesomeIcon icon={faUnlock} title="Unblock" /></button>
          <button className="mx-1 my-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => selectedUsers.forEach(deleteUser)}>Delete Selected</button>
        </div>
        <h2 className='text-white text-lg p-2 bg-indigo-500'> Current User - { currentUser.email } </h2>
      </div>
    </div>
  );
};

export default Home;

