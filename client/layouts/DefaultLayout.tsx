import {PropsWithChildren, ReactNode} from 'react'
import styles from 'styles/layouts/DefaultLayout.module.css'

export default function DefaultLayout(props: PropsWithChildren<ReactNode>) {
    return (
        <main className={styles.layout}>
            {props.children}
        </main>
    )
}