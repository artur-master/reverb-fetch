Axios=require('axios');

async function getItemsInfo(listItem) {
  const response = await Axios.get(`https://www.ebay.com/b/${listItem}?LH_BIN=1&LH_ItemCondition=3000&LH_PrefLoc=3&mag=1&rt=nc&_sop=10`,
    {
      headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9"
      }
    });

  const regex = /<li class="s-item s-item--large s-item--bgcolored">(.*?)<\/li>/g;
  const arr = response.data.match(regex);
  
  const linkEx = /<a *[^>]+? class="s-item__link" *[^>]+?href="(.*?)">/g;

  const re = arr.map(element => {
    const link = Array.from(element.matchAll(linkEx), m => m[1]);    
    return link[0];
  });

  return re;
}

async function getItemDetails(link) {
  const linkEx = /https:\/\/www.ebay.com\/itm\/(\d*.?)/g;
  const itemNumber = Array.from(link.matchAll(linkEx), m => m[1])[0].replace('?', '');

  const response = await Axios.get(link,
    {
      headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9"
      }
    });
  const data = response.data.trim();

  const titleEx = /<h1 class="it-ttl" itemprop="name" id="itemTitle">(.*?)<\/h1>/g;
  const title = Array.from(data.matchAll(titleEx), m => m[1]);
  
  const priceEx = /<span class="notranslate"*[^>]+ id="prcIsum"*[^>]+ itemprop="price"*[^>]+ style="text-decoration:none"*[^>]+ content="(.*?)">/g;
  const price = Array.from(data.matchAll(priceEx), m => m[1]);

  const brandEx = /<span itemprop="brand" itemscope="itemscope" itemtype="http:\/\/schema.org\/Brand"><span itemprop="name">(.*?)<\/span><\/span>/g;
  const brand = Array.from(data.matchAll(brandEx), m => m[1]);
  
  const modelEx = /<span itemprop="model">(.*?)<\/span>/g;
  const model = Array.from(data.matchAll(modelEx), m => m[1]);
  
  const upcEx = /<span itemprop="gtin13">(.*?)<\/span>/g;
  const upc = Array.from(data.matchAll(upcEx), m => m[1]);

  const zipCode = '07052'
  const shippingResp = await Axios.get(`https://www.ebay.com/itm/getrates?item=${itemNumber}&country=1&zipCode=${zipCode}&co=0`);
  const shippingCost = shippingResp.data.freeShipping ?
    "Free Shipping":
    Array.from(shippingResp.data.shippingSummary.matchAll(/<span>(\$\d.*)?<\/span>/g), m => m[1])[0] || "";
    
  return {
    itemNumber: itemNumber,
    title: title[0].replace('<span class="g-hdn">Details about  &nbsp;</span>', ''),
    price: price[0],
    brand: brand[0] || "",
    model: model[0] || "",
    UPC: upc[0] || "",
    shippingCost: shippingCost.replace('$', '')
  }
}

getItemsInfo("Guitar-Effects-Pedals/181222").then(async (re) => {
  for(let i=0; i<10; i++){
    const details = await getItemDetails(re[i]);
    console.log(details);
  }
});
