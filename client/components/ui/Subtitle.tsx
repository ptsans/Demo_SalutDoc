import Title from './Title'

type SubtitleProps = {
    text: string
}
export default function Subtitle({text}: SubtitleProps) {
    return <Title text={text} style={{fontSize: '1.4rem'}} />
}