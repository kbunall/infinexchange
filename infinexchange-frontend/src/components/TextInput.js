import React from 'react'

const TextInput = ({text, disabled, type}) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px' }}>
            <span style={{
                flex: '1',
                fontFamily: 'Outfit',
                fontStyle: 'normal',
                fontWeight: '700',
                fontSize: '20px',
                lineHeight: '25px',
                textAlign: 'left',
                color: '#02224E',
                maxWidth: '25%'
            }}>
                {text}
            </span>
                
                <input type={type} disabled={disabled} style={{
                flex: '1',
                boxSizing: 'border-box',
                border: '2px solid #004AAD',
                textAlign: 'left',
                maxWidth: '50%',
                backgroundColor:  disabled ? 'gray' : 'white'
            }}></input>
        </div>
    )
}

export default TextInput;