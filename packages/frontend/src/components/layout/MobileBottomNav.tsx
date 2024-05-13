import { motion } from 'framer-motion'
import React from 'react'
import { NavLink } from 'react-router-dom'
import AddIcon from '@/assets/add.svg'
import BellIcon from '@/assets/bell.svg'
import HomeIcon from '@/assets/home.svg'
import PersonCircleIcon from '@/assets/person-circle.svg'
import StarIcon from '@/assets/star.svg'
import SignupPendingTransition from '@/components/login/SignupPendingTransition'
import { useIsMutating } from '@tanstack/react-query'
import { MutationKeys } from '@/constants/queryKeys'

export default function MobileBottomNav() {
    const signingUpCount = useIsMutating({ mutationKey: [MutationKeys.Signup] })
    const isSigningUp = signingUpCount > 0

    const navVariants = {
        start: { y: 100 },
        end: {
            y: 0,
            transition: {
                delay: 0,
                duration: 1,
                ease: 'easeInOut',
            },
        },
    }

    return (
        <>
            {isSigningUp ? (
                <div className="fixed bottom-0 w-screen h-24">
                    <SignupPendingTransition />
                </div>
            ) : (
                <motion.nav
                    className="
                        fixed 
                        bottom-0 
                        w-screen 
                        h-20 
                        flex 
                        items-stretch 
                        rounded-t-3xl
                        bg-secondary/90
                        shadow-[0_0_20px_0_rgba(0,0,0,0.6)_inset"
                    variants={navVariants}
                    initial="start"
                    animate="end"
                >
                    <NavLink
                        className="flex items-center justify-center flex-1"
                        to="/"
                    >
                        <HomeIcon className="text-white w-14 h-14" />
                    </NavLink>
                    <NavLink
                        className="flex items-center justify-center flex-1"
                        to="/"
                    >
                        <StarIcon className="text-white w-14 h-14" />
                    </NavLink>
                    <div className="relative flex justify-center flex-1">
                        <NavLink
                            className="absolute flex items-center justify-center w-16 h-16 bg-white rounded-full bottom-8 drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
                            title="create a post"
                            to="/write-post"
                        >
                            <AddIcon className="w-8 h-8 text-secondary" />
                        </NavLink>
                    </div>
                    <NavLink
                        className="flex items-center justify-center flex-1"
                        to="/"
                    >
                        <BellIcon className="text-white w-14 h-14" />
                    </NavLink>
                    <NavLink
                        className="flex items-center justify-center flex-1"
                        to="/profile"
                    >
                        <PersonCircleIcon className="text-white w-14 h-14" />
                    </NavLink>
                </motion.nav>
            )}
        </>
    )
}
