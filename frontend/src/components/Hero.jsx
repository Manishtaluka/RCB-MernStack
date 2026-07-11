export default function Hero() {
  return (
    <div id="home" className="container mx-auto pt-24">
      <div className="flex flex-wrap items-center">
        <div className="w-full md:w-7/12 px-4">
          <h1 className="font-poppins font-bold text-center text-white text-6xl md:text-8xl">
            RC<span className="text-rcb-gold">B</span>
          </h1>
          <p className="font-poppins font-bold text-white text-right text-sm leading-relaxed pl-12 pt-4">
            Royal Challengers Bangalore (RCB), is one of the most popular franchises in the
            Indian Premier League (IPL), known for its passionate fan base and star-studded
            lineups. Founded in 2008, the team is owned by United Spirits and plays its home
            matches at the iconic M. Chinnaswamy Stadium in Bengaluru. Despite boasting legendary
            players like Virat Kohli, AB de Villiers, Chris Gayle, and Anil Kumble over the years,
            RCB has often been labeled as underachievers, having reached the IPL finals three
            times (2009, 2011, and 2016) but never clinching the trophy. In recent seasons, RCB
            has focused on building a more balanced squad with strong bowling options, aiming to
            shed its "always the bridesmaid" tag and finally secure an IPL championship.
          </p>
        </div>
        <div className="w-full md:w-5/12 px-4">
          <img
            src="https://images.news18.com/ibnlive/uploads/2023/11/pl_2024_auction_rcb_squad_image1-2023-11-86f18706a80e9b1b2bbda1f55a81404f.jpg"
            alt="RCB squad"
            className="h-[440px] w-full object-cover rounded"
          />
        </div>
      </div>
    </div>
  );
}
