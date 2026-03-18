import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Navigate, Route, Routes } from "react-router-dom";
import EditProfilePage from "./pages/edit-profile";
import LoginPage from "./pages/login";
import MyPage from "./pages/my";
import Ranking from "./pages/ranking";
import SettingsPage from "./pages/settings";
import Home from "./pages/home";
import Category from "./pages/category";

type Instrument = {
  id?: string | number | null
  name?: string | null
  [key: string]: unknown
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseKey = (import.meta.env
  .VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ??
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

function App() {
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void getInstruments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function getInstruments() {
    if (!supabase) {
      setError(
        'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY) in Vite env.'
      )
      return
    }

    setLoading(true)
    setError(null)

    const { data, error } = await supabase.from('instruments').select('*')
    if (error) {
      setError(error.message)
      setInstruments([])
      setLoading(false)
      return
    }

    setInstruments((data ?? []) as Instrument[])
    setLoading(false)
  }

  // 根据当前路径决定渲染什么内容
  const path = window.location.pathname

  // 如果是路由页面，渲染 Routes
  if (path.startsWith('/my') || path === '/' || path === '/login' || path === '/ranking') {
    return (
      <Routes>
        <Route element={<Ranking />} path="/" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<MyPage />} path="/my" />
        <Route element={<EditProfilePage />} path="/my/edit-profile" />
        <Route element={<SettingsPage />} path="/my/settings" />
        <Route element={<Ranking />} path="/ranking" />
        {/* 添加 main 分支的新路由 */}
        <Route element={<Home />} path="/home" />
        <Route element={<Category />} path="/category" />
        <Route element={<Navigate replace to="/ranking" />} path="*" />
      </Routes>
    )
  }

  // 否则渲染 Instruments 页面
  return (
    <main id="center">
      <h1>Instruments</h1>
      <button
        className="counter"
        onClick={() => void getInstruments()}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Refresh'}
      </button>

      {error && (
        <p style={{ color: 'crimson', margin: 0, textAlign: 'center' }}>
          {error}
        </p>
      )}

      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {instruments.map((instrument, idx) => (
          <li key={String(instrument.id ?? instrument.name ?? idx)}>
            {instrument.name ?? '(no name)'}
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App