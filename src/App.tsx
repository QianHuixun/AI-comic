<<<<<<< Updated upstream
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

type Instrument = {
  id?: string | number | null
  name?: string | null
  [key: string]: unknown
=======
import { Navigate, Route, Routes } from "react-router-dom";
import EditProfilePage from "./pages/edit-profile";
import LoginPage from "./pages/login";
import MyPage from "./pages/my";
import Ranking from "./pages/ranking";
import SettingsPage from "./pages/settings";

function App() {
  return (
    <Routes>
      <Route element={<Ranking />} path="/" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<MyPage />} path="/my" />
      <Route element={<EditProfilePage />} path="/my/edit-profile" />
      <Route element={<SettingsPage />} path="/my/settings" />
      <Route element={<Ranking />} path="/ranking" />
      <Route element={<Navigate replace to="/ranking" />} path="*" />
    </Routes>
  );
>>>>>>> Stashed changes
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
