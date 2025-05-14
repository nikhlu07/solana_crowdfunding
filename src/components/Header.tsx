import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { FaUserCircle, FaPlusCircle, FaBars, FaTimes } from 'react-icons/fa'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { getProvider } from '@/services/blockchain'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  const { publicKey, sendTransaction, signTransaction } = useWallet()

  const program = useMemo(
    () => getProvider(publicKey, signTransaction, sendTransaction),
    [publicKey, signTransaction, sendTransaction]
  )

  useEffect(() => {
    setIsMounted(true)
    setIsOpen(false)
  }, [pathname])

  const navItems = program && publicKey ? [
    { href: '/account', icon: <FaUserCircle className="w-5 h-5" />, label: 'Account' },
    { href: '/create', icon: <FaPlusCircle className="w-5 h-5" />, label: 'Create' },
  ] : []

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed w-full top-0 z-50 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-lg border-b border-cyan-500/20 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="relative group">
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            PulseFund
          </h1>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full group-hover:shadow-glow" />
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 
                ${pathname === item.href 
                  ? 'text-cyan-400 bg-cyan-500/10 shadow-glow' 
                  : 'text-gray-300 hover:text-cyan-400 hover:bg-gray-700/50 hover:shadow-glow'
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          
          {isMounted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <WalletMultiButton 
                className="!bg-gradient-to-r !from-cyan-500 !to-purple-500 hover:!from-cyan-600 hover:!to-purple-600 !rounded-xl !py-2 !px-6 !text-white !font-medium !transition-all !duration-300 !shadow-lg hover:!shadow-glow"
              />
            </motion.div>
          )}
        </nav>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden w-12 h-12 flex items-center justify-center rounded-xl text-gray-300 hover:bg-gray-700/50 transition-all duration-200"
        >
          {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-gray-900/95 border-t border-cyan-500/20"
          >
            <div className="container mx-auto px-6 py-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-xl text-sm font-medium transition-all duration-300
                    ${pathname === item.href 
                      ? 'text-cyan-400 bg-cyan-500/10 shadow-glow' 
                      : 'text-gray-300 hover:text-cyan-400 hover:bg-gray-700/50 hover:shadow-glow'
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {isMounted && (
                <WalletMultiButton 
                  className="!bg-gradient-to-r !from-cyan-500 !to-purple-500 hover:!from-cyan-600 hover:!to-purple-600 !rounded-xl !py-3 !w-full !text-white !font-medium !transition-all !duration-300 !shadow-lg hover:!shadow-glow"
                />
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}