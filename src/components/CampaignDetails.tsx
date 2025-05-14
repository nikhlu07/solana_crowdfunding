import { truncateAddress } from '@/utils/helper'
import { Campaign } from '@/utils/interfaces'
import Link from 'next/link'
import React from 'react'
import {
  FaUserCircle,
  FaCoins,
  FaDollarSign,
  FaBell,
  FaRegCalendarAlt,
} from 'react-icons/fa'
import { motion } from 'framer-motion'

const CampaignDetails: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
  const goalReachedText = campaign.amountRaised >= campaign.goal ? 'Goal Reached!' : 'In Progress'
  const progressPercentage = (campaign.amountRaised / campaign.goal) * 100
  const statusText = campaign.active ? 'Active' : 'Ended'

  const CLUSTER_NAME = process.env.CLUSTER_NAME || 'custom'

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="md:col-span-2 bg-white rounded-2xl p-8 shadow-custom"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Campaign Details
      </h2>
      <p className="text-gray-600 leading-relaxed text-lg">{campaign?.description}</p>

      {/* Funding Progress */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaCoins className="text-primary" />
          Funding Progress
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-primary h-full rounded-full"
          />
        </div>
        <div className="mt-3 flex justify-between text-sm font-medium">
          <span className="text-primary">{campaign?.amountRaised.toLocaleString()} SOL raised</span>
          <span className="text-gray-600">{campaign?.goal.toLocaleString()} SOL goal</span>
        </div>
      </div>

      {/* Status Cards */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Campaign Status</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              campaign.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {statusText}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-500">Donations</p>
              <p className="text-xl font-bold text-gray-800">{campaign.donors}</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Withdrawals</p>
              <p className="text-xl font-bold text-gray-800">{campaign.withdrawals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Goal Status</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              campaign.amountRaised >= campaign.goal ? 'bg-primary/10 text-primary' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {goalReachedText}
            </span>
          </div>
          <div className="text-3xl font-bold text-primary">
            {progressPercentage.toFixed(1)}%
          </div>
          <p className="text-sm text-gray-500 mt-1">of goal reached</p>
        </div>
      </div>

      {/* Creator Info */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaUserCircle className="text-primary" />
              Creator
            </h3>
            <Link
              href={`https://explorer.solana.com/address/${campaign?.creator}?cluster=${CLUSTER_NAME}`}
              target="_blank"
              className="text-primary hover:text-primary-light transition-colors mt-1 inline-block"
            >
              {truncateAddress(campaign?.creator)}
            </Link>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 justify-end">
              <FaRegCalendarAlt className="text-primary" />
              Created
            </h3>
            <p className="text-gray-600 mt-1">
              {new Date(campaign.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CampaignDetails
