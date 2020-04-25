import React, {useState, useEffect} from 'react'
import NavBar from './NavBar';
import Grid from '@material-ui/core/Grid';
import "firebase/database";
import "firebase/auth";
import "firebase/functions";
import AllPolls from './AllPolls';
import PageTitle from './PageTitle';
import BetterButton from './BetterButton';
import { makeStyles } from '@material-ui/core/styles';
import AddPollDialog from './AddPollDialog';

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
                <Grid item xs={9}>
                    <Grid item container className={classes.standardMargin}>
                        <Grid item xs={12} className={classes.spacer}>
                            <PageTitle>
                                Polls feed
                            </PageTitle>
                            <BetterButton  function={toggleDialog}>Create a poll</BetterButton>
                        </Grid>
                    </Grid>
                    <Grid item className={classes.pullUp}>
                        <AllPolls />
                    </Grid>

                </Grid>
            </Grid>
            <AddPollDialog isOpen={addPollDialogOpen} handleClose={toggleDialog}/>
            </div>);

}
export default PollsPage;