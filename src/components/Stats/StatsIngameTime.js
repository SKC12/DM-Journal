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
  const ingameTimeData = prepData(props.sessions);

  //Converts data for time x level Line graph. Adding accumulated time.
  function prepData(array) {
    let accTime = 0;
    let newData = [];
    let latestData = {};
    for (let i = 0; i < array.length; i++) {
      let data = {
        partyLevel: parseInt(array[i].partyLevel),
        accTime: accTime,
        color: array[i].color,
        name: array[i].name,
        sessionNumber: i + 1,
      };
      newData.push(data);
      latestData = data;
      accTime += parseInt(array[i].ingameTime);
    }
    if (newData) {
      newData.push({
        partyLevel: latestData.partyLevel,
        accTime: accTime,
        color: latestData.color,
        name: "Current time",
        sessionNumber: "",
      });
    }
    return newData;
  }

  //Creates the gradient for the Line element, based on session color.
  function createGradient() {
    let colorsArray = getColors(props.sessions);
    let percents = getPercents(colorsArray, ingameTimeData);
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
      let accTime = array[index].accTime;

      let endIndex = array.findIndex((entry) => entry.color === colors[i + 1]);

      let percent = accTime / maxTime || 0;

      arr.push({
        index: index,
        percent: percent,
        color: colors[i],
      });
      if (endIndex > 0) {
        let endAccTime = array[endIndex].accTime;
        let endPercent = endAccTime / maxTime;
        arr.push({
          index: endIndex,
          percent: endPercent,
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

  //Returns an array of equalily separated numbers
  function getTicks(maxTime, n) {
    let arr = [];
    for (let i = 0; i < maxTime; i += n) {
      arr.push(i);
    }
    return arr;
  }

  //Returns the longest session
  function getMaxSessionTime(sessions) {
    let max = 0;
    let current = {};
    for (let i = 0; i < sessions.length; i++) {
      if (parseInt(sessions[i].ingameTime) >= max) {
        max = parseInt(sessions[i].ingameTime);
        current = sessions[i];
      }
    }
    return current;
  }

  const numberOfSessions = props.sessions.length;
  const maxTime = ingameTimeData[ingameTimeData.length - 1].accTime;
  const avgTPS = maxTime / numberOfSessions;
  const maxSession = getMaxSessionTime(props.sessions);

  //Custom tootip for the chart
  const ChartCustomToolTip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-100 px-4 py-2 border-gray-500 rounded-lg border">
          <p>
            {`${
              payload[0].payload.sessionNumber
                ? "#" + payload[0].payload.sessionNumber + ":"
                : ""
            } ${payload[0].payload.name} - Day ${label}`}{" "}
          </p>
        </div>
      );
    }
    return null;
  };

  //Passed time x level chart
  const lineChart = (
    <div className="StatsInfo__graph-container">
      <LineChart
        margin={{
          top: 15,
          left: 0,
          right: 35,
          bottom: 15,
        }}
        width={numberOfSessions * 30 + 200}
        height={500}
        data={ingameTimeData}
        scale="linear"
      >
        <defs>
          <linearGradient id="levels" x1={0} y1={0} x2={1} y2={0}>
            {createGradient()}
          </linearGradient>
        </defs>

        <CartesianGrid stroke="#ccc" scale="linear" strokeDasharray="5 5" />

        <XAxis
          style={{
            fontSize: "0.75rem",
          }}
          type="number"
          scale="linear"
          dataKey="accTime"
          height={50}
          angle={45}
          textAnchor="start"
          unit=" days"
          ticks={getTicks(maxTime, 5)}
        />
        <YAxis
          style={{
            fontSize: "0.75rem",
          }}
          interval={0}
          type="category"
          dataKey="partyLevel"
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
          dot={{
            stroke: "gray",
            strokeWidth: 1,
          }}
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
    <div className="StatsInfo__element-container animate__animated animate__fadeIn ">
      <h2 className="generic__label  Stats__label">Time passed:</h2>
      {lineChart}

      <div>
        <div className="StatsInfo__stat-container">
          <h2 className="generic__label  Stats__label">Ingame time passed:</h2>
          <p className="shrink-0">{maxTime} days</p>
        </div>
        <div className="StatsInfo__stat-container">
          <h2 className="generic__label  Stats__label">
            Average time passed per session:
          </h2>
          <p className="shrink-0">{avgTPS.toFixed(1)} days</p>
        </div>
        <div className="StatsInfo__stat-container">
          <h2 className="generic__label  Stats__label">
            Max time passed in a session:
          </h2>
          <p className="flex 1">
            {maxSession.ingameTime} days in "{maxSession.name}"
          </p>
        </div>
      </div>
    </div>
  );
}

export default StatsIngameTime;
