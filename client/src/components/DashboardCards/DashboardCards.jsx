import React from 'react'
import './DashboardCards.css'
import { CardsData } from '../../data/chartData'
import Dashboard from '../DashboardCard/DashboardCard'
import DashboardCard from '../DashboardCard/DashboardCard'


const DashboardCards = () => {
  return (
    <div className="Cards">
        {CardsData.map((card,id)=>{
            return(
                <div className="parentContainer">
                    <DashboardCard
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

export default DashboardCards