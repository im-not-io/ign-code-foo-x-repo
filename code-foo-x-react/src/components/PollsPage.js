import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import "firebase/auth";
import "firebase/database";
import "firebase/functions";
import React, { useState } from 'react';
import AddPollDialog from './AddPollDialog';
import AllPolls from './AllPolls';
import BetterButton from './BetterButton';
import NavBar from './NavBar';
import PageTitle from './PageTitle';

function PollsPage(props) {
    const [addPollDialogOpen, setAddPollDialogOpen] = useState(false);

    const useStyles = makeStyles((theme) => ({
        pageHeader: {
            margin: "1rem"
        },
        pullUp: {
            marginTop: "-2rem"
        },
        spacer: {
            marginBottom: "2rem",
            marginTop: "1rem"
        },
        pushTop: {
            marginTop: "2rem"
        },
        standardMargin: {
            margin: "0.5rem"
        }
    }));
    const classes = useStyles();

    
    function toggleDialog() {
        setAddPollDialogOpen(!addPollDialogOpen);
    }

    return (<div>
            <NavBar />
            <Grid container spacing={0} justify="center">
                <Grid item xs={10}>
                    <Grid item container className={classes.standardMargin}>
                        <Grid item xs={12} className={classes.spacer}>
                            <PageTitle>
                                Polls feed
                            </PageTitle>
                            <BetterButton  function={toggleDialog}>Create a poll</BetterButton>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className={classes.pullUp}>
                        <AllPolls />
                    </Grid>

                </Grid>
            </Grid>
            <AddPollDialog isOpen={addPollDialogOpen} handleClose={toggleDialog}/>
            </div>);

}
export default PollsPage;