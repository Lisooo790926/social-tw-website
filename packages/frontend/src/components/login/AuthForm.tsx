import React, { useContext, useEffect, useState } from 'react'
import { BsTwitter } from 'react-icons/bs'
import LoginButton from './LoginButton'
import { motion } from 'framer-motion'
import { SERVER } from '../../config'
import useTwitterVerify from '../../hooks/useTwitterVerify'
import useSignUpWithWallet from '../../hooks/useSignupWithWallet'
import useSignupWithServer from '../../hooks/useSignupWithServer'
import { observer } from 'mobx-react-lite'
import { useNavigate, useSearchParams } from 'react-router-dom'
import NoteModal from '../modal/NoteModal'
import { GrFormClose } from 'react-icons/gr'
import { useUser } from '../../contexts/User'

// TODO: Twitter auto login: when user has login twitter but haven't signed up
// TODO: twitter login form is ugly
const AuthForm: React.FC = ( 
) => {
    const [searchParams] = useSearchParams()
    const hashUserId = searchParams.get('code')
    const navigate = useNavigate()
    const { setIsSignupLoading, isSignupLoading, handleServerSignMessage, handleWalletSignMessage, load, signup } = useUser()
    const [noteStatus, setNoteStatus] = useState('close')
    const twitterVerify = useTwitterVerify(SERVER)
    const signupWithWallet = useSignUpWithWallet(navigate, setIsSignupLoading, handleWalletSignMessage, load, signup)
    const signupWithServer = useSignupWithServer(navigate, setIsSignupLoading, handleServerSignMessage, load, signup)

    const authVarients = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delay: 2,
                duration: 1,
                ease: "easeInOut",
            },
        },
    }

    return (
        <>
            <motion.div
                className="md:pb-28 pb-8 min-w-[300px] w-full flex flex-col justify-center items-center gap-6 "
                variants={authVarients}
                initial="hidden"
                animate="visible"
            >
                {hashUserId ? 
                (
                    <>
                        <LoginButton
                            isLoading={isSignupLoading}
                            icon={BsTwitter}
                            onClick={signupWithWallet}
                            title='錢包註冊'
                            subTitle='使用 MetaMask 錢包進行登入'
                            color='#2F9CAF'
                            text='MetaMask 錢包'
                            setNoteStatus={() => setNoteStatus('metamask')}
                        />
                        <LoginButton
                            isLoading={isSignupLoading}
                            icon={BsTwitter}
                            onClick={signupWithServer}
                            title='直接註冊'
                            subTitle='沒有錢包嗎? 沒關係! 可以直接使用 Server 註冊'
                            color='#DB7622'
                            text='Server 註冊'
                            setNoteStatus={() => setNoteStatus('server')}
                        />
                    </>
                )
                :
                (
                    <>
                        <LoginButton
                            isLoading={isSignupLoading}
                            icon={BsTwitter}
                            onClick={twitterVerify}
                            title='立即註冊'
                            subTitle='加入我們的匿名討論行列!'
                            color='#2F9CAF'
                        />
                    </>
                )
                }
            </motion.div>
            <NoteModal 
                icon={GrFormClose}
                noteStatus={noteStatus}
                onClose={() => setNoteStatus('close')}
            />
        </>
    )
}

export default AuthForm 

