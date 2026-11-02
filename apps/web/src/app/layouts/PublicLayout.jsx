import { useState } from 'react'
import { Outlet } from 'react-router'
import { Header } from '../../components/layout/Header'
import { Footer } from '../../components/layout/Footer'
import { MobileBottomBar } from '../../components/layout/MobileBottomBar'

export function PublicLayout() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50 pb-14 md:pb-0">
      <Header
        mobileDrawerOpen={mobileDrawerOpen}
        setMobileDrawerOpen={setMobileDrawerOpen}
        mobileSearchOpen={mobileSearchOpen}
        setMobileSearchOpen={setMobileSearchOpen}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-2.5 sm:px-6 lg:px-8 py-3.5 sm:py-5">
        <Outlet />
      </main>

      <Footer />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomBar
        onOpenMenu={() => setMobileDrawerOpen(true)}
        onToggleSearch={() => setMobileSearchOpen((prev) => !prev)}
      />
    </div>
  )
}

export default PublicLayout
