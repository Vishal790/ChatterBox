import React from 'react'

const Widgets = ({title,value,icon}) => {
  return (
    <div className="flex flex-col gap-y-2 w-2/12 rounded-xl items-center bg-white tab-shadow p-2">
      <h1 className=" border-2 rounded-full w-[3rem] h-[3rem] flex items-center justify-center">{value}</h1>
      {icon}
      <h1>{title}</h1>
    </div>
  );
}

export default Widgets