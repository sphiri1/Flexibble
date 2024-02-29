import Image from 'next/image';
import React, { ChangeEvent, useState, useEffect } from 'react'
import FormField from './FormField';
import { categoryFilters } from '@/constants';
import CustomMenu from './CustomMenu';
import Button from './Button';
import { createNewProject, editProject } from '@/firebase/actions';
import { useRouter } from 'next/navigation';
import { UserInfo } from 'firebase/auth';
import { FormState, ProjectInterface } from '@/common.types';


type Props = {
    type: string,
    user: UserInfo,
    project?: ProjectInterface
}

const ProjectForm = ({ type, user, project }: Props) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [file, setFile] = useState('');
    const [form, setForm] = useState<FormState>({
        title: "",
        description: "",
        image: "",
        liveSiteUrl: "",
        githubUrl: "",
        category: ""
    })

    useEffect(() => {

        const result = () => {
            setForm({
                title: project?.title || "",
                description: project?.description || "",
                image: project?.image || "",
                liveSiteUrl: project?.liveSiteUrl || "",
                githubUrl: project?.githubUrl || "",
                category: project?.category || ""
            })
        }
        result();

    }, [project])



    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);

        try {
            if (type === 'create' && user) {
                createNewProject(form, user, file)
                router.push("/")
            }
            if (type === 'edit' && user && project) {
                editProject(form, user, file, project?.id)
                router.push("/")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {

        //action to prevent default behaviour of browser to reload page
        e.preventDefault();

        const file = e.target.files?.[0];


        if (!file) return

        if (!file.type.includes('image')) {
            return alert('Please upload an image file');
        }


        const reader = new FileReader();
        reader.readAsDataURL(file);
        setFile(file.name);

        reader.onload = () => {
            const result = reader.result as string;
            handleStateChanged('image', result);
        }
    };


    const handleStateChanged = (fieldName: string, value: string) => {
        setForm((prevState) => ({
            ...prevState, [fieldName]: value
        }))

    }


    return (
        <form
            onSubmit={handleFormSubmit}
            className='flexStart form'>

            <div className='flexStart form_image-container'>

                <label htmlFor='poster' className='flexCenter form_image-label'>
                    {!form.image && 'Choose a thumbnail for your project'}
                </label>

                {/* Input image thumbnail */}
                <input
                    id='image'
                    type='file'
                    accept='image/'
                    required={type == 'create'}
                    className='form_image-input'
                    onChange={handleChangeImage}
                />

                {/* Display already added image */}
                {form.image && (
                    <Image
                        src={form?.image}
                        className='sm:p-10 object-contain z-20'
                        alt='Project poster'
                        fill
                    />
                )}
            </div>

            {/* Project details form */}
            <FormField
                title='Title'
                state={form.title}
                placeholder="Flexibble"
                setState={(value) => handleStateChanged('title', value)}
            />

            <FormField
                title='Description'
                state={form.description}
                placeholder="Showcase and discover remarkable developer projects"
                setState={(value) => handleStateChanged('description', value)}
            />

            <FormField
                type='url'
                title='Website URL'
                state={form.liveSiteUrl}
                placeholder="https://example.com"
                setState={(value) => handleStateChanged('liveSiteUrl', value)}
            />

            <FormField
                type='url'
                title='GitHub URL'
                state={form.githubUrl}
                placeholder="https://example.com"
                setState={(value) => handleStateChanged('githubUrl', value)}
            />

            <CustomMenu
                title='Category'
                state={form.category}
                filters={categoryFilters}
                setState={(value) => handleStateChanged('category', value)}
            />

            <div className='flexStart w-full'>
                <Button
                    title={
                        isSubmitting ?
                            `${type === 'create' ?
                                'Creating' : 'Editing'}` :
                            `${type === 'create' ?
                                'Create' : 'Edit'}`}
                    type='submit'
                    leftIcon={isSubmitting ? '' : '/plus.svg'}
                    isSubmitting={isSubmitting} />
            </div>
        </form>
    )
}

export default ProjectForm