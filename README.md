This was made as part of an assignment for an Advanced Web Programming unit at University. We were tasked with developing a web client and server-architecture based application.

# Project Description:

This project uses Node.js to develop a HTTP server that communicates with a client through their web browser.

The styling of the web pages take heavy inspiration from IBM's open source design system - [Carbon](https://carbondesignsystem.com/all-about-carbon/what-is-carbon/)

# Running the Application

## Server

1. First run `npm install` in the project's root directory. This installes the necessary packages
2. Run the server in the project's root directory using `node index.js`

## Client

- Assuming this is ran locally, and not a dedicated server, access the local host `127.0.0.1/`.
  - If a custom port has been assigned (e.g. 40000), access the website through `127.0.0.1:40000/`.

# Assignment Functionalities

## Submission of Student Details

- Present to the user an interface that allows submission of student details, along with their degree and optional photo.
- Information is sent to the server, and saved in a csv file `data/students.csv`
  - The photo, if it exists, is saved in `data/photos/`
  - Client-side validation is performed, providing inline feedback on any potential issues
 
## Search for Students

- Present an interface that allows the user to search for students on the server using a single search string
  - This string is compared to each field for each saved student
    - Case insensitive
    - Photos are omitted in the search
  - Partial/full matches will retrieve that student's record
  - All matching student records are sent back to the client for display
    - Results are displayed in a tabular format
    - Student details may include a link to their photo, if applicable
      - If the link to photo is clicked, that image is displayed on the same page
     
# Technical Requirements

- Asynchronous requests sent to the server
- Raw data, in JSON format, sent to the client
- No clientside web framework such as Angular. jQuery is permitted
- No Node.js framework such as Express
- No need for external modules, other than formidable

