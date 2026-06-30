'use client'

import React, { useEffect, useRef, useState, useCallback } from "react";

const testimonials = [
    { name: "Rafi Ahmed", role: "HSC 2025 • Dhaka Board", text: "GoalPilot AI amar study routine completely change kore diyeche. Weak topics auto detect kore suggestion dey, ata khub helpful!", stars: 5 },
    { name: "Nusrat Jahan", role: "SSC Candidate • Chittagong", text: "Mock test er pore detailed analysis pawa jai konkhane mistake hoise. Amr physics score 30 theke 72-e giyeche matro 2 maase!", stars: 5 },
    { name: "Tanvir Islam", role: "Admission Prep • Rajshahi", text: "AI tutor 24/7 available thake. Rater belay question korleo instant answer pawa jai. Coaching er cheye beshi help korche!", stars: 5 },
    { name: "Sadia Sultana", role: "HSC 2024 • Sylhet Board", text: "Progress tracker ta dekhle motivation pawa jai. Daily streak system ta game er moto addictive — study chharte ichhe kore na!", stars: 5 },
    { name: "Mehedi Hasan", role: "SSC 2025 • Comilla", text: "Bangla medium students der jonno perfect. Explanation gulo Bangla-te dewa, bujhte kono problem hoy na. Highly recommend!", stars: 5 },
    { name: "Farhan Chowdhury", role: "BUET Admission • Dhaka", text: "Admission test preparation e GoalPilot er question bank use korechi. 6000+ MCQ, subject-wise filter ache — ekdom complete!", stars: 5 },
];

const CLONE_COUNT = 3;
const GAP = 16;

const cloned = [
    ...testimonials.slice(-CLONE_COUNT),
    ...testimonials,
    ...testimonials.slice(0, CLONE_COUNT),
];

export default function Comment() {
    const [current, setCurrent] = useState(0);
    const [visibleCount, setVisibleCount] = useState(3);
    const trackRef = useRef(null);
    const viewportRef = useRef(null);
    const animating = useRef(false);
    const timerRef = useRef(null);

    // Responsive visible count check
    useEffect(() => {
        const updateVisibleCount = () => {
            if (window.innerWidth < 768) {
                setVisibleCount(1);
            } else {
                setVisibleCount(3);
            }
        };
        updateVisibleCount();
        window.addEventListener("resize", updateVisibleCount);
        return () => window.removeEventListener("resize", updateVisibleCount);
    }, []);

    const getCardWidth = useCallback(() => {
        if (!viewportRef.current) return 0;
        return (viewportRef.current.offsetWidth - GAP * (visibleCount - 1)) / visibleCount + GAP;
    }, [visibleCount]);

    const setPosition = useCallback(
        (idx, animated) => {
            if (!trackRef.current) return;
            const offset = (idx + CLONE_COUNT) * getCardWidth();
            trackRef.current.style.transition = animated
                ? "transform 0.5s cubic-bezier(0.4,0,0.2,1)"
                : "none";
            trackRef.current.style.transform = `translateX(-${offset}px)`;
        },
        [getCardWidth]
    );

    useEffect(() => {
        setPosition(0, false);
    }, [setPosition]);

    useEffect(() => {
        const onResize = () => setPosition(current, false);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [current, setPosition]);

    const next = useCallback(() => {
        if (animating.current || !trackRef.current) return;
        animating.current = true;

        const nextIdx = current + 1;
        const rawIdx = nextIdx % testimonials.length;

        const offset = (nextIdx + CLONE_COUNT) * getCardWidth();
        trackRef.current.style.transition = "transform 0.5s cubic-bezier(0.4,0,0.2,1)";
        trackRef.current.style.transform = `translateX(-${offset}px)`;

        setTimeout(() => {
            if (trackRef.current) {
                trackRef.current.style.transition = "none";
                trackRef.current.style.transform = `translateX(-${(rawIdx + CLONE_COUNT) * getCardWidth()}px)`;
            }
            animating.current = false;
        }, 520);

        setCurrent(rawIdx);
    }, [current, getCardWidth]);

    const goTo = useCallback(
        (idx) => {
            if (animating.current) return;
            animating.current = true;
            setCurrent(idx);
            setPosition(idx, true);
            setTimeout(() => {
                animating.current = false;
            }, 520);
        },
        [setPosition]
    );

    const startTimer = useCallback(() => {
        timerRef.current = setInterval(next, 3000);
    }, [next]);

    const stopTimer = useCallback(() => {
        clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        startTimer();
        return () => stopTimer();
    }, [startTimer, stopTimer]);

    const cardWidth = `calc((100% - ${GAP * (visibleCount - 1)}px) / ${visibleCount})`;

    return (
        <div className=" mt-15 w-full bg-white dark:bg-[black]">
            <div className="max-w-[1000px] mx-auto px-4 pb-24  transition-colors duration-200">
                <p className="text-teal-600 text-xs font-mono uppercase tracking-widest text-center mb-2 font-bold">
                    Verified Recall Telemetry
                </p>
                <h3 className="text-2xl font-bold text-center mb-8 text-slate-900  dark:text-slate-50">
                    Student Feedbacks & Reviews
                </h3>

                <div
                    ref={viewportRef}
                    className="overflow-hidden w-full"
                    onMouseEnter={stopTimer}
                    onMouseLeave={startTimer}
                >
                    <div ref={trackRef} className="flex" style={{ gap: GAP }}>
                        {cloned.map((t, i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 bg-slate-50 dark:bg-[#1F2736] border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col justify-between"
                                style={{ width: cardWidth, minHeight: 150 }}
                            >
                                <div>
                                    <div className="text-amber-400 text-xs mb-2 tracking-wide">
                                        {"★".repeat(t.stars)}
                                    </div>
                                    <p className="text-xs sm:text-sm italic text-slate-500 dark:text-slate-400 leading-relaxed">
                                        "{t.text}"
                                    </p>
                                </div>
                                <div className="flex items-center gap-2.5 mt-4">
                                    <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600 font-bold text-xs font-mono flex-shrink-0">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <span className="font-semibold text-slate-900 dark:text-white text-xs block">
                                            {t.name}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">
                                            {t.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center items-center gap-1.5 mt-5">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === current
                                    ? "w-5 bg-teal-500"
                                    : "w-1.5 bg-slate-300 dark:bg-slate-600"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}