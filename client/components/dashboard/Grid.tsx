import {ClassAttributes, HTMLAttributes} from "react";
import styles from 'styles/pages/dashboard/Grid.module.css'

type GridProps = {

}   & ClassAttributes<HTMLDivElement>
    & HTMLAttributes<HTMLDivElement>

export default function Grid({children}: GridProps) {
    return (
        <section className={styles.grid}>
            {children}
        </section>
    )
}