export default function Placeholder({ title }) {
  return (
    <div className="container mx-auto pt-32 pb-16 text-center min-h-[50vh]">
      <h1 className="font-poppins font-bold text-white text-4xl">
        {title} <span className="text-rcb-gold">coming soon</span>
      </h1>
      <p className="font-poppins text-white/70 mt-4">This page is next up on the build list.</p>
    </div>
  );
}
