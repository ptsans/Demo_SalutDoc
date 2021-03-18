import Title from './Title'
import {HTMLAttributes} from "react";

type SubtitleProps = {
    text: string
} & HTMLAttributes<HTMLHeadingElement>
export default function Subtitle({text, style, ...props}: SubtitleProps) {
    return <Title text={text} style={{fontSize: '1.4rem', ...style}} {...props} />
}