import Link from "next/link";

export default function Home() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center dark:bg-neutral-900"
      style={{
        backgroundImage: `url('/images/placeholders/geoffroy-hauwen-Nba45LGrCfM-unsplash.jpg')`,
      }}
    >
      {/* Overlay to darken the background image slightly for better text contrast */}
      <div className="absolute inset-0 bg-black opacity-40 dark:opacity-60"></div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 max-w-xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 shadow-lg">
          Join The Giving Bridge Challenge!
        </h1>
        <p className="text-lg sm:text-xl text-neutral-200 mb-8 shadow-md">
          Make a difference this September. Support recovery, build community,
          and inspire hope.
        </p>
        <Link
          href="/interest-form"
          className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white text-lg font-semibold rounded-lg shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
        >
          Express Your Interest
        </Link>
      </div>
    </div>
  );
}
