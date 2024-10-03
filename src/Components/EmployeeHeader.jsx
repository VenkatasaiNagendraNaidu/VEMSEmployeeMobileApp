import React from 'react'
import './EmployeeHeader.css'

const EmployeeHeader = () => {
  return (
    <div>
      <div className='EmployeehomeEdits' style={{display:"flex",boxShadow:"0 0 20px white"}}>
        <div className="logo">
          <img src="https://res.cloudinary.com/dhikrbq2f/image/upload/v1727689096/vemslogo_rsa3cx-removebg-preview_sjdohs.png" alt="Logo" style={{width:"100px"}}/>
        </div>
        <div className='EmployeeScheduler-home'>
          <span>Arrive in comfort, always on time </span>
        <p>- your journey made easy.</p>
        </div>
      </div>
    </div>
  )
}

export default EmployeeHeader