const http = require( "http" ),
      fs   = require( "fs" ),
      mime = require( "mime" ),
      dir  = "public/",
      port = 3000


//store movie name, year, plot rating, acting rating, music rating, overall rating (derived)
const appdata = [
  { "name": "Knives Out", "year": 2019, "plotRating": 10, "actingRating": 10, "musicRating": 10, "overallRating": 10 },
  { "name": "Superman", "year": 2025, "plotRating": 9, "actingRating": 9, "musicRating": 10, "overallRating": 9.33 },
  { "name": "Little Women", "year": 2019, "plotRating": 10, "actingRating": 10, "musicRating": 9, "overallRating": 9.66 }
]

const server = http.createServer( function( request,response ) {
  if( request.method === "GET" ) {
    handleGet( request, response )    
  }else if( request.method === "POST" ){
    handlePost( request, response ) 
  }else if ( request.method === "DELETE") {
    handleDelete( request, response)
  }
  else if ( request.method === "PATCH") {
    handlePatch( request, response)
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === "/" ) {
    sendFile( response, "public/index.html" )
  }
  else if ( request.url == "/results" ) {
    sendData( response )
  } else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ""

  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {
    let dataJSON = JSON.parse( dataString )

    //convert inputs to the right type
    dataJSON["year"] = parseInt(dataJSON["year"])
    dataJSON["plotRating"] = parseInt(dataJSON["plotRating"])
    dataJSON["actingRating"] = parseInt(dataJSON["actingRating"])
    dataJSON["musicRating"] = parseInt(dataJSON["musicRating"])

    //calculate and add derived field
    let newObj = addDerivedField(dataJSON)
    
    //add to appdata
    appdata.push(newObj)
    console.log("New data added to appdata:", newObj)

    response.writeHeader( 200, {"Content-Type": "text" })
    response.end(JSON.stringify(appdata))
  })
}

const handleDelete = function ( request, response ) {
  console.log("delete")

   let dataString = ""

  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {
    let dataJSON = JSON.parse( dataString )

    //find data in appdata
    const dataIndex = appdata.findIndex(movie =>
      movie['name'] === dataJSON['name'] &&
      movie['year'] === parseInt(dataJSON['year'])  &&
      movie['plotRating'] === parseInt(dataJSON['plotRating'])  &&
      movie['actingRating'] === parseInt(dataJSON['actingRating'])  &&
      movie['musicRating'] === parseInt(dataJSON['musicRating']) 
    );

    console.log("looking to delete ", dataIndex, appdata[dataIndex])

    //check if valid
    if (dataIndex === -1 ) {
      console.log("No movie entry found")

      response.writeHeader( 404, {"Content-Type": "text" })
      response.end(JSON.stringify(appdata))
    }
    else {
      appdata.splice(dataIndex, 1)

      response.writeHeader( 200, {"Content-Type": "text" })
      response.end(JSON.stringify(appdata))
    }
  })
}

const handlePatch = function ( request, response ) {
   let dataString = ""

  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {
    let dataJSON = JSON.parse( dataString )

    //find data in appdata
    const dataIndex = appdata.findIndex(movie =>
      movie['name'] === dataJSON["oldData"]['name'] &&
      movie['year'] === parseInt(dataJSON["oldData"]['year'])  &&
      movie['plotRating'] === parseInt(dataJSON["oldData"]['plotRating'])  &&
      movie['actingRating'] === parseInt(dataJSON["oldData"]['actingRating'])  &&
      movie['musicRating'] === parseInt(dataJSON["oldData"]['musicRating']) 
    );

    //check if valid
    if (dataIndex === -1 ) {
      console.log("No movie entry found")

      response.writeHeader( 404, {"Content-Type": "text" })
      response.end(JSON.stringify(appdata))
    }
    else {
      //delete entry and add new edited version
      appdata.splice(dataIndex, 1)

      //convert inputs to the right type
      dataJSON["newData"]["year"] = parseInt(dataJSON["newData"]["year"])
      dataJSON["newData"]["plotRating"] = parseInt(dataJSON["newData"]["plotRating"])
      dataJSON["newData"]["actingRating"] = parseInt(dataJSON["newData"]["actingRating"])
      dataJSON["newData"]["musicRating"] = parseInt(dataJSON["newData"]["musicRating"])

      let newObj = addDerivedField(dataJSON["newData"])

      //add to appdata
      appdata.push(newObj)

      response.writeHeader( 200, {"Content-Type": "text" })
      response.end(JSON.stringify(appdata))
    }
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we"ve loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { "Content-Type": type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( "404 Error: File Not Found" )

     }
   })
}

const sendData = function( response) {
  response.writeHeader( 200, { "Content-Type": 'text' })
  response.end(JSON.stringify(appdata))
}

const addDerivedField = function( dataJSON ) {
  let total = dataJSON["plotRating"] + dataJSON["actingRating"] + dataJSON["musicRating"]

  let newObject = { 
      "name": dataJSON["name"], 
      "year": dataJSON["year"], 
      "plotRating": dataJSON["plotRating"], 
      "actingRating": dataJSON["actingRating"], 
      "musicRating": dataJSON["musicRating"], 
      "overallRating": Math.round((total / 3) * 100) / 100}

  return newObject
}

server.listen( process.env.PORT || port )
