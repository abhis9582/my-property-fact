"use client";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
export default function MpfMultiSelectDropdown({
  label = "MultiSelect Dropdown",
  options = [
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
  ],
  selectedValues,
  onSelect,
  onRemove,
}) {
  const [showOptions, setShowOptions] = useState(false);
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      {/* <Form> */}
        <Form.Control type="text" onClick={()=> setShowOptions(true)}/>
        {showOptions && <ul className="list-unstyled mt-2 bg-light shadow-sm p-2 rounded">
          {options.map((option, index) => (
            <li
              className="p-2 text-captilaise"
              key={index}
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) => (e.target.style.background = "#f1f1f1")}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              <Form.Check
                type="checkbox"
                label={option}
                checked={
                  selectedValues ? selectedValues.includes(option) : false
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    onSelect && onSelect(option);
                  } else {
                    onRemove && onRemove(option);
                  }
                }}
              />
              {/* {option} */}
            </li>
          ))}
        </ul>}
      {/* </Form> */}
    </div>
  );
}
