import React, { useState } from 'react';
import VideoView from "./videoview";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, createStyles } from '@material-ui/core/styles'; //bu önemli çünkü theme.spacing(15) @material-ui/styles ile çalışmıyor
import CallIcon from '@material-ui/icons/Call';
import CloseIcon from '@material-ui/icons/Close';
import Fab from '@material-ui/core/Fab';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Grid from '@material-ui/core/Grid';
import webrtc from './webrtc.js';
const mui_style = (theme) => createStyles(
    {
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        fab: {
            margin: theme.spacing(1),
        },
        appBar: {
            position: 'relative',
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
    }
);
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class App extends React.Component {
    constructor(props) {
        super(props);
        this.webrtc = new webrtc();
        this.streams = new Map();
        var name = "noname";
        if (this.props.location.state) name = this.props.location.state.name;
        this.state = { localstream: null, peers: [], peerid: null, streams: new Map(), open: false, name: name };
    }

   
    componentDidMount() {
        this.startConnection();
    }
    componentDidUpdate() {
     
        {
            Array.from(this.streams).map(([key, value]) => {
                document.getElementById(key).srcObject=value;
                    
            })
        }

    }
    connectWebsocket() {
        this.webrtc.setClientInfo(this.state.name);
        this.webrtc.connect("wss://webrtc-ahmetcan.herokuapp.com/signal", true);
        
        this.webrtc.addEvent("opened", (evt) => {

        });
        this.webrtc.addEvent("message",(message) => {
            console.log(message);
        });
        this.webrtc.addEvent("peers_changed", (peers) => {
            console.log(peers);
            this.setState({
                peers: peers,
            });
        });
        this.webrtc.addEvent("on_add_stream", (id, stream) => {
            this.streams.set(id, stream);
            this.setState({ streams: this.streams });

        });
        this.webrtc.addEvent("on_remove_stream", (id, stream) => {
            this.streams.delete(id);
            this.setState({ streams: this.streams });

        });
       
       
    }
    startConnection() {
        let _this = this;
        this.peer_id = this.webrtc.getPeerId();

        this.webrtc.createLocalStream("video", true).then((stream) => {
            this.setState({
                localstream: stream
            });
            this.streams.set(this.peer_id, stream);
            this.setState({ streams: this.streams });
            _this.connectWebsocket();
        }); 

    }
    handleChange=(event)=> {
        this.setState({ peerid: event.target.value });
    }
    handleOnCall = (peerid) => {
        this.webrtc.call(peerid, "video");
        this.handleClose();
        console.log("call");
    }
    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        var _this = this;
        var { classes } = this.props;
        var peerList =
            this.state.peers.map(item => {
                return (
                    <ListItem onClick={() => { _this.handleOnCall(item.peerid) }}>
                        <ListItemText primary={item.name+" PeerID:"+item.peerid} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="CALL" onClick={() => { _this.handleOnCall(item.peerid) }}>
                                <CallIcon />
                            </IconButton>
                            
                        </ListItemSecondaryAction>
                    </ListItem>
                );
            });
        

        return (
            
            
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>

                        <Fab edge="start" color="secondary" aria-label="add" className={classes.fab} onClick={this.handleClickOpen}>
                            <CallIcon />
                        </Fab>
                        <Typography variant="h6" className={classes.title}>
                            {this.state.peers.length}{"<= Connect To Peer"}
                        </Typography>
                        <a style={{color:"white"}} href="https://github.com/ahmetcancomtr" target="_blank">Ahmet CAN/GitHub</a>
                    </Toolbar>
                </AppBar>
                <Grid container spacing={3}
                    direction="row"
                    justify="center"
                    alignItems="center">

                   

                    {Array.from(this.state.streams).map(([key, value]) => {
                        return (
                            <Grid item xs>
                                <video style={{ width: "100%", height:"100%" }} id={key} autoPlay playsInline />
                            </Grid>
                            )
                    })}
                                       
                   
                </Grid>

                <Dialog fullScreen open={this.state.open} onClose={this.handleClose} TransitionComponent={Transition}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                Press Call Button On List
                             </Typography>
                            {/** <Button color="inherit" onClick={this.handleClose}>
                                save
                            </Button>**/}
                        </Toolbar>
                    </AppBar>
                    <List>
                        {peerList}
                        
                    </List>
                </Dialog>
            </div>

        )
    };
}

export default withStyles(mui_style)(App);
