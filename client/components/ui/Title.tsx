import styles from 'styles/ui/Title.module.css'
import {HTMLAttributes} from "react";
import clsx from "clsx";

type TitleProps = {
    text: string
} & HTMLAttributes<HTMLHeadingElement>

export default function Title({ text = '', className, ...otherProps }: TitleProps) {
    return (
        <h2 className={clsx(styles.title, className)} {...otherProps}>
            {text}
        </h2>
    )
}