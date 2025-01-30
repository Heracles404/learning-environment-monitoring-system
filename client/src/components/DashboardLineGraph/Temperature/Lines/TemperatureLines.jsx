import React from 'react'
import './TemperatureLines.css'
import { LightingData } from '../../../../data/chartData' 

import LightingCard from '../../../ChartCard/Lighting/LightingCard'

const TemperatureLines = () => {
  return (
    <div className="Cards">
        {LightingData.map((card,id)=>{
            return(
                <div className="parentContainer">
                    <LightingCard
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

export default TemperatureLines