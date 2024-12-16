import React, {useState} from 'react'
import TextInput from './TextInput';
import { Button, MenuItem, TextField,} from '@mui/material';


export default function Portfolio() {
 const [id, setID] = useState('');
  return (
    <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    }}>
        <div style={{
            width: '100%',
            height: '50%',
            display: 'flex',
            flexDirection: 'row'
        }}>
            <div style={{
                width: '50%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignContent: 'center',
                justifyContent: 'center',
            }}>
                <TextInput text='Müşteri Ad' type='text'></TextInput>
                <TextInput text='Müşteri Soyad' type='text'></TextInput>

                <TextInput text='Müşteri ID' type='text'></TextInput>
                <TextInput text='Portföy ID' type='text'></TextInput>
                <TextInput text='Kıymet Türü' type='text'></TextInput>
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <Button style={{width: '15%', backgroundColor: '#02224E', fontFamily: 'Times New Roman',fontWeight: '700', lineHeight: '28.75px',textAlign: 'center',color: '#FFFFFF' }}
                    >Listele</Button>
                </div>
            </div>
            <div style={{
                width: '50%',
                height: '100%',
            }}>

            </div>
        </div>

        <div style={{
            width: '100%',
            height: '50%',
            display: 'flex',
            flexDirection: 'row'
        }}>
            <div style={{
                width: '50%',
                height: '100%',
            }}>

            </div>
            <div style={{
                width: '50%',
                height: '100%',
            }}>

            </div>

        </div>
      
    </div>
  )
}
