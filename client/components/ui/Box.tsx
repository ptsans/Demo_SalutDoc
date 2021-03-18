import styles from 'styles/ui/Box.module.css'
import { PropsWithChildren } from 'react'

export default function Box({children}: PropsWithChildren<any>) {
    return (
        <section className={styles.box}>
            {children}
        </section>
    )
}