'use client'
import React from 'react';
import { Field, ErrorMessage } from 'formik';

const CustomInputFieldWithIcon = ({ name, icon, ...props }) => {
  return (
    <div>
      <div className={'relative'}>
        <span className={'absolute top-3 pl-3 text-primary'}>{icon}</span>
        <Field name={name} {...props} className={'border-primary border-1 p-2 rounded-lg w-full pl-10'}/>
        <ErrorMessage name={name} component="div" className={'text-destructive text-sm pl-1'}/>
      </div>
    </div>
  );
};

export default CustomInputFieldWithIcon;
