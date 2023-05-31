/* eslint-disable array-callback-return */
import axios from 'axios';

export const auth = async () => {
  const body = {
    "username": "khanmuhammadahmed12345@gmail.com",
    "password": "TestingDev123!",
    "code": "string"
  }
  const res = await axios.post('https://launch.tcap.dev/api/ui/auth', body, {
    headers: {
      'Content-Type': 'application/json',
      'X-RequestScope': 60,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    }
  }).catch((e) => alert(e))

  const tokenn = res.data.token
  return tokenn
}

export const getWholesalerId = async (t) => {
  const res = await axios.get('https://launch.tcap.dev/api/ui/WholesalerNavigationList',{ 
      headers: {
        'Content-Type': 'application/json',
        'X-RequestScope': 60,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        'Authorization': `Bearer ${ t }`
      }
    }).catch((e) => alert(e))
    const wholesalerID = res.data[0].wholesalerBillingSettings.wholesalerID
    return wholesalerID
}

export const getNumblockList = async (t) => {
  const wholesalerID = await getWholesalerId(t)
  const res = await axios.get(`https://launch.tcap.dev/api/ui/NumberBlocks/${wholesalerID}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-RequestScope': 60,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      'Authorization': `Bearer ${ t }`
    }
  }).catch((e) => alert(e))
  const list = res.data
  const list2 = []
  await list.map((item, key) => {
    if(item.companyID === null){
      list2.push({
        key: key,
        id: item.id,
        companyID: item.companyID,
        partnerID: item.partnerID,
        wholesalerID: item.wholesalerID,
        carrierID: item.carrierID,
        inboundCarrierID: item.inboundCarrierID,
        outboundCarrierID: item.outboundCarrierID,
        company: item.company,
        blockSize: item.blockSize,
        firstNumber: item.first,
        lastNumber: item.last,
        inboundCarrier: item.inboundCarrier,
        outboundCarrier: item.outboundCarrier,
      })
    }
  })
  return list2
}