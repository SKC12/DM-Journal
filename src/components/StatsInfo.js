import StatsLeveling from "./StatsLevelling";
import StatsTime from "./StatsTime";
import StatsIngameTime from "./StatsIngameTime";
import "../style/StatsInfo.css";

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
    <div className="StatsInfo__container">
      {props.sessions.length > 0 ? component : null}
    </div>
  );
}

export default StatsInfo;
