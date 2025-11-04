import BackgroundTiles from "@/components/BackgroundTiles";

export default function Placeholder({ title }: { title: string }) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center text-center text-white">
      <BackgroundTiles />
      <div className="relative z-10 max-w-2xl glass border border-white/10 rounded-2xl p-10">
        <h2 className="text-3xl font-extrabold mb-2">{title}</h2>
        <p className="text-white/70">
          This page will be crafted next. Tell me what content and widgets you want here and I’ll build it to match the brand.
        </p>
      </div>
    </section>
  );
}
