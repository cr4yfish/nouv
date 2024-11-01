"use client";

import { useState } from "react";
import { experimental_useObject as useObject } from "ai/react"
import { v4 as uuidv4 } from "uuid";

import { Input } from "@nextui-org/input";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Accordion, AccordionItem } from "@nextui-org/accordion";

import { Button } from "@/components/utils/Button";
import UppyFileUpload from "@/components/utils/UppyFileUpload";
import ScraperForm from "@/components/utils/ScraperForm";
import CourseAutocomplete from "@/components/course/CourseAutocomplete";
import Icon from "@/components/utils/Icon";


import { multipleLevelSchema } from "@/functions/ai/schemas";
import { deleteObject } from "@/utils/supabase/storage";
import { upsertCourseSection } from "@/utils/supabase/courseSections";
import { upsertCourseTopic } from "@/utils/supabase/topics";

import { SessionState } from "@/types/auth";
import { Course, Course_Section, Question, Topic } from "@/types/db";
import { upsertQuestion } from "@/utils/supabase/questions";
import CourseSectionAutocomplete from "@/components/courseSection/CourseSectionAutocomplete";
import { QuestionTypes } from "@/utils/constants/question_types";


export default function LevelNewAIMain({ sessionState } : { sessionState: SessionState }) {
    const [apiKey, setApiKey] = useState<string | null>(sessionState.settings.gemini_api_key ?? null);
    const [filename, setFilename] = useState<string | null>(null);
    const [course, setCourse] = useState<Course | null>(null);
    const [courseSection, setCourseSection] = useState<Course_Section | null>(null);
    const [numLevels, setNumLevels] = useState<number>(1);

    const [isAddingLoading, setIsAddingLoading] = useState<boolean>(false);
    const [isAdded, setIsAdded] = useState<boolean>(false);

    const { object, submit, isLoading } = useObject({
        api: "/api/ai/createLevels",
        schema: multipleLevelSchema,
        headers: {
            "X-api-key": apiKey ?? "",
            "X-doc-name": filename ?? "",
            "X-num-levels": numLevels?.toString() ?? "",
            "X-course-section-title": courseSection?.title ?? "",
            "X-course-section-description": courseSection?.description ?? "",
        },
        onFinish: async () => {
            await deleteObject({ filename: filename!, path: "", bucketName: "documents" });
        }
    })

    const handleAddContentToCourse = async () => {
        if(!object || !sessionState || !course) {
            console.error("Missing object, session or course");
            return;
        };
        
        setIsAddingLoading(true);

        object.forEach(async (section) => {

            const newCourseSection: Course_Section = {} as Course_Section;

            if(courseSection == null) {
                if(!section || !section.title || !section.description || !section.order ||
                    !section.levels || section.levels.length == 0
                ) return;

                newCourseSection.id = uuidv4();
                newCourseSection.course = course;
                newCourseSection.title = section.title;
                newCourseSection.description = section.description;
                newCourseSection.order = section.order;

                await upsertCourseSection(newCourseSection);
            }

            // toggle for first uploaded section for safety
            if(!isAdded) setIsAdded(true);

            section?.levels?.forEach(async (level) => {
                if(!level || !level.title || !level.description || !level.questions || level.questions.length == 0) return;
                
                const newLevel: Topic = {
                    id: uuidv4(),
                    title: level.title,
                    description: level.description,
                    course: course,
                    course_section: courseSection ? courseSection : newCourseSection
                }

                const res = await upsertCourseTopic(newLevel);

                if(res) {
                    level.questions.forEach(async (question) => {
                        if(!question || !question.title || !question.question) return;

                        const newQuestion: Question = {
                            id: uuidv4(),
                            title: question.title,
                            question: question.question,
                            topic: {
                                ...newLevel,
                                id: res.id
                            },
                            answer_options: question.question_type == "multiple_choice" ? question.multiple_choice?.answer_options as string[] : ["true", "false"],
                            answers_correct: question.question_type == "multiple_choice" ? question.multiple_choice?.answers_correct as string[] : question.true_false?.answer_correct ? ["true"] : ["false"],
                            type: question.question_type == "multiple_choice" ? QuestionTypes.multiple_choice : QuestionTypes.boolean
                        }

                        await upsertQuestion(newQuestion);
                    })
                }
            })
        })

        setIsAddingLoading(false);
        setIsAdded(true);
    }




    return (
        <>
        <div className="z-50 flex items-center justify-center ">
            <Card shadow="lg" className="relative flex w-full flex-col items-center gap-4 h-full">
                <CardHeader className="flex flex-col justify-start items-start pb-0">
                    <h1 className=" font-bold text-2xl">Generate new levels with AI</h1>
                    <p>Use AI to create multiple new levels from a PDF</p>
                </CardHeader>
                <CardBody className="flex flex-col gap-2 pt-0 pb-0">
                    {false && <Input 
                        label="Your Gemini API Key" 
                        value={apiKey ?? ""} 
                        type="password"
                        onValueChange={(value) => setApiKey(value)} 
                    />}
                    <CourseAutocomplete setCourse={(course) => setCourse(course)} />
                    <CourseSectionAutocomplete 
                        setCourseSection={(courseSection) => setCourseSection(courseSection)} 
                        course={course}
                    />
                    <Input 
                        label="Number of Levels" 
                        type="number" 
                        isRequired
                        className=" max-w-[200px]" 
                        value={numLevels.toString()} 
                        onValueChange={(value) => setNumLevels(parseInt(value))} 
                    />
                    <div className="flex flex-wrap gap-2 items-center">
                        <UppyFileUpload 
                            session={sessionState} 
                            label="Upload source from PDF" 
                            setFileNameCalback={(filename) => setFilename(filename)} 
                        />
                        <ScraperForm 
                            setFilenameCallback={(filename) => setFilename(filename)} 
                        />
                    </div>

                </CardBody>
                <CardFooter className="flex flex-row items-center gap-4">
                    <Button 
                        isDisabled={!sessionState || !filename || isAddingLoading || !course} 
                        isLoading={isLoading} 
                        onClick={() => {submit(""); setIsAdded(false)}} 
                        color="primary"
                        variant={"shadow"} 
                        startContent={<Icon filled>auto_awesome</Icon>}
                    >
                        {object ? "Generate again" : "Generate Levels"}
                    </Button>
                    {object && 
                        <Button 
                            color="primary" 
                            variant="shadow" 
                            isLoading={isAddingLoading} 
                            isDisabled={!sessionState || !filename || isLoading}
                            onClick={handleAddContentToCourse}
                        >
                            {isAdded ? "Saved Levels" : "Add new Levels"}
                        </Button>
                        }
                </CardFooter>
            </Card>               
        </div>


        <div className="flex flex-col gap-4  h-full overflow-y-auto">
            {object?.map((section, sectionIndex) => (
                <div key={sectionIndex} className="flex flex-col gap-2 px-2 py-2 rounded">
                    <span className=" font-bold text-lg">{section?.title}</span>
                    <span className="">{section?.description}</span>
                    
                    <div className="flex flex-col gap-1">
                        {section?.levels?.map((level, i) => (
                        <div className=" p-2 rounded" key={i}>
                            {level?.questions && level.questions.length > 0 &&
                                <Accordion>
                                    {level.questions.map((q, i) => (
                                        <AccordionItem 
                                            aria-label="Questions" 
                                            key={i}
                                            title={q?.title} subtitle={q?.question}
                                        >

                                            {q?.question_type == "multiple_choice" &&
                                                <div className="flex flex-col">
                                                    {q?.multiple_choice?.answer_options?.map((a, j) => (
                                                        <span key={j} className={`text-tiny ${q?.multiple_choice?.answers_correct?.includes(a) && "text-green-400"}`}>{a}</span>
                                                    ))}
                                                </div>
                                            }

                                            {q?.question_type == "true_false" &&
                                                <span className={`text-tiny ${q?.true_false?.answer_correct ? "text-green-400" : "text-red-400"}`}>{q?.true_false?.answer_correct ? "true" : "false"}</span>
                                            }

                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            }
                        </div>
                        ))}
                    </div>
                </div>
            ))}

            
        </div>

        </>
    )
}