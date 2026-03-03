import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, orgs(id, name, type)')
        .eq('user_id', userId)
        .single()
      if (error) throw error
      setProfile(data)
      return data
    } catch (err) {
      console.error('프로필 로딩 실패:', err)
      setProfile(null)
      return null
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      if (s?.user) {
        loadProfile(s.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        setSession(s)
        if (s?.user) {
          await loadProfile(s.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
  }

  const isHQ = profile?.role === 'hq_admin' || profile?.role === 'hq_staff'
  const isAdmin = profile?.role === 'hq_admin'
  const isAgency = profile?.role === 'agency'
  const orgId = profile?.org_id
  const orgName = profile?.orgs?.name || ''

  return (
    <AuthContext.Provider value={{
      session, user: session?.user || null, profile, loading,
      signIn, signOut,
      isHQ, isAdmin, isAgency, orgId, orgName,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서 사용해야 합니다.')
  return ctx
}
