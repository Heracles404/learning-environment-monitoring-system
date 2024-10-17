import React from 'react'
import './RightSide.css'
import Updates from '../Updates/Updates'
import HeadCount from '../HeadCount/HeadCount'

const RightSide = () => {
  return (
    <div className="RightSide">
        <div>
            <h2>Updates</h2>
            <Updates/>
        </div>
        <div>
            <h2>Head Count</h2>
            <HeadCount/>
        </div>
    </div>
  )
}

export default RightSide