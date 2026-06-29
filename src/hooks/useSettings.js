import { useState, useEffect } from 'react'
import { api } from '@/utils/api'

let cachedSettings = null
let listeners = []

const emitChange = () => {
  listeners.forEach(listener => listener(cachedSettings))
}

export function useSettings() {
  const [settings, setSettings] = useState(cachedSettings)
  const [loading, setLoading] = useState(!cachedSettings)

  useEffect(() => {
    const listener = (newSettings) => {
      setSettings(newSettings)
      setLoading(false)
    }
    listeners.push(listener)

    if (!cachedSettings) {
      api.get('/api/settings')
        .then(res => {
          const data = res.data || res
          cachedSettings = data
          emitChange()
        })
        .catch(err => {
          console.error('Failed to load settings:', err)
          setLoading(false)
        })
    }

    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }, [])

  const updateSettingsLocally = (newSettings) => {
    cachedSettings = newSettings
    emitChange()
  }

  const refreshSettings = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/settings')
      const data = res.data || res
      cachedSettings = data
      emitChange()
    } catch (err) {
      console.error('Failed to refresh settings:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    settings: settings || {
      shopName: 'Style Inverse @Jeshuvesre',
      whatsapp: '+917993466185',
      phone: '+917993466185',
      address: '42, Marine Drive, South Mumbai, Maharashtra - 400020',
      instagram: 'https://instagram.com/style_inverse',
      facebook: 'https://facebook.com/style_inverse',
      logo: '',
      bannerImages: ''
    },
    loading,
    refreshSettings,
    updateSettingsLocally
  }
}
