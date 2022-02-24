function CampaignSelector(props) {
  const populateSelectOptions = props.campaigns
    ? props.campaigns.map((camp, index) => {
        return (
          <option key={index} value={camp.name}>
            {camp.name}
          </option>
        );
      })
    : null;

  return (
    <div>
      <h2 id="journal-select-label" className="select-none pb-4">
        Campaign:
      </h2>
      <select
        className="text-gray-700 text-sm px-2 py-0.5 mb-4 w-full rounded focus:text-gray-700 focus:border-gray-700 focus:outline-none"
        aria-label="journal-campaign-select"
        value={props.currentCampaign.name}
        onChange={props.handleSelectChange}
      >
        <option>--- Select a campaign ---</option>
        {populateSelectOptions}
      </select>
    </div>
  );
}

export default CampaignSelector;
