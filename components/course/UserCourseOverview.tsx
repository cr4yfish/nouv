"use client";


import { ScrollShadow } from "@nextui-org/scroll-shadow";

import CourseCard from "./CourseCard";
import { SessionState } from "@/types/auth";

import { useUserCourses } from "@/context/SharedUserCourses";
import { useEffect } from "react";

export default function UserCourseOverview({ sessionState } : { sessionState: SessionState }) {

    const { userCourses, setUserCourses } = useUserCourses();

    useEffect(() => {
        setUserCourses(sessionState.courses);
    }, [sessionState, setUserCourses])
    
    return (
        <>
        <h2 className=" font-bold">Your courses</h2>
        <ScrollShadow className="flex flex-col gap-2 overflow-y-auto overflow-visible pb-40">
            {userCourses?.map((userCourse) => (
                <CourseCard 
                    key={userCourse.course.id} 
                    course={userCourse.course} 
                    userID={sessionState?.user?.id}
                />
            ))}
        </ScrollShadow>
        </>
    )
}