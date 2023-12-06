import { RiLogoutBoxRLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { CyanButton } from '../../../components/buttons/CyanButton'

// TODO: update the icon
export const HistoryButton = () => {
    const navigate = useNavigate()
    const handleLogout = () => {
        navigate('/profile/history')
    }
    return (
        <CyanButton
            isLoading={false}
            onClick={handleLogout}
            title="歷史紀錄"
            icon={RiLogoutBoxRLine}
            start={true}
            text="lg"
            iconSize={24}
        />
    )
}
