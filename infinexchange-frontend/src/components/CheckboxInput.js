import React, { useState } from 'react';
import { FormGroup, FormControlLabel, Radio, RadioGroup } from '@mui/material';

const CheckboxInput = ({ text, labels, defaultCheckedIndex = 0, vertical, onSelectionChange}) => {
    const [selectedIndex, setSelectedIndex] = useState(defaultCheckedIndex);

    const handleChange = (event) => {
        const newIndex = Number(event.target.value);
        setSelectedIndex(newIndex);
        if (onSelectionChange) {
            onSelectionChange(newIndex);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', margin: '20px' }}>
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
                marginTop: '7px',
            }}>
                {text}
            </span>
            <FormGroup style={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <RadioGroup value={selectedIndex} onChange={handleChange} style={{
                    display: 'flex',
                    flexDirection: vertical ? 'column' : 'row',
                }}>
                    {labels.map((label, index) => (
                        <FormControlLabel
                            key={label}
                            value={index}
                            control={<Radio />}
                            label={label}
                        />
                    ))}
                </RadioGroup>
            </FormGroup>
        </div>
    );
};

export default CheckboxInput;
