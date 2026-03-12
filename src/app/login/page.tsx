import Link from 'next/link'
import { login } from '@/app/auth/actions'
import Image from 'next/image'
import bgImage from '../../../public/bg-image.avif'


export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const params = await searchParams;

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
      {/* Background Image - Covers Whole Page */}
      <div className="fixed inset-0 z-0">
        <Image
          src={bgImage}
          alt="Travel Background"
          placeholder="blur"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>







      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-white bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center group text-sm transition-all z-20 border border-white/20"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back to Home
      </Link>

      <form
        action={login}
        className="relative z-10 animate-in flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 text-white bg-white/10 backdrop-blur-xl p-10 rounded-2xl border border-white/20 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black mb-2">Welcome Back</h1>
          <p className="text-white/60">Sign in to continue your journey</p>
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-bold uppercase tracking-wider text-white/70" htmlFor="email">
            Email Address
          </label>
          <input
            className="rounded-xl px-4 py-3 bg-white/10 border border-white/10 text-white placeholder-white/30 focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:bg-white/20"
            name="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="flex flex-col gap-1 mb-6">
          <label className="text-sm font-bold uppercase tracking-wider text-white/70" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-xl px-4 py-3 bg-white/10 border border-white/10 text-white placeholder-white/30 focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:bg-white/20"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          className="bg-blue-600 rounded-xl px-4 py-4 text-white font-bold text-lg mb-4 hover:bg-blue-700 transition-all transform active:scale-95 shadow-lg shadow-blue-500/20"
        >
          Sign In
        </button>

        {params?.message && (
          <p className="mt-2 p-4 bg-blue-500/20 border border-blue-500/30 text-blue-100 text-center rounded-xl backdrop-blur-md">
            {params.message}
          </p>
        )}

        <p className="text-sm text-center mt-6 text-white/60">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 underline font-bold transition-colors">
            Create one now
          </Link>
        </p>
      </form>
    </div>
  )

}
