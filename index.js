const express = require("express")
const cors = require("cors")
const body_parser = require("body-parser")
const serviceReserva = require("./ReservaService.js")

const app = express()
const path =  "/reservas"
const portreserva = 8084

app.use(cors())
app.use(body_parser.json())

app.get(path ,
    async (request, response)=>{
        console.log("llego peticion")
        id_client= request.query.id_client
        response.send(await serviceReserva.getReservas(id_client))
    }
)

app.post(path,
    
    async (request, response)=>{
        let reserva = request.body
        response.send(await serviceReserva.reservas(reserva))
    }
)

app.patch(path,
    async (request, response)=>{
        const estado_pago = request.body
        response.send(await serviceReserva.cambioEstado(estado_pago))
    }
)


app.listen(portreserva,
    ()=>{
        console.log("Subio api reserva en el puerto "+portreserva)
    }
)

