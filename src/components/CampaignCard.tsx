import { Campaign } from '@/utils/interfaces'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaCoins, FaUsers } from 'react-icons/fa'
import { motion } from 'framer-motion'

const CampaignCard: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
  const progressPercentage = Math.min(
    (campaign.amountRaised / campaign.goal) * 100,
    100
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="max-w-sm bg-white rounded-2xl shadow-custom overflow-hidden"
    >
      <div className="relative">
        <Image
          src={campaign.imageUrl}
          alt={`${campaign.title} campaign`}
          width={300}
          height={150}
          className="w-full h-52 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-primary font-semibold text-sm">
            {campaign.goal} SOL Goal
          </span>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {campaign.title}
        </h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {campaign.description}
        </p>

        <div className="space-y-4">
          <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute h-full bg-primary rounded-full"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1.5 rounded-full">
              <FaCoins className="text-primary" />
              <span className="text-primary font-medium">
                {campaign.amountRaised} SOL
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-full">
              <FaUsers className="text-gray-600" />
              <span className="text-gray-700 font-medium">
                {campaign.donors} Donors
              </span>
            </div>
          </div>

          <Link
            href={`/campaign/${campaign.publicKey}`}
            className="block w-full bg-primary hover:bg-primary-light text-white font-medium py-3 px-4 rounded-xl text-center transition-all duration-200"
          >
            View Campaign
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default CampaignCard
