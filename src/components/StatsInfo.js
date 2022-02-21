import StatsSessions from "./StatsSessions";
import StatsTime from "./StatsTime";

// const LABEL_STYLE = "w-52 block text-gray-700 font-bold pb-3";
// const INPUT_STYLE =
//   "bg-gray-200 appearance-none border-2 border-gray-200 rounded p-1 text-gray-700 leading-tight focus:outline-none focus:bg-gray-100 focus:border-gray-700";

function StatsInfo(props) {
  let component = null;
  switch (props.stat) {
    case "time":
      component = <StatsTime {...props} />;
      break;
    case "sessions":
      component = <StatsSessions {...props} />;
      break;
    default:
      component = null;
  }

  return (
    <div className="pl-24 pt-12 overflow-hidden p-3 bg-gray-300 grow">
      {component}
    </div>
  );
}

export default StatsInfo;
