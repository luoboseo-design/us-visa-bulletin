import React from 'react'
import { AlertCircle, XCircle, CheckCircle, Info } from 'lucide-react'

interface AlertProps {
  type: 'error' | 'warning' | 'success' | 'info'
  title?: string
  message: string
  onClose?: () => void
  className?: string
}

export function Alert({ type, title, message, onClose, className = '' }: AlertProps) {
  const typeConfig = {
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-400',
      Icon: XCircle
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-400',
      Icon: AlertCircle
    },
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-400',
      Icon: CheckCircle
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400',
      Icon: Info
    }
  }

  const config = typeConfig[type]
  const { Icon } = config

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 ${className}`}>
      <div className="flex">
        <Icon className={`${config.iconColor} w-5 h-5 flex-shrink-0 mt-0.5`} />
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`${config.textColor} text-sm font-medium mb-1`}>
              {title}
            </h3>
          )}
          <div className={`${config.textColor} text-sm`}>
            {message}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${config.iconColor} hover:opacity-75 ml-2`}
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
