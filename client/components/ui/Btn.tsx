import {ButtonHTMLAttributes, forwardRef} from 'react'
import clsx from 'clsx'
import styles from 'styles/ui/Btn.module.css'

type BtnProps = {
  label: string
} & ButtonHTMLAttributes<HTMLButtonElement>

const Btn = forwardRef(({className, label, ...props}: BtnProps, ref) => {
    return (
        <button
            className={clsx(styles.button, className)}
            {...ref}
            {...props}
        >
            {label}
        </button>
    )
})

export default Btn