import React, { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { FaDollarSign, FaDonate, FaEdit, FaTrashAlt } from 'react-icons/fa'
import { Campaign } from '@/utils/interfaces'
import { toast } from 'react-toastify'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  donateToCampaign,
  fetchAllDonations,
  fetchCampaignDetails,
  getProvider,
} from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'

const CampaignDonate: React.FC<{ campaign: Campaign; pda: string }> = ({
  campaign,
  pda,
}) => {
  const { publicKey, sendTransaction, signTransaction } = useWallet()
  const [amount, setAmount] = useState('')
  const { setWithdrawModal, setDelModal } = globalActions
  const dispatch = useDispatch()

  const program = useMemo(
    () => getProvider(publicKey, signTransaction, sendTransaction),
    [publicKey, signTransaction, sendTransaction]
  )

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (Number(amount) + campaign.amountRaised > campaign.goal) {
      return toast.warn('Amount exceeds campaign goal')
    }

    if (!publicKey) return toast.warn('Please connect wallet')

    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          const tx: any = await donateToCampaign(
            program!,
            publicKey!,
            pda!,
            Number(amount)
          )

          setAmount('')
          await fetchCampaignDetails(program!, pda)
          await fetchAllDonations(program!, pda)
          resolve(tx)
        } catch (error) {
          reject(error)
        }
      }),
      {
        pending: 'Processing donation...',
        success: 'Thank you for your donation! 🎉',
        error: 'Transaction failed 😔',
      }
    )
  }

  const remainingAmount = campaign.goal - campaign.amountRaised

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-8 shadow-custom"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <FaDonate className="text-primary text-2xl" />
        Support this Campaign
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="donationAmount"
            className="block text-gray-700 font-medium mb-2"
          >
            Donation Amount (SOL)
          </label>
          <div className="relative">
            <input
              type="text"
              name="donationAmount"
              placeholder={`${remainingAmount.toFixed(2)} SOL remaining`}
              value={amount}
              onChange={(e) => {
                const value = e.target.value
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                  setAmount(value)
                }
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              min="1"
              required
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              SOL
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={
            !amount ||
            !campaign.active ||
            campaign.amountRaised >= campaign.goal
          }
          className={`w-full bg-primary hover:bg-primary-light ${
            !amount ||
            !campaign.active ||
            campaign.amountRaised >= campaign.goal
              ? 'opacity-50 cursor-not-allowed'
              : ''
          } text-white font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200`}
        >
          <FaDonate className="text-xl" />
          Donate {amount ? `${amount} SOL` : 'Now'}
        </motion.button>
      </form>

      {publicKey && campaign.creator === publicKey.toBase58() && (
        <div className="mt-8 grid grid-cols-3 gap-3">
          <Link
            href={`/campaign/edit/${pda}`}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 font-medium"
          >
            <FaEdit />
            Edit
          </Link>
          
          {campaign.active && (
            <button
              type="button"
              onClick={() => dispatch(setDelModal('scale-100'))}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 font-medium"
            >
              <FaTrashAlt />
              Delete
            </button>
          )}

          <button
            onClick={() => dispatch(setWithdrawModal('scale-100'))}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 font-medium"
          >
            <FaDollarSign />
            Payout
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default CampaignDonate
