import React from 'react'


const Card = React.forwardRef((props, ref) => (

    <div  ref = {ref} className="card">
           <img className="card--img" src={props.imageUrl} alt="profilePic"></img>
            <h3 className="card--name">{props.prefix + " " + props.name + " " + props.lastName}</h3>
            <p className="card--title">{props.title}</p>
            <button onClick = {() => props.navigationFunction(props.id)}>View More</button>
        </div>
  ));

export default Card;