import Image from "next/image";
import Link from "next/link";
import { courses } from "@/lib/mock-data";

export default function CoursesPage() {
  return (
    <section className="bg-[#728DA1] py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12">
          <h1 className="text-5xl font-black leading-tight text-charcoal">50+ уроков для вдохновения</h1>
          <p className="mt-4 text-xl text-charcoal/80">Авторы уже создали много интересных курсов</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`} className="group relative aspect-[4/3] overflow-hidden bg-white shadow-lg transition-transform hover:-translate-y-1">
              <Image 
                src={course.imageUrl} 
                alt={course.title} 
                fill 
                className="object-cover transition-transform group-hover:scale-105" 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 px-4 py-3 shadow-md">
                <div className="text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-1">
                  {course.details.level}
                </div>
                <h3 className="text-lg font-black leading-tight text-charcoal uppercase">
                  {course.title}
                </h3>
                <div className="mt-2 text-sm font-bold text-[#32495e]">
                  {course.priceRub.toLocaleString('ru-RU')} ₽
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}