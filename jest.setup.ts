import '@testing-library/jest-dom'

// Setup environment variables expected by Supabase client
process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'anon'

// Mock global fetch if not already
if (!global.fetch) {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ count: 0, isLiked: false }) })
  ) as unknown as typeof fetch
}

// Mock Supabase createClient
jest.mock('@supabase/supabase-js', () => {
  const originalModule = jest.requireActual('@supabase/supabase-js')
  return {
    __esModule: true,
    ...originalModule,
    createClient: () => ({
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: { access_token: 'token' } } }),
      },
    }),
  }
})
