import "./button.css"

export default function BigBtn({children, onClick}) {
    return (
        <button onClick={onClick} className={"bigBtn"}>{children}</button>
    )
}