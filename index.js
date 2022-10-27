import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()

app.use(cors())

const getRestaurant = async (lat, long) => {
    const res = await axios.get(`https://api.tomtom.com/search/2/nearbySearch/.json?key=CgaqrXudPI7DboNNXuw87icNGeSdctCR&lat=${lat}&lon=${long}&categoryset=7315`)
    const result = res.data.results;
    const data = result.filter(item => `${item.poi.categorySet[0].id}`.includes('7315'))
    const restroResult = data.map(item => item.poi)
    return restroResult
}

const getLatLongByPinCode = async (pincode) => {
    const result = await axios.get(`https://india-pincode-with-latitude-and-longitude.p.rapidapi.com/api/v1/pincode/${pincode}`, {
        headers: {
            'X-RapidAPI-Key': '41c6aadc22mshe452cd069520b34p1cfd09jsn65c971769f4a',
            'X-RapidAPI-Host': 'india-pincode-with-latitude-and-longitude.p.rapidapi.com'
        }
    })
    if(result.data.length < 1){
        throw new Error('Pin code is incorrect')
    }else{
        return result.data[0]
    }
}


app.get('/get_restaurant/:pin_code', async (req, res) => {
    const { pin_code } = req.params
    try {
        const {lat, lng} = await getLatLongByPinCode(pin_code)
        const result = await getRestaurant(lat, lng)
        res.json({ status: 'success', data: result })
    } catch (error) {
        console.log(">>>>", error);
        res.status(404).json({ data: error.message })
    }
})



app.listen(5050, () => {
    console.log("app listening on port 5050");
})