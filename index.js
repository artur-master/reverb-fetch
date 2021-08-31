Axios=require('axios');

async function getPricingInfo(listItem) {
  const response = await Axios.get(`https://www.ebay.com/b/${listItem}?rt=nc&mag=1&LH_BIN=1&LH_ItemCondition=3000&LH_PrefLoc=3`,
    {
      headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9"
      }
    });

  const regex = /<li class=\"s-item s-item--large s-item--bgcolored\">(.*?)<\/li>/gi;
  const arr = response.data.match(regex);

  const titleEx = /<h3 class="s-item__title*[^>]+?">(.*?)<\/h3>/g;
  const priceEx = /<span class="s-item__price">\$(.*?)<\/span>/g;
  const shippingEx = /<span class="s-item__shipping s-item__logisticsCost">\$(.*)?( shipping)<\/span>/g;

  const re = arr.map(element => {
    const title = Array.from(element.matchAll(titleEx), m => m[1]);
    const price = Array.from(element.matchAll(priceEx), m => m[1]);
    const shipping = Array.from(element.matchAll(shippingEx), m => m[1]);

    return {
      title: title[0],
      price: price[0],
      shpping: shipping[0] || "Free"
    }
  });

  return re;
}

getPricingInfo("Guitar-Bass-Pedals/41411").then(re => {
  console.log(re);
});
