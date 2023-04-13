import { SecretNetworkClient, Wallet } from "secretjs";
import * as fs from "fs";

//replace with your wallet seed
const wallet = new Wallet("hawk loyal creek exotic stick steel inspire donkey zoo slow index student");
const wallet1 = new Wallet("empty creek remove toy nephew illness person omit drop fluid render drastic sorry rude dilemma announce magic suspect public inspire require jaguar broccoli trigger");

const contract_wasm = fs.readFileSync("../contract.wasm");

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-2",
  url: "https://api.pulsar.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});

//console.log(secretjs);

let upload_contract = async () => {
try{
  let tx = await secretjs.tx.compute.storeCode(
    {
      sender: wallet.address,
      wasm_byte_code: contract_wasm,
      source: "",
      builder: "",
    },
    {
      gasLimit: 4_000_000,
    }
  );

  const codeId = Number(
    tx.arrayLog.find((log) => log.type === "message" && log.key === "code_id")
      .value
  );

  console.log("codeId: ", codeId);

  const contractCodeHash = (
    await secretjs.query.compute.codeHashByCodeId({ code_id: codeId })
  ).code_hash;
  console.log(`Contract hash: ${contractCodeHash}`);
}
catch (err){

console.error(err);
}


};

//upload_contract();

let contractCodeHash="8577aab4926b9a0fcb264c783ef25be728e0c0eba1811893569a8eb2421269a4";
let codeId=20729;
let contractAddress="secret19ttj98gk3ylmdg5gzrlt38rdtgslgyhrrxqcg4"
let instantiate_contract = async (codeId,sender,contractCodeHash,init_msg,label) => {
  // Create an instance of the Counter contract, providing a starting count
  try{

  const initMsg = { entropy: "this " };
  let tx = await secretjs.tx.compute.instantiateContract(
    {
      code_id: codeId,
      sender: sender,
      code_hash: contractCodeHash,
      init_msg: init_msg,
      label: label ,
    },
    {
      gasLimit: 400_000,
    }
  );

  //Find the contract_address in the logs
  //let arraylog1=tx.arrayLog;
  const contractAddress = tx.arrayLog.find(
    (log) => log.type === "message" && log.key === "contract_address"
  ).value;
  
  
  


  console.log(contractAddress);
  }
  catch(err){
  console.error(err);
  }
};
//instantiate_contract();






let createCard = async () => {

  const card_creation_tx = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contract_address: contractAddress,
      msg: {
        create: {
          card: {
            name: "DElete me",
            address: "DElete me ",
            phone: "12345678953",
          },
          index: 1,
        },
      },
      code_hash: contractCodeHash,
    },
    { gasLimit: 100_000 }
  );

  console.log(card_creation_tx);
};
//createCard();


let burnContract = async () => {
  let burn_contract = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contract_address: contractAddress,
      msg: {
      burn:{
       index:1
       }
      },
      code_hash: contractCodeHash,
    },
    { gasLimit: 100_000 }
  );

  console.log(
    burn_contract.arrayLog
  );
};

//burnContract();


let createViewingKey = async () => {
  let viewing_key_creation = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contract_address: contractAddress,
      msg: {
        generate_viewing_key: {
          index: 1,
          reciever:wallet1.address
          
        },
      },
      code_hash: contractCodeHash,
    },
    { gasLimit: 100_000 }
  );

  console.log(
    viewing_key_creation.arrayLog
  );
};
//createViewingKey();

let deleteViewingKey =async () => {
  let viewing_key_delete = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contract_address: contractAddress,
      msg: {
        delete_key: {
         
          account:wallet1.address
          
        },
      },
      code_hash: contractCodeHash,
    },
    { gasLimit: 100_000 }
  );

  console.log(
    viewing_key_delete.arrayLog
  );
};


//deleteViewingKey();




let viewing_key="api_key_Uj0SCTkceMG+hoTVq8XkAoLZajaRdTf9t6q2/FmNRO4=";


let queryCard = async () => {
let business_card_query_tx=await secretjs.query.compute.queryContract({
	contract_address:contractAddress,
	query:{
		get_card:{
			wallet:wallet1.address,
			viewing_key:viewing_key,
			index:1,
			
		},
		
	
	},
	code_hash:contractCodeHash,
	
});
console.log(business_card_query_tx);
  
};
//queryCard();


let bankTransfer = async () => {
let bank_tx = await secretjs.tx.bank.send(
    {
      amount: [{ amount: "1000", denom: "uscrt" }],
      from_address: wallet.address,
      to_address: wallet1.address, // Set recipient to sender for testing
    },
    {
      gasLimit: 20_000,
      gasPriceInFeeDenom: 0.25,
      memo: "send tokens ",
    }
  );

  console.log("Transaction: ", bank_tx);
};

bankTransfer();



//Get the codeInfo based on codeid
const codeInfo = await secretjs.query.compute.contractsByCodeId({code_id:"20622"});
//console.log(codeInfo)

// current doubts: viewing keys should be the owner to see the information, other people use the same key should not see the information ? ---- problem solve !

