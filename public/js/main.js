// FRONT-END (CLIENT) JAVASCRIPT HERE

let currentlyEditingOldData = null;

const submit = async function( event ) {
  clearEditing()

  event.preventDefault()

  const name = document.querySelector( "#name" ),
        year = document.querySelector( "#year" ),
        plotRating = document.querySelector( "#plotRating" ),
        actingRating = document.querySelector( "#actingRating" ),
        musicRating = document.querySelector( "#musicRating" ),
        json = { name: name.value, year: year.value, plotRating: plotRating.value, actingRating: actingRating.value, musicRating: musicRating.value },
        body = JSON.stringify( json )

  const response = await fetch( "/submit", {
    method:"POST",
    body 
  })

  const data = await response.json()

  console.log( "text:", data )

  //clear inputs
  name.value = ''
  year.value = ''
  plotRating.value = ''
  actingRating.value = ''
  musicRating.value = ''

  populateTable(data)
}

const deleteRow = async function( rowIndex ) {
  clearEditing()

  console.log("Delete row")

  const name = document.getElementById( `name-${rowIndex}` ),
        year = document.getElementById( `year-${rowIndex}` ),
        plotRating = document.getElementById( `plotRating-${rowIndex}` ),
        actingRating = document.getElementById( `actingRating-${rowIndex}` ),
        musicRating = document.getElementById( `musicRating-${rowIndex}` ),
        json = { name: name.textContent, 
          year: year.textContent, 
          plotRating: plotRating.textContent, 
          actingRating: actingRating.textContent, 
          musicRating: musicRating.textContent },
        body = JSON.stringify( json )

  console.log("deleting: ", body)

  const response = await fetch( "/", {
    method:"DELETE",
    body 
  })

  const data = await response.json()

  console.log( "text:", data )

  populateTable(data)
}

const editRow = function( rowIndex ) {

  const name = document.getElementById( `name-${rowIndex}` ),
        year = document.getElementById( `year-${rowIndex}` ),
        plotRating = document.getElementById( `plotRating-${rowIndex}` ),
        actingRating = document.getElementById( `actingRating-${rowIndex}` ),
        musicRating = document.getElementById( `musicRating-${rowIndex}` ),
        plotRatingOldVal = plotRating.textContent,
        actingRatingOldVal = actingRating.textContent,
        musicRatingOldVal = musicRating.textContent

  //populate edit fields
  let editName = document.getElementById('edit-name');
  editName.textContent = name.textContent

  let editYear = document.getElementById('edit-year');
  editYear.textContent = year.textContent

  let plotInputField = document.getElementById('edit-plot');
  plotInputField.value = plotRatingOldVal;

  let actingInputField = document.getElementById('edit-acting');
  actingInputField.value = actingRatingOldVal;

  let musicInputField = document.getElementById('edit-music');
  musicInputField.value = musicRatingOldVal;

  //change edit section border color and submit button 
  let trackerEditDiv = document.getElementById('tracker-edit');
  trackerEditDiv.style.border = "7px solid rgba(218, 226, 98, 0.99)";

  let trackerEditButton = document.getElementById('edit-submit')
  trackerEditButton.style.background = "rgba(218, 226, 98, 0.99)"

  //store data
  currentlyEditingOldData = {
    name: name.textContent,
    year: year.textContent,
    plotRating: plotRatingOldVal,
    actingRating: actingRatingOldVal,
    musicRating: musicRatingOldVal
  };

}

const clearEditing = function () {
  //reset edit fields
  let editName = document.getElementById('edit-name');
  editName.textContent = 'Movie Name'

  let editYear = document.getElementById('edit-year');
  editYear.textContent = 'Movie Year'

  let plotInputField = document.getElementById('edit-plot');
  plotInputField.value = ''

  let actingInputField = document.getElementById('edit-acting');
  actingInputField.value = ''

  let musicInputField = document.getElementById('edit-music');
  musicInputField.value =''

  //change edit section border color and submit button 
  let trackerEditDiv = document.getElementById('tracker-edit');
  trackerEditDiv.style.border = "7px solid rgba(22, 109, 45, 0.79)";

  let trackerEditButton = document.getElementById('edit-submit')
  trackerEditButton.style.background = "rgb(106, 144, 48)"

  currentlyEditingOldData = null; 
}

const submitEdits = async function ( ) {

  const name = document.getElementById( "edit-name" ),
        year = document.getElementById('edit-year'),
        plotRating = document.getElementById( "edit-plot" ),
        actingRating = document.getElementById( "edit-acting" ),
        musicRating = document.getElementById( "edit-music" ),
        newData = { name: name.textContent, 
          year: year.textContent, 
          plotRating: plotRating.value, 
          actingRating: actingRating.value, 
          musicRating: musicRating.value }
  
  if (currentlyEditingOldData) {
    json = { newData: newData, oldData: currentlyEditingOldData },
    body = JSON.stringify( json )
  }
  else {
    console.log("no previous data found")
    return;
  }
        
  const response = await fetch( "/", {
    method:"PATCH",
    body 
  })

  const data = await response.json()

  console.log( "text:", data )

  populateTable(data)

  clearEditing()
}
      
const seeResults = async function ( event ) {
  event.preventDefault()

  clearEditing()

  const response = await fetch( "/results", {
    method:'GET', 
  })

  const data = await response.json()

  console.log( "text2:", data )

  populateTable(data)
  
}

const populateTable = function (data) {
  const tableBody = document.getElementById("movie-table-body");

  //clear the table
  tableBody.innerHTML = '';

  data.forEach((movie, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td id="name-${index}">${movie['name']}</td>
      <td class="number-cell" id="year-${index}">${movie['year']}</td>
      <td class="number-cell" id="plotRating-${index}">${movie['plotRating']}</td>
      <td class="number-cell" id="actingRating-${index}">${movie['actingRating']}</td>
      <td class="number-cell" id="musicRating-${index}">${movie['musicRating']}</td>
      <td class="number-cell" id="overallRating-${index}">${movie['overallRating']}</td>
      <td><button onclick="deleteRow(${index})">Delete</button></td>
      <td><button onclick="editRow(${index})">Edit</button></td>
    `;
    tableBody.appendChild(row);
  });

}

window.onload = function() {
  const form = document.querySelector("#inputForm");
  const SeeResultsButton = document.querySelector("#results-request");
  const SubmitEditsButton = document.getElementById('edit-submit')
  const editCancelButton = document.getElementById('edit-cancel')

  form.addEventListener("submit", submit); 
  SeeResultsButton.addEventListener("click", seeResults);
  SubmitEditsButton.addEventListener("click", submitEdits);
  editCancelButton.addEventListener("click", clearEditing)
  
}