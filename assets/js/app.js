/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import '../css/app.css';

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

console.log('Hello Webpack Encore! Edit me in assets/js/app.js');

import React from 'react';
import ReactDOM from 'react-dom';

import {Bar} from 'react-chartjs-2';

class App extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            submitted: false,
            companySymbol: '',
            companySymbolError: '',
            startDate: '',
            startDateError: '',
            endDate: '',
            endDateError: '',
            email: '',
            emailError: '',
            loader: false,
            quotes: [],
            labels: [],
            openPrices: [],
            closePrices: []
        };
  
        this.handleCompanySymbolChange = this.handleCompanySymbolChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleCompanySymbolChange(event) {
        this.setState({companySymbol: event.target.value});
    }

    handleStartDateChange(event) {
        this.setState({startDate: event.target.value});
    }

    handleEndDateChange(event) {
        this.setState({endDate: event.target.value});
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }
  
    handleSubmit(event) {
        event.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                symbol: this.state.companySymbol,
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                email: this.state.email
            })
        };
        fetch('validate', requestOptions)
            .then(response => response.json())
            .then(response => {
                this.setState({companySymbolError: ''})
                this.setState({startDateError: ''})
                this.setState({endDateError: ''})
                this.setState({emailError: ''})

                // check validation errors
                if (response.statusCode != 200) {
                    if (typeof response.symbol != 'undefined') {
                        this.setState({
                            companySymbolError: response.symbol
                        })
                    }
                    if (typeof response.startDate != 'undefined') {
                        this.setState({
                            startDateError: response.startDate
                        })
                    }
                    if (typeof response.endDate != 'undefined') {
                        this.setState({
                            endDateError: response.endDate
                        })
                    }
                    if (typeof response.email != 'undefined') {
                        this.setState({
                            emailError: response.email
                        })
                    }
                }
                else {
                    this.setState({loader: true})

                    var url = 'https://www.quandl.com/api/v3/datasets/WIKI/'
                        +this.state.companySymbol+'.json?order=asc&amp;start_date='+this.state.startDate
                        +'&amp;end_date='+this.state.endDate+'&api_key=iDWmbL8gkNcE4jEakZVu';

                    // get results
                    fetch(url)
                        .then(response => response.json())
                        .then(entries => {
                            var quotes = entries.dataset.data;

                            this.setState({loader: false})

                            for (var i in quotes) {
                                this.setState({
                                    labels: this.state.labels.concat(quotes[i][0])
                                })
                                this.setState({
                                    openPrices: this.state.openPrices.concat(quotes[i][1])
                                })
                                this.setState({
                                    closePrices: this.state.closePrices.concat(quotes[i][4])
                                })
                            }

                            this.setState({
                                submitted: true
                            });
                            this.setState({
                                quotes
                            });
                        });

                    // send mail
                    fetch('send/mail', requestOptions)
                        .then(response => response.json())
                        .then(response => {})
                }
            })
    }
    
    render() {
        if (!this.state.submitted) {
            return (
                <div className="col-md-6">
                    {this.state.loader ?
                        <div className="loader"></div>
                        : ''
                    }
                    <form onSubmit={this.handleSubmit}>
                        <div className="card" style={{ margin: '0 0 20px 0' }}>
                            <div className="card-body">
                                
                                <div className="form-group">
                                    <label>Company Symbol</label>
                                    <input className="form-control" 
                                        type="text" 
                                        value={this.state.companySymbol} 
                                        onChange={this.handleCompanySymbolChange} 
                                    />
                                    <span className="text-danger">{this.state.companySymbolError}</span>
                                </div>
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <input className="form-control"
                                        placeholder="YYYY-mm-dd"
                                        type="text" 
                                        value={this.state.startDate} 
                                        onChange={this.handleStartDateChange}
                                    />
                                    <span className="text-danger">{this.state.startDateError}</span>
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input className="form-control" 
                                        placeholder="YYYY-mm-dd"
                                        type="text" 
                                        value={this.state.endDate} 
                                        onChange={this.handleEndDateChange}
                                    />
                                    <span className="text-danger">{this.state.endDateError}</span>
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input className="form-control" 
                                        type="text" 
                                        value={this.state.email} 
                                        onChange={this.handleEmailChange}
                                    />
                                    <span className="text-danger">{this.state.emailError}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '0 1.25rem' }}>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
            );
        }
        else {
            let rows = this.state.quotes.map((data, i) => {
                var cols = [];
                for (var c = 0; c < 6; c++) {
                    cols.push(<td key={c}>{data[c]}</td>)
                }
                return(
                    <tr key={i}>
                        {cols}
                    </tr>
                ) 
            });

            return (
                <div className="col-md-10">
                    <div className="card" style={{ margin: '0 0 20px 0' }}>
                        <div className="card-body">
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Open</th>
                                        <th>High</th>
                                        <th>Low</th>
                                        <th>Close</th>
                                        <th>Volume</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <Bar
                                data={{
                                    labels: this.state.labels,
                                    datasets: [
                                        {
                                            label: 'Open Prices',
                                            backgroundColor: 'rgba(75,192,192,1)',
                                            borderColor: 'rgba(0,0,0,1)',
                                            borderWidth: 1,
                                            data: this.state.openPrices
                                        },
                                        {
                                            label: 'Close Prices',
                                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                            borderColor: 'rgba(0, 0, 0, 0.1)',
                                            borderWidth: 1,
                                            data: this.state.closePrices
                                        }
                                    ]
                                }}
                                options={{
                                    title:{
                                        display:true,
                                        text:'Open and Close prices',
                                        fontSize: 20
                                    },
                                    legend:{
                                        display:true,
                                        position:'bottom'
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            )
        }
    }
}
  
ReactDOM.render(<App />, document.getElementById('root'));