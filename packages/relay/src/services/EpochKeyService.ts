import { EpochKeyProof, EpochKeyLiteProof } from '@unirep/circuits'
import { UnirepSocialSynchronizer } from '../synchornizer'
import { SnarkProof } from '@unirep/utils'
import { ethers } from 'ethers'
import ABI from '@unirep-app/contracts/abi/UnirepApp.json'
import { APP_ADDRESS, LOAD_POST_COUNT } from '../config'
import TransactionManager from '../singletons/TransactionManager'
import { InternalError } from '../types/InternalError'

class EpochKeyService {
    async getAndVerifyProof(
        publicSignals: (bigint | string)[],
        proof: SnarkProof,
        synchronizer: UnirepSocialSynchronizer
    ): Promise<EpochKeyProof> {
        // verify epochKeyProof of user
        const epochKeyProof = new EpochKeyProof(
            publicSignals,
            proof,
            synchronizer.prover
        )

        // get current epoch and unirep contract
        const epoch = await synchronizer.loadCurrentEpoch()

        // check if epoch is valid
        const isEpochvalid = epochKeyProof.epoch.toString() === epoch.toString()
        if (!isEpochvalid) {
            throw new InternalError('Invalid Epoch', 400)
        }

        // check if state tree exists in current epoch
        const isStateTreeValid = await synchronizer.stateTreeRootExists(
            epochKeyProof.stateTreeRoot,
            Number(epochKeyProof.epoch),
            epochKeyProof.attesterId
        )
        if (!isStateTreeValid) {
            throw new InternalError('Invalid State Tree', 400)
        }

        // check if proof is valid
        const isProofValid = await epochKeyProof.verify()
        if (!isProofValid) {
            throw new InternalError('Invalid proof', 400)
        }

        return epochKeyProof
    }

    async getAndVerifyLiteProof(
        publicSignals: (bigint | string)[],
        proof: SnarkProof,
        synchronizer: UnirepSocialSynchronizer,
        originalEpochKey: String
    ): Promise<EpochKeyLiteProof> {
        const epochKeyLiteProof = new EpochKeyLiteProof(
            publicSignals,
            proof,
            synchronizer.prover
        )

        if (originalEpochKey != epochKeyLiteProof.epochKey.toString()) {
            throw new InternalError('Invalid epoch key', 400)
        }

        const isProofValid = await epochKeyLiteProof.verify()
        if (!isProofValid) {
            throw new InternalError('Invalid proof', 400)
        }

        return epochKeyLiteProof
    }

    // TODO move this to other service?
    async callContract(
        functionSignature: string, // 'leaveComment' for example
        args: any[]
    ): Promise<string> {
        const appContract = new ethers.Contract(APP_ADDRESS, ABI)
        const calldata = appContract.interface.encodeFunctionData(
            functionSignature,
            [...args]
        )
        const hash = await TransactionManager.queueTransaction(
            APP_ADDRESS,
            calldata
        )

        return hash
    }
}

export const epochKeyService = new EpochKeyService()
