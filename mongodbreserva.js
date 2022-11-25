const {MongoClient} = require("mongodb")

const getClient = async ()=>{

    const url = "mongodb+srv://MisionTic:MisionTicG1920@cluster0.2w1otct.mongodb.net/?retryWrites=true&w=majority"
    const client = new MongoClient(url)
    await client.connect()
    .then( 
        (response)=>{
            console.log("Conexion Exitosa")
        }
    )
    .catch(
        (error)=>{
            console.log("Error en la Conexion")
            console.log(error)
        }
    )

    return client
}


const getCollection = async (clientdb)=>{

    const db = await clientdb.db("AerolinaG1920")
    const collection = await db.collection("reserva")

    return collection
}


const find = async (collection,filtro)=>{

    const resultado = await collection.find(filtro).toArray()

    return resultado
}

const findOne = async (collection,filtro)=>{

    let resultado = {}

    await collection.findOne(filtro)
    .then(
        (respuesta)=>{
            resultado = respuesta
        }
    )
    .catch(
        (error)=>{
            console.log(error)
            throw error
        }
    )

    return resultado
}


const insert = async (collection,documentolist)=>{

    await collection.insertMany(documentolist)
    .then(
        (respuesta)=>{
            console.log("Inserto los documentos")
        }
    )
    .catch(
        (error)=>{
            console.log(error)
            throw error
        }
    )

    return "Documento insertados"
}

const updatereserva= async (collection,filtro,update)=>{

    await collection.updateOne(filtro,update)
    .then(
        (respose)=>{
            console.log("Actualizo documento")
        }
    )
    .catch(
        (error)=>{
            console.log("Error actualizando documento")
            console.log(error)
        }
    )

}

const deleteReserva = (collection,filtro)=>{

    collection.deleteMany(filtro)
    .then(
        (respuesta)=>{
            console.log("Documentos eliminados")
        }
    )
    .catch(
        (error)=>{
            console.log(error)
            throw error
        }
    )

    return "Documento eliminados"
}

const closeClient = (client) =>{
    client.close()
}


module.exports.getClient = getClient;
module.exports.getCollection = getCollection;
module.exports.getFind = find;
module.exports.findOne = findOne;
module.exports.insert = insert;
module.exports.deleteReserva = deleteReserva;
module.exports.close = closeClient;
module.exports.updatereserva = updatereserva;