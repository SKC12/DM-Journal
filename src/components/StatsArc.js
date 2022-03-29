import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export default function StatsArc(props) {
  let colorsArray = getColors(props.sessions);
  let ingameTimeData = getIngameTimeData(props.sessions);
  console.log(ingameTimeData);
  console.log(colorsArray);

  function getIngameTimeData(array) {
    let dataObj = {};
    for (let i = 0; i < array.length; i++) {
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

  function getColors(array) {
    let arr = [];
    array.forEach((entry) => {
      if (arr[arr.length - 1] !== entry.color) {
        arr.push(entry.color);
      }
    });
    return arr;
  }
  const ingameTimePieChart = (
    <ResponsiveContainer width={500} height={200}>
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
            console.log("handling label?");
            const RADIAN = Math.PI / 180;
            // eslint-disable-next-line
            const radius = 25 + innerRadius + (outerRadius - innerRadius);
            // eslint-disable-next-line
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            // eslint-disable-next-line
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                style={{
                  fontSize: "0.85rem",
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

  return (
    <div className="StatsInfo__element-container animate__animated animate__fadeIn">
      <h2 className="generic__label  Stats__label">Campaign Arcs:</h2>
      <div className="m-4">
        <h2 className="generic__label  Stats__label">Ingame time</h2>
        {ingameTimePieChart}
      </div>
    </div>
  );
}
