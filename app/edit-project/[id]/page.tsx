"use client"

import Modal from '@/components/Modal';
import ProjectForm from '@/components/ProjectForm';
import { redirect } from 'next/navigation';
import { UserAuth } from '@/components/AuthContext';
import { UserInfo } from 'firebase/auth';
import { getProjectDetails } from '@/firebase/actions';
import { DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ProjectInterface } from '@/common.types';


const EditProject = ({ params: { id } }: { params: { id: string} }) => {
  const [data, setData] = useState<DocumentData | null>(null);
  const { user, googleSignIn, logOut } = UserAuth();
  const currentUser = user as UserInfo;
  if (!user) redirect('/');

  useEffect(() => {

    const result = async () => {
    const getData = await getProjectDetails(id);
    if (getData.exists()) {
            setData(getData.data());
                } else {
                    console.log("Failed to fetch project info!");
                }
    }
    result();

}, [user])

const result = data as ProjectInterface;

  return (
    <Modal>
      <h3 className="modal-head-text">
        Edit Project
      </h3>
      <ProjectForm type='edit' user={currentUser} project={result} />
    </Modal>
  )
}

export default EditProject