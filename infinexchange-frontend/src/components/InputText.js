

/*

import React from 'react'

const InputText = ({text, type}) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', margin: '20px' }}>
            <span style={{
                fontFamily: 'Outfit',
                fontStyle: 'normal',
                fontWeight: '700',
                fontSize: '20px',
                lineHeight: '25px',
                textAlign: 'center',
                color: '#02224E',
                maxWidth: '70%',
            }}>
                <span style={{
                    display: 'inline-block', // Ensure the span respects width properties
                    maxWidth: '70%',
                    wordBreak: 'break-word', // Ensures long words break to fit
                    overflowWrap: 'break-word', // Ensures text wraps onto the next line
                }}>
                    {text}
                </span>
            </span>
                
            <input type={type} style={{
                boxSizing: 'border-box',
                backgroundColor: '#FFFFFF',
                border: '2px solid #004AAD',
                textAlign: 'left',
                maxWidth: '70%',
            }}></input>
        </div>
    )
}

export default InputText;

*/

import React from 'react';
import PropTypes from 'prop-types';
import {Button, Form} from 'reactstrap';

const InputText = ({ first, second }) => {
    return (
        <table style={{ border: 'none', margin: '5%', fontFamily: 'Outfit',
            fontStyle: 'normal',
            fontWeight: '700',
            fontSize: '20px',
            lineHeight: '25px',
            textAlign: 'center',
            color: '#02224E',
            gap: '5%',
            maxWidth: '70%',}}>
            <thead style={{textAlign: 'center'}}>
                <tr>
                    {first.map((header, index) => (
                        <th style={{width: '12.5%'}} key={index}>{header}</th>
                    ))}
                </tr>
                <tr>
                    {second.map((header, index) => (
                        <th key={index}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {first.map((_, index) => (
                        <td style={{
                            border: '2px solid #004AAD'
                        }}
                        key={index}><input style={{border: 'none'}} type='text' /></td>
                    ))}
                    <Button>Döviz Listele</Button>
                </tr>
            </tbody>
        </table>
    );
};

InputText.propTypes = {
    first: PropTypes.arrayOf(PropTypes.string).isRequired,
    second: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default InputText;



