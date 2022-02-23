import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
const CAT_STYLE = "pb-4 pr-2 block text-gray-700 font-bold";

function StatsIngameTime(props) {
  const ingameTimeData = prepData(props.sessions);

  //Converts data for time x level Line graph. Adding accumulated time.
  function prepData(array) {
    let accTime = 0;
    let newData = [];
    for (let i = 0; i < array.length; i++) {
      accTime += parseInt(array[i].ingameTime);
      newData.push({
        partyLevel: parseInt(array[i].partyLevel),
        accTime: accTime,
        color: array[i].color,
        name: array[i].name,
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
      //let percent = index / array.length;
      let percent = accTime / maxTime;

      arr.push({
        index: index,
        percent: percent,
        color: colors[i],
      });
      if (endIndex > 0) {
        let endAccTime = array[endIndex].accTime;
        //let endPencent = endIndex / array.length;
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
      if (parseInt(sessions[i].ingameTime) > max) {
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
  const CustomToolTip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-100 p-2">
          <p>{`${payload[0].payload.name}: Day ${label}`} </p>
        </div>
      );
    }
    return null;
  };

  //Passed time x level chart
  const lineChart = (
    <div className="overflow-auto bg-gray-200">
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

        <CartesianGrid stroke="#ccc" scale="linear" />

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
          //tickCount={5}
          //interval={25}
          //minTickGap={10000}
          ticks={getTicks(maxTime, 5)}
        />
        <YAxis
          style={{
            fontSize: "0.75rem",
          }}
          interval={0}
          type="category"
          dataKey="partyLevel"
        />
        <Line
          type="linear"
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
          content={<CustomToolTip />}
        />
      </LineChart>
    </div>
  );

  return (
    <div className="pr-12 flex-col">
      <h2 className={CAT_STYLE}>Time passed:</h2>
      {lineChart}

      <div className="mb-4 overflow-auto"></div>
      <div>
        <div className="flex">
          <h2 className={CAT_STYLE}>Ingame time passed:</h2>
          <p>{maxTime} days</p>
        </div>
        <div className="flex">
          <h2 className={CAT_STYLE}>Average time passed per session:</h2>
          <p>{avgTPS.toFixed(1)} days</p>
        </div>
        <div className="flex">
          <h2 className={CAT_STYLE}>Max time passed in session:</h2>
          <p>
            {maxSession.ingameTime} days in "{maxSession.name}"
          </p>
        </div>
      </div>
    </div>
  );
}

export default StatsIngameTime;
