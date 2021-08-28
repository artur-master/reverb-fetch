Axios=require('axios');

const apiUrl = "https://api.reverb.com/api";

async function getPricingInfo(brand_name, model) {
  const response = await Axios.get(`${apiUrl}/csps/${brand_name}-${model}/transactions?per_page=10`,
    {
      headers: {
        "accept-language": "en",
        "accept-version": "3.0"
      }
    }
  )
  const allowTypes = ['Mint','Excellent','Very Good','Good','Fair','B-Stock'];
  const result = [];

  if(response.data) {
    response.data.transactions.forEach(transaction => {
      if(allowTypes.includes(transaction["condition"]))
        result.push(transaction["price_ask"]["amount"]);
    });
  }

  return result;
}

getPricingInfo("dwarfcraft-devices", "wizard-of-pitch").then(re => {
  console.log(re);
});
