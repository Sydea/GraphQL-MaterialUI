import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DvrIcon from '@material-ui/icons/Dvr';
import Completate from './completate.js';
import DaCompletare from './daCompletare.js';
import userIcon from '../img/user_icon.png';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    backgroundColor: '#ffffff',
    color:'#7e8a96',
    textAlign:"right"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#2a3948',
    color: '#7e8a96'
  },
  // necessary for content to be below app bar
  /*toolbar: {minHeight: 64, backgroundColor:'#3d4b59',textAlign: 'center'},*/
  toolbar: {
    minHeight:64, 
    display:'flex',
    alignItems:'center', 
    justifyContent:'center',
    color: '#ffffff',
    fontSize: 20,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  listItem:{
    fontSize: 14
  },
  listWrap: {
    "&:hover": {
      border: "1px solid #6c757d",
      color: "black"
    },
    "&:Active": {
      background: "#6c757d",
      color: "black"
    }
  }
}));

var item =0;

export default function PermanentDrawerLeft() {
  const classes = useStyles();

  const [showCompletate, showAttivitaCompletate] = React.useState(false);
  const [showDaCompletare, showAttivitaDaCompletare] = React.useState(true);

  function completate() {
      showAttivitaCompletate(true);
      showAttivitaDaCompletare(false);
  }
  function daCompletare() {
      showAttivitaCompletate(false);
      showAttivitaDaCompletare(true);
  }   

  return (    
    <div className={classes.root}>
      <CssBaseline />
        <AppBar position="fixed" className={classes.appBar} >
          <Toolbar className="End">
            <div className="Margin-5 Style-username">
              Nome Cognome
              <div className="Ruolo">Admin</div>
            </div>
            <img className="Dimension-icon-user" src={userIcon}></img>              
          </Toolbar>
        </AppBar>

      <Drawer className={classes.drawer}
              variant="permanent"
              classes={{
                paper: classes.drawerPaper,
              }}
              anchor="left">
        <div className={classes.toolbar}>LOGO</div>
        <Divider />
        <List>
          {['Attività da completare', 'Attività completate'].map((text, index) => (
            <ListItem button key={text} className={item==index ? "Active" : null} onClick={() => {
                if (text == "Attività da completare") {
                  item=0;
                    daCompletare();                    
                } else if (text == "Attività completate") {
                  item=1;
                    completate();                    
                }
            }}>
              <ListItemIcon >{index % 2 === 0 ? <DvrIcon style={{fill: "#7e8a96"}}/> : <AssignmentIcon style={{fill: "#7e8a96"}}/>}</ListItemIcon>
              <ListItemText primary={text} classes={{ primary:classes.listItem}} />
            </ListItem>
          ))}
        </List>        
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {showDaCompletare && <DaCompletare></DaCompletare>}
        {showCompletate && <Completate></Completate>}
      </main>
    </div>
  );
}
