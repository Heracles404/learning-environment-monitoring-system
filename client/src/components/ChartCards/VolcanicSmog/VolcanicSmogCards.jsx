import React from 'react'
import './VolcanicSmogCards.css'
import { VolcanicSmogData } from '../../../data/chartData' 
import VolcanicSmogCard from '../../ChartCard/VolcanicSmog/VolcanicSmogCard'

const VolcanicSmogCards = () => {
  return (
    <div className="Cards">
        {VolcanicSmogData.map((card,id)=>{
            return(
                <div className="parentContainer">
                    <VolcanicSmogCard
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

export default VolcanicSmogCards