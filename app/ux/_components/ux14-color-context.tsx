"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type ColorScheme = {
  name: string
  from: string
  to: string
  bg: string
  bgHover: string
}

export const colorSchemes: Record<string, ColorScheme> = {
  garden: {
    name: "Garden",
    from: "from-emerald-500",
    to: "to-teal-500",
    bg: "from-emerald-50",
    bgHover: "to-teal-50",
  },
  lavender: {
    name: "Lavender Fields",
    from: "from-purple-400",
    to: "to-violet-400",
    bg: "from-purple-50",
    bgHover: "to-violet-50",
  },
  forest: {
    name: "Forest",
    from: "from-green-600",
    to: "to-emerald-600",
    bg: "from-green-50",
    bgHover: "to-emerald-50",
  },
  sky: {
    name: "Sky",
    from: "from-blue-400",
    to: "to-cyan-400",
    bg: "from-blue-50",
    bgHover: "to-cyan-50",
  },
  sunset: {
    name: "Sunset",
    from: "from-orange-400",
    to: "to-pink-400",
    bg: "from-orange-50",
    bgHover: "to-pink-50",
  },
  earth: {
    name: "Earth",
    from: "from-amber-600",
    to: "to-orange-600",
    bg: "from-amber-50",
    bgHover: "to-orange-50",
  },
  astrazeneca: {
    name: "AstraZeneca",
    from: "from-[#830051]",
    to: "to-[#F0AB00]",
    bg: "from-[#FDF2F8]",
    bgHover: "to-[#FEF3C7]",
  },
}

type ColorSchemeContextType = {
  scheme: ColorScheme
  schemeName: string
  setScheme: (name: string) => void
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(undefined)

export function ColorSchemeProvider({ children }: { children: ReactNode }) {
  const [schemeName, setSchemeName] = useState("garden")

  const value = {
    scheme: colorSchemes[schemeName],
    schemeName,
    setScheme: setSchemeName,
  }

  return (
    <ColorSchemeContext.Provider value={value}>
      {children}
    </ColorSchemeContext.Provider>
  )
}

export function useColorScheme() {
  const context = useContext(ColorSchemeContext)
  if (context === undefined) {
    throw new Error("useColorScheme must be used within ColorSchemeProvider")
  }
  return context
}
