import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom'
import OnboardingLayout from './onboarding/layout'
import LoginPage from './onboarding/login/page'
import LoginInternalPage from './onboarding/login/internal/page'
import SignupPage from './onboarding/signup/page'
import SignupInternalPage from './onboarding/signup/internal/page'
import WelcomePage from './welcome/page'
import TwitterCallbackPage from './twitter/callback/page'
import RootLayout from './root/layout'
import PostListPage from './root/posts/page'
import PostPage from './root/posts/[id]/page'
import ProfileLayout from './root/profile/layout'
import ProfilePage from './root/profile/page'
import HistoryPage from './root/profile/history/page'
import ReputationPage from './root/profile/reputation/page'
import FullScreenLayout from './full-screen/layout'
import WritePostPage from './full-screen/write-post/page'
import { ProtectedRoute } from '@/features/auth'
import { ErrorBoundary, ResetStorage } from '@/features/shared'
import { PATHS } from '@/constants/paths'

const router = createBrowserRouter([
    {
        path: PATHS.WELCOME,
        element: <WelcomePage />,
    },
    {
        path: PATHS.TWITTER_CALLBACK,
        element: <TwitterCallbackPage />,
    },
    {
        element: <OnboardingLayout />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                path: PATHS.LOGIN,
                element: <LoginPage />,
            },
            {
                path: `${PATHS.LOGIN_INTERNAL}/:selectedSignupMethod`,
                element: <LoginInternalPage />,
            },
            {
                path: PATHS.SIGN_UP,
                element: <SignupPage />,
            },
            {
                path: PATHS.SIGN_UP_INTERNAL,
                element: <SignupInternalPage />,
            },
        ],
    },
    {
        element: (
            <ProtectedRoute>
                <RootLayout />
            </ProtectedRoute>
        ),
        errorElement: <ResetStorage />,
        children: [
            {
                path: PATHS.HOME,
                element: <PostListPage />,
            },
            {
                path: PATHS.VIEW_POST,
                element: <PostPage />,
            },
            {
                element: <ProfileLayout />,
                children: [
                    {
                        path: PATHS.PROFILE,
                        element: <ProfilePage />,
                    },
                    {
                        path: PATHS.REPUTATION,
                        element: <ReputationPage />,
                    },
                    {
                        path: PATHS.HISTORTY,
                        element: <HistoryPage />,
                    },
                ],
            },
        ],
    },
    {
        element: <FullScreenLayout />,
        children: [
            {
                path: PATHS.WRITE_POST,
                element: (
                    <ProtectedRoute>
                        <WritePostPage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: '/explore',
        loader: () => {
            return redirect(PATHS.HOME)
        },
    },
    {
        path: '/notification',
        loader: () => {
            return redirect(PATHS.HOME)
        },
    },
])

export default function Router() {
    return <RouterProvider router={router} />
}
