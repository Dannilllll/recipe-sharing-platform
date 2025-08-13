'use client'

import { useState } from 'react'
import SignIn from './sign-in'
import SignUp from './sign-up'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signin' | 'signup'
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)

  if (!isOpen) return null

  const switchToSignUp = () => setMode('signup')
  const switchToSignIn = () => setMode('signin')

  return (
    <>
      {mode === 'signin' && (
        <SignIn
          onSwitchToSignUp={switchToSignUp}
          onClose={onClose}
        />
      )}
      {mode === 'signup' && (
        <SignUp
          onSwitchToSignIn={switchToSignIn}
          onClose={onClose}
        />
      )}
    </>
  )
}
