import React, { useState } from "react";
import Select from "react-select";

const options = [
  { value: "flip", label: "Flips" },
  { value: "join", label: "Players Joining" },
  { value: "disconnect", label: "Disconnections" },
  { value: "new_word", label: "New Words" },
  { value: "steal", label: "Stolen Words" },
];

function OptionsDropdown(props) {
  const [optionsSelected, setOptionsSelected] = useState(options);

  const handleChange = (selected) => {
    props.setOptionsSelectedSet(new Set(selected.map((elt) => elt["value"])));
    setOptionsSelected(selected);
  };

  return (
    <Select
      isMulti
      options={options}
      isSearchable={false}
      hideSelectedOptions={false}
      controlShouldRenderValue={false}
      closeMenuOnSelect={false}
      onChange={handleChange}
      value={optionsSelected}
    />
  );
}

export default OptionsDropdown;
