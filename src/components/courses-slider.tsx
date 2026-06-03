"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Course } from "@/lib/mock-data";

interface CoursesSliderProps {
  courses: Course[];
}

export function CoursesSlider({ courses }: CoursesSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      {/* Кнопки управления */}
      <button
        onClick={() => scroll("left")}
        className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-3 shadow-xl transition-all hover:bg-slate-50 focus:outline-none md:-left-6 lg:opacity-0 lg:group-hover:opacity-100"
        aria-label="Предыдущие курсы"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="h-6 w-6 text-charcoal">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-3 shadow-xl transition-all hover:bg-slate-50 focus:outline-none md:-right-6 lg:opacity-0 lg:group-hover:opacity-100"
        aria-label="Следующие курсы"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="h-6 w-6 text-charcoal">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Контейнер со списком */}
      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {courses.map((course) => (
          <div key={course.id} className="min-w-[280px] flex-shrink-0 snap-start md:min-w-[340px] lg:w-[calc(33.333%-16px)]">
            <Link
              href={`/courses/${course.id}`}
              className="group relative block aspect-[4/3] overflow-hidden bg-white shadow-lg transition-transform hover:-translate-y-1"
            >
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/40" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 px-4 py-3 shadow-md">
                <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-charcoal/60">
                  {course.details.level}
                </div>
                <h3 className="text-base font-black uppercase leading-tight text-charcoal md:text-lg">
                  {course.title}
                </h3>
                <div className="mt-2 text-sm font-bold text-[#32495e]">
                  {course.priceRub.toLocaleString("ru-RU")} ₽
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
