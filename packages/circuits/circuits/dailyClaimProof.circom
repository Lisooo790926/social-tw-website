pragma circom 2.1.0;

include "../../../node_modules/@unirep/circuits/circuits/circomlib/circuits/reputation.circom";

template DailyClaimProof(STATE_TREE_DEPTH, EPOCH_KEY_NONCE_PER_EPOCH, SUM_FIELD_COUNT, FIELD_COUNT, REPL_NONCE_BITS) {
    // Identity and daily epoch
    signal input identity_secret;
    signal input daily_epoch; // should be changed daily
    signal input daily_nullifier; 

    // Global state tree
    signal input state_tree_indices[STATE_TREE_DEPTH];
    signal input state_tree_elements[STATE_TREE_DEPTH];
    signal input data[FIELD_COUNT];
    
    // Epoch key
    signal input reveal_nonce;
    signal input attester_id;
    signal input epoch;
    signal input nonce;
    signal input chain_id;
    signal input sig_data;

    // reputation proof output
    signal output epoch_key;
    signal output state_tree_root;
    signal output control[2];

    // Reputation proof parameters
    // skip below checking
    var PROVE_GRAFFITI = 0;
    var GRAFFITI = 0;
    var MAX_REP = 0;
    var PROVE_MAX_REP = 0;
    var PROVE_ZERO_REP = 0;
    var PROVE_GRAFFITI = 0;
    // only enable min reputation checking
    var ZERO_MIN_REP = 1;
    var ENABLE_PROVE_MIN_REP = 1;

    // Step 1. Check reputation circuit and Check reputation >= 1
    (epoch_key, state_tree_root, control[2]) <== Reputation(STATE_TREE_DEPTH, EPOCH_KEY_NONCE_PER_EPOCH, SUM_FIELD_COUNT, FIELD_COUNT, REPL_NONCE_BITS)(
        identity_secret, 
        state_tree_indices,
        state_tree_elements,
        data, 
        PROVE_GRAFFITI, 
        GRAFFITI, 
        reveal_nonce, 
        attester_id, 
        daily_epoch, 
        nonce, 
        chain_id, 
        ZERO_MIN_REP, 
        MAX_REP, 
        ENABLE_PROVE_MIN_REP, 
        PROVE_MAX_REP, 
        PROVE_ZERO_REP,
        sig_data
    );

    // Step 2: check daily nullifier
    daily_nullifier === Poseidon(2)([identity_secret, daily_epoch]);
}