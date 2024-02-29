'use client'

import { UserAuth } from '@/components/AuthContext';
import { UserInfo } from 'firebase/auth';
import { DocumentData } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Modal from "@/components/Modal";
import Link from 'next/link';
import Image from 'next/image';
import { getProjectDetails } from '@/firebase/actions';
import RelatedProjects from '@/components/RelatedProjects';
import ProjectActions from '@/components/ProjectActions';
import { ProjectInterface } from '@/common.types';

const Project = ({ params: { id } }: { params: { id: string} }) => {
    const [data, setData] = useState<DocumentData | null>(null);
    const { user, googleSignIn, logOut } = UserAuth();
    const currentUser = user as UserInfo;
   

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


    if (data == null) {
        return (
            <p className="no-result-text">Failed to fetch project info</p>
        )
    }


    const renderLink = () => `/profile/${currentUser?.uid}`
    const result = data as ProjectInterface;

    return (
        <Modal>

            <section className="flexBetween gap-y-8 max-w-4xl max-xs:flex-col w-full">
                <div className="flex-1 flex items-start gap-5 w-full max-xs:flex-col">

                    <Link href={renderLink()}>
                        <Image
                            src={result.createdby.avatarUrl}
                            width={50}
                            height={50}
                            alt="profile"
                            className="rounded-full"
                        />
                    </Link>

                    <div className="flex-1 flexStart flex-col gap-1">
                        <p className="self-start text-lg font-semibold">
                            {result.title}
                        </p>
                        <div className="user-info">
                            <Link href={renderLink()}>
                                {result.createdby.name}
                            </Link>
                            <Image src="/dot.svg" width={4} height={4} alt="dot" />
                            <Link href={`/?category=${result.category}`} className="text-primary-purple font-semibold">
                                {result.category}
                            </Link>
                        </div>
                    </div>
                </div>

                {currentUser?.email === result.createdby.email && (
            <div className="flex justify-end items-center gap-2">
                <ProjectActions projectId={result?.id} uid={currentUser.uid} />
            </div>
        )}
            </section>

            <section className="mt-14">
                <Image
                    src={result.image}
                    className="object-cover rounded-2xl"
                    width={1064}
                    height={798}
                    alt="poster"
                />
            </section>

            <section className="flexCenter flex-col mt-20">
                <p className="max-w-5xl text-xl font-normal">
                    {result.description}
                </p>

                <div className="flex flex-wrap mt-5 gap-5">
                    <Link href={result.githubUrl} target="_blank" rel="noreferrer" className="flexCenter gap-2 tex-sm font-medium text-primary-purple">
                        🖥 <span className="underline">Github</span>
                    </Link>
                    <Image src="/dot.svg" width={4} height={4} alt="dot" />
                    <Link href={result.liveSiteUrl} target="_blank" rel="noreferrer" className="flexCenter gap-2 tex-sm font-medium text-primary-purple">
                        🚀 <span className="underline">Live Site</span>
                    </Link>
                </div>
            </section>

            <section className="flexCenter w-full gap-8 mt-28">
                <span className="w-full h-0.5 bg-light-white-200" />
                <Link href={renderLink()} className="min-w-[82px] h-[82px]">
                    <Image
                        src={result.createdby.avatarUrl}
                        className="rounded-full"
                        width={82}
                        height={82}
                        alt="profile image"
                    />
                </Link>
                <span className="w-full h-0.5 bg-light-white-200" />
            </section>

            <RelatedProjects userId={result.createdby.id} projectId={result.id} name={result.createdby.name}/>
        </Modal>

    )
}

export default Project