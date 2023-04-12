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
let contractCodeHash="a0ad9e7ee9c3edb85a4d339e343410748fc50da72b23b0c8606ceb1a56d7094b";
let codeId=20728;
let contractAddress="secret1huqp8m4ma90kg0ptw554f0sw55zmz2ydr62jt0"
let instantiate_contract = async () => {
  // Create an instance of the Counter contract, providing a starting count
  try{

  const initMsg = { entropy: "this " };
  let tx = await secretjs.tx.compute.instantiateContract(
    {
      code_id: codeId,
      sender: wallet.address,
      code_hash: contractCodeHash,
      init_msg: initMsg,
      label: "Secret BUsiness card improve Demo V5" ,
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
          reciever:wallet.address
          
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




let viewing_key="api_key_NUrx0MwOtSOCHka6K0QPJXQysEPSJyyAVXEmNMsiiwc=";


let queryCard = async () => {
let business_card_query_tx=await secretjs.query.compute.queryContract({
	contract_address:contractAddress,
	query:{
		get_card:{
			wallet:wallet.address,
			viewing_key:viewing_key,
			index:1,
			
		},
		
	
	},
	code_hash:contractCodeHash,
	
});
console.log(business_card_query_tx);
  
};
queryCard();


//Get the codeInfo based on codeid
const codeInfo = await secretjs.query.compute.contractsByCodeId({code_id:"20622"});
//console.log(codeInfo)

// current doubts: viewing keys should be the owner to see the information, other people use the same key should not see the information ? ---- problem solve !

