const mongoReservas = require("./mongodbreserva.js")
const request = require("axios")
const ObjectId = require("mongodb").ObjectId

/*
MODELO RESERVA BD
{
    "_id":""
    "id_client":"",
    "sillas":[
        {
            "id_vuelo":"",
            "sillas":0,
            "valor_unidad":0
        },
        {
            "id_vuelo":"",
            "sillas":0,
            "valor_unidad":0
        }
    ],
    "estado_reserva":""
}

/* 
RESERVA POSTMAN

{
    "id_cliente":"",
    "id_vuelo":"",
    "sillas":0,
    "categoria":"",
    "valor_silla":100
}
*/

const reservas = async (reserva_api)=>{
    const client = await mongoReservas.getClient()
    const collection = await mongoReservas.getCollection(client)
    const filtro = {"id_client":reserva_api.id_cliente,"estado_reserva":"pendiente"}
    const reserva = await mongoReservas.findOne(collection,filtro)
    let reserva_new = null
    let sillas_update = null
    //Verifica Si existe una reserva
    if(reserva != null){
        // ACTUALIZAR LA RESERVA CON LAS SILLAS Y EL VUELO SELECCIONADO
        sillas_update = reserva.sillas
        sillas_update.push(reserva_api)
        console.log("Existe Reseva")
    }else{
        //Insertar Reserva Con un nuevo vuelo y sillas
        reserva_new = { "id_client":reserva_api.id_cliente, "estado_reserva":"pendiente", "sillas":[]}
        reserva_new.sillas.push(reserva_api)
    }

    await request.patch(
        "http://192.168.1.7:8081/vuelos",reserva_api
    )
    .then(
        async (response)=>{
            if(reserva != null){
                await mongoReservas.updatereserva(collection,filtro,{"$set":{"sillas":sillas_update}})
            }else{
                await mongoReservas.insert(collection,[ reserva_new ])
            }
        }
    )
    .catch(
        async (error)=>{
            console.log("Erro en reservar sillas")
            console.log(error)
        }
    )
    const reserva_bd = await mongoReservas.findOne(collection,filtro)

    mongoReservas.close(client)
    return reserva_bd        
}

const getReservas = async (id_client)=>{

    const client = await mongoReservas.getClient()
    const collection = await mongoReservas.getCollection(client)
    const filtro = {"id_client":id_client, "estado_reserva":"pendiente"}
    const reserva = await mongoReservas.findOne(collection, filtro)
    mongoReservas.close(client)
    return reserva

}

const cambioEstado = async (estado_pago)=>{

    const client = await mongoReservas.getClient()
    const collection = await mongoReservas.getCollection(client)  
    const filtro = {"_id":new ObjectId(estado_pago.id_reserva),"estado_reserva":"pendiente"}
    const update = {"$set":{"estado_reserva":estado_pago.estado_pago}}
    await mongoReservas.updatereserva(collection,filtro,update)
    const reserva = await mongoReservas.findOne(collection,{"_id":estado_pago.id_reserva})
    mongoReservas.close(client)
    return reserva
}


module.exports.reservas = reservas
module.exports.getReservas = getReservas
module.exports.cambioEstado = cambioEstado