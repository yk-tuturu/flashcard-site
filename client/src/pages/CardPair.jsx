import React, {useState, forwardRef, useEffect, useRef} from "react"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/Cards.css';

const CardPair = forwardRef((props, ref) => {
    const [frontValue, setFrontValue] = useState(props.frontValue)
    const [backValue, setBackValue] = useState(props.backValue)

    const handleFrontChange = (e) => {
        if (e.includes("\t")) {
            e = e.replace("\t", "")
        }
        setFrontValue(prev => e)
        props.functions.updateCardInfo({index: props.index, frontValue: e, backValue: backValue})
    }

    const handleBackChange = (e) => {
        if (e.includes("\t")) {
            e = e.replace("\t", "")
        }
        setBackValue(prev => e)
        props.functions.updateCardInfo({index: props.index, frontValue: frontValue, backValue: e})
    }

    const handleAddCard = () => {
        props.functions.addCard(props.index)
    }

    const handleDeleteCard = () => {
        props.functions.deleteCard(props.index)
    }

    const handleMoveUp = () => {
        props.functions.moveUp(props.index)
    }

    const handleMoveDown = () => {
        props.functions.moveDown(props.index)
    }

    return (
        <div className="cardPair" ref={ref}>
            <div>{props.index + 1}.</div>
            <ReactQuill className={"front"} theme="snow" value={frontValue} onChange={handleFrontChange}/>
            <ReactQuill className={"back"} theme="snow" value={backValue} onChange={handleBackChange}/>
            <div className="buttonContainer">
                <button onClick={handleAddCard}><img src="/add.png" alt="add"></img></button>
                <button onClick={handleDeleteCard}><img src="/trash.png" alt="delete"></img></button>
                <button onClick={handleMoveUp}><img src="/up.png" alt="move up"></img></button>
                <button onClick={handleMoveDown}><img src="/down.png" alt="move down"></img></button>
            </div>
        </div>
        
    )
});

export default CardPair