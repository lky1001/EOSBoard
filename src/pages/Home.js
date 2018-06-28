import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import "../styles/Home.scss";

const Home = () => {
    return  (
        <div className="root">
            <header className="header">
                Welcome to the EOS tweet.
            </header>

            <section className="content">
                <Grid container spacing={24}>
                    <Grid item xs={12} sm={6} md={8}>
                        <main>
                            <Paper className="paper">Tweet goes here.</Paper>
                        </main>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <aside>
                            <Paper className="paper">Chart goes here.</Paper>
                        </aside>
                    </Grid>
                </Grid>
            </section>
        </div>
    );
};

export default Home;