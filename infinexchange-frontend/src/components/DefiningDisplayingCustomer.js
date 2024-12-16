import React, { Component} from 'react'
import DisplayFrame from './DisplayFrame'
import TextInput from './TextInput'
import InputText from './InputText'

import CheckboxInput from './CheckboxInput'
import TextareaInput from './TextareaInput'
import {Button, Form} from 'reactstrap';
import DataTable from './DataTable'
import CurrencyList from './CurrencyList'


export default class DefiningDisplayingCustomer extends Component {
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
        return(
            <div style={{ display: 'grid', gridTemplateRows: '40% 60%', height: '100vh' }}>
                <div style={{ minHeight: '40%', display: 'flex', alignItems: 'flex-end', marginBottom: '30px', justifyContent: 'center'}}>
                    <InputText first={['TC Kimlik', 'Ad Soyad', 'Danışman', 'Müşteri']} second={['Vergi No', 'Kurum Adı', 'Adı Soyadı', 'Tipi']} />
                </div>
                <div style={{ minHeight: '60%' }}>
                    {/*<CurrencyList /> */}
                </div>
            </div>
        )
        {/*

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
            <tr>
            <td><InputText text="TC Kimlik Vergi No" /></td>
            <td><InputText text="Ad Soyad Kurum Adı" /></td>
            <td><InputText text="Danışman Adı Soyadı" /></td>
            <td><InputText text="Müşteri Tipi" /></td>
            </tr>
        </tbody>
        </table>
        const { selectedIndex } = this.state;
        const isIndividualDisabled = selectedIndex === 1
        console.log(isIndividualDisabled)
        return (
        <DisplayFrame headings='MÜŞTERİ TANIMLAMA'>
        <Form onSubmit={this.handleSubmit}>
            <div>
                <InputText text="TC Kimlik Vergi No"></InputText>
                <InputText text="Ad Soyad Kurum Adı"></InputText>
                <InputText text="Danışman Adı Soyadı"></InputText>
                <InputText text="Müşteri Tipi"></InputText>
                <div style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', height: '87%' }}>
                    <div style={{ width: '50%' }}>
                        <CheckboxInput text='Müşteri Türü' labels = {['Bireysel', 'Kurumsal']} defaultCheckedIndices={[0]} vertical={false} onSelectionChange={this.handleSelectionChange}></CheckboxInput>
                        <TextInput className='individual' text="TC Kimlik" disabled={isIndividualDisabled} />
                        <TextInput className='corporate' text="Vergi Numarası" disabled={!isIndividualDisabled} />
                        <TextInput className='individual' text="Ad Soyad" disabled={isIndividualDisabled}/>
                        <TextInput className='corporate' text="Kurum Adı" disabled={!isIndividualDisabled} />
                        <TextInput className='individual' text="Doğum Tarihi" disabled={isIndividualDisabled} />
                        <TextInput text="Telefon" />
                        <TextInput text="Danışman" />
                    </div>
                    <div style={{ width: '50%' }}>
                        <TextInput text="E-Mail" />
                        <TextareaInput text='Adress'></TextareaInput>
                        <CheckboxInput text='Risk Profili' labels={['Düşük', 'Düşük-Orta', 'Orta', 'Orta-Yüksek', 'Yüksek'
                        ]} defaultCheckedIndices={[0]} vertical={true}></CheckboxInput>
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
                        {/** 
                        <InputText text="TC Kimlik Vergi No"></InputText>
                        <InputText text="Ad Soyad Kurum Adı"></InputText>
                        <InputText text="Danışman Adı Soyadı"></InputText>
                        <InputText text="Müşteri Tipi"></InputText>
                        <InputText text="Kullanıcı Adı"></InputText>
                        <InputText text="Ad Soyad"></InputText>
                        <InputText text="Kıymet Kodu"></InputText>
                        <InputText text="Ülke Adı"></InputText>
                        <InputText text="Ülke Adı"></InputText>
                        <InputText text="Tarih Seçimi"></InputText>
                        /}

                    </div>
                </div>
            </div>
            </Form>
        </DisplayFrame>
        )
        */}
    }
}