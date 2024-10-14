
import React from "react";
import {Autocomplete, AutocompleteItem} from "@nextui-org/autocomplete";
import {useInfiniteScroll} from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";

import { Course } from "@/types/db";

import { useCoursesList } from "@/hooks/useCoursesList";
import { getCourses, searchCourses } from "@/functions/client/supabase";

export default function CourseSelect({ setCourse } : { setCourse: (course: Course) => void }) {

    const list = useAsyncList<Course>({
        async load({signal, filterText}) {
            const res = await searchCourses(filterText || "");

            return {
                items: res,
            }
        }
    })

    return (
        <Autocomplete
            className="max-w-xs dark"
            variant="bordered"
            label="Pick a Course"
            placeholder="Select a Course"

            required
            isRequired
            isLoading={list.isLoading}
            items={list.items}
            inputValue={list.filterText}
            onInputChange={list.setFilterText}
            onSelectionChange={(key: React.Key | null) => {
                if(!key) return;
                setCourse(list.items.find((item) => item.id === key) as Course);
            }}
            
        >
            {(item) => (
                <AutocompleteItem key={item.id} className="capitalize dark">
                    {item.abbreviation}
                </AutocompleteItem>
            )}
        </Autocomplete>
    );
}