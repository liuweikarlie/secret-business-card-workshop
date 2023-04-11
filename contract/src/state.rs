use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use secret_toolkit::storage::{Item, Keymap};
use cosmwasm_std::{Addr};

pub static CONFIG_KEY: &[u8] = b"config";

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]

pub struct Card {
    pub name: String,
    pub address: String,
    pub phone: String,
}

pub static USER_CARDS: Keymap<u8, Card> = Keymap::new(b"user cards");

pub static CARD_VIEWING_KEY: Keymap<u8, String> = Keymap::new(b"card viewing key");

pub static ENTROPY: Item<String> = Item::new(b"entropy");
pub static OWNER: Item<Addr> = Item::new(b"owner");
pub static ADMIN: Item<Addr> = Item::new(b"admin");
pub static MODIFY: Item<bool> = Item::new(b"modify");
