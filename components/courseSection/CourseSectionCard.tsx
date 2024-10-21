"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardFooter, CardBody } from "@nextui-org/card";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Input } from "@nextui-org/input";

import Icon from "../utils/Icon";
import { Course_Section, Topic } from "@/types/db";
import { ReactSortable } from "react-sortablejs";
import { upsertCourseSection, deleteCourseSection } from "@/functions/supabase/courseSections";
import { upsertCourseTopic, getCourseSectionTopics } from "@/functions/supabase/topics";


export default function CourseSectionCard(
    { courseSection, courseSections, setCourseSections } : 
    { 
        courseSection: Course_Section, 
        courseSections: Course_Section[], 
        setCourseSections: (sections: Course_Section[]) => void
    }) {

    const [editingSection, setEditingSection] = useState<Course_Section>(courseSection);
    const [isEditingLoading, setIsEditingLoading] = useState(false);
    const [isCourseSectionDeleteLoading, setIsCourseSectionDeleteLoading] = useState(false);
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isOrderMode, setIsOrderMode] = useState(false);
    const [loadingOrder, setLoadingOrder] = useState(false);

    const handleEditCourseSection = (section: Course_Section) => {
        setEditingSection(section); 
        onOpen();
    }
    
    const handleSaveCourseSection = async () => {
    if(editingSection && editingSection.title.length > 0 && editingSection.description.length > 0) {
        setIsEditingLoading(true);
        const { id } = await upsertCourseSection(editingSection);
        if(id) {
        // update in state
        const index = courseSections.findIndex((section) => section.id === id);
        if(index !== -1) {
            const newState = [...courseSections];
            newState[index] = editingSection;
            setCourseSections([...newState]);
        } else {
            setCourseSections([...courseSections, editingSection]);	
        }
        }
        onOpenChange();
        setIsEditingLoading(false);
    }
    }

    const handleDeleteCourseSection = async (section: Course_Section) => {
    setIsCourseSectionDeleteLoading(true);
    if(window.confirm("Are you sure you want to delete this section?")) {
        const res = await deleteCourseSection(section.id);
        if(res) {
        // remove from state
        const index = courseSections.findIndex((s) => s.id === section.id);
        if(index !== -1) {
            const newState = [...courseSections];
            newState.splice(index, 1);
            setCourseSections([...newState]);
        }
        }
    }
    setIsCourseSectionDeleteLoading(false);
    }
    
    const updateTopicsOrder = async () => {
        setLoadingOrder(true);

        topics.forEach(async (topic, index) => {
            topic.order = index;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (topic as any).chosen;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (topic as any).selected;

            await upsertCourseTopic(topic);
        })

        setIsOrderMode(false);
        setLoadingOrder(false);
    }

    useEffect(() => {
        const fetchCourseTopics = async () => {
            try { 
                const res = await getCourseSectionTopics(courseSection.id);
                if(res) {
                    setTopics(res);
                }
            } catch (error) {
                console.error(error)
            }
        }

        if(isOpen && topics.length == 0) {
            fetchCourseTopics();
        }

    }, [isOpen, courseSection.id, topics.length])

    return (
    <>
        <Card key={courseSection.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-0">
            <span className=" font-bold">{courseSection.title}</span>
            </CardHeader>
            <CardFooter className="flex items-center justify-between gap-4">
                <Button 
                    onClick={() => handleEditCourseSection(courseSection)} 
                    color="warning"
                    isDisabled={isCourseSectionDeleteLoading} 
                    variant="flat"
                    startContent={<Icon filled>edit</Icon>}
                >
                    Edit
                </Button>
                <Button
                    variant="bordered"
                    color="danger"
                    onClick={() => handleDeleteCourseSection(courseSection)}
                    isIconOnly
                    isLoading={isCourseSectionDeleteLoading}
                >
                    <Icon filled>delete</Icon>
                </Button>
            </CardFooter>
        </Card>

        <Modal
        size="full"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        >
            <ModalContent>
                <ModalHeader>{editingSection?.title || "New Course Section"}</ModalHeader>
                <ModalBody>
                    <Input 
                        label="Title" 
                        isRequired 
                        value={editingSection?.title} 
                        onValueChange={(value) => setEditingSection({...editingSection, title: value})}
                    />
                    <Input 
                        label="Description" 
                        isRequired 
                        value={editingSection?.description} 
                        onValueChange={(value) => setEditingSection({...editingSection, description: value})}
                    />

                    <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">Course Levels</span>
                        <Button
                            onClick={() => isOrderMode ? updateTopicsOrder() : setIsOrderMode(true)}
                            color="warning"
                            variant={isOrderMode ? "solid" : "flat" }
                            isLoading={loadingOrder}
                            startContent={<Icon filled>{isOrderMode ? "save" : "sort"}</Icon>}
                            >
                            {isOrderMode ? "Save Order" : "Edit Order"}
                        </Button>   
                    </div>

                    {!isOrderMode &&
                        <div className="flex flex-col gap-2">
                            {topics.map((topic) => (
                                <Card key={topic.id}>
                                    <CardHeader className="pb-0 font-medium">{topic.title}</CardHeader>
                                    <CardFooter className="flex items-center gap-4">
                                        <Button 
                                            color="warning" variant="flat" 
                                            isDisabled
                                            startContent={<Icon filled>edit</Icon>}
                                            onClick={() => console.log("edit topic")}
                                        >Edit</Button>
                                        <Button 
                                            color="danger" variant="flat"
                                            isDisabled 
                                            startContent={<Icon filled>delete</Icon>}
                                            onClick={() => console.log("delete topic")}
                                        >Delete</Button>
                                    </CardFooter>
                                </Card>
                            ))}

                        </div>
                    }

                    { isOrderMode && (
                        <ReactSortable list={topics} setList={setTopics} className=" overflow-y-auto max-h-[50vh] ">
                        {topics?.map((topic) => (
                            <Card key={topic.id} className=" mb-2  cursor-move select-none">
                            <CardHeader className="flex flex-row items-center justify-between pb-0">
                                <span className=" font-bold">{topic.title}</span>
                            </CardHeader>
                            <CardBody className="flex flex-row items-center justify-end">
                                <Icon>drag_indicator</Icon>
                            </CardBody>
                            </Card>
                        ))}
                        </ReactSortable>
                    )}


                </ModalBody>
                <ModalFooter>
                    <Button 
                        color="warning" variant="flat" 
                        isDisabled={isEditingLoading || loadingOrder} onClick={onClose}
                    >Cancel</Button>
                    <Button 
                        color="primary" variant="solid" 
                        isLoading={isEditingLoading} 
                        isDisabled={loadingOrder}
                        onClick={handleSaveCourseSection}
                    >Save</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
    )
}