use cosmwasm_std::Addr;
use schemars::JsonSchema;

use serde::{Deserialize, Serialize};

use crate::state::Card;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct InstantiateMsg {
    pub entropy: String,
    pub owner: Addr,
    pub admin:Addr,
    pub modify: bool,
  
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    Create { card: Card, index: u8 },
    Burn { index: u8 },
    GenerateViewingKey { index: u8,reciever:String },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub struct ViewingKeyResponse {
    pub viewing_key: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetCard {
        wallet: Addr,
        viewing_key: String,
        index: u8,
        owner:Addr
    },
}

// We define a custom struct for each query response
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct CardResponse {
    pub card: Card,
}
