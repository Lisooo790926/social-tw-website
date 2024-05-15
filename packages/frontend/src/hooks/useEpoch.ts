import { useEffect, useMemo, useState } from 'react'
import { useUserState } from './useUserState'

const epochLength = 300

export function useEpoch() {
    const [epoch, setEpoch] = useState<number>()
    const [remainingTime, setRemainingTime] = useState<number>()

    const epochStartTime = useMemo(
        () =>
            epoch && remainingTime
                ? Date.now() / 1000 - (epochLength - remainingTime)
                : 0,
        [epoch, remainingTime],
    )
    const epochEndTime = useMemo(
        () => (epoch && remainingTime ? Date.now() / 1000 + remainingTime : 0),
        [epoch, remainingTime],
    )

    const { userState } = useUserState()

    useEffect(() => {
        if (!userState) return

        let timer: number
        function loadEpoch() {
            if (!userState) return

            const _remainingTime = userState.sync.calcEpochRemainingTime()
            const _epoch = userState.sync.calcCurrentEpoch()
            setEpoch(_epoch)
            setRemainingTime(_remainingTime)

            timer = window.setTimeout(loadEpoch, _remainingTime * 1000)
        }

        loadEpoch()

        return () => {
            clearTimeout(timer)
        }
    }, [userState])

    return {
        epochLength,
        epoch,
        epochStartTime,
        epochEndTime,
        remainingTime,
    }
}
