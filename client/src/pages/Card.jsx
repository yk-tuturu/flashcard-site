import React, {useState} from "react"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/Cards.css';

function Card(props) {
    const [value, setValue] = useState(props.value)

    const handleChange = (e) => {
        setValue(prev => e)
        props.updateCardInfo({index: props.index, side:props.side, value: e})
    }

    return (
        <div className="card">
            <ReactQuill theme="snow" value={value} onChange={handleChange}/>
        </div>
    )
}

export default Card

