import React from 'react'
export default function Loader({ size = 'inline' }: { size?: 'inline' | 'full' }) {
  if (size === 'full') {
    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%'}}>
        <div className="ovelix-loader-container" aria-hidden>
          <div className="loader"></div>
          <div className="loader"></div>
          <div className="loader"></div>
        </div>
      </div>
    )
  }
  return (
    <div className="ovelix-loader-small" aria-hidden>
      <div className="loader-small" />
    </div>
  )
}
