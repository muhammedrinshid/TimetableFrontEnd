import React from 'react'

const LabelDisplayer = ({label,data}) => {
  return (
    <div className="w-[90%] px-3 py-2 rounded-lg  bg-slate-200 ml-1 flex flex-col mt-8">
    <div >
      <p className="text-xs font-light text-slate-500">{label}</p>
      <h6 className="text-sm font-medium">{data}</h6>
    </div>
  </div>
  )
}

export default LabelDisplayer
