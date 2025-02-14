import { Accordion } from "@mantine/core"
import { TransportMode } from "../../types"


export const TranspoertNode = () => {
    const transportModes : TransportMode[] = ["walking","cycling","motorcycling","driving"]
  return (
    <>
    <Accordion.Panel>
        {transportModes.map((transportMode,index)=>(
            <div key={index}>{transportMode}</div>
        ))}
    </Accordion.Panel>
    </>
  )
}
