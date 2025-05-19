import Link from "next/link"
import { Bell } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="w-full border-b bg-beige">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-blue-600"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
          <span className="font-semibold text-blue-600">AP</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-accent_red">
            Find Papers
          </Link>
          <Link href="/chat" className="text-sm font-medium hover:text-accent_red">
            Chat
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-accent_red">
            About Us
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent_red"></span>
            <span className="sr-only">Notifications</span>
          </Button>
          <Avatar className="h-8 w-8 border">
            <AvatarFallback className="bg-blue-100 text-blue-800">RS</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
