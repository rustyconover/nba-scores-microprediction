# Import NBA scores to Microprediction

This module loads data from the NBA scoreboard to Microprediction.org.

## Loaded Data

The data is sourced from:

https://data.nba.net/prod/v2/${now}/scoreboard.json

Where now is the current date.

## Implementation Details

Right now it just assumes there will be one game active at a time,
this seems likely as its time for the playoff. When the regular
season starts again there will need to be a way to make multiple
concurrent games to different predictive streams.

The value produced is the visiting teams score substracted from home
team's score. If there is no active game the value of zero is set
on the stream.

There is a single Lambda function that is run as a scheduled
CloudWatch Event every minute pull new data. This function
is created using webpack to amalgamate the various imported modules.

It runs in about 2 seconds or less every minute.

The write keys are not included in this repo.
