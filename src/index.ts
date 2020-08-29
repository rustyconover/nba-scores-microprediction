// What this code does is download the latest load information and publishes to microprediction.org
import { MicroWriter, MicroWriterConfig, MicroReader } from "microprediction";
import { game_write_keys } from "./write-keys";
const bent = require("bent");

import * as _ from "lodash";
const getJSON = bent("json");
import { ScheduledHandler } from "aws-lambda";
import S3 from "aws-sdk/clients/s3";
import moment from "moment-timezone";

async function getScores(): Promise<{
  games: Array<{
    gameId: string;
    isGameActivated: boolean;
    vTeam: {
      teamId: string;
      triCode: string;
      score: string;
    };
    hTeam: {
      triCode: string;
      score: string;
    };
  }>;
}> {
  const now = moment().tz("America/New_York").format("YYYYMMDD");
  return getJSON(`https://data.nba.net/prod/v2/${now}/scoreboard.json`);
}

async function calculateScoreDiff() {
  const games = await getScores();

  const active_games = games.games.filter((v) => v.isGameActivated);

  let value: number = 0;

  if (active_games.length > 0) {
    value =
      parseInt(active_games[0].hTeam.score) -
      parseInt(active_games[0].vTeam.score);
  }

  const writes = [];
  const name = "nba-active-game-1-score-diff";
  let config = await MicroWriterConfig.create({
    write_key: game_write_keys[0],
  });
  const writer = new MicroWriter(config);
  console.log("Writing", name, value);
  writes.push(writer.set(`${name}.json`, value));
  await Promise.all([...writes]);
}

export const handler: ScheduledHandler<any> = async (event) => {
  console.log("Fetching data");
  await calculateScoreDiff();
};
