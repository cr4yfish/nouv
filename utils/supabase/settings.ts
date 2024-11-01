"use server";

import { cache } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient as getClient } from "./server/server";

import { Course, Settings } from "@/types/db";

export const getSettings = cache(async(userID: string): Promise<Settings> => {
    const { data, error } = await getClient().from("settings").select(`
        *,
        courses (*)
    `).eq("user", userID);
    if(error) { throw error; }

    // oh god
    const tmp = data[0] as any;

    return {
        ...tmp,
        current_course: tmp?.courses as Course
    };
})

export async function upsertSettings(settings: Settings): Promise<{ id: string }> {
    if(!settings.user?.id) {
        throw new Error("No user ID provided");
    }
    delete (settings as any).courses;
    const { data, error } = await getClient().from("settings").upsert([{
        ...settings,
        current_course: settings.current_course?.id,
        user: settings.user.id
    }]).select().single();
    if(error) { throw error; }
    return { id: data.id };
}

