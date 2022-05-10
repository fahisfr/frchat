import React from 'react'
import './HomeLoading.css'
function HomeLoading({ loading }) {
  return loading ? (
    <div className="homeloading" >
      <div className="loader"></div>
    </div>
  ) : null
}

export default HomeLoading