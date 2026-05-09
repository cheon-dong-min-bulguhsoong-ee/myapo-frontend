'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Persona = 'korean' | 'foreign' | null

interface PersonaContextType {
  persona: Persona
  setPersona: (p: Persona) => void
}

const PersonaContext = createContext<PersonaContextType>({ persona: null, setPersona: () => {} })

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>(null)

  useEffect(() => {
    const saved = localStorage.getItem('myapo_persona')
    if (saved === 'korean' || saved === 'foreign') setPersonaState(saved)
  }, [])

  const setPersona = (p: Persona) => {
    if (p) localStorage.setItem('myapo_persona', p)
    else localStorage.removeItem('myapo_persona')
    setPersonaState(p)
  }

  return <PersonaContext.Provider value={{ persona, setPersona }}>{children}</PersonaContext.Provider>
}

export const usePersona = () => useContext(PersonaContext)
