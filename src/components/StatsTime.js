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
const CAT_STYLE = "pr-2 block text-gray-700 font-bold max-w-[50vw]";

function StatsTime(props) {
  const heatMapData = props.sessions.map((entry, index) => {
    let sessionNumber = index + 1;
    return {
      date: entry.date.replaceAll("-", "/"),
      count: 1,
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
    .map((entry, index) => {
      return (
        <div className="flex w-48 grow" key={index}>
          <h2 className="pb-1 pr-2 block text-gray-700 font-bold">{entry}:</h2>
          <p>{sessionByWeekday[entry]} sessions</p>
        </div>
      );
    });

  return (
    <div className="animate__animated animate__fadeIn md:pl-24 md:pt-12 md:pr-12 flex-col">
      <h2 className={`${CAT_STYLE} pb-4`}>Sessions:</h2>
      <div className="mb-4 overflow-auto">
        <HeatMap
          className="h-[140px] bg-gray-200"
          rectSize={14}
          value={heatMapData}
          legendCellSize={0}
          width={differenceInDays(eDate, sDate) * 2.3 + 100}
          startDate={sDate}
          endDate={eDate}
          panelColors={{
            0: "#b8b8b8",
            1: "#2b7a1f",
          }}
          rectRender={(props, data) => {
            if (!data.count) return <rect {...props} />;
            return (
              <Tooltip
                key={props.key}
                placement="top"
                content={`${format(new Date(data.date), "MMMM dd, yyyy")} - #${
                  data.sessionNumber
                } ${data.name} `}
              >
                <rect {...props} />
              </Tooltip>
            );
          }}
        />
      </div>
      <div>
        <div className="flex pb-4">
          <h2 className={CAT_STYLE}>Number of sessions:</h2>
          <p className="shrink-0">{numberOfSessions}</p>
        </div>
        <div className="pb-4">
          <h2 className={`${CAT_STYLE} pb-4`}>Session days:</h2>
          <div className="pl-4 ">{weekdayElements}</div>
        </div>
        <div className="flex pb-4">
          <h2 className={CAT_STYLE}>First Session:</h2>
          <p className="shrink-0">{format(sDate, "MMMM dd, yyyy")}</p>
        </div>
        <div className="flex pb-4">
          <h2 className={CAT_STYLE}>Last Session:</h2>
          <p className="shrink-0">{format(eDate, "MMMM dd, yyyy")}</p>
        </div>
        <div className="flex pb-4">
          <h2 className={CAT_STYLE}>Campaign Duration:</h2>
          <p className="">
            {campaignLength} days ({getFormatedDiff(sDate, eDate)})
          </p>
        </div>
        <div className="flex pb-4 items-center">
          <h2 className={CAT_STYLE}>Average time between sessions:</h2>
          <p className="shrink-0">
            {(campaignLength / numberOfSessions).toFixed(2)} days
          </p>
        </div>
      </div>
    </div>
  );
}

export default StatsTime;
