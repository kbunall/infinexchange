import React from 'react'

const DisplayFrame =({headings, children}) => {
    return (
      <div style={{
        width: '100%',
        height: '100%',
      }}>
        <div style={{
            width: '100%',
            height: '13%',
            backgroundColor: '#004AAD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <span style={{
                fontFamily: 'Outfit',
                fontStyle: 'normal',
                fontWeight: '700',
                fontSize: '30px',
                lineHeight: '38px',
                textAlign: 'center',
                
                color: '#FFFFFF',
            }}>
                {headings} 
            </span>
        </div>
        {children}
      </div>
    )
}


export default DisplayFrame; 
