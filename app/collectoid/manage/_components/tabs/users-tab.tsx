// app/collectoid/manage/_components/tabs/users-tab.tsx
"use client"

import { useCollection } from "../collection-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useColorScheme } from "@/app/collectoid/_components"
import {
  Users,
  Plus,
  CheckCircle2,
  XCircle,
  GraduationCap,
  FileSignature,
} from "lucide-react"

export function UsersTab() {
  const { scheme } = useColorScheme()
  const { collection } = useCollection()

  if (!collection) return null

  const users = collection.users || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-light text-neutral-900">User Access</h2>
          <p className="text-sm font-light text-neutral-500">
            Define who can access this collection
          </p>
        </div>
        <Button
          className={cn("rounded-full font-light bg-gradient-to-r text-white", scheme.from, scheme.to)}
        >
          <Plus className="size-4 mr-2" strokeWidth={1.5} />
          Add Role / Users
        </Button>
      </div>

      {/* Role-based access info */}
      <Card className="border-neutral-200 rounded-xl bg-neutral-50">
        <CardContent className="py-4">
          <p className="text-sm font-light text-neutral-600">
            <span className="font-normal">Tip:</span> Define access by role for simpler management.
            You can also add specific individuals if needed.
          </p>
        </CardContent>
      </Card>

      {/* Empty state or user list */}
      {users.length === 0 ? (
        <Card className="border-neutral-200 rounded-xl border-dashed">
          <CardContent className="py-12 text-center">
            <Users className="size-12 text-neutral-300 mx-auto mb-4" strokeWidth={1} />
            <h3 className="text-lg font-light text-neutral-600 mb-2">No users defined</h3>
            <p className="text-sm font-light text-neutral-500 mb-4">
              Add roles or individual users who should have access to this collection.
            </p>
            <Button
              className={cn("rounded-full font-light bg-gradient-to-r text-white", scheme.from, scheme.to)}
            >
              <Plus className="size-4 mr-2" strokeWidth={1.5} />
              Define User Access
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id} className="border-neutral-200 rounded-xl">
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("size-10 rounded-full flex items-center justify-center text-white text-sm font-medium bg-gradient-to-br", scheme.from, scheme.to)}>
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="text-sm font-normal text-neutral-900">{user.name}</h3>
                      <p className="text-xs font-light text-neutral-500">
                        {user.department} · {user.role.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-light text-xs",
                        user.trainingComplete ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      )}
                    >
                      <GraduationCap className="size-3 mr-1" strokeWidth={1.5} />
                      {user.trainingComplete ? "Training Complete" : "Training Required"}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-light text-xs",
                        user.agreementSigned ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      )}
                    >
                      <FileSignature className="size-3 mr-1" strokeWidth={1.5} />
                      {user.agreementSigned ? "Agreement Signed" : "Needs Signature"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
