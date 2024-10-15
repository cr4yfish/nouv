"use client";

import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useStopwatch } from "react-use-precision-timer";

import Icon from "@/components/Icon";
import Header from "@/components/question/Header"
import Question from "@/components/question/Question"

import { addUsersTopics, updateTotalXP, extendOrAddStreak, getCurrentUser, getQuestions, tryRankUp } from "@/functions/client/supabase";

import { Question as QuestionType } from "@/types/db";
import { LevelState } from "@/types/client";
import { SessionState } from "@/types/auth";


export default function Level({ params } : { params: { level: string }}) {

    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [session, setSession] = useState<SessionState>();
    const [levelState, setLevelState] = useState<LevelState>({
        progress: 0,
        answeredQuestions: 0,
        correctQuestions: 0,
        totalQuestions: 1,
        xp: 0,
        currentQuestionIndex: 0,
        seconds: 0,
        rankUp: false
    });
    const [isLoading, setIsLoading] = useState(true);

    const stopwatch = useStopwatch();

    useEffect(() => {
        stopwatch.start();

        // cleanup
        return () => {
            stopwatch.stop();
        }
    }, [stopwatch])

    const addUserTopic = async () => {
        if(!session || !session?.user?.id || !session.profile) return;
        stopwatch.pause();
        setIsLoading(true);

        const newTopic = {
            userID: session.user.id,
            topicID: params.level,
            completed: true,
            seconds: Math.round(stopwatch.getElapsedRunningTime()/1000),
            accuracy: levelState.correctQuestions/levelState.answeredQuestions * 100,
            xp: levelState.xp         
        }
        stopwatch.stop();

        setLevelState((prevState) => ({
            ...prevState,
            seconds: newTopic.seconds
        }))

        await addUsersTopics(newTopic)  
        await updateTotalXP(session.user.id, session.profile?.total_xp + levelState.xp);
        await extendOrAddStreak(session.user.id, new Date());
        const { rank, rankedUp } = await tryRankUp(session.user.id, session.profile?.total_xp + newTopic.xp, session.profile?.rank);
        console.log(rank, rankedUp);

        if(rankedUp) {
            setLevelState((prevState) => ({
                ...prevState,
                rankUp: true
            }))
        }
        setIsLoading(false);
    
        
    }

    useEffect(() => {
        try {
            getCurrentUser().then(res => {
                if(res == null) return;
                setSession(res);
            });
        } catch (error) {
            console.error(error);
        }

        async function fetchQuestions(): Promise<QuestionType[]> {
            const res = await getQuestions(params.level);
            return res;
        }

        fetchQuestions().then(res => {
            setQuestions(res);
            setLevelState((prevState) => ({
                ...prevState,
                totalQuestions: res.length
            }));
        });
 
    }, [])

    useEffect(() => {
        if(levelState.answeredQuestions == levelState.totalQuestions) {
            addUserTopic();
        }
    }, [levelState.answeredQuestions])

    return (
        <div className="dark px-4 py-6 flex flex-col gap-4 h-full min-h-full ">
            <Header progress={levelState.progress} numQuestions={levelState.totalQuestions} xp={levelState.xp} />
           
            <div className="flex flex-col justify-between h-full min-h-full gap-12">
                {questions.length > 0 && levelState.answeredQuestions < levelState.totalQuestions && (
                    <Question 
                        key={questions[levelState.currentQuestionIndex].id} 
                        question={questions[levelState.currentQuestionIndex]} 
                        setLevelState={setLevelState}
                        session={session}
                    />
                )}
                {levelState.answeredQuestions > 0 && levelState.answeredQuestions == levelState.totalQuestions && (
                    <div className="flex flex-col gap-8 items-center justify-center w-full h-full min-h-screen px-4 pb-[33vh]">
                        <Icon upscale filled color="green-500">check_circle</Icon>
                        <div className="flex flex-col justify-center items-center">
                            <h2 className="text-4xl font-semibold">Congratulations!</h2>
                            <p>You have completed this level.</p>
                        </div>

                        <Link 
                            className="w-full" 
                            href={`/level/${params.level}/complete?rankUp=${levelState.rankUp}`}
                        >
                            <Button 
                                color="primary" 
                                variant="shadow" 
                                className="w-full font-bold"
                                isLoading={isLoading}
                            >
                                Continue
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}