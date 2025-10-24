import { ComponentProps } from 'react'

export default function InputForm(props: ComponentProps<"input">){
    return(
        <input
            {...props}
            className="w-full p-3 border-solid border-3 border-cyan-600 bg-white rounded-lg focus:outline-none"
        />
    )
}
