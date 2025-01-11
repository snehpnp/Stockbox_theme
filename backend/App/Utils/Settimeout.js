const db = require("../Models");
const open_position_excute = db.open_position_excute;

var axios = require('axios');
const Clients_Modal = db.Clients;
const Signal_Modal = db.Signal;
const Stock_Modal = db.Stock;
const Order_Modal = db.Order;

const {orderexit} = require('../Controllers/Aliceblue')
const {orderexitangle} = require('../Controllers/Angle')
const {orderexitkotakneo} = require('../Controllers/Kotakneo')
const {orderexitmarkethub} = require('../Controllers/Markethub')



async function run() {
  try {

    const exitOpentrade = async () => {
    
      try {
       
        let openPosition = await open_position_excute.find().toArray();

        
        if (openPosition.length > 0) {
          for (const item of openPosition) {
           await ExitplaceOrder(item)
          
          }

        } else {
          return
        }

      } catch (error) {
        // console.log("Error in Open Position", error);
      }

    }

    while (true) {
      // Delay for 1000 milliseconds (1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));
      await exitOpentrade();
    }


  } catch (error) {
    // console.log(error);
  }
}

async function ExitplaceOrder(item) {
  if(item.borkerid==1)
    {
      orderexitangle(item)
    }
  else if(item.borkerid==2)
  {
    orderexit(item)
  }
  else if(item.borkerid==3)
  {
      orderexitkotakneo(item)
  }
  else if(item.borkerid==4)
  {
     orderexitmarkethub(item)
  }
  
}



run().catch