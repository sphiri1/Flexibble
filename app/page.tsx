"use client"

import { PageInfo, ProjectInterface } from "@/common.types";
import Categories from "@/components/Categories";
import LoadMore from "@/components/LoadMore";
import ProjectCard from "@/components/ProjectCard";
import { fetchMore, fetchPrev, getAllProjects, getPageInfo } from "@/firebase/actions";
import { DocumentData } from "firebase/firestore";
import { useCallback, useEffect, useState } from 'react';


type SearchParams = {
  category?: string
}


type Props = {
  searchParams: SearchParams
}


export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;


const Home = ({ searchParams: { category } }: Props) => {
  const [data, setData] = useState<DocumentData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInfo, setPageInfo] = useState<PageInfo>();


  //Pagination functionality
  const handlePageChange = useCallback(async (value: string) => {
    if (value === "Next") {
      setCurrentPage((page) => page + 1);

      if (pageInfo) {
        const result = await fetchMore(pageInfo, currentPage, category);
        const info = await getPageInfo(result, category);
        setPageInfo(info);
        setData(result.docs.map(doc => doc.data()));
      }
    }

    else if (value === "Prev") {
      setCurrentPage((page) => page - 1);

      const result = await fetchPrev(pageInfo, currentPage, category);
      const info = await getPageInfo(result, category);
      setPageInfo(info);
      setData(result.docs.map(doc => doc.data()));
    }
  }, [pageInfo, currentPage]);



  useEffect(() => {

    const fetchAllProjects = async () => {
      const result = (await getAllProjects(category));
      if (result) {
        setData(result.docs.map(doc => doc.data()));
        const info = await getPageInfo(result, category);
        setPageInfo(info);
      }

    }
    fetchAllProjects();
  }, [category])



  if (data?.length === 0) {
    return (
      <section className="flexStart flex-col paddings">
        <Categories />
        <p className="no-result-text text-center">No projects found, go create some first.</p>
      </section>
    )
  }
  else {
    return (
      <section className="flex-start flex-col paddings mb-16">
        <Categories />

        <section className="projects-grid">
          {data?.map((project: ProjectInterface) => (
            <ProjectCard
              key={project?.id}
              id={project?.id}
              image={project?.image}
              title={project?.title}
              name={project?.createdby?.name}
              avatarUrl={project?.createdby?.avatarUrl}
              userId={project?.createdby?.id}
            />
          ))}
        </section>

        <LoadMore currentPage={currentPage} noOfPages={pageInfo?.total} handlePageChange={handlePageChange} />
      </section>
    )
  }
}




export default Home; 