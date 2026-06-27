// Simple fetch interceptor for development to mock /api/me and /api/logout
const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

if (isDev) {
  const originalFetch = window.fetch.bind(window)

  window.fetch = async (input: RequestInfo, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input)

    // Normalize path (strip origin)
    const path = url.replace(window.location.origin, '')

    if (path === '/api/auth/me') {
      // If adminAuth set in localStorage, return mocked user
      const adminAuth = localStorage.getItem('adminAuth')
      if (adminAuth === 'true') {
        const body = JSON.stringify({ ok: true, user: { username: localStorage.getItem('adminUser') || 'dev' } })
        return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } })
      }
      const body = JSON.stringify({ ok: false, message: 'No autenticado' })
      return new Response(body, { status: 401, headers: { 'Content-Type': 'application/json' } })
    }

    if (path === '/api/logout') {
      // simulate logout
      localStorage.removeItem('adminAuth')
      localStorage.removeItem('adminUser')
      const body = JSON.stringify({ ok: true })
      return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } })
    }

    return originalFetch(input, init)
  }
}

export {}
