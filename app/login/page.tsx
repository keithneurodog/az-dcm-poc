"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, AlertCircle, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        router.push("/")
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || "Authentication failed")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-neutral-200 rounded-2xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-neutral-100">
              <Lock className="size-7 text-neutral-600" strokeWidth={1.5} />
            </div>
          </div>
          <CardTitle className="text-2xl font-extralight text-neutral-900">
            Collectoid POC
          </CardTitle>
          <CardDescription className="font-light">
            Enter the password to access this prototype
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="font-light text-neutral-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="rounded-xl border-neutral-200 focus:border-neutral-400"
                autoFocus
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-light">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-full font-light"
              disabled={isLoading || !password}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Access Prototype"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-neutral-100 text-center">
            <p className="text-xs font-light text-neutral-500">
              AstraZeneca - Internal Prototype
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
