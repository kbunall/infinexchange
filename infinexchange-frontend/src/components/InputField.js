import React from 'react'
import {Input, FormGroup, Label} from 'reactstrap';

function InputField({type,id, placeholder, value, onChange}) {
  return (
    <div>
        
          <FormGroup floating>
            <Input
              type={type}
              id={id}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              required={true}
              style={{
                width: '478px',
                height: '77px',
                gap: '0px',
                borderRadius: '4px',
                backgroundColor: '#C0DBEA',
              }}
            />
            <Label for={id}>
              {placeholder}
            </Label>
          </FormGroup>
          {' '}
        
    </div>
  )
}


export default InputField;

