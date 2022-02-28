import StatsLeveling from "./StatsLevelling";
import StatsTime from "./StatsTime";
import StatsIngameTime from "./StatsIngameTime";

function StatsInfo(props) {
  let component = null;
  switch (props.stat) {
    case "time":
      component = <StatsTime {...props} />;
      break;
    case "leveling":
      component = <StatsLeveling {...props} />;
      break;
    case "ingameTime":
      component = <StatsIngameTime {...props} />;
      break;
    default:
      component = null;
  }

  return (
    <div className="overflow-x-hidden overflow-y-auto p-3 bg-gray-300 grow ">
      {props.sessions.length > 0 ? component : null}
    </div>
  );
}

export default StatsInfo;
