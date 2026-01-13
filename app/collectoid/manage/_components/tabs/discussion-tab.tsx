// app/collectoid/manage/_components/tabs/discussion-tab.tsx
"use client"

import { useCollection } from "../collection-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useColorScheme } from "@/app/collectoid/_components"
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Lightbulb,
} from "lucide-react"

const TYPE_CONFIG = {
  comment: { icon: User, color: "bg-neutral-100" },
  system: { icon: Bot, color: "bg-blue-50" },
  suggestion: { icon: Lightbulb, color: "bg-amber-50" },
}

export function DiscussionTab() {
  const { scheme } = useColorScheme()
  const { collection } = useCollection()

  if (!collection) return null

  const comments = collection.comments || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-light text-neutral-900">Discussion</h2>
        <p className="text-sm font-light text-neutral-500">
          Collaborate with others on this collection
        </p>
      </div>

      {/* Comment input */}
      <Card className="border-neutral-200 rounded-xl">
        <CardContent className="py-4">
          <Textarea
            placeholder="Add a comment or question..."
            className="min-h-[80px] resize-none border-neutral-200 font-light text-sm"
          />
          <div className="flex justify-end mt-3">
            <Button
              className={cn("rounded-full font-light bg-gradient-to-r text-white", scheme.from, scheme.to)}
            >
              <Send className="size-4 mr-2" strokeWidth={1.5} />
              Post Comment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments list */}
      {comments.length === 0 ? (
        <Card className="border-neutral-200 rounded-xl border-dashed">
          <CardContent className="py-12 text-center">
            <MessageSquare className="size-12 text-neutral-300 mx-auto mb-4" strokeWidth={1} />
            <h3 className="text-lg font-light text-neutral-600 mb-2">No comments yet</h3>
            <p className="text-sm font-light text-neutral-500">
              Start a discussion about this collection.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => {
            const config = TYPE_CONFIG[comment.type]
            const Icon = config.icon

            return (
              <Card key={comment.id} className={cn("border-neutral-200 rounded-xl", config.color)}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div className={cn("size-8 rounded-full flex items-center justify-center shrink-0", comment.type === "system" ? "bg-blue-100" : "bg-neutral-200")}>
                      <Icon className="size-4 text-neutral-600" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-normal text-neutral-900">{comment.authorName}</span>
                        <span className="text-xs font-light text-neutral-400">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-light text-neutral-600">{comment.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
