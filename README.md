## Personal Movie Review Tracker
My project allows users to review movies and track their past reviews. They provide the movie name, year, and their ratings of the movie plot, acting, and music, and then the application will compute an overall rating (average) before storing it. You can do this in the "Movie Rating Entry" section -- all fields must be filled out, with valid ratings ranging from 0-10 and valid dates ranging from 1900-2025. Users can view all ratings stored by clicking "See Results" in the "Movie Rating Results" section. This table will be repopulated automatically when a user submits, edits, or deletes a rating. Users can delete entries by clicking the "Delete" button on the respective entry row. Similarly, users can click the respective "edit" button and edit their movie ratings in the "Edit Section" section. When done with their edits, pressing "Submit Edits" will submit their changes to the server, which will update the entry and the display table. To cancel an edit, users can click "Cancel editing" or any other button. 

Upon starting the application, there will be 3 pre-loaded movie review entries for the user's reference. They are free to delete or edit them at any time. 

For the best viewing experience please adjust your browser zoom to %80, as that was what I used to develop and style (sorry!).

For CSS positioning, I used flexboxes. I also included fonts found from Google Fonts. Most CSS styling, including rules needed for the positioning and fonts, is located in the main.css file. I used some in-element styling for some small, unique, styling rules to demonstrate using various CSS functionalities, however, most of my styling was done with class selectors (divs/containers, specific inputs, fonts), ID selectors (edit buttons), and general element selectors (styling buttons or tables). 

## Technical Achievements
- **Tech Achievement 1**: Using a combination of HTML forms, HTML tables, dictionaries, and GET, POST, DELETE, and PATCH requests, I created a single-page app that supports user data entry, deletion, fetching, and editing. The frontend code provides an entry form for users to submit data to the server with a POST request, which uses that data to first calculate a derived field (average rating) before storing it in a array of dictionaries in the server file. Users can also delete data by sending a DELETE request, in which the server finds the requested entry for deletion and removes it from the array of dictionaries, appdata. Similarly, users can also edit data by sending a PATCH request, in which the server finds the requested entry for editing and applies the desired changes. Finally, users can also request to see all their entry data by sending a GET request to /results. After all of these requests, the server will send the entire appdata array back to the frontend as a response so that the results table can be updated and always reflect the server-side data. 

The part I found most challenging was adding the "delete" and "edit" buttons to each row of the data display table because each button had to uniquely correspond to their respective rows and the javascript needed to be able to access each element in a specified row in order to package data for a request. Because there is a variable number of rows in the table at a given time, I could not hard-code this in. To solve this problem, I used the current index of the loop I used to display each row to create a unique id name for each td element. This way, when a delete or edit button was clicked, the row ID/index number could be passed into the deleteRow or editRow functions to allow the javascript to access each element of that specific row. 

- **Tech Achievement 2**: As mentioned above, users have the ability to change their ratings of past movie reviews they made. In the data table, each row has an assoiated "edit" button, which will activate the "edit section" where users can change the rating values and submit for processing. The old and new proposed data is sent in a PATCH request to the server, who will take the data and replace the old entry with the new one. Once done, the updated server-side data will be sent back as a response so that the frontend can update the data display table.

The part I found most challenging was both sending and handling the request. Because users can technically submit reviews for the same movie, the unique identifier for each entry was the entire entry. This meant that I had to send the old data along with the new updates. I had to figure out a way to store this old data before activating the edit section, and then refer back to it once the submit button was pressed. To do this, I used a global variable that stored a dictionary of the data or was null. The variable was populated when an "edit" button was clicked, and cleared when any other button was clicked (submit or not). When the submit button was pressed, the server sent a PATCH request with two dictionaries: oldData and newData. To handle the request on the server, I had some trouble because I had to make sure I was parsing correctly into the request JSON and converting values to the correct types before searching through appdata. 

### Design/Evaluation Achievements

- **Design Achievement 1**: User interface test on Mom 

What problems did the user have with your design?

What comments did they make that surprised you?

What would you change about the interface based on their feedback


- **Design Achievement 1**: User interface test on Dad 

What problems did the user have with your design?

What comments did they make that surprised you?

What would you change about the interface based on their feedback