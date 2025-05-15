module message_board_addr::escrow {
    use std::signer;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::timestamp;
    use aptos_framework::aptos_coin::AptosCoin;

    /// Errors
    const ENOT_ENOUGH_BALANCE: u64 = 1;
    const ENOT_CONTRACTOR: u64 = 2;
    const ENOT_CLIENT: u64 = 3;
    const EESCROW_NOT_FOUND: u64 = 4;
    const EESCROW_EXPIRED: u64 = 5;
    const EESCROW_NOT_APPROVED: u64 = 6;

    struct Escrow has key {
        client: address,
        contractor: address,
        amount: u64,
        duration_hours: u64,
        start_time: u64,
        client_approved: bool,
        contractor_approved: bool,
        claimed_amount: u64,
        coins: Coin<AptosCoin>,
    }

    public entry fun create_escrow(
        client: &signer,
        contractor: address,
        amount: u64,
        duration_hours: u64,
    ) {
        let client_addr = signer::address_of(client);
        
        // Transfer coins from client to the escrow
        let coins = coin::withdraw<AptosCoin>(client, amount);
        
        // Create escrow
        move_to(client, Escrow {
            client: client_addr,
            contractor,
            amount,
            duration_hours,
            start_time: timestamp::now_seconds(),
            client_approved: false,
            contractor_approved: false,
            claimed_amount: 0,
            coins,
        });
    }

    public entry fun claim(
        contractor: &signer,
    ) acquires Escrow {
        let contractor_addr = signer::address_of(contractor);
        let escrow = borrow_global_mut<Escrow>(contractor_addr);
        
        assert!(escrow.contractor == contractor_addr, ENOT_CONTRACTOR);
        assert!(escrow.client_approved, EESCROW_NOT_APPROVED);
        
        let current_time = timestamp::now_seconds();
        let elapsed_hours = (current_time - escrow.start_time) / 3600;
        assert!(elapsed_hours >= escrow.duration_hours, EESCROW_EXPIRED);
        
        let claimable_amount = escrow.amount - escrow.claimed_amount;
        escrow.claimed_amount = escrow.amount;
        
        // Transfer remaining coins to contractor
        let coins = coin::extract(&mut escrow.coins, claimable_amount);
        coin::deposit(contractor_addr, coins);
    }

    public entry fun approve_continue_client(
        client: &signer,
    ) acquires Escrow {
        let client_addr = signer::address_of(client);
        let escrow = borrow_global_mut<Escrow>(client_addr);
        
        assert!(escrow.client == client_addr, ENOT_CLIENT);
        escrow.client_approved = true;
    }

    public entry fun approve_continue_contractor(
        contractor: &signer,
    ) acquires Escrow {
        let contractor_addr = signer::address_of(contractor);
        let escrow = borrow_global_mut<Escrow>(contractor_addr);
        
        assert!(escrow.contractor == contractor_addr, ENOT_CONTRACTOR);
        escrow.contractor_approved = true;
    }

    #[view]
    public fun get_escrow_details(account: address): (address, address, u64, u64, u64, bool, bool, u64) acquires Escrow {
        let escrow = borrow_global<Escrow>(account);
        (
            escrow.client,
            escrow.contractor,
            escrow.amount,
            escrow.duration_hours,
            escrow.start_time,
            escrow.client_approved,
            escrow.contractor_approved,
            escrow.claimed_amount
        )
    }
} 