import { differenceInDays, format } from "date-fns";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
const CAT_STYLE = "pb-4 pr-2 block text-gray-700 font-bold";

function StatsSessions(props) {
  function createGradient() {
    let colorsArray = getColors(props.sessions);
    let percents = getPercents(colorsArray, props.sessions);
    return percents.map((entry) => {
      return <stop offset={entry.percent} stopColor={entry.color}></stop>;
    });
  }

  //console.log(createGradient());

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

  function getColors(array) {
    let arr = [];

    array.forEach((entry) => {
      if (arr[arr.length - 1] !== entry.color) {
        arr.push(entry.color);
      }
    });
    return arr;
  }

  //console.log(props.sessions);
  const sessionsData = props.sessions.map((entry) => {
    return {
      date: entry.date.replaceAll("-", "/"),
      count: 1,
    };
  });
  const numberOfSessions = props.sessions.length;
  const sDate = new Date(sessionsData[0].date);
  const eDate = new Date(sessionsData[sessionsData.length - 1].date);
  const campaignLength = differenceInDays(eDate, sDate);

  return (
    <div className="pr-12 flex-col">
      <h2 className={CAT_STYLE}>Sessions:</h2>
      <div className="overflow-auto bg-gray-200">
        <LineChart
          margin={{
            top: 15,
            left: 0,
            right: 100,
          }}
          width={numberOfSessions * 30}
          height={500}
          data={props.sessions}
        >
          <defs>
            <linearGradient id="levels" x1={0} y1={0} x2={1} y2={0}>
              {createGradient()}
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#ccc" />
          <Line
            type="monotone"
            dataKey="partyLevel"
            strokeWidth={3}
            dot={false}
            stroke="url(#levels)"
          />

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
          />
          <Tooltip
            style={{
              fontSize: "0.65rem",
            }}
          />
        </LineChart>
      </div>

      <div className="mb-4 overflow-auto"></div>
      <div>
        <div className="flex">
          <h2 className={CAT_STYLE}>Number of sessions:</h2>
          <p>{numberOfSessions}</p>
        </div>
        <div className="flex">
          <h2 className={CAT_STYLE}>First Session:</h2>
          <p>{format(sDate, "MMMM dd, yyyy")}</p>
        </div>
        <div className="flex">
          <h2 className={CAT_STYLE}>Last Session:</h2>
          <p>{format(eDate, "MMMM dd, yyyy")}</p>
        </div>
        <div className="flex">
          <h2 className={CAT_STYLE}>Campaign Duration:</h2>
          <p>{campaignLength} days</p>
        </div>
        <div className="flex">
          <h2 className={CAT_STYLE}>Average time between sessions:</h2>
          <p>{(campaignLength / numberOfSessions).toFixed(2)} days</p>
        </div>
      </div>
    </div>
  );
}

export default StatsSessions;
