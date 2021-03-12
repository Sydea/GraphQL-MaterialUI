import React, { Component } from 'react';
import {getUser, getAttivita} from '../net/API.js'
import { DataGrid } from '@material-ui/data-grid';
import Select from 'react-select'
import { makeStyles } from '@material-ui/core/styles';


class Completate extends React.Component<Props, State> {
    constructor(props) {
        super(props);

        this.changeOperator=this.changeOperator.bind(this);
        this.recuperaDati=this.recuperaDati.bind(this);
        
        this.state = {
            rows: [],
            columns: [
                { field: 'col1', headerName: 'Operatore', width: 150 },
                { field: 'col2', headerName: 'Attivita', width: 500 }
            ],
            optionsOperatore: []            
        };        

        this.useStyles = makeStyles((theme) => ({
            root: {
              flexGrow: 1,
            },
            paper: {
              padding: theme.spacing(2),
              textAlign: 'center',
              color: theme.palette.text.secondary,
            },
        }));  

        this.useStylesInput = makeStyles((theme) => ({
            root: {
              '& > *': {
                margin: theme.spacing(1),
                width: '25ch',
              },
            },
        }))

        this.useStylesButton = makeStyles((theme) => ({
            root: {
              '& > *': {
                margin: theme.spacing(1),
              },
            },
        }));
    }

    componentDidMount() {   
        this.recuperaDati()     
    }

    changeOperator(e){        
        this.state.rows= this.state.originalData

        this.state.rows = this.state.rows.filter(function(item){
            return ((item.firstname == e.firstname) && (item.done));
        }).map(function({col1, col2, firstname, id, label, task, value}){
            return {col1, col2, firstname, id, label, task, value};
        });

        this.setState({
            rows: this.state.rows
        });
    }

    recuperaDati() {
        var array = [];
        var listUserSelect = [];
        getUser()
        .then((res) =>{    
            origin = res.data.users;        
            res.data.users.forEach((user,index) => {
                user.id=index;
                user.col1= user.firstname;
                user.col2= user.task;
                user.col4= user.done;
                if(user.done) {
                    array.push(user);
                }
            });

            //QUESTO CICLO POPOLA L'ARRAY DELLE SELECT
            res.data.users.forEach((userSelect,index) => {
                userSelect.value = userSelect.id;
                userSelect.label = userSelect.firstname;
                listUserSelect.push(userSelect);
            });

            this.setState({
                originalData : origin,
                rows: array,
                optionsOperatore: listUserSelect
            });
        })
        .catch(err => {
            console.log(err)
        }); 
    }
    
    render() {
         return (            
            <div >
                <div className="Style-title-da-completare">
                    Attività completate
                </div>
                <div>
                    <Select options={this.state.optionsOperatore} onChange={this.changeOperator} />
                </div>
                <div style={{ height: 450, width: '100%', marginTop: 10}}>
                  <DataGrid rows={this.state.rows} columns={this.state.columns} pagination {...this.state.rows} pageSize={5} rowsPerPageOptions={[5, 10, 20]} />
                </div>
            </div>
        );
    }
}

export default Completate;