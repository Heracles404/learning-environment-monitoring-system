import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Logo from '../../imgs/ESLIHS_Logo.png';
import './Sidebar.css';

import { SidebarData } from "../../Data/Data";
import { UilSignOutAlt, UilBars } from '@iconscout/react-unicons';
import { motion } from 'framer-motion';

const Sidebar = () => {

  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(true);

  const sidebarVariants = {
    true: {
      left: '0'
    },
    false: {
      left: '-60%'
    }
  }

  return (
    <>
      <div className='bars' style={expanded ? {
        left: '60%'
      } : { left: '5%' }}
        onClick={() => setExpanded(!expanded)}
      >
        <UilBars />
      </div>
      <motion.div className="Sidebar"
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ''}
      >
        { /* logo */}
        <div className="logo">
          <img src={Logo} alt="" />
        </div>

        { /* menu */}
        <div className="menu">
          {SidebarData.map((item, index) => {
            return (
              <Link to={item.path} key={index} className={selected === index ? 'menuItem active' : 'menuItem'}
                onClick={() => setSelected(index)}>
                <item.icon />
                <span>
                  {item.heading}
                </span>
              </Link>
            )
          })}
          <div className="menuItem">
            <UilSignOutAlt />
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar;
