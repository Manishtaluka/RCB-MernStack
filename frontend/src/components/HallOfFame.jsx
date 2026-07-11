const legends = [
  {
    image: "https://pbs.twimg.com/media/FS73d45UYAE4EzI.jpg",
    text: `AB de Villiers' induction into RCB's hall of fame underscores his status as one of the
      greatest cricketers to have graced the IPL stage and his enduring legacy within the
      franchise. His performances have etched unforgettable memories in the hearts of cricket
      enthusiasts worldwide.`,
  },
  {
    image: "https://pbs.twimg.com/media/FRAy2kDUYAE0oxs.jpg",
    text: `Chris Gayle's legacy in the IPL extends beyond his statistics; he brought excitement,
      entertainment, and a winning mentality to RCB during his time with the team. He is
      remembered fondly by fans as one of the greatest T20 cricketers of all time.`,
  },
];

export default function HallOfFame() {
  return (
    <div className="container mx-auto pt-24">
      <h1 className="font-poppins font-bold text-center text-white text-4xl mb-8">
        Hall of <span className="text-rcb-gold">Fame</span>
      </h1>
      <div className="flex flex-wrap">
        {legends.map((legend, i) => (
          <div
            key={i}
            className="w-full md:w-1/2 px-4 text-center transition-colors rounded hover:bg-rcb-gold/90 py-4"
          >
            <img src={legend.image} alt="RCB legend" className="h-72 mx-auto rounded" />
            <p className="font-poppins font-bold text-white text-xs px-12 pt-5 leading-relaxed">
              {legend.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
