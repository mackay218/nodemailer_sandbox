const express = require('express');

const router = express.Router();

const faker = require('faker');
const moment = require('moment');

const pool = require('../modules/pool');

router.post('/', (req, res) => {
    console.log('trying to generate mock player data');

    for (let i = 0; i < 10000; i++) {

        //account status_type
        const statusTypeArr = ['active', 'suspended', 'banned'];

        const statusTypePicker = Math.round(Math.random() * (2 - 0) + 0);

        const statusType = statusTypeArr[statusTypePicker];

        statusReason = null;

        if (statusType === 'suspended') {
            statusReason = 'committed to team/school';
        }
        else if (statusType === 'banned') {
            statusReason = 'fake account'
        }

        //activity log
        const activityTime = new Date();
        const activityType = 'logged in';

        let createdOn = new Date();
        createdOn = moment(createdOn).format('L');

        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const emailAddress = faker.internet.email();
        const fakePassword = faker.lorem.word();
        const role = 'player';

        const phoneNumber = faker.phone.phoneNumber();

        const profilePic = faker.image.imageUrl();
        let birthDate = faker.date.past();
        birthDate = moment(birthDate).format('L');
        const playerInfo = faker.lorem.sentence();

        //math.random() functions for gpa, act score, sat score, height, weight, goals, assists,
        // points, wins, losses, save%, shutouts
        const gradeYear = Math.round(Math.random() * (12 - 10) + 10);

        const gpaScore = Math.random() * (5.00 - 1.00) + 1.00;
        const actScore = Math.round(Math.random() * (36 - 0) + 0);

        const height = Math.round(Math.random() * (7 - 4) + 4) + "' " + Math.round(Math.random() * (11)) + '"';
        const weight = Math.round(Math.random() * (300 - 100) + 100);

        const positionId = Math.round(Math.random() * (3 - 1) + 1);
        const leagueId = Math.round(Math.random() * (16 - 1) + 1);

        const teamName = faker.company.companyName();
        const school = faker.address.city() + ' High School';

        const videoLink = 'https://www.youtube.com/watch?v=dwDpSKDyKRU';

        let goals = null;
        let assists = null;
        let points = null;

        let wins = null;
        let losses = null;
        let ties = null;
        let gamesPlayed = null;
        let savePercent = null;
        let shutOuts = null;
        let goalsAgainst = null;

        const guardian = false;

        //if forward or defense
        if (positionId <= 2) {
            goals = Math.round(Math.random() * (100 - 1) + 1);
            assists = Math.round(Math.random() * (100 - 1) + 1);
            points = Math.round(Math.random() * (150 - 1) + 1);
        }
        //if goalie
        else if (positionId === 3) {
            wins = Math.round(Math.random() * (20 - 1) + 1);
            losses = Math.round(Math.random() * (20 - 1) + 1);
            ties = Math.round(Math.random() * (20 - 1) + 1);
            savePercent = Math.random() * (90.00 - 1.00) + 1.00;
            gamesPlayed = wins + losses + ties;
            goalsAgainst = Math.round(Math.random() * (30 - 1) + 1);
        }

        //insert school and teamName into school and team tables and get back id to insert 
        // into player_stats table

        (async () => {
            const client = await pool.connect();

            try {
                let queryText = `INSERT INTO account_status(status_type, reason) 
                                VALUES ($1, $2) RETURNING "id";`;
                let values = [statusType, statusReason];

                const accountStatusResult = await client.query(queryText, values);

                let accountStatusId = accountStatusResult.rows[0].id;

                queryText = `INSERT INTO activity_log(time, activity_type)
                            VALUES ($1, $2) RETURNING "id";`;
                values = [activityTime, activityType];

                const activityLogResult = await client.query(queryText, values);

                let activityLogId = activityLogResult.rows[0].id;

                queryText = `INSERT INTO person(email, password, role, status_id, activity_log_id)
                            VALUES ($1, $2, $3, $4, $5) RETURNING "id";`;
                values = [emailAddress, fakePassword, role, accountStatusId, activityLogId];

                const personResult = await client.query(queryText, values);

                let personId = personResult.rows[0].id;

                queryText = `INSERT INTO school(school_name) VALUES ($1) RETURNING "id";`;
                values = [school];

                const schoolResult = await client.query(queryText, values);

                let schoolId = schoolResult.rows[0].id;

                queryText = `INSERT INTO team(team_name) VALUES ($1) RETURNING "id";`;
                values = [teamName];

                const teamResult = await client.query(queryText, values);

                let teamId = teamResult.rows[0].id;

                queryText = `INSERT INTO player_stats(person_id, league_id, team_id, school_id, position_id, 
                            first_name, last_name, phone_number, birth_date, height, weight, gpa, act_score, 
                            school_year, image_path, video_link, goals, assists, points, games_played, wins, 
                            losses, ties, save_percent, shutouts, goals_against, guardian, created_on, player_info)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,
                                    $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29);`;
                values = [personId, leagueId, teamId, schoolId, positionId, firstName, lastName,
                    phoneNumber, birthDate, height, weight, gpaScore, actScore, gradeYear, profilePic,
                    videoLink, goals, assists, points, gamesPlayed, wins, losses, ties, savePercent,
                    shutOuts, goalsAgainst, guardian, createdOn, playerInfo];

                const result = await client.query(queryText, values);

                await client.query('COMMIT');
                res.sendStatus(201);
            } catch (error) {
                console.log('ROLLBACK', error);
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }
        })().catch((error) => {
            console.log('CATCH', error);
            res.sendStatus(500);
        });
    }

});

router.post('/coaches', (req, res) => {

    for(let i = 0; i < 300; i++){
        //account status_type
        const statusTypeArr = ['active', 'suspended', 'banned'];

        const statusTypePicker = Math.round(Math.random() * (2 - 0) + 0);

        const statusType = statusTypeArr[statusTypePicker];

        statusReason = null;

        if (statusType === 'suspended') {
            statusReason = 'payment due';
        }
        else if (statusType === 'banned') {
            statusReason = 'fake account'
        }

        //activity log
        const activityTime = new Date();
        const activityType = 'logged in';

        const emailAddress = faker.internet.email();
        const fakePassword = faker.lorem.word();
        const role = 'coach';

        const inviteCode = faker.finance.bitcoinAddress();

        (async () => {
            const client = await pool.connect();

            try {
                let queryText = `INSERT INTO account_status(status_type, reason) 
                                VALUES ($1, $2) RETURNING "id";`;
                let values = [statusType, statusReason];

                const accountStatusResult = await client.query(queryText, values);

                let accountStatusId = accountStatusResult.rows[0].id;

                queryText = `INSERT INTO activity_log(time, activity_type)
                            VALUES ($1, $2) RETURNING "id";`;
                values = [activityTime, activityType];

                const activityLogResult = await client.query(queryText, values);

                let activityLogId = activityLogResult.rows[0].id;

                queryText = `INSERT INTO person(email, password, role, invite, status_id, activity_log_id)
                            VALUES ($1, $2, $3, $4, $5, $6) RETURNING "id";`;
                values = [emailAddress, fakePassword, role, inviteCode, accountStatusId, activityLogId];

                const personResult = await client.query(queryText, values);

                let personId = personResult.rows[0].id;

            } catch (error) {
                console.log('ROLLBACK', error);
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }
        })().catch((error) => {
            console.log('CATCH', error);
            res.sendStatus(500);
        });

    }

});

module.exports = router;