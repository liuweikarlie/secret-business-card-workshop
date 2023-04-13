import React, { useState, useEffect } from "react";
const { SecretNetworkClient } = require("secretjs");

const DENOM = 'SCRT';
const MINIMAL_DENOM = 'uscrt';


const CHAIN_NAME = 'online Testnet';  //Anything you want
const GRPCWEB_URL = 'https://grpc.pulsar.scrttestnet.com';
const LCD_URL = 'https://api.pulsar.scrttestnet.com';
const RPC_URL = 'https://rpc.pulsar.scrttestnet.com';
const CHAIN_ID = "pulsar-2";
export default function App() {
  const contractCodeHash="8577aab4926b9a0fcb264c783ef25be728e0c0eba1811893569a8eb2421269a4";
  const codeId=20729;
  const [myAddress, setMyAddress] = useState("");
  const [balance, setBalance] = useState();
  const [keplrReady, setKeplrReady] = useState(false);
  const [secretjs,setSecretjs]=useState();
  const [contractAddress,setContractAddress ]=useState("");
  let [card,setCard]=useState([
    {
      name: "",
      address: "",
      phone: "",
      index: "",
    }
  ]);
  const [wordshow,setWorshow]=useState("");
  const [showpermit,setShowpermit]=useState("");
  const contrastAddress='secret12pl08d7ku4wacrdkagvyynmhsx73zj60dennct';
  
  const upload =async(event)=>{
 
  	event.preventDefault();
  	console.log("upload start");
  	//const wordInformation=event.target.elements.wordInformation.value;
  	setCard({
	      name: event.target.elements.name.value,
	      address: event.target.elements.address.value,
	      phone: event.target.elements.phone.value,
	      index: 1,
	    });
  	console.log(card);
  	
  	try{
  	  const initMsg = { entropy: "this " };
  	  console.log("upload start 1");
	  let tx = await secretjs.tx.compute.instantiateContract(
	    {
	      code_id: codeId,
	      sender: myAddress,
	      code_hash: contractCodeHash,
	      init_msg: initMsg,
	      label: "Secret BUsiness card improve Demo V6" +Math.ceil(Math.random() * 10000),
	    },
	    {
	      gasLimit: 400_000,
	    }
	  );
	  
	   let contractAddress1 = tx.arrayLog.find(
    (log) => log.type === "message" && log.key === "contract_address"
  ).value;
  console.log(`contractAddress=${contractAddress}`);
  setContractAddress(contractAddress=>contractAddress1);
  
  	
  	
  	const card_creation_tx = await secretjs.tx.compute.executeContract(
    {
      sender: myAddress,
      contract_address: contractAddress,
      msg: {
        create: {
          card: {
            name: card['name'],
            address: card['address'],
            phone: card['phone'],
          },
          index: card['index'],
        },
      },
      code_hash: contractCodeHash,
    },
    { gasLimit: 100_000 }
  );

  console.log(card_creation_tx);
}    
   
    
    catch (e){
  		console.error(e);
  	}
    
  	
  	
  
  };
  
  
/*
  const permitrequest=async(event)=>{
  	const contractaddress=event.target.elements.contractnumber.value
  
  	let permit=await secretjs.utils.accessControl.permit.sign(
  		myAddress,
  		CHAIN_ID,
  		"test",
  		[contractaddress],
  		["owner","balance"].

  	);
  	
  	console.log("it have the request and give the permit");
  	let querypermit={
  		"with_permit":permit
  	}
  	const outputinformation=await secretjs.query.compute.queryCOntract({
  		contract_address:contractaddress,
  		code_hash:contractCodeHash,
  		query:querypermit
  	
  	
  	});
  	
  	console.log(outputinformation.word);
  	setShowpermit(showpermit=>outputinformation.word);
  	
  	
  	
  
  
  
  };*/

  useEffect(() => {

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const getKeplr = async () => {

      // Wait for Keplr to be injected to the page
      while (
        !window.keplr &&
        !window.getOfflineSigner &&
        !window.getEnigmaUtils
      ) {
        await sleep(10);
      }


      await window.keplr.experimentalSuggestChain({
        chainId: CHAIN_ID,
        chainName: CHAIN_NAME,
        rpc: RPC_URL,
        rest: LCD_URL,
        bip44: {
          coinType: 529,
        },
        coinType: 529,
        stakeCurrency: {
          coinDenom: DENOM,
          coinMinimalDenom: MINIMAL_DENOM,
          coinDecimals: 6,
        },
        bech32Config: {
          bech32PrefixAccAddr: "secret",
          bech32PrefixAccPub: "secretpub",
          bech32PrefixValAddr: "secretvaloper",
          bech32PrefixValPub: "secretvaloperpub",
          bech32PrefixConsAddr: "secretvalcons",
          bech32PrefixConsPub: "secretvalconspub",
        },
        currencies: [
          {
            coinDenom: DENOM,
            coinMinimalDenom: MINIMAL_DENOM,
            coinDecimals: 6,
          },
        ],
        feeCurrencies: [
          {
            coinDenom: DENOM,
            coinMinimalDenom: MINIMAL_DENOM,
            coinDecimals: 6,
          },
        ],
        gasPriceStep: {
          low: 0.1,
          average: 0.25,
          high: 0.4,
        },
        features: ["secretwasm"],
      });

 
      await window.keplr.enable(CHAIN_ID);


      const keplrOfflineSigner = window.getOfflineSignerOnlyAmino(CHAIN_ID);

      const [{ address: myAddress }] = await keplrOfflineSigner.getAccounts();
      
   
      
      const secretjs = new SecretNetworkClient({
	  chainId: "pulsar-2",
	  url: "https://api.pulsar.scrttestnet.com",
	  wallet: keplrOfflineSigner,
	  walletAddress: myAddress,
	});
	
      const {
        balance: { amount },
      } = await secretjs.query.bank.balance(
        {
          address: myAddress,
          denom: MINIMAL_DENOM,
        }
      );
      setBalance(new Intl.NumberFormat("en-US", {}).format(amount / 1e6))

      setKeplrReady(true);
      setMyAddress(myAddress);
      
    }
      getKeplr();
      
    return () => {};
  }, []);
  

  return (
    <div className="App">
      <h1>Secret Dapp</h1>

      {!keplrReady ? 
          <h1>Waiting for Keplr wallet integration...</h1>
      : 
        <div>
          <p>
            <strong>My Address:</strong> {myAddress}
          </p>
          <p>
            <strong>Balance:</strong> {balance} SCRT
          </p>
          <form onSubmit={upload}>
           <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="given-name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        autoComplete="address"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                     <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        autoComplete="phone"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
          <input type="submit" value="Submit" />
          </form>
         
        </div>
      }
      </div>
  );
}
