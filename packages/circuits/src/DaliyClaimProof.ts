import { BaseProof, Circuit, Prover } from '@unirep/circuits'
import { Groth16Proof } from 'snarkjs'
import { UnirepSocialCircuit } from './types'

/**
 * Verify the voter identity for voting the report
 */
export class DailyClaimProof extends BaseProof {
    readonly output = {
        epoch_key: 0, 
        state_tree_root: 1, 
        control0: 2, 
        control1: 3 
    }

    readonly input = {
        daily_nullifier: 4
    }

    public dailyNullifier: bigint
    public epochKey: bigint
    public stateTreeRoot: bigint
    public control0: bigint
    public control1: bigint
    
    public revealNonce: bigint
    public attesterId: bigint
    public epoch: bigint
    public nonce: bigint
    public chainId: bigint
    public sigData: bigint

    constructor(
        publicSignals: (bigint | string)[],
        proof: Groth16Proof,
        prover?: Prover
    ) {
        super(publicSignals, proof, prover)
        ...
        this.circuit = UnirepSocialCircuit.dailyClaimProof as any as Circuit
    }
}
