import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { nanoid } from "nanoid";

export default function StatsArc(props) {
  let colorsArray = getColors(props.sessions);
  let ingameTimeData = getIngameTimeData(props.sessions);
  let sessionData = getSessionData(props.sessions);

  //Gets array of Arc:IngameTime objects for reacharts pie chart.
  function getIngameTimeData(array) {
    let dataObj = {};
    for (let i = 0; i < array.length; i++) {
      if (!array[i].arc) {
        return [];
      }
      if (!dataObj[array[i].arc]) {
        dataObj[array[i].arc] = parseInt(array[i].ingameTime);
      } else {
        dataObj[array[i].arc] =
          parseInt(dataObj[array[i].arc]) + parseInt(array[i].ingameTime);
      }
    }
    let dataArr = [];
    for (const [key, value] of Object.entries(dataObj)) {
      dataArr.push({ name: key, value: value });
    }
    return dataArr;
  }

  //Gets array of Arc:Session objects for reacharts pie chart.

  function getSessionData(array) {
    let dataObj = {};
    for (let i = 0; i < array.length; i++) {
      if (!array[i].arc) {
        return [];
      }
      if (!dataObj[array[i].arc]) {
        dataObj[array[i].arc] = 1;
      } else {
        dataObj[array[i].arc] = dataObj[array[i].arc] + 1;
      }
    }
    let dataArr = [];
    for (const [key, value] of Object.entries(dataObj)) {
      dataArr.push({ name: key, value: value });
    }
    return dataArr;
  }

  //Gets array of colors that represent each first session of each arc.
  function getColors(array) {
    let colorArr = [];
    let arcArr = [];
    array.forEach((entry, i) => {
      if (!arcArr.includes(entry.arc)) {
        arcArr.push(entry.arc);
        colorArr.push(entry.color);
      }
    });
    return colorArr;
  }

  const ingameTimePieChart = (
    <ResponsiveContainer height={250} minWidth={550} key={nanoid()}>
      <PieChart>
        <Pie
          data={ingameTimeData}
          cx="50%"
          cy="50%"
          dataKey="value"
          legendType="line"
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            value,
            index,
          }) => {
            const RADIAN = Math.PI / 180;
            // eslint-disable-next-line
            const radius = 20 + innerRadius + (outerRadius - innerRadius);
            // eslint-disable-next-line
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            // eslint-disable-next-line
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                style={{
                  fontSize: "0.8rem",
                }}
                fill="#374151"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
              >
                {`${ingameTimeData[index].name}
                 (${value} days)`}
              </text>
            );
          }}
        >
          {ingameTimeData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colorsArray[index % colorsArray.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );

  const sessionsPieChart = (
    <ResponsiveContainer height={250} minWidth={550} key={nanoid()}>
      <PieChart>
        <Pie
          data={sessionData}
          cx="50%"
          cy="50%"
          dataKey="value"
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            value,
            index,
          }) => {
            const RADIAN = Math.PI / 180;
            // eslint-disable-next-line
            const radius = 20 + innerRadius + (outerRadius - innerRadius);
            // eslint-disable-next-line
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            // eslint-disable-next-line
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                style={{
                  fontSize: "0.8rem",
                }}
                fill="#374151"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
              >
                {`${sessionData[index].name}
                 (${value} s.)`}
              </text>
            );
          }}
        >
          {sessionData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colorsArray[index % colorsArray.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="StatsInfo__element-container animate__animated animate__fadeIn">
      {ingameTimeData.length === 0 ? (
        <h2 className="generic__label  Stats__label">
          There was an error in your data. Make sure all your sessions contain
          Campaign Arc information.
        </h2>
      ) : (
        <>
          <h2 className="generic__label  Stats__label">Campaign Arcs:</h2>
          <div className="m-4">
            <h2 className="generic__label  Stats__label">Ingame time</h2>
            <div className="StatsInfo__Piechart-container">
              {ingameTimePieChart}
            </div>
          </div>
          <div className="m-4">
            <h2 className="generic__label  Stats__label">Sessions</h2>
            <div className="StatsInfo__Piechart-container">
              {sessionsPieChart}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
