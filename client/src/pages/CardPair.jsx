import React, {useState} from "react"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/Cards.css';

function CardPair(props) {
    const [frontValue, setFrontValue] = useState(props.frontValue)
    const [backValue, setBackValue] = useState(props.backValue)

    const handleFrontChange = (e) => {
        setFrontValue(prev => e)
        props.updateCardInfo({index: props.index, frontValue: e, backValue: backValue})
    }

    const handleBackChange = (e) => {
        setBackValue(prev => e)
        props.updateCardInfo({index: props.index, frontValue: frontValue, backValue: e})
    }

    const handleAddCard = () => {
        props.addCard(props.index)
    }

    return (
        <div className="cardPair">
            <div></div>
            <ReactQuill theme="snow" value={frontValue} onChange={handleFrontChange}/>
            <ReactQuill theme="snow" value={backValue} onChange={handleBackChange}/>
            <button onClick={handleAddCard}>Add</button>
        </div>
        
    )
}

export default CardPair