import React from "react";
import CreatableSelect from "react-select/creatable";
import { Controller } from "react-hook-form";

const MultiSelectCreatable = ({ data, name, control, defaultValue }) => {
  const colourStyles = {
    option: (styles, { isDisabled, isSelected }) => ({
      ...styles,
      color: isSelected ? "#FFF" : "#000",
      cursor: isDisabled ? "not-allowed" : "pointer",
    }),
  };

  return (
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
            value: item.id,
            label: item.name,
          }))}
          value={field.value.map(value => ({
            value: value.id,
            label: value.name,
          }))}
          onChange={(values) =>
            field.onChange(values.map((value) => {
              if (value.__isNew__) {
                return { id: null, name: value.label };
              }
              return { id: value.value, name: value.label };
            }))
          }
        />
      )}
    />
  );
};

export default MultiSelectCreatable;