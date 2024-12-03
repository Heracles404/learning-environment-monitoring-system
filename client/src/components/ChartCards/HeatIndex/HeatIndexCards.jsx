import React from 'react'
import './HeatIndexCards.css'
import { HeatIndexData } from '../../../data/chartData' 

import HeatIndexCard from '../../ChartCard/HeatIndex/HeatIndexCard'
const HeatIndexCards = () => {
  return (
    <div className="Cards">
        {HeatIndexData.map((card,id)=>{
            return(
                <div className="parentContainer">
                    <HeatIndexCard
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