module message_board_addr::message_board {
    use std::signer;
    use aptos_framework::object::{Self, ExtendRef};
    use aptos_framework::string::String;

    /// Errors
    const ENOT_OWNER: u64 = 1;
    const EMESSAGE_NOT_FOUND: u64 = 2;

    struct Message has key {
        string_content: String,
    }

    const BOARD_OBJECT_SEED: vector<u8> = b"message_board";

    struct BoardObjectController has key {
        extend_ref: ExtendRef,
    }

    fun init_module(sender: &signer) {
        let constructor_ref = &object::create_named_object(sender, BOARD_OBJECT_SEED);
        let board_signer = object::generate_signer(constructor_ref);
        move_to(&board_signer, BoardObjectController {
            extend_ref: object::generate_extend_ref(constructor_ref),
        });
    }

    public entry fun post_message(
        _sender: &signer,
        new_string_content: String,
    ) acquires Message, BoardObjectController {
        let board_addr = get_board_obj_address();
        if (!exists<Message>(board_addr)) {
            let board_obj_signer = get_board_obj_signer();
            move_to(&board_obj_signer, Message {
                string_content: new_string_content,
            });
        } else {
            let message = borrow_global_mut<Message>(board_addr);
            message.string_content = new_string_content;
        }
    }

    #[view]
    public fun exist_message(): bool {
        exists<Message>(get_board_obj_address())
    }

    #[view]
    public fun get_message_content(): (String) acquires Message {
        let message = borrow_global<Message>(get_board_obj_address());
        message.string_content
    }

    fun get_board_obj_address(): address {
        object::create_object_address(&@message_board_addr, BOARD_OBJECT_SEED)
    }

    fun get_board_obj_signer(): signer acquires BoardObjectController {
        object::generate_signer_for_extending(&borrow_global<BoardObjectController>(get_board_obj_address()).extend_ref)
    }

    #[test_only]
    public fun init_module_for_test(sender: &signer) {
        init_module(sender);
    }
}
