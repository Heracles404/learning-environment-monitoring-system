import React from 'react'
import './RightSide.css'
import Updates from '../../components/Updates/Updates'
import HeadCount from '../../components/HeadCount/HeadCount'

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