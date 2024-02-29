"use client"

import Modal from '@/components/Modal';
import ProjectForm from '@/components/ProjectForm';
import { redirect } from 'next/navigation';
import { UserAuth } from '@/components/AuthContext';
import { UserInfo } from 'firebase/auth';


const createProject = () => {

  const { user, googleSignIn, logOut } = UserAuth();
  const currentUser = user as UserInfo;
  if (!user) redirect('/')

  return (
    <Modal>
      <h3 className="modal-head-text">
        Create a New Project
      </h3>
      <ProjectForm type='create' user={currentUser} />
    </Modal>
  )
}

export default createProject