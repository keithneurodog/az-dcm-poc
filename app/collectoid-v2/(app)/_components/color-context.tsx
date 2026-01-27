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
  coral: {
    name: "Coral & Rose",
    from: "from-rose-500",
    to: "to-orange-400",
    bg: "from-rose-50",
    bgHover: "to-orange-50",
  },
  purple: {
    name: "Purple & Violet",
    from: "from-purple-500",
    to: "to-violet-400",
    bg: "from-purple-50",
    bgHover: "to-violet-50",
  },
  teal: {
    name: "Teal & Cyan",
    from: "from-teal-500",
    to: "to-cyan-400",
    bg: "from-teal-50",
    bgHover: "to-cyan-50",
  },
  blue: {
    name: "Blue & Indigo",
    from: "from-blue-500",
    to: "to-indigo-400",
    bg: "from-blue-50",
    bgHover: "to-indigo-50",
  },
  emerald: {
    name: "Emerald & Green",
    from: "from-emerald-500",
    to: "to-green-400",
    bg: "from-emerald-50",
    bgHover: "to-green-50",
  },
  amber: {
    name: "Amber & Yellow",
    from: "from-amber-500",
    to: "to-yellow-400",
    bg: "from-amber-50",
    bgHover: "to-yellow-50",
  },
  astrazeneca: {
    name: "AstraZeneca Brand",
    from: "from-[#830051]",
    to: "to-[#C084FC]",
    bg: "from-[#FDF2F8]",
    bgHover: "to-[#F3E8FF]",
  },
}

type ColorSchemeContextType = {
  scheme: ColorScheme
  schemeName: string
  setScheme: (name: string) => void
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(undefined)

export function ColorSchemeProvider({ children }: { children: ReactNode }) {
  const [schemeName, setSchemeName] = useState("coral")

  return (
    <ColorSchemeContext.Provider
      value={{
        scheme: colorSchemes[schemeName],
        schemeName,
        setScheme: setSchemeName,
      }}
    >
      {children}
    </ColorSchemeContext.Provider>
  )
}

export function useColorScheme() {
  const context = useContext(ColorSchemeContext)
  if (!context) {
    throw new Error("useColorScheme must be used within ColorSchemeProvider")
  }
  return context
}
