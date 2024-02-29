
import { doc, setDoc, collection, getDoc, updateDoc, addDoc, query, getDocs, where, deleteDoc, limit, DocumentData, orderBy, startAfter, endAt, endBefore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { db } from '../firebase';
import { PageInfo, ProjectForm } from "@/common.types";
import { UserInfo } from "firebase/auth";


export const createUser = async (user: any) => {

    //Verify if user already exists in firestore
    if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);

        // If doc returns null
        if (!docSnap.data()) {
            await setDoc(doc(db, "Users", user.uid), {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                description: "",
                avatarUrl: user.photoURL,
                githubUrl: "",
                linkedinUrl: "",
            }).then(() => {
                console.log('user added to database');
            })
                .catch(err => {
                    console.log(err);
                });
        }
        else {
            console.log("welcome");
        }
    }
};



export const createNewProject = async (form: ProjectForm, user: UserInfo, name: string) => {
    const action = 'create';

    //Upload image to storage then trigger action within
    UploadImage(form, name, user, action, form.title);
}



export const editProject = async (form: ProjectForm, user: UserInfo, name: string, id: string) => {

    //Check if image already exists in database then trigger action within
     checkIfFileExists(form, user, name, id);
}



export const addProjects = async (form: ProjectForm, user: UserInfo, downloadURL: string) => {

    const ref = collection(db, 'Projects');

    // Add Projects doc
    await addDoc(ref, {
        title: form.title,
        image: downloadURL,
        description: form.description,
        category: form.category,
        githubUrl: form.githubUrl,
        liveSiteUrl: form.liveSiteUrl,
        createdby: {
            id: user.uid,
            name: user.displayName,
            email: user.email,
            avatarUrl: user.photoURL,
        }
    }).then((docu) => {
        console.log('Project added to database');

        //Update project and add Id
        const ref = doc(db, `Projects/${docu.id}`);
        updateDoc(ref, {
            ...doc,
            id: docu.id
        });

        // Update User doc after project addition
        AddtoUserDoc(user.uid, docu.id, form, downloadURL);

    }).catch(error => {
        console.log(error);
    })
}



export const AddtoUserDoc = async (uid: string, id: string, form: ProjectForm, downloadURL: string) => {
    const ref = doc(db, `Users/${uid}/Projects/${id}`);

    await setDoc(ref, {
        id: ref.id,
        title: form.title,
        image: downloadURL,
        description: form.description,
        category: form.category,
        githubUrl: form.githubUrl,
        liveSiteUrl: form.liveSiteUrl,
    }).then(() => {
        console.log('Project added to Users database');
    })
        .catch(err => {
            console.log(err);
        });
}



export const UpdateProjectDoc = async (form: ProjectForm, user: UserInfo, downloadURL: string, id: string) => {

    //Get doc references
    const ref = doc(db, `Projects/${id}`);
    const ref2 = doc(db, `Users/${user.uid}/Projects/${id}`);

    // Update Projects doc first
    await updateDoc(ref, {
        id: id,
        title: form.title,
        image: downloadURL,
        description: form.description,
        category: form.category,
        githubUrl: form.githubUrl,
        liveSiteUrl: form.liveSiteUrl,
        createdby: {
            id: user.uid,
            name: user.displayName,
            email: user.email,
            avatarUrl: user.photoURL,
        }
    }).then(async () => {
        console.log('Project update to database');

        //Update Users project
        await updateDoc(ref2, {
            id: id,
            title: form.title,
            image: downloadURL,
            description: form.description,
            category: form.category,
            githubUrl: form.githubUrl,
            liveSiteUrl: form.liveSiteUrl,
        })

    }).catch(error => {
        console.log(error);
    })
}



export const UploadImage = async (form: ProjectForm, name: string, user: UserInfo, action: string, id: string) => {

    const storage = getStorage();
    const storageRef = ref(storage, 'images/' + name);
    const data = await fetch(form.image);

    //Convert image to blob type
    const blob = await data.blob();
    const fileType = blob.type;

    //upload to storage
    const file = new File([blob], name, { type: fileType });
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
        (snapshot) => {

            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {

            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;
                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        },
        () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

                if (action == 'create') {
                    addProjects(form, user, downloadURL);
                }
                else {
                    UpdateProjectDoc(form, user, downloadURL, id)
                }

            });
        }
    );
}



