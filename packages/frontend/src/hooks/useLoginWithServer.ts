import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/User'
import { LocalStorageHelper } from '../utils/LocalStorageHelper'

export function useLoginWithServer() {
    const navigate = useNavigate()
    const { createUserState, setIsLogin, setErrorCode } = useUser()
    const loginWithServer = async () => {
        try {
            await createUserState()
            setIsLogin('success')
            LocalStorageHelper.removeIsTwitterVerified()
            navigate('/')
        } catch (error: any) {
            setErrorCode(error.message)
        }
    }
    return loginWithServer
}
