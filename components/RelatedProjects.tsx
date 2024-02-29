import { DocumentData } from 'firebase/firestore';
import { useState, useEffect } from 'react'
import { getUserProjects } from '@/firebase/actions';
import Link from 'next/link';
import Image from 'next/image';
import { ProjectInterface } from '@/common.types';

type Props = {
    userId: string,
    projectId: string,
    name: string
}

const RelatedProjects = ({ userId, projectId, name }: Props) => {
    const [data, setData] = useState<DocumentData | null>(null);

    useEffect(() => {

        const fetchUserProjects = async () => {
            if (userId) {
                const result = await getUserProjects(userId);
                setData(result);
            }
        }
        fetchUserProjects();
    }, [])


    if (data?.length === 0) return null

    return (

        <section className='flex flex-col mt-32 w-full'>
            <div className='flexBetween'>
                <p className='text-base font-bold'>More by {name}
                </p>
                <Link
                    href={`/profile/${userId}`}
                    className='text-primary-purple text-base'>
                    View All
                </Link>
            </div>

            <div className='related_projects-grid'>

                {data?.map((project: ProjectInterface) => (
                    <div key={project?.id} className='flexCenter related_project-card drop-shadow-card'>
                        <Link href={`/project/${project?.id}`}
                            className='flexCenter group relative w-full h-full'>

                            <Image
                                src={project?.image}
                                width={414}
                                height={314}
                                className='w-full h-full object-cover rounded-2xl'
                                alt='project image' />

                            <div className='hidden group-hover:flex related_project-card_title'>
                                <p className='w-full'>
                                    {project?.title}
                                </p>
                            </div>
                            
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default RelatedProjects