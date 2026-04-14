import Image from "next/image";

export default function CoursesPage() {
  return (
    <section className="bg-[#728DA1] py-14">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <h1 className="text-5xl font-black leading-tight text-charcoal">50+ уроков для вдохновения</h1>
          <p className="mt-4 text-xl text-charcoal/80">Авторы уже создали много интересных курсов</p>
          <button className="mt-8 bg-[#32495e] px-6 py-3 text-base font-semibold text-white">Узнайте больше</button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="relative aspect-[4/3] overflow-hidden bg-white shadow-lg">
            <Image src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&h=700&fit=crop" alt="Как цвета влияют на человека" fill className="object-cover" sizes="50vw" />
            <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-3 text-2xl font-black">Как цвета влияют на человека ?</div>
          </article>
          <article className="relative aspect-[4/3] overflow-hidden bg-white shadow-lg">
            <Image src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&h=700&fit=crop" alt="Дизайнерский курс" fill className="object-cover" sizes="50vw" />
            <div className="absolute bottom-4 left-4 right-4 bg-[#2c3e97]/90 px-4 py-3 text-xl font-black text-white">
              ДИЗАЙНЕРСКИЙ КУРС ДЛЯ ОПЫТНЫХ ПОЛЬЗОВАТЕЛЕЙ
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}