import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'
import { motion, HTMLMotionProps } from 'framer-motion'
import React from 'react'

const buttonStyles = cva(
  'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/20',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-light shadow-sm',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
        ghost: 'text-primary hover:bg-primary/10',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
        success: 'bg-green-500 text-white hover:bg-green-600 shadow-sm',
      },
      size: {
        sm: 'text-sm px-4 py-2',
        default: 'text-base px-6 py-3',
        lg: 'text-lg px-8 py-4',
        icon: 'p-2',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      fullWidth: false,
    },
  }
)

interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, keyof VariantProps<typeof buttonStyles>>,
    VariantProps<typeof buttonStyles> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    loading,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        className={twMerge(
          buttonStyles({ variant, size, fullWidth }),
          loading && 'opacity-70 cursor-wait',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg 
            className="animate-spin h-5 w-5"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'