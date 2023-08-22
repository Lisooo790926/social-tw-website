import { useContext, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { stringifyBigInts } from '@unirep/utils'
import RichTextEditor from '../components/RichTextEditor'
import { SERVER } from '../config'
import { useUser } from '../contexts/User'

export default function PostCreate() {
    const { userState, provider, loadData, stateTransition} = useUser()

    const [content, setContent] = useState('')
    const [epkNonce, setEpkNonce] = useState('0')
    const [isPending, setIsPending] = useState(false)

    const navigate = useNavigate()

    const createPost = async () => {
        try {
            setIsPending(true)

            console.log(userState)

            if (!userState)
                throw new Error('user state not initialized')

            if (
                userState.sync.calcCurrentEpoch() !==
                (await userState.latestTransitionedEpoch())
            ) {
                throw new Error('Needs transition')
            }

            const epochKeyProof = await userState.genEpochKeyProof({
                nonce: Number(epkNonce),
            })
            console.log(epochKeyProof)
            const data = await fetch(`${SERVER}/api/post`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(
                    stringifyBigInts({
                        content,
                        publicSignals: epochKeyProof.publicSignals,
                        proof: epochKeyProof.proof,
                    })
                ),
            }).then((r) => r.json())
            await provider.waitForTransaction(data.transaction)
            await userState.waitForSync()
            await loadData(userState)
            toast('貼文成功送出')
            navigate('/')
        } catch (err: unknown) {
            console.log(err)
            toast((err as Error).message)
        } finally {
            setIsPending(false)
        }
    }

    const handleStateTransition = async () => {
        try {
            setIsPending(true)
            await stateTransition()
        } catch {
            toast('transition failed')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <main className="max-w-3xl py-6 mx-auto space-y-6">
            <section className="text-center">
                <h2 className="text-3xl">匿名的環境還需要你一起守護 🫶🏻</h2>
            </section>
            <section>
                <RichTextEditor value={content} onValueChange={setContent} />
            </section>
            <section className="w-full max-w-xs form-control">
                <label className="label">
                    <span className="label-text">Personas</span>
                </label>
                <select
                    className="select select-bordered select-primary"
                    value={epkNonce}
                    onChange={(e) => setEpkNonce(e.target.value)}
                >
                    <option value="0">0</option>
                    <option value="1">1</option>
                </select>
            </section>
            <section className="flex items-center justify-center gap-4">
                <Link to="/posts" className="btn btn-ghost">
                    取消
                </Link>
                <button
                    className="btn btn-primary"
                    disabled={isPending}
                    onClick={createPost}
                >
                    {isPending ? 'Pending...' : '發出貼文'}
                </button>
                <button
                    className="btn btn-primary"
                    disabled={isPending}
                    onClick={handleStateTransition}
                >
                    Transition
                </button>
            </section>
            <Toaster />
        </main>
    )
}
