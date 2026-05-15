import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { courses } from "@/lib/mock-data";
import { AddToCartButton } from "@/components/add-to-cart-button";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CourseDetailPage({ params }: Props) {
  const { id } = await params;
  const course = courses.find((c) => c.id === id);

  if (!course) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href="/courses"
        className="mb-8 inline-flex items-center text-sm font-medium text-charcoal/60 hover:text-charcoal"
      >
        ← Назад к курсам
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-8">
          <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black leading-tight text-charcoal uppercase">
              {course.title}
            </h1>
            <p className="text-xl text-charcoal/80 leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="space-y-6 pt-6">
            <h2 className="text-2xl font-black text-charcoal uppercase">Программа обучения</h2>
            <div className="space-y-4">
              {course.program.map((item, index) => (
                <div key={index} className="border-l-4 border-[#728DA1] bg-slate-50 p-5 shadow-sm">
                  <h3 className="font-bold text-lg text-charcoal">{item.title}</h3>
                  <p className="mt-1 text-charcoal/70">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="text-3xl font-black text-[#32495e]">
              {course.priceRub.toLocaleString('ru-RU')} ₽
            </div>
            
            <div className="mt-6 space-y-4 border-y border-slate-100 py-6">
              <div className="flex justify-between text-sm">
                <span className="text-charcoal/50">Длительность</span>
                <span className="font-bold">{course.details.duration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-charcoal/50">Уровень</span>
                <span className="font-bold">{course.details.level}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-charcoal/50">Количество уроков</span>
                <span className="font-bold">{course.details.lessonsCount}</span>
              </div>
            </div>

            <div className="mt-6">
              <AddToCartButton 
                productId={course.id}
                title={course.title}
                imageUrl={course.imageUrl}
                priceRub={course.priceRub}
                maxStock={1}
              />
              <p className="mt-3 text-center text-xs text-charcoal/40">
                После оплаты курс появится в вашем личном кабинете
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-6">
            <h3 className="text-lg font-bold text-charcoal mb-4">Автор курса</h3>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 shrink-0 rounded-full bg-[#728DA1] flex items-center justify-center text-white font-bold text-xl">
                {course.author.name[0]}
              </div>
              <div>
                <div className="font-bold text-charcoal">{course.author.name}</div>
                <p className="mt-1 text-sm text-charcoal/70 leading-relaxed">
                  {course.author.bio}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
