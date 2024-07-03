import React from "react";

import CreatableSelect from "react-select/creatable";
import { Controller } from "react-hook-form";

const MultiSelectCreatable = ({ data, name, control,defaultValue }) => {

  const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        color: isSelected ? "#FFF" : "#000", // Set the text color
        cursor: isDisabled ? "not-allowed" : "pointer",
        // Add any other styles you want
      };
    },
  };


  return  (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <CreatableSelect
          {...field}
          placeholder="Qualified Subjects"
          styles={colourStyles}
          isMulti
          options={data.map((item) => ({
            value: item.subject,
            label: item.subject,
          }))}
          value={field.value.map(value => ({ value, label: value }))}
          onChange={(values) =>
            field.onChange(values.map((value) => value.value))
          }
        />
      )}
    />
  );
};

export default MultiSelectCreatable;
