import React, { Fragment } from 'react';
import Background from './background.jpg';
import styles from './index.css'
import TextField from '@material-ui/core/TextField';
import { withStyles, createStyles } from '@material-ui/core/styles'; //bu önemli çünkü theme.spacing(15) @material-ui/styles ile çalışmıyor
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Redirect } from 'react-router-dom'


const mui_style = (theme) => createStyles(
    {
        button: {
            margin: theme.spacing(1),
            marginLeft:"auto",
        },
        input: {
            display: 'none',
        },
        CardActionArea: {
            height: "100px",
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
    }
);
class Entry extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: null, isRedirect: false };
    }
  
    okHandle = () => {

        this.setState({
            isRedirect: true
        });
    }
    onChangeHandle = (evt) => {
        this.setState({ name:evt.target.value });
    }
    render() {

        if (this.state.isRedirect) {

            return <Redirect to={{
                pathname: '/app',
                state: { name: this.state.name }
            }}/>
        }

        var { classes } = this.props;
        
        return (
           
           
            <React.Fragment>
                <div className="bg">
                    <div className={'toptitle'}>
                    <h2>
                        ReactJS WebRTC Demo (Asp.Net Core SinglePageApp)
                    </h2>
                    <h3>
                        <a href="https://github.com/ahmetcancomtr" style={{color: "#000000" }}>https://github.com/ahmetcancomtr</a><br/>
                    </h3>
                    </div>
                    <Card className={classes.card + ' login-box'}>
                        <CardActionArea className={classes.CardActionArea} >
                        <CardContent>
                                <TextField label="Name" className={classes.textField} value={this.state.name} onChange={this.onChangeHandle} margin="normal" variant="outlined" />
                        </CardContent>
                        </CardActionArea>
                        <CardActions >
                            <Button size="small" variant="contained" color="primary" className={classes.button} onClick={this.okHandle}>
                                Ok
                             </Button>
                        </CardActions>
                    </Card>
                   
            </div>
          </React.Fragment>
        )
    };
}

export default withStyles(mui_style)(Entry);
