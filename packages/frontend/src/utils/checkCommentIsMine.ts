import { RelayRawComment } from '@/types/Comments'
import { UserState } from '@unirep/core'

const checkCommentIsMine = (
    comment: Pick<RelayRawComment, 'epoch' | 'epochKey'>,
    userState: UserState,
) => {
    if (!userState.getEpochKeys(comment.epoch)) return false

    const epochKeys = userState.getEpochKeys(comment.epoch).toString()
    if (epochKeys.includes(comment.epochKey)) return true

    return false
}

export default checkCommentIsMine