export const checkIfFileExists = (form: ProjectForm, user: UserInfo, name: string, id: string) => {
    const storage = getStorage();
    const storageRef = ref(storage, form.image);

    getDownloadURL(storageRef)
        .then(url => {
            UpdateProjectDoc(form, user, form.image, id)
        })
        .catch(error => {
            if (error.code === 'storage/object-not-found') {
                console.log('not found')
                UploadImage(form, name, user, 'edit', id);
            } else {
                console.log('error' + ' => ' + error);
            }
        });
}



export const getAllProjects = async (category?: string) => {
    let querySnapshot = null;

    if (category) {
        const q = query(collection(db, 'Projects'),
            where("category", "==", category),
            orderBy('title', 'asc'),
            limit(20));
        querySnapshot = await getDocs(q);
    }

    else {
        const q = query(collection(db, 'Projects'),
            orderBy('title', 'asc'),
            limit(20));
        querySnapshot = await getDocs(q);
    }

    return querySnapshot;
}


//Gets the full size of the query
export const totalPages = async (category?: string) => {
    let docSnap = 0;

    if (category) {
        const q = query(collection(db, 'Projects'), where("category", "==", category));
        const querySnapshot = await getDocs(q);
        docSnap = querySnapshot.size;
    }
    else {
        const querySnapshot = await getDocs(collection(db, 'Projects'));
        docSnap = querySnapshot.size;
    }

    return docSnap;
}


export const getPageInfo = async (data: DocumentData | null, category?: string) => {
    const ref = totalPages(category);
    //Divides full size of query by 20
    const totalPage = Math.ceil(await ref / 20);

    const pageInfo = {
        count: data?.size,
        lastVisible: data?.docs[data?.docs.length - 1],
        firstVisible: data?.docs[0],
        total: totalPage
    } as PageInfo;

    return pageInfo;
}



export const fetchMore = async (pageInfo: PageInfo | undefined, currentPage: number, category?: string | undefined) => {
    const q = collection(db, "Projects");
    let nextProjectsQuery = null;

    if (category && pageInfo) {
        nextProjectsQuery = query(q, where("category", "==", category),
            orderBy("title", 'asc'),
            startAfter(pageInfo.firstVisible),
            limit(20)
        );
    }

    else {
        nextProjectsQuery = query(q,
            orderBy("title", 'asc'),
            startAfter(pageInfo?.lastVisible),
            limit(20)
        );
    }

    const nextProjectsSnaphot = await getDocs(nextProjectsQuery);

    return nextProjectsSnaphot;
};



export const fetchPrev = async (pageInfo: PageInfo | undefined, currentPage: number, category?: string | undefined) => {
    const q = collection(db, "Projects");
    const end = pageInfo?.total !== currentPage ? endAt(pageInfo?.firstVisible) : endBefore(pageInfo.firstVisible);
    let prevProjectsQuery = null;

    if (category) {
        prevProjectsQuery = query(q, where("category", "==", category),
            orderBy("title", 'asc'),
            end,
            limit(20)
        );
    }

    else {
        prevProjectsQuery = query(q,
            orderBy("title", 'asc'),
            end,
            limit(20)
        );
    }

    const prevProjectsSnaphot = await getDocs(prevProjectsQuery);

    return prevProjectsSnaphot;
};



export const getUserProjects = async (uid: string) => {
    const docRef = collection(db, 'Users', uid, 'Projects');
    const querySnapshot = await getDocs(docRef);
    const docSnap = querySnapshot.docs.map(doc => doc.data());

    return docSnap;
}



export const getUserDetails = async (uid: string) => {
    const docRef = doc(db, 'Users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap;
}



export const getProjectDetails = async (id: string) => {
    const docRef = doc(db, "Projects", id);
    const docSnap = await getDoc(docRef);
    return docSnap;
}



export const deleteProject = async (id: string, uid: string) => {
    const docRef = doc(db, "Projects", id);
    const docRef2 = doc(db, "Users", uid, "Projects", id)
    if (docRef && docRef2) {
        await deleteDoc(docRef);
        await deleteDoc(docRef2);
    }
}


