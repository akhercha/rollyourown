use starknet::ContractAddress;

#[derive(Component, Copy, Drop, Serde)]
struct Name {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    short_string: felt252,
}
