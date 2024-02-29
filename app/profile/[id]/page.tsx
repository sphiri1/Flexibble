'use client'
import React, { useEffect, useState } from 'react';
import { getUserDetails, getUserProjects } from '@/firebase/actions';
import { DocumentData } from 'firebase/firestore';
import { UserAuth } from '@/components/AuthContext';
import ProfilePage from '@/components/ProfilePage';
import { UserProfile } from '@/common.types';

type Props = {
  params: {
    id: string
  }
}

const UserProfile = ({ params }: Props) => {
  const [data, setData] = useState<DocumentData | null>(null);
  const [user, setUser] = useState<DocumentData | null>(null);
  const { currentUser, googleSignIn, logOut } = UserAuth();


  useEffect(() => {

    const fetchAllProjects = async () => {
      const result = await getUserProjects(params.id);
      const userRef = await getUserDetails(params.id);
      setData(result);
      if (userRef.exists()) {
        setUser(userRef.data());
            } else {
                console.log("Failed to fetch user info!");
            }
        }

    fetchAllProjects();
  }, [currentUser])


  if (data?.length === 0) {
    return (
      <p className="no-result-text text-center">Failed to fetch user info.</p>
    )
  }

  const result = user as UserProfile;

  return (
     <ProfilePage data={data} user={result}/>
  )
}

export default UserProfile