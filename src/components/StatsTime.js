import HeatMap from "@uiw/react-heat-map";
import Tooltip from "@uiw/react-tooltip";
import {
  differenceInDays,
  intervalToDuration,
  formatDuration,
  format,
  getDay,
} from "date-fns";
import "animate.css";

function StatsTime(props) {
  const colorValuePairs = getColorValuePairs(props.sessions);

  const heatMapData = props.sessions.map((entry, index) => {
    let sessionNumber = index + 1;
    let ColorValueObj = colorValuePairs.find((o) => o.color === entry.color);
    return {
      date: entry.date.replaceAll("-", "/"),
      count: ColorValueObj.value,
      name: entry.name,
      sessionNumber: sessionNumber,
    };
  });

  const numberOfSessions = props.sessions.length;
  const sDate = new Date(heatMapData[0].date);
  const eDate = new Date(heatMapData[heatMapData.length - 1].date);
  const campaignLength = differenceInDays(eDate, sDate);
  const sessionByWeekday = getDataSeparatedByWeekday(heatMapData);

  //Returns an english string of a Date Interval
  function getFormatedDiff(fDate, lDate) {
    let interval = intervalToDuration({
      start: fDate,
      end: lDate,
    });

    return formatDuration(interval, { delimiter: ", " });
  }

  function weekdayToString(weekday) {
    switch (weekday) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      default:
        return "ERROR";
    }
  }

  //Returns a dictionary where each key is weekday with value = number of session on that day.
  function getDataSeparatedByWeekday(data) {
    let dataObj = {};
    for (let i = 0; i < data.length; i++) {
      let weekday = weekdayToString(getDay(new Date(data[i].date)));
      dataObj[weekday] = dataObj[weekday] + 1 || 1;
    }
    return dataObj;
  }

  //Generates the individual weekday elements
  const weekdayElements = Object.keys(sessionByWeekday)
    .sort((a, b) => {
      return sessionByWeekday[b] - sessionByWeekday[a];
    })
    .map((entry) => {
      return (
        <>
          <h2 className="font-bold">{entry}:</h2>
          <p>{sessionByWeekday[entry]} sessions</p>
        </>
      );
    });

  function getColorValuePairs(data) {
    let arr = [];
    let value = 1;
    for (let i = 0; i < data.length; i++) {
      if (arr.filter((e) => e.color === data[i].color).length === 0) {
        arr.push({ color: data[i].color, value: value });
        value++;
      }
    }
    return arr;
  }

  function getPanelColors(colorValuePairs) {
    let obj = {
      0: "#b8b8b8",
    };
    for (let i = 0; i < colorValuePairs.length; i++) {
      obj[colorValuePairs[i].value + 1] = colorValuePairs[i].color;
    }
    return obj;
  }

  return (
    <div className="StatsInfo__element-container animate__animated animate__fadeIn">
      <h2 className="StatsInfo__label">Sessions:</h2>
      <div className="StatsInfo__graph-container">
        <HeatMap
          className="h-[140px]"
          rectSize={14}
          value={heatMapData}
          legendCellSize={0}
          width={differenceInDays(eDate, sDate) * 2.3 + 100}
          startDate={sDate}
          endDate={eDate}
          panelColors={getPanelColors(colorValuePairs)}
          rectRender={(props, data) => {
            if (!data.count) return <rect {...props} />;
            return (
              <Tooltip
                key={data.name}
                placement="top"
                content={`${format(new Date(data.date), "MMMM dd, yyyy")} - #${
                  data.sessionNumber
                } ${data.name}`}
              >
                <rect {...props} />
              </Tooltip>
            );
          }}
        />
      </div>
      <div>
        <div className="StatsInfo__stat-container">
          <h2 className="generic__label Stats__label">Number of sessions:</h2>
          <p className="shrink-0">{numberOfSessions}</p>
        </div>
        <div>
          <h2 className="generic__label Stats__label">Session days:</h2>
          <div className="StatsTime__weekdays">{weekdayElements}</div>
        </div>
        <div className="StatsInfo__stat-container">
          <h2 className="generic__label Stats__label">First Session:</h2>
          <p className="shrink-0">{format(sDate, "MMMM dd, yyyy")}</p>
        </div>
        <div className="StatsInfo__stat-container">
          <h2 className="generic__label Stats__label">Last Session:</h2>
          <p className="shrink-0">{format(eDate, "MMMM dd, yyyy")}</p>
        </div>
        <div className="StatsInfo__stat-container">
          <h2 className="generic__label Stats__label">Campaign Duration:</h2>
          <p className="">
            {campaignLength} days ({getFormatedDiff(sDate, eDate)})
          </p>
        </div>
        <div className="StatsInfo__stat-container">
          <h2 className="generic__label Stats__label">
            Average time between sessions:
          </h2>
          <p className="shrink-0">
            {(campaignLength / numberOfSessions).toFixed(2)} days
          </p>
        </div>
      </div>
    </div>
  );
}

export default StatsTime;
