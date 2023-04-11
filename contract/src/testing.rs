use cosmwasm_std::{
    entry_point, to_binary, Addr, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError,
    StdResult,
};

use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use secret_toolkit::storage::{Item, Keymap,PrefixedStorage};
// use crate::error::ContractError;
use crate::msg::{CardResponse, ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{Card, CARD_VIEWING_KEY, ENTROPY, USER_CARDS};

use secret_toolkit::crypto::sha_256;
use secret_toolkit::crypto::Prng;


fn test_keymap_iter() -> StdResult<()> {
    let mut storage = PrefixedStorage::new(b"test", &mut MockStorage::new());

    let keymap: Keymap<Vec<u8>, Foo> = Keymap::new(b"test");
    let foo1 = Foo {
        string: "string one".to_string(),
        number: 1111,
    };
    let foo2 = Foo {
        string: "string two".to_string(),
        number: 1111,
    };

    keymap.insert(&mut storage, &b"key1".to_vec(), &foo1)?;
    keymap.insert(&mut storage, &b"key2".to_vec(), &foo2)?;

    let mut x = keymap.iter(&storage)?;
    let (len, _) = x.size_hint();
    assert_eq!(len, 2);

    assert_eq!(x.next().unwrap()?.1, foo1);

    assert_eq!(x.next().unwrap()?.1, foo2);

    Ok(())
}

// if want to do the testing by one rust file ; cargo run bin filename

fn main (){
	test_keymap_iter().unwrap();
	}
