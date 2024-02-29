'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { deleteProject } from '@/firebase/actions';

type Prop = {
    projectId: string,
    uid: string
}


const ProjectActions = ({ projectId, uid }: Prop) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    
    const handleDeleteProject = async () => {
        setIsDeleting(true);

        try {
            await deleteProject(projectId, uid);
            router.push('/');
        } catch (error) {
            console.log(error)
        } finally {
            setIsDeleting(false);
        }
    }


    return (
        <>
            <Link href={`/edit-project/${projectId}`} className='flexCenter edit-action_btn'>
                <Image src='/pencile.svg'
                    width={15}
                    height={15}
                    alt='edit'
                />
            </Link>

            <button className={`flexCenter delete-action_btn ${isDeleting ? 'bg-gray' : 'bg-primary-purple'}`
            } onClick={handleDeleteProject}
                type='button'>
                <Image src='/trash.svg'
                    width={15}
                    height={15}
                    alt='delete'
                />
            </button>
        </>
    )
}

export default ProjectActions