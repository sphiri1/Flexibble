"use client"

import { UserAuth } from './AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, Fragment } from 'react';
import { Menu, Transition } from "@headlessui/react";
import Button from './Button';

const AuthProviders = () => {

  const { user, googleSignIn, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const handleSignIn = async () => {
    try {
      await googleSignIn()
    } catch (error) {
      console.log(error);
    }
  }


  const handleSignOut = async () => {
    try {
      await logOut()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {

    //Rechecks user authentication on page reload
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user])

  return (
    <div className='flex gap-7 flexBetween'>
      {loading ? null : user ? (
        <>
          <div className="flexCenter z-10 flex-col relative">

            <Menu as="div">
              <Menu.Button className="flexCenter" onMouseEnter={() => setOpenModal(true)} >
                {user?.photoURL && (
                  <Image
                    src={user.photoURL}
                    width={40}
                    height={40}
                    className="rounded-full"
                    alt="user profile image"
                  />
                )}
              </Menu.Button>

              <Transition
                show={openModal}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className="flexStart profile_menu-items"
                  onMouseLeave={() => setOpenModal(false)}
                >
                  <div className="flex flex-col items-center gap-y-4">
                    {user?.photoURL && (
                      <Image
                        src={user?.photoURL}
                        className="rounded-full"
                        width={80}
                        height={80}
                        alt="profile Image"
                      />
                    )}
                    <p className="font-semibold">{user?.displayName}</p>
                  </div>

                  <div className="flex flex-col gap-3 pt-10 items-start w-full">
                    
                    <Menu.Item>
                      <Link href={`/profile/${user?.uid}`} className="text-sm">Work Preferences</Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link href={`/profile/${user?.uid}`} className="text-sm">Settings</Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link href={`/profile/${user?.uid}`} className="text-sm">Profile</Link>
                    </Menu.Item>
                  </div>
                  <div className="w-full flexStart border-t border-nav-border mt-5 pt-5">
                    <Menu.Item>
                      <button className='cursor-pointer' onClick={handleSignOut}>Sign out</button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          <div className='flex flex-1 gap-7'>
            <Link href='/create-project'>
              <p className='text-small rounded-xl border-outline px-4 py-3'>Share Work</p>
            </Link>
          </div>
        </>
      ) :
        <Button handleClick={handleSignIn} title='Sign In with Google' />
      }
    </div>
  )
}



export default AuthProviders