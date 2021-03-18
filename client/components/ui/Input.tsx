import clsx from 'clsx'
import styles from 'styles/ui/Input.module.css'
import {InputHTMLAttributes} from 'react'

type InputProps = {
    id: string
    label: string
}   & InputHTMLAttributes<HTMLInputElement>

export default function Input(props: InputProps) {
    const { className, ...otherProps } = props

    return (
        <>
            <label
                htmlFor={props.id}
                className={styles.input__label}
            >
                {props.label}
            </label>
            <input
                className={clsx(styles.input, className)}
                {...otherProps}
            />
        </>
    )
}