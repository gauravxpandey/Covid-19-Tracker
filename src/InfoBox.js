import React from 'react'
import { Card, CardContent } from "@material-ui/core"

function InfoBox( { title, cases, active, isRed, isGrey, total, customColor, customColor1, hoverColor, ...props } ) {

    const [bgcolor, setBgColor] = React.useState('transparent')

    return (
        <Card  onMouseEnter={()=>setBgColor(hoverColor)} onMouseLeave={()=>setBgColor('transparent')} style={{backgroundColor: bgcolor}}
        onClick={props.onClick} 
        className={`infoBox ${active && "infoBox--selected"} 
                            ${isGrey && "infoBox--grey"}
                            ${isRed && "infoBox--red"}
                            `}
        >
            <CardContent>

                <h1 style={{color: customColor}} className="infoBox__title">{title}</h1>
                <h2 style={{color: customColor1}} className="infoBox__cases">{cases}</h2>
                <h1 style={{color: customColor}} className="infoBox__total">{total}</h1>

            </CardContent>
        </Card>
    )
}

export default InfoBox
