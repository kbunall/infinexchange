import React, { Component} from 'react'
import DisplayFrame from './DisplayFrame'
import TextInput from './TextInput'
import CheckboxInput from './CheckboxInput'
import {Button, Form} from 'reactstrap';

export default class DefiningEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0
        };
    }
    handleSelectionChange = (index) => {
        console.log('Selected index:', index);
        this.setState({ selectedIndex: index });
    };
    handleSubmit = (event) =>{
        event.preventDefault();
    }
    render() {
        const { selectedIndex } = this.state;
        const isIndividualDisabled = selectedIndex === 1
        console.log(isIndividualDisabled)
        return (
        <DisplayFrame headings='PERSONEL TANIMLAMA'>
        <Form onSubmit={this.handleSubmit}>
            <div>
                <div style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', height: '87%' }}>
                    <div style={{ width: '50%' }}>
                        <TextInput text="Ad Soyad" />
                        <TextInput text="Kullanıcı Adı"/>
                        <TextInput type='password' text="Şifre" />
                        <TextInput type='email' text="E - Mail" />
                    </div>
                    <div style={{ width: '50%' }}>
                        <CheckboxInput text='Yetki Türü' labels={['Admin', 'Sınırlı']}
                        defaultCheckedIndices={[0]} vertical={true}></CheckboxInput>
                        <Button className='definingButton' type='submit' color="primary" block style={{
                            minWidth: '150px',
                            maxWidth: '150px',
                            height: '46px',
                            top: '207px',
                            left: '3786px',
                            gap: '0px',
                            borderRadius: '23px',
                            backgroundColor: '#004AAD',
                        }}
                            ><span className='definingText' style={{
                                fontFamily: 'Outfit',
                                fontFize: '20px',
                                fontWeight: '700',
                                lineLeight: '25.2px',
                                textAlign: 'center',
                        }}>Tanımla</span></Button>
                    </div>
                </div>
                
            </div>
        </Form>
        </DisplayFrame>
        )
    }
}

