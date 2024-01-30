import React from 'react';
import { FormikValues } from "formik";
import { ComponentPropsWithoutRef } from "react";

export type Period = {
  hours: number;
  minutes: number;
  seconds: number;
};

const divStyle = {
  color: "black",
  backgroundColor: "lightgrey",
  padding: "10px",
  fontFamily: "cursive"
};

export function ScoreCard({
    items,
  }: {
    items: { title: string | number; body: string | number }[];
  }) {
    return (
      <div style={divStyle}>
        <div>
          {items.map((i) => (
            <div style={{padding:"5px"}} key={i.title}>
              <div className="p-4">
                <div className="stat-title">{i.title}</div>
                <div className="stat-value sm:text-2xl text-xl">{i.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getFormikFieldErrors = ({
    formik,
    fieldName,
  }: {
    formik: FormikValues;
    fieldName: string;
  }) => {
    if (formik.touched[fieldName] && formik.errors[fieldName])
      return formik.errors[fieldName];
    return null;
  };

  function FormikErrors({
    formik,
    fieldName,
    className,
  }: {
    formik: FormikValues;
    fieldName: string;
    className?: string;
  }) {
    return (
      <div className={className}>
        {formik.touched[fieldName] && formik.errors[fieldName] ? (
          <p className="text-sm text-error">{formik.errors[fieldName]}</p>
        ) : null}
      </div>
    );
  }

interface SelectProps extends ComponentPropsWithoutRef<"select"> {
  options: number[] | string[];
  selectClassName?: string;
  label?: string;
}

export function Select({
  label,
  selectClassName,
  className,
  options,
  ...rest
}: SelectProps) {
  return (
    <div className={`form-control ${className}`}>
      {label && <label className="label">{label}</label>}

      <select className={`select select-bordered ${selectClassName}`} {...rest}>
        {options.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </div>
  );
}

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  label?: string;
  inputClassName?: string;
  fieldName?: string;
  formik?: FormikValues;
  showErrors?: boolean;
}

export const Input = ({
  type,
  placeholder,
  label,
  className,
  inputClassName,
  formik,
  fieldName,
  showErrors = true,
  ...rest
}: InputProps) => {
  return (
    <div className={`form-control ${className}`}>
      {label && <label className="label">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        className={`input input-bordered w-full px-4 py-2 ${inputClassName}
        ${
          formik && fieldName && getFormikFieldErrors({ formik, fieldName })
            ? "input-error"
            : ""
        }
        `}
        {...(formik && fieldName && { ...formik.getFieldProps(fieldName) })}
        {...rest}
      />

      {formik && fieldName && showErrors && (
        <FormikErrors formik={formik} fieldName={fieldName} />
      )}
    </div>
  );
};