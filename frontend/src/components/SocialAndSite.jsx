const socials = [
  {
    href: "https://www.youtube.com/@royalchallengersbengaluruYT",
    icon: "https://static.vecteezy.com/system/resources/thumbnails/011/998/173/small_2x/youtube-icon-free-vector.jpg",
    label: "YouTube",
  },
  {
    href: "https://www.instagram.com/royalchallengers.bengaluru/?hl=en",
    icon: "https://static.vecteezy.com/system/resources/previews/018/910/697/non_2x/instagram-mobile-app-logo-instagram-app-icon-ig-app-free-free-vector.jpg",
    label: "Instagram",
  },
  {
    href: "https://x.com/RCBTweets",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzEc3orXVmbHvTZA1QlWihCgekfrXzC0c23IYD6QftJQ&s",
    label: "X",
  },
];

export default function SocialAndSite() {
  return (
    <div className="container mx-auto pt-24 pb-16 text-center">
      <h1 className="font-poppins font-bold text-white text-4xl">
        Social <span className="text-rcb-gold">Media</span>
      </h1>
      <div className="flex justify-center gap-6 mt-6 mb-16">
        {socials.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
            <img src={s.icon} alt={s.label} className="h-12 rounded" />
          </a>
        ))}
      </div>

      <h1 className="font-poppins font-bold text-white text-4xl">
        Official <span className="text-rcb-gold">Website</span>
      </h1>
      <a href="https://www.royalchallengers.com/" target="_blank" rel="noreferrer">
        <button className="font-poppins bg-rcb-gold text-black italic px-6 py-2 rounded mt-6">
          press here
        </button>
      </a>
    </div>
  );
}
