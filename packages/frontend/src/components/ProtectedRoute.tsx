import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStatus } from '@/hooks/useAuthStatus/useAuthStatus'
import { PATHS } from '@/constants/paths'
import { useIsFirstRender } from '@uidotdev/usehooks'

type ProtectedRouterProps = {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouterProps) {
    const isFirstRender = useIsFirstRender()

    const navigate = useNavigate()

    const { isLoggedIn, isLoggingIn } = useAuthStatus()

    useEffect(() => {
        if (isFirstRender || isLoggingIn) {
            return
        }
        if (!isLoggedIn) {
            navigate(PATHS.WELCOME)
        }
    }, [isFirstRender, isLoggedIn, isLoggingIn, navigate])

    if (isLoggingIn) {
        return null
    }

    return <>{children}</>
}
