import { useEffect } from 'react'

interface GoogleAdsenseProps {
  adSlot: string
  adFormat?: string
  fullWidth?: boolean
  className?: string
}

export function GoogleAdsense({ 
  adSlot, 
  adFormat = 'auto', 
  fullWidth = false,
  className = '' 
}: GoogleAdsenseProps) {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle as any[]).push({})
      }
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  if (!adSlot) {
    return null
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9067966629125338"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidth ? 'true' : 'false'}
      />
    </div>
  )
}

export function AdSenseScript() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9067966629125338'
    script.async = true
    script.crossOrigin = 'anonymous'
    document.head.appendChild(script)

    return () => {
      try {
        document.head.removeChild(script)
      } catch (err) {
        // Script might have been removed already
      }
    }
  }, [])

  return null
}

// 声明全局类型
declare global {
  interface Window {
    adsbygoogle: any[]
  }
}
