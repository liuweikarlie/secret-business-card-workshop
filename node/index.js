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
let contractCodeHash="bbc91b6010298e67f9f318a9c65f3a8a25863b60fb7fb5c9d11d9a72876df537";
let codeId=20689;
let contractAddress="secret1n5mt3u2n0vf8z4x7x6ztl0qdatyc5p8clnq9sh"
let instantiate_contract = async () => {
  // Create an instance of the Counter contract, providing a starting count
  try{
  console.log("initialized");
  const initMsg = { entropy: "this " };
  let tx = await secretjs.tx.compute.instantiateContract(
    {
      code_id: codeId,
      sender: wallet.address,
      code_hash: contractCodeHash,
      init_msg: initMsg,
      label: "Secret BUsiness card improve Demo V3" ,
    },
    {
      gasLimit: 400_000,
    }
  );

  //Find the contract_address in the logs
  let arraylog1=tx.arrayLog
  


  console.log(arraylog1);
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
            name: "Crd",
            address: "Codetredsfet",
            phone: "12345678953",
          },
          index: 0,
        },
      },
      code_hash: contractCodeHash,
    },
    { gasLimit: 100_000 }
  );

  console.log(card_creation_tx);
};
//createCard();

let createViewingKey = async () => {
  let viewing_key_creation = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contract_address: contractAddress,
      msg: {
        generate_viewing_key: {
          index: 0,
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




let viewing_key="dZoik9JALs9gQX4IUydQbwCQPoojy5acjWSLKPZOItI=";
//let viewing_key="KXHV3PcqLieJW0MMKUfn8J3pYi01YbGmrg7pmYwwdDg=";

let queryCard = async () => {
let business_card_query_tx=await secretjs.query.compute.queryContract({
	contract_address:contractAddress,
	query:{
		get_card:{
			wallet:wallet1.address,
			viewing_key:viewing_key,
			index:0,
			owner:wallet.address
		},
		
	
	},
	code_hash:contractCodeHash,
	
});
console.log(business_card_query_tx);
  
};
queryCard();

// current doubts: viewing keys should be the owner to see the information, other people use the same key should not see the information ? ---- problem solve !

