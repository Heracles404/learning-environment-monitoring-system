import React from 'react'
import './RightSide.css'
import Updates from '../Updates/Updates'
import HeadCount from '../HeadCount/HeadCount'

const RightSide = () => {
  return (
    <div className="RightSide">
        <div>
            <h3>Updates</h3>
            <Updates/>
        </div>
        <div>
            <h3>HeadCount</h3>
            <HeadCount/>
        </div>
    </div>
  )
}

export default RightSide