import React from 'react';

const TextareaInput = ({ text }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', margin: '20px', height: '20%' }}>
            <span style={{
                flex: '1',
                fontFamily: 'Outfit',
                fontStyle: 'normal',
                fontWeight: '700',
                fontSize: '20px',
                lineHeight: '25px',
                textAlign: 'left',
                color: '#02224E',
                maxWidth: '25%',
            }}>
                {text}
            </span>
            <textarea style={{
                flex: '1',
                boxSizing: 'border-box',
                backgroundColor: '#FFFFFF',
                border: '2px solid #004AAD',
                textAlign: 'left',
                height: '100%',
                resize: 'none',
                maxWidth: '50%',
            }}></textarea>
        </div>
    );
};

export default TextareaInput;
