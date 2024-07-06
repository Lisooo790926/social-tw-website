import { ReactComponent as BanIcon } from '@/assets/svg/ban.svg'
import { useDialog } from '@/features/shared'
import { FaTrashCan } from 'react-icons/fa6'
import {
    ActionMenuBottomSlide,
    ActionMenuBottomSlideItem,
    ActionMenuContainer,
    ActionMenuDropdown,
    ActionMenuDropdownItem,
    useActionMenu,
} from '../ActionMenu'
import CommentDeleteDialog from '../CommentDeleteDialog/CommentDeleteDialog'
import { CommentReportDialog } from './CommentReportDialog'

interface CommentActionMenuProps {
    commentId: string
    onDelete: () => void
    canDelete: boolean
    canReport: boolean
}

export function CommentActionMenu({
    commentId,
    onDelete,
    canDelete,
    canReport,
}: CommentActionMenuProps) {
    const {
        isOpen: isActionMenuOpen,
        onOpen: onActionMenuOpen,
        onClose: onActionMenuClose,
    } = useActionMenu()
    const {
        isOpen: isReportDialogOpen,
        onOpen: onReportDialogOpen,
        onClose: onReportDialogClose,
    } = useDialog()
    const {
        isOpen: isDeleteDialogOpen,
        onOpen: onDeleteDialogOpen,
        onClose: onDeleteDialogClose,
    } = useDialog()
    return (
        <ActionMenuContainer
            onOpen={onActionMenuOpen}
            onClose={onActionMenuClose}
        >
            <ActionMenuDropdown
                isOpen={isActionMenuOpen}
                onClose={onActionMenuClose}
            >
                <ActionMenuDropdownItem
                    icon={<FaTrashCan />}
                    name="刪除留言"
                    onClick={onDeleteDialogOpen}
                    disabled={!canDelete}
                />
                <ActionMenuDropdownItem
                    icon={<BanIcon />}
                    name="檢舉留言"
                    onClick={onReportDialogOpen}
                    disabled={!canReport}
                />
            </ActionMenuDropdown>
            <ActionMenuBottomSlide
                isOpen={isActionMenuOpen}
                onClose={onActionMenuClose}
            >
                <ActionMenuBottomSlideItem
                    icon={<FaTrashCan />}
                    name="刪除留言"
                    onClick={onDeleteDialogOpen}
                    disabled={!canDelete}
                />
                <ActionMenuBottomSlideItem
                    icon={<BanIcon />}
                    name="檢舉留言"
                    onClick={onReportDialogOpen}
                    disabled={!canReport}
                />
            </ActionMenuBottomSlide>
            <CommentReportDialog
                commentId={commentId}
                isOpen={isReportDialogOpen}
                onClose={onReportDialogClose}
            />
            <CommentDeleteDialog
                open={isDeleteDialogOpen}
                onClose={onDeleteDialogClose}
                onConfirm={onDelete}
            />
        </ActionMenuContainer>
    )
}
