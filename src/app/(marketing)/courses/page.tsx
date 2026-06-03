import Image from "next/image";
import Link from "next/link";
import { courses } from "@/lib/mock-data";
import { CoursesSlider } from "@/components/courses-slider";

export default function CoursesPage() {
  return (
    <section className="bg-[#728DA1] py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12">
          <h1 className="text-5xl font-black leading-tight text-charcoal">50+ уроков для вдохновения</h1>
          <p className="mt-4 text-xl text-charcoal/80">Авторы уже создали много интересных курсов</p>
        </div>

        <CoursesSlider courses={courses} />
      </div>
    </section>
  );
}