import { getCluster, truncateAddress } from '@/utils/helper'
import { Transaction } from '@/utils/interfaces'
import Link from 'next/link'
import React from 'react'
import { FaMoneyBillWave, FaExternalLinkAlt } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const DonationsList: React.FC<{ donations: Transaction[] }> = ({
  donations,
}) => {
  const CLUSTER: string = process.env.NEXT_PUBLIC_CLUSTER || 'localhost'
  const CLUSTER_NAME = getCluster(CLUSTER)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 bg-white rounded-2xl p-6 shadow-custom"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <FaMoneyBillWave className="text-primary text-2xl" />
        Recent Donations
      </h2>

      <AnimatePresence>
        {donations.length > 0 ? (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="divide-y divide-gray-100"
          >
            {donations.map((donation, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FaMoneyBillWave className="text-primary" />
                  </div>
                  <div>
                    <Link
                      href={`https://explorer.solana.com/address/${donation.owner}?cluster=${CLUSTER_NAME}`}
                      target="_blank"
                      className="text-gray-900 font-medium hover:text-primary transition-colors flex items-center gap-2"
                    >
                      {truncateAddress(donation.owner)}
                      <FaExternalLinkAlt className="text-xs opacity-50" />
                    </Link>
                    <p className="text-sm text-gray-500">
                      {new Date(donation.timestamp).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="ml-13 sm:ml-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    {donation.amount.toLocaleString()} SOL
                  </span>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="text-gray-500">No donations received yet</p>
            <p className="text-sm text-gray-400 mt-1">Be the first to support this campaign!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default DonationsList
