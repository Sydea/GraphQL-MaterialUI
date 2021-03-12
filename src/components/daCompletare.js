import React, { Component } from 'react';
import {getUser, updateUser, newActivity} from '../net/API.js'
import { DataGrid } from '@material-ui/data-grid';
import Select from 'react-select'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class DaCompletare extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        
        this.state = {
            originalData : [],
            rows: [],
            columns: [
                { field: 'col1', headerName: 'Operatore', headerClassName: 'super-app-theme--header',flex: 0.1 },
                { field: 'col2', headerName: 'Attivita', headerClassName: 'super-app-theme--header',flex: 0.5},
                { field: 'col3', headerName: ' ', renderCell: (index) => (<div className="ContainerButtonTable">
                                                                                    <Button variant="contained"
                                                                                       color="primary"
                                                                                       size="small"
                                                                                       onClick={() => this.getElemento(index.row)}
                                                                                       entry={index}>
                                                                                        Svolgi
                                                                                    </Button>
                                                                                </div>), 
                                                                                flex: 0.3 }
            ],
            newAttivita: "",
            options: [],
            optionsOperatore: []
        };

        this.recuperaDati=this.recuperaDati.bind(this);
        this.changeOperator=this.changeOperator.bind(this);
        this.updateInputValue=this.updateInputValue.bind(this);
        this.salva=this.salva.bind(this);
        this.changeOperatorNewAttivita=this.changeOperatorNewAttivita.bind(this);
        this.getElemento=this.getElemento.bind(this);

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

    getElemento(element){       
        element.done = true;
        updateUser(element).then((res) =>{ 
            this.recuperaDati(); 
        });
    }

    componentDidMount() {   
        this.recuperaDati();    
    }

    changeOperator(e){        
        this.state.rows= this.state.originalData

        this.state.rows = this.state.rows.filter(function(item){
            return ((item.firstname == e.firstname) && (!item.done));
        }).map(function({col1, col2, firstname, id, label, task, value}){
            return {col1, col2, firstname, id, label, task, value};
        });

        this.setState({
            rows: this.state.rows
        });
    }

    changeOperatorNewAttivita(e){ 
        var obj = Object.assign({}, e);
        this.setState({
            operatorNewAttivita: obj
        });
    }

    recuperaDati() {
        var array = [];
        var listUserSelect = [];
        var origin = [];
        getUser()
        .then((res) =>{       
            origin = res.data.users;
            res.data.users.forEach((user,index) => {  
                user.col1= user.firstname;
                user.col2= user.task;   
                user.col4= user.done;
                if(!user.done) {
                    array.push(user);
                } 
            });

            //QUESTO CICLO POPOLA L'ARRAY DELLE SELECT
            res.data.users.forEach((userSelect,index) => {
                userSelect.value = userSelect.id;
                userSelect.label= userSelect.firstname;
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

    updateInputValue(evt) {
        this.setState({
            newAttivita: evt.target.value
        });
    }

    salva(){
        var addElement = {  
                            firstname: this.state.operatorNewAttivita.firstname,
                            task: this.state.newAttivita,
                            done: false,
                        };
        newActivity(addElement).then((res) =>{ 
            this.recuperaDati(); 
        });   
    }
    
    render() { 
        return (            
            <div>
                <div className="Style-title-da-completare">
                    Attività da completare
                </div>
                
                <div>
                    <Select options={this.state.optionsOperatore} onChange={this.changeOperator}/>
                </div>
                
                <div className="Container-grid">
                  <DataGrid className rows={this.state.rows} columns={this.state.columns} pagination {...this.state.rows} pageSize={5} rowsPerPageOptions={[5, 10, 20]}/>
                </div>
                
                <div className="Style-title-da-completare">
                    NUOVA ATTIVITÀ
                </div>

                <div className={this.useStyles.root} className="Margin-top-10">                
                    <Grid container spacing={1} >
                        <Grid item xs={6}>
                            <form className={this.useStylesInput.root} noValidate autoComplete="off">
                                <TextField label="Size" id="filled-size-small" variant="outlined" size="small" label="Nuova attività"  className="Width-input" value={this.state.newAttivita} onChange={evt => this.updateInputValue(evt)}/>
                            </form>                        
                        </Grid>
                        <Grid item xs={6}>
                            <Select options={this.state.optionsOperatore} onChange={this.changeOperatorNewAttivita} className="Height-select"/>
                        </Grid>
                        <Grid item xs={12}>
                            <div className={this.useStylesButton.root} className="Text-right">
                                <Button variant="contained" className="Margin-5">
                                    ANNULLA
                                </Button>
                                <Button variant="contained" color="primary" className="Margin-5" onClick={this.salva}>
                                    SALVA
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default DaCompletare;