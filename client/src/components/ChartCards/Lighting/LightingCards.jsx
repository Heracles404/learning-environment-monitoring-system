import React from 'react'
import './LightingCards.css'
import { LightingData } from '../../../data/chartData' 

import CO2Card from '../../ChartCard/AirQuality/CO2Card'

const LightingCards = () => {
  return (
    <div className="Cards">
        {LightingData.map((card,id)=>{
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

export default LightingCards