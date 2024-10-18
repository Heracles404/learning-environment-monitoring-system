import React from 'react'
import './MainDash.css'
import Cards from '../../components/Cards/Cards'
import Table from '../../components/Table/Table'
import RightSide from '../../global/RightSide/RightSide.jsx'


const MainDash = () => {
  return (
    <div className="MainContainer">
      <div className="MainDash">
        <h1>Dashboard</h1>
        <Cards/>
        <Table/>
      </div>
      <RightSide />
    </div>
  )
}

export default MainDash