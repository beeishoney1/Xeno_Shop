import { BiArrowBack } from "react-icons/bi";
import Nav from "./Nav";
import { Link } from "react-router-dom";

export default function GreetingScreen() {
  return (
    <div
      className="w-full h-screen text-white relative rounded-xl shadow-2xl overflow-hidden flex flex-col 
                 bg-[url('/bg.jpg')] md:bg-[url('/dsbg.jpg')] bg-cover bg-center animate-[zoomIn_1.5s_ease]"
    >
      {/* Nav Component */}
      <Nav />

      {/* Content Section */}
      <div className="flex flex-col items-center md:items-start px-6 md:px-12 
                      mt-auto mb-6 md:mt-8 md:mb-0
                      max-w-lg text-center md:text-left animate-[fadeUp_1.2s_ease]">
        <h2
          className="text-4xl md:text-3xl font-extrabold mb-4 md:mb-6 uppercase
                     bg-gradient-to-b from-yellow-300 to-orange-600 bg-clip-text text-transparent"
        >
          Welcome
        </h2>

        <p className="text-sm md:text-lg mb-6 md:mb-8 bg-black/40 backdrop-blur-sm p-3 md:p-4 rounded-lg shadow-md">
          “Shop with confidence. There’s no need to worry about recovery — we’ve got you
          covered with <span className="font-bold text-red-400">100% insurance</span> on every purchase.”
        </p>
        <Link to="/home" className="flex items-center gap-2 md:gap-3 bg-red-900/90 hover:bg-red-800 px-6 md:px-10 py-3 md:py-4 rounded-full text-lg md:text-xl font-bold border-2 border-black shadow-lg transition transform hover:scale-105 hover:animate-pulse">
          <BiArrowBack /> Get Started
        </Link>
      </div>
    </div>
  );
}
