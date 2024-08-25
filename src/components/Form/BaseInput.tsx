import { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    labelAdditionClass?: string;
    inputAdditionClass?: string;
    twColor?: string;
}  

const BaseInput = ({label, labelAdditionClass = '', twColor = "denim", inputAdditionClass = '', ...inputProps}: Props) => {
  console.log(twColor, "color")
  return (
    <div className='w-full flex flex-col'>
        {label && <label className={`text-${twColor}-600 ${labelAdditionClass}`}>{label}</label>}
        <input className={`rounded-radius-6 text-size-base outline-none border border-${twColor}-600 py-[9px] pl-4 pr-[6px] ${inputAdditionClass}`} {...inputProps} />
    </div>
  )
}

export default BaseInput
