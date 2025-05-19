import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t bg-beige py-6">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Academic Paper Search. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="text-sm text-gray-500 hover:underline underline-offset-4">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-gray-500 hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="/contact" className="text-sm text-gray-500 hover:underline underline-offset-4">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
