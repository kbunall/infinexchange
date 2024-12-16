import React, { Component} from 'react'
import InputText from './InputText'
import CurrencyList from './CurrencyList'
import {Button, Form} from 'reactstrap';
import InputComponent from '../CommonComponents/InputComponent';

export default class CurrencyClosingPrices extends Component {
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
                <div style={{ height: '20%', display: 'flex',}}>
                    <InputComponent
                        id="currencyCode"
                        label="Kıymet Kodu"
                        //value={customerName}
                        //onChange={(e) => setCustomerName(e.target.value)}
                    />

                    <Button>Döviz Listele</Button>

                </div>
                <div style={{ minHeight: '80%' }}>
                    <CurrencyList /> 
                </div>
            </div>
        )
    }
}