import React from 'react'
import './CO2Cards.css'
import { CO2Data } from '../../../data/chartData' 

import CO2Card from '../../ChartCard/AirQuality/CO2Card'
const HeatIndexCards = () => {
  return (
    <div className="Cards">
        {CO2Data.map((card,id)=>{
            return(
                <div className="parentContainer">
                    <CO2Card
                    title={card.title}
                    color={card.color}
                    barValue={card.barValue}
                    value={card.value}
                    png={card.png}
                    series={card.series}
                    />
                </div>
            )
        })}
    </div>
  )
}

export default HeatIndexCards