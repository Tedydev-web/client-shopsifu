'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

type PaymentData = any

interface ShopsifuSocketContextType {
  isConnected: boolean
  payments: PaymentData[]
}

const ShopsifuSocketContext = createContext<ShopsifuSocketContextType>({
  isConnected: false,
  payments: [],
})

export const useShopsifuSocket = () => useContext(ShopsifuSocketContext)

export const ShopsifuSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [payments, setPayments] = useState<PaymentData[]>([])

  useEffect(() => {
    const newSocket = io('https://api.shopsifu.live/payment', {
      transports: ['websocket'],
      // auth: { token: 'your_token' }, // nếu backend yêu cầu
    })

    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('🟢 Connected')
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('🔴 Disconnected')
      setIsConnected(false)
    })

    newSocket.on('payment', (data: PaymentData) => {
      console.log('📨 Payment event:', data)
      setPayments((prev) => [...prev, data])
    })

    newSocket.on('connect_error', (err) => {
      console.error('❌ Connection error:', err.message)
    })
    
    return () => {
      newSocket.disconnect()
    }
  }, [])

  return (
    <ShopsifuSocketContext.Provider value={{ isConnected, payments }}>
      {children}
    </ShopsifuSocketContext.Provider>
  )
}
