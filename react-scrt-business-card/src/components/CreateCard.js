import { MsgExecuteContract } from "secretjs";


export default function CreateCard({
  card,
  setCard,
  viewingKey,
  setViewingKey,
  secretJs,
  myAddress,
}) {

  
  const codeId=20729;
  const contractCodeHash="8577aab4926b9a0fcb264c783ef25be728e0c0eba1811893569a8eb2421269a4";

  let formSubmitted = (e) => {
    e.preventDefault();
     setCard({
      name: e.target.elements.name.value,
      address: e.target.elements.address.value,
      number: e.target.elements.phone.value,
      index: parseInt(e.target.elements.cardNumber.value),
    });
    createCard(
      e.target.elements.name.value,
      e.target.elements.address.value,
      e.target.elements.phone.value,
      parseInt(e.target.elements.cardNumber.value)
    );

   
  };

  let createCard = async (name, address, phone, index) => {
    // your code to go here
    try{
    
    const init_msg = { entropy: "this " };
    let label="Secret BUsiness card improve Demo V9";
    
    
    // initiate contract
    
    /*
   let tx = await secretJs.tx.compute.instantiateContract(
    {
      code_id: codeId,
      sender: myAddress,
      code_hash: contractCodeHash,
      init_msg: init_msg,
      label: "Secret BUsiness card improve Demo V8 "+ Math.ceil(Math.random() * 10000) ,
    },
    {
      gasLimit: 400_000,
    }
  );
  
  let a = tx.arrayLog;
  let contractAddress=a.find(
    (log) => log.type === "message" && log.key === "contract_address"
  ).value;
  console.log(contractAddress);

  //Find the contract_address in the logs
  
  
  
    if (contractAddress.length >0){*/
    
     //execute create card
     const contractAddress="secret1vjd6sahlrf87eykmsg27u83t8rm8s4ew3wjh90";
     console.log(card['number']);
    	 const card_creation_tx = await secretJs.tx.compute.executeContract(
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
          index: card['number'],
        },
      },
      code_hash: contractCodeHash,
    },
    { gasLimit: 100_000 }
  );
  

  
    

  }
  
  catch(err){
  
  console.error(err);
  
  }
  
  };
createCard();

  return (
    <>
      <div className="pt-4 ml-6 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Create a Secret Business Card
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Create a Secret Business Card with customizable privacy.
              </p>
            </div>
          </div>
          <div className="mt-5 mr-2 md:col-span-2 md:mt-0">
            <form onSubmit={formSubmitted}>
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
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

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="card-number"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        id="cardNumber"
                        autoComplete="card number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
