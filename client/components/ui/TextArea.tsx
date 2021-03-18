import styles from 'styles/ui/TextArea.module.css'
import {TextareaHTMLAttributes} from "react";
import clsx from "clsx";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export default function TextArea({ className, ...props }: TextAreaProps) {
    return (
        <textarea
            className={clsx(styles.textarea, className)}
            {...props}
        />
    )
}