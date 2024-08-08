import { BaseProof, Prover } from '@unirep/circuits'
import { Groth16Proof } from 'snarkjs'

export class ReportIdentityProof extends BaseProof {
    public reportNullifier: bigint
    public attesterId: bigint
    public epoch: bigint
    public stateTreeRoot: bigint

    constructor(
        publicSignals: (bigint | string)[],
        proof: Groth16Proof,
        prover?: Prover
    ) {
        super(publicSignals, proof, prover)
        this.reportNullifier = this.publicSignals[0]
        this.attesterId = this.publicSignals[1]
        this.epoch = this.publicSignals[2]
        this.stateTreeRoot = this.publicSignals[3]
        ;(this as any).circuit = 'reportIdentityProof'
    }
}
