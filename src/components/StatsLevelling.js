import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label,
} from "recharts";
const CAT_STYLE = "pb-4 pr-2 block text-gray-700 font-bold";

function StatsIngameTime(props) {
  //Creates the gradient for the Line element, based on session color.
  function createGradient() {
    let colorsArray = getColors(props.sessions);
    let percents = getPercents(colorsArray, props.sessions);
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
        let endPencent = endIndex / array.length;
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
    let levelsDictionary = splitLevels(props.sessions);
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
        <div className="flex w-48 grow" key={index}>
          <h2 className="pb-1 pr-2 block text-gray-700 font-bold">
            Level {entry}:
          </h2>
          <p>{indLevels[entry].length} sessions</p>
        </div>
      );
    }
  );

  const numberOfSessions = props.sessions.length;
  const maxLvl = props.sessions[props.sessions.length - 1].partyLevel;
  const avgTTL = numberOfSessions / maxLvl;

  //Custom tootip for the chart
  const ChartCustomToolTip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-100 px-4 py-2 border-gray-500 rounded-lg border">
          <p>{`${label} - Level ${payload[0].payload.partyLevel}`} </p>
        </div>
      );
    }
    return null;
  };

  //Session x level line chart
  const lineChart = (
    <div className="overflow-auto bg-gray-200">
      <LineChart
        margin={{
          top: 15,
          left: 0,
          right: 100,
        }}
        width={numberOfSessions * 30 + 200}
        height={500}
        data={props.sessions}
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
    <div className="pr-12 flex-col">
      <h2 className={CAT_STYLE}>Levels:</h2>
      {lineChart}

      <div className="mb-4 overflow-auto"></div>
      <div>
        <h2 className={CAT_STYLE}>Time to level</h2>
        <div className="bg-gray-200 h-40 pl-4 mb-4 flex flex-col flex-wrap gap-2 overflow-x-auto">
          {individualLevelElements}
        </div>

        <div className="flex">
          <h2 className={CAT_STYLE}>Number of sessions:</h2>
          <p>{numberOfSessions}</p>
        </div>
        <div className="flex">
          <h2 className={CAT_STYLE}>Average time to level:</h2>
          <p>{avgTTL.toFixed(1)} sessions</p>
        </div>
      </div>
    </div>
  );
}

export default StatsIngameTime;
