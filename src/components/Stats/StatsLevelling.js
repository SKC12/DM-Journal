import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label,
} from "recharts";
import "animate.css";
import "../../style/StatsInfo.css";

function StatsIngameTime(props) {
  const sessionsData = props.sessions.map((entry, index) => {
    let sessionNumber = index + 1;
    return {
      name: entry.name,
      color: entry.color,
      partyLevel: entry.partyLevel,
      sessionNumber: sessionNumber,
    };
  });
  //Creates the gradient for the Line element, based on session color.
  function createGradient() {
    let colorsArray = getColors(sessionsData);
    let percents = getPercents(colorsArray, sessionsData);
    return percents.map((entry, index) => {
      return (
        <stop key={index} offset={entry.percent} stopColor={entry.color}></stop>
      );
    });
  }

  //Returns array with the % at which each color starts and stops.
  function getPercents(colors, array) {
    let arr = [];
    for (let i = 0; i < colors.length; i++) {
      let index = array.findIndex((entry) => entry.color === colors[i]);
      let endIndex = array.findIndex((entry) => entry.color === colors[i + 1]);
      let percent = index / array.length;

      arr.push({
        index: index,
        percent: percent,
        color: colors[i],
      });
      if (endIndex > 0) {
        let endPencent = endIndex / (array.length - 1);
        arr.push({
          index: endIndex,
          percent: endPencent,
          color: colors[i],
        });
      } else {
        arr.push({
          index: array.length - 1,
          percent: 1,
          color: colors[i],
        });
      }
    }
    return arr;
  }

  //Returns an array with all used colors
  function getColors(array) {
    let arr = [];
    array.forEach((entry) => {
      if (arr[arr.length - 1] !== entry.color) {
        arr.push(entry.color);
      }
    });
    return arr;
  }

  //Returns an Object where each key is a level with value equal to an array of session
  function getIndividualLevels() {
    let levelsDictionary = splitLevels(sessionsData);
    return levelsDictionary;
  }

  function splitLevels(array) {
    let levelsObject = {};
    array.forEach((entry) => {
      if (levelsObject[entry.partyLevel] === undefined) {
        levelsObject[entry.partyLevel] = [entry];
      } else {
        levelsObject[entry.partyLevel].push(entry);
      }
    });
    return levelsObject;
  }

  //Generates the individual level elements
  const individualLevelElements = Object.keys(getIndividualLevels()).map(
    (entry, index) => {
      let indLevels = getIndividualLevels();
      return (
        <div className="StatsLevelling__levels-level" key={index}>
          <h2 className="font-bold">Level {entry}:</h2>
          <p>{indLevels[entry].length} sessions</p>
        </div>
      );
    }
  );

  const numberOfSessions = sessionsData.length;
  const maxLvl = sessionsData[sessionsData.length - 1].partyLevel;
  const avgTTL = numberOfSessions / maxLvl;

  //Custom tootip for the chart
  const ChartCustomToolTip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-100 px-4 py-2 border-gray-500 rounded-lg border">
          <p>
            {`#${payload[0].payload.sessionNumber}: ${label} - Level ${payload[0].payload.partyLevel}`}{" "}
          </p>
        </div>
      );
    }
    return null;
  };

  //Session x level line chart
  const lineChart = (
    <div className="StatsInfo__graph-container">
      <LineChart
        margin={{
          top: 15,
          left: 0,
          right: 100,
        }}
        width={numberOfSessions * 30 + 200}
        height={500}
        data={sessionsData}
      >
        <defs>
          <linearGradient id="levels" x1={0} y1={0} x2={1} y2={0}>
            {createGradient()}
          </linearGradient>
        </defs>

        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />

        <XAxis
          style={{
            fontSize: "0.65rem",
          }}
          dataKey="name"
          textAnchor="start"
          type="category"
          minTickGap={5}
          angle={35}
          height={150}
          interval={0}
        />
        <YAxis
          style={{
            fontSize: "0.75rem",
          }}
          interval={0}
          type="category"
        >
          <Label
            style={{
              fontSize: "0.75rem",
            }}
            fill="#666"
            strokeWidth={0.5}
            value="Party level"
            angle={270}
          />
        </YAxis>
        <Line
          type="monotone"
          dataKey="partyLevel"
          strokeWidth={3}
          dot={false}
          stroke="url(#levels)"
        />
        <Tooltip
          style={{
            fontSize: "0.65rem",
          }}
          content={<ChartCustomToolTip />}
        />
      </LineChart>
    </div>
  );

  return (
    <div className="StatsInfo__element-container animate__animated animate__fadeIn">
      <h2 className="generic__label  Stats__label">Levels:</h2>
      {lineChart}

      <div>
        <h2 className="generic__label">Time to level:</h2>
        <div className="StatsLevelling__levels  Stats__label">
          {individualLevelElements}
        </div>

        <div className="StatsInfo__stat-container">
          <h2 className="generic__label  Stats__label">Number of sessions:</h2>
          <p>{numberOfSessions}</p>
        </div>
        <div className="StatsInfo__stat-container">
          <h2 className="generic__label  Stats__label">
            Average time to level:
          </h2>
          <p>{avgTTL.toFixed(1)} sessions</p>
        </div>
      </div>
    </div>
  );
}

export default StatsIngameTime;
