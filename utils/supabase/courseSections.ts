"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { cache } from "react";

import { createClient as getClient } from "./server/server";

import { Course_Section } from "@/types/db";

export const getCourseSection = cache(async(courseSectionID: string): Promise<Course_Section> => {
    const { data, error } = await getClient().from("course_sections").select(`
        id,
        created_at,
        title,
        description,
        order,
        courses (
            id,
            title,
            abbreviation,
            description
        )
    `).eq("id", courseSectionID).single();
    if(error) { throw error; }
    return {
        id: data.id,
        created_at: data.created_at,
        title: data.title,
        description: data.description,
        order: data.order,
        course: data.courses as any
    }
})

export const getCourseSections = cache(async(courseId: string): Promise<Course_Section[]> => {
    const { data, error } = await getClient().from("course_sections").select(`
        id,
        created_at,
        title,
        description,
        order,
        courses (
            id,
            title,
            abbreviation,
            description
        )
    `).eq("course", courseId).order("order", { ascending: true });
    if(error) { throw error; }
    return data.map((db: any) => {
        return {
            id: db.id,
            created_at: db.created_at,
            title: db.title,
            description: db.description,
            order: db.order,
            course: db.courses
        }
    });
})


// no caching

export async function upsertCourseSection(courseSection: Course_Section): Promise<{ id: string }> {
    const { data, error } = await getClient().from("course_sections").upsert([{
        ...courseSection,
        course: courseSection?.course?.id
    }]).select().single();
    if(error) { throw error; }
    return { id: data.id };
}

export async function deleteCourseSection(courseSectionID: string): Promise<boolean> {
    const { error } = await getClient().from("course_sections").delete().eq("id", courseSectionID);
    if(error) { throw error; }
    return true;
}

