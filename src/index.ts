import { config } from 'dotenv'
import axios from 'axios'
import Period from './enums/Period'
import Candle from './models/Candle'

config()

const readMarketPrice = async (): Promise<number> => {
    const result = await axios.get(process.env.PRICES_API)
    const data = result.data
    const price = data.bitcoin.usd

    return price
}

const generateCandle = async () => {

    while(true) {
        const loopTimes = Period.ONE_MINUTE / Period.TEN_SECONDS
        const candle = new Candle('BTC')

        console.log('--------------------------')
        console.log('Gerando novo Candle')
        for(let i = 0; i< loopTimes; i++) {
            const price = await readMarketPrice()
            candle.addValue(price)
            console.log(`Preço de mercado #${i + 1} of ${loopTimes}`)
            await new Promise(r => setTimeout(r, Period.TEN_SECONDS))
        }
        candle.closeCandle()
        console.log('Candle encerrado')
        console.log(candle.toSimpleObject())
    }
}

generateCandle()