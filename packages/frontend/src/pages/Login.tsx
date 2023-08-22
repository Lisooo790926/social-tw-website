import React, { useContext, useEffect, useState } from 'react'
import AuthForm from '../components/login/AuthForm'
import { motion } from 'framer-motion'
import DemoPostList from '../components/login/DemoPostList'
import { clsx } from 'clsx'
import { useSearchParams } from 'react-router-dom'
import { IoChevronBack } from 'react-icons/io5'

const Login: React.FC = () => {
    const [searchParams] = useSearchParams()
    const hashUserId = searchParams.get('code')
    const [method, setMethod] = useState('')

    const basicVarients = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: 'easeInOut',
            },
        },
    }

    const textVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delay: 0.5,
                duration: 0.5,
                ease: 'easeInOut',
            },
        },
    }

    const postListVariants = {
        start: { y: 700 },
        end: {
            y: 0,
            transition: {
                delay: 1,
                duration: 1,
                ease: 'easeInOut',
            },
        },
    }

    return (
        <div className='flex flex-col h-full items-center'>
            <div className={clsx(
                `z-40 h-full flex flex-col w-11/12`,
                method === 'signup' ? 'gap-12' : 'justify-between'
            )}>
                <div className={clsx(`flex flex-col gap-12`, method === 'signup' && 'sm:flex hidden')}>
                    <div
                        className='pt-24 flex items-center flex-col justify-center'
                    >
                        <motion.img
                            src={require('../../public/unirep_logo_white.png')}
                            alt='UniRep Logo'
                            className='w-[120px] mb-2'
                            variants={basicVarients}
                            initial='hidden'
                            animate='visible'
                        />
                        <motion.h1
                            className='text-2xl font-semibold text-neutral-200'
                            variants={textVariants}
                            initial='hidden'
                            animate='visible'
                        >
                            Unirep Social TW
                        </motion.h1>
                        <motion.h2
                            className='text-sm font-light tracking-wider text-center text-white mt-9'
                            variants={textVariants}
                            initial='hidden'
                            animate='visible'
                        >
                            嗨 🙌🏻 歡迎來到 Unirep Social TW <br />
                            提供你 100% 匿名身份、安全發言的社群！
                        </motion.h2>
                    </div>
                    {method === 'signup' &&
                        <motion.div
                            className='flex justify-center'
                            variants={textVariants}
                            initial='hidden'
                            animate='visible'
                        >
                            <div className='flex w-[80px] flex-col justify-center items-center gap-2'>
                                <div
                                    className={clsx(`
                                    text-white 
                                    w-[60px] 
                                    h-[60px] 
                                    flex 
                                    items-center 
                                    justify-center 
                                    font-semibold 
                                    bg-[#FF892A] 
                                    rounded-full 
                                    text-[30px]
                                    `,
                                        hashUserId && 'border-[5px] border-white'
                                    )}
                                >1</div>
                                <div className='text-white text-sm flex flex-col justify-center items-center tracking-wide'>
                                    <span>Twitter</span>
                                    <span>帳號登入</span>
                                </div>
                            </div>
                            <div className='w-[50px] mb-10 flex justify-between items-center'>
                                <span className='bg-[#FF892A] h-1 w-1'></span>
                                <span className='bg-[#FF892A] h-1 w-2'></span>
                                <span className='bg-[#FF892A] h-1 w-2'></span>
                                <span className='bg-[#FF892A] h-1 w-1'></span>
                            </div>
                            <div
                                className={clsx(
                                    `flex w-[80px] flex-col justify-center items-center gap-2`,
                                    !hashUserId && 'opacity-30'
                                )}>
                                <div
                                    className='
                                    text-white 
                                    w-[60px] 
                                    h-[60px] 
                                    flex 
                                    items-center 
                                    justify-center 
                                    font-semibold 
                                    bg-[#FF892A] 
                                    rounded-full 
                                    text-[30px]
                                    '
                                >2</div>
                                <div className='text-white text-sm flex flex-col justify-center items-center tracking-wide'>
                                    <span>錢包註冊</span>
                                    <span>Or 直接註冊</span>
                                </div>
                            </div>
                        </motion.div>
                    }
                </div>
                {method === 'signup' &&
                <>
                    <div className='absolute top-7 bg-[#E8ECF4] p-3 sm:px-4 sm:py-2 rounded-lg cursor-pointer flex justify-center items-center'>
                        <IoChevronBack 
                            size={16} 
                            onClick={() => setMethod('')}    
                        />
                        <span className='sm:block hidden mx-2 text-sm font-bold'>回到註冊頁</span>
                    </div>
                    <div className='sm:hidden flex flex-col text-white font-semibold text-2xl tracking-wider mt-40'>
                        <p>歡迎回到</p>
                        <p>Unirep Social TW！</p>
                        {hashUserId && <p>再一步即可完成登入</p>}
                    </div>
                </>
                }
                <AuthForm
                    hashUserId={hashUserId}
                    method={method}
                    onSignup={() => setMethod('signup')}
                    onLogin={() => setMethod('login')}
                />
            </div>
            {method === ''
                &&
                <motion.div
                    className='fixed inset-0 z-30 overflow-y-none mt-[220px]'
                    variants={postListVariants}
                    initial='start'
                    animate='end'
                >

                    <DemoPostList />
                </motion.div>
            }
        </div>
    )
}

export default Login
