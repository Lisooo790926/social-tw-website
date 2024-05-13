import './styles/main.css'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PATHS } from './constants/paths'
import AppLayout from './layouts/AppLayout'
import BaseLayout from './layouts/BaseLayout'
import OnboardingLayout from './layouts/OnboardingLayout'
import CreatePost from './pages/CreatePost'
import ErrorPage from './pages/ErrorPage'
import Home from './pages/Home'
import { Login } from './pages/Login'
import { InternalLogin } from './pages/Login/InternalLogin'
import { History } from './pages/Profile/History'
import Profile from './pages/Profile/Profile'
import ProfileLayout from './pages/Profile/ProfileLayout'
import { Reputation } from './pages/Profile/Reputation'
import { Signup } from './pages/Signup'
import { InternalSignup } from './pages/Signup/InternalSignup'
import { Welcome } from './pages/Welcome'
import PostDetails from './pages/PostDetails'
import TwitterCallback from './pages/Login/TwitterCallback'
import ProtectedRoute from './components/ProtectedRoute'

dayjs.extend(relativeTime)

const router = createBrowserRouter([
    {
        element: <OnboardingLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: PATHS.WELCOME,
                element: <Welcome />,
            },
            {
                path: PATHS.LOGIN,
                element: <Login />,
            },
            {
                path: PATHS.TWITTER_CALLBACK,
                element: <TwitterCallback />,
            },
            {
                path: `${PATHS.LOGIN_INTERNAL}/:selectedSignupMethod`,
                element: <InternalLogin />,
            },
            {
                path: PATHS.SIGN_UP,
                element: <Signup />,
            },
            {
                path: PATHS.SIGN_UP_INTERNAL,
                element: <InternalSignup />,
            },
        ],
    },
    {
        element: (
            <ProtectedRoute>
                <BaseLayout />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                element: <AppLayout />,
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: PATHS.HOME,
                        element: <Home />,
                    },
                    {
                        path: PATHS.VIEW_POST,
                        element: (
                            <ProtectedRoute>
                                <PostDetails />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: 'profile',
                        element: <ProfileLayout />,
                        children: [
                            {
                                path: '',
                                element: (
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                ),
                            },
                            {
                                path: 'reputation',
                                element: (
                                    <ProtectedRoute>
                                        <Reputation />
                                    </ProtectedRoute>
                                ),
                            },
                            {
                                path: 'history',
                                element: (
                                    <ProtectedRoute>
                                        <History />
                                    </ProtectedRoute>
                                ),
                            },
                        ],
                    },
                ],
            },
            {
                path: PATHS.WRITE_POST,
                element: <CreatePost />,
            },
        ],
    },
])

const queryClient = new QueryClient()

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    )
}

const rootElement = document.getElementById('root')
if (rootElement) {
    const root = createRoot(rootElement)
    root.render(<App />)
}
