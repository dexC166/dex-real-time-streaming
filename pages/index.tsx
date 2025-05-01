import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaAngleRight } from 'react-icons/fa';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: '/browse',
        permanent: false,
      },
    };
  }
  return { props: {} };
}

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleGetStarted = () => {
    router.push(`/auth?variant=register&email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="w-full bg-black text-white">
      {/* HERO SECTION - occupies 70vh */}
      <div
        className="w-full relative bg-[url('/images/hero.png')] bg-cover bg-center"
        style={{ height: '70vh' }}
      >
        {/* Dark overlay - increased opacity */}
        <div className="absolute inset-0 bg-black bg-opacity-60" />

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto h-full flex flex-col px-4">
          {/* Header with Logo & Sign In */}
          <div className="w-full flex items-center justify-between pt-6">
            <img
              src="/images/netflix-logo.png"
              alt="Netflix"
              className="w-32 md:w-44"
            />
            <button
              onClick={() => router.push('/auth?variant=login')}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 text-sm font-medium"
            >
              Sign In
            </button>
          </div>

          {/* Hero Text - Centered in middle of screen */}
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <h1 className="text-white text-4xl md:text-5xl font-bold max-w-3xl">
              Unlimited movies, TV shows, and more
            </h1>
            <p className="text-white text-xl md:text-2xl mt-4">
              Watch anywhere. Cancel anytime.
            </p>
            <p className="text-white text-lg mt-5">
              Ready to watch? Enter your email to create or restart your
              membership.
            </p>

            {/* Email Input & Get Started Button */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-2 w-full max-w-xl">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-4 w-full rounded bg-black bg-opacity-60 text-white border border-gray-600"
              />
              <button
                onClick={handleGetStarted}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded text-xl font-medium whitespace-nowrap"
              >
                Get Started <FaAngleRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Border that separates hero and scrolling section - full width */}
      <div className="w-full border-t-8 border-gray-800"></div>

      {/* SCROLLABLE CONTENT SECTIONS */}
      <main className="w-full bg-black text-white">
        {/* Section: Enjoy on your TV */}
        <section className="py-16 px-4">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
            <div className="md:w-1/2 mb-6 md:mb-0 px-4">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Enjoy on your TV
              </h2>
              <p className="text-lg md:text-xl">
                Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV,
                Blu-ray players, and more.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center relative">
              {/* TV frame image with relative positioning */}
              <div className="relative w-full max-w-md">
                <img
                  src="/images/tv.png"
                  alt="TV"
                  width={500}
                  height={300}
                  className="w-full h-auto relative z-10"
                />
                {/* Further adjusted video positioning to eliminate bottom black bar */}
                <div className="absolute top-[11%] left-[13%] w-[74%] h-[67%] z-0 overflow-hidden">
                  <video
                    src="/images/raw.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover object-center brightness-[80%]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full-width border - increased thickness */}
        <div className="w-full border-t-8 border-gray-800"></div>

        {/* Section: Download your shows */}
        <section className="py-16 px-4">
          <div className="flex flex-col md:flex-row-reverse items-center justify-between max-w-6xl mx-auto">
            <div className="md:w-1/2 mb-6 md:mb-0 px-4">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Download your shows to watch offline
              </h2>
              <p className="text-lg md:text-xl">
                Save your favorites easily and always have something to watch.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative max-w-md">
                <img
                  src="/images/stranger-things-lg.png"
                  alt="Stranger Things phone"
                  className="w-full h-auto"
                />
                <div className="absolute flex items-center gap-2 bottom-6 left-1/2 -translate-x-1/2 bg-black bg-opacity-80 p-2 rounded-lg border border-gray-600 w-3/4 max-w-xs">
                  <img
                    src="/images/stranger-things-sm.png"
                    alt="Poster"
                    className="w-12 h-16 object-cover"
                  />
                  <div className="flex flex-col text-white flex-grow">
                    <p className="text-sm font-bold">Stranger Things</p>
                    <p className="text-blue-400 text-xs">Downloading...</p>
                  </div>
                  <img
                    src="/images/download-icon.gif"
                    alt="Loading"
                    className="w-6 h-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full-width border - increased thickness */}
        <div className="w-full border-t-8 border-gray-800"></div>

        {/* Section: Watch everywhere */}
        <section className="py-16 px-4">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
            <div className="md:w-1/2 mb-6 md:mb-0 px-4">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Watch everywhere
              </h2>
              <p className="text-lg md:text-xl">
                Stream unlimited movies and TV shows on your phone, tablet,
                laptop, and TV.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              {/* Device pile with relative positioning */}
              <div className="relative w-full max-w-md">
                <img
                  src="/images/device-pile.png"
                  alt="Devices"
                  className="w-full h-auto relative z-10"
                />
                {/* Video overlay inside device screen */}
                <div className="absolute top-[10%] left-[17%] w-[65%] h-[47%] z-0 overflow-hidden">
                  <video
                    src="/images/interstellar.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover brightness-[100%]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full-width border - increased thickness */}
        <div className="w-full border-t-8 border-gray-800"></div>

        {/* Section: Create profiles for kids */}
        <section className="py-16 px-4">
          <div className="flex flex-col md:flex-row-reverse items-center justify-between max-w-6xl mx-auto">
            <div className="md:w-1/2 mb-6 md:mb-0 px-4">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Create profiles for kids
              </h2>
              <p className="text-lg md:text-xl">
                Send kids on adventures with their favorite characters in a
                space made just for them, free with your membership.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-full max-w-md">
                <img
                  src="/images/kids.png"
                  alt="Kids"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
