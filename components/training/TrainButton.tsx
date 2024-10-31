"use client";

import { useState } from "react";

import { Weak_User_Questions } from "@/types/db";
import { Button } from "../utils/Button";
import Icon from "../utils/Icon";

import { createTrainingLevel } from "@/app/training/actions";

export default function TrainButton({ weakQuestions } : { weakQuestions: Weak_User_Questions[] }) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Button 
            startContent={<Icon filled>exercise</Icon>} 
            fullWidth size="lg" color="primary" variant="shadow"
            onClick={() => {createTrainingLevel(weakQuestions); setIsLoading(true)}}
            isLoading={isLoading}
        >
            Train
        </Button>
    )
}