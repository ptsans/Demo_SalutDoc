import styles from 'styles/pages/FormPage.module.css'
import Title from 'components/ui/Title'
import Box from 'components/ui/Box'

export default function FormPage() {
    return (
        <main className={styles.page}>
            <Box>
                <Title text="Форма для записи на прием" />
            </Box>
        </main>
    )
}