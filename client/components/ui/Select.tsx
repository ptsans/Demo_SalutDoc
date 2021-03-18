import clsx from 'clsx'
import styles from 'styles/ui/Select.module.css'
import {ClassAttributes, HTMLAttributes, useEffect, useRef, useState} from 'react'

type SelectProps = {
    label?: string
    data: Record<string, any>[]
    datakey: string,
    value: number,
    onChangeOption: (number: number) => void
}   & ClassAttributes<HTMLDivElement>
    & HTMLAttributes<HTMLDivElement>

export default function Select({label = '', onChangeOption, ...props}: SelectProps) {
    const [isOpen, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        return () => {
            document.body.removeEventListener('click', close)

        }
    }, [])

    useEffect(() => {
        if (isOpen) {
            document.body.addEventListener('click', close, {once: true})
        }
    }, [isOpen])

    const {
        className,
        ...otherProps
    } = props

    function close(e: MouseEvent) {
        e && e.target !== ref.current && setOpen(false)
    }

    return (
        <div
            className={clsx(styles.select, className)}
            {...otherProps}
        >
            <div
                className={styles.select__control}
                onClick={() => setOpen((prev) => !prev)}
            >
                <div
                    className={clsx(styles.select__value, isOpen && styles.select__value_active)}
                    ref={ref}
                >
                    { `${label} ${props.data[props.value][props.datakey]}` }
                </div>
                <div className={clsx(styles.select__arrow, isOpen && styles.select__arrow_open)} />
            </div>
            <div
                className={clsx(styles.option, isOpen && styles.open__items_open)}
            >
                {
                    props.data.map((option, index)=> (
                        <button
                            key={index}
                            className={clsx(styles.option__item, (index === props.value) && styles.option__item_active)}
                            onClick={() => onChangeOption(index)}
                        >
                            {option[props.datakey]}
                        </button>
                    ))
                }
            </div>
        </div>
    )
}