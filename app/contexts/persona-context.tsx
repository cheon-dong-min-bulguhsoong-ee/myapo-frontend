'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

type Persona = 'korean' | 'foreign' | null

interface PersonaContextType {
  persona: Persona
  setPersona: (p: Persona) => void
}

const PersonaContext = createContext<PersonaContextType>({ persona: null, setPersona: () => {} })

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>(() => {
    if (typeof window === 'undefined') return null
    const saved = localStorage.getItem('myapo_persona')
    return saved === 'korean' || saved === 'foreign' ? saved : null
  })

  const setPersona = (p: Persona) => {
    if (p) localStorage.setItem('myapo_persona', p)
    else localStorage.removeItem('myapo_persona')
    setPersonaState(p)
  }

  return <PersonaContext.Provider value={{ persona, setPersona }}>{children}</PersonaContext.Provider>
}

export const usePersona = () => useContext(PersonaContext)
