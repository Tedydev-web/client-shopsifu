'use client'

import { Menu } from 'lucide-react'

type Props = {
  onClick: () => void
}

export const HamburgerButton = ({ onClick }: Props) => (
  <button onClick={onClick} className="fixed top-20 left-4 z-20 p-2 text-gray-900 hover:text-primary md:hidden">
    <Menu className="w-6 h-6" />
  </button>
)
