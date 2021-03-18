import styles from 'styles/ui/Title.module.css'

export default function Title({ text = '' }) {
    return (
        <h2 className={styles.title}>
            {text}
        </h2>
    )
}