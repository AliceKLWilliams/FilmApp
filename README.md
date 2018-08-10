# FilmApp

Using 'MovieMe' you can keep track of the films you've seen, the films you want to see, and leave reviews for others to read.

## Functionality

### Users

- Log in and register using a username and password (using Passport.js)
- Can provide a profile picture, which is shown next to their posted reviews.
- Can change their password, provided they have the correct current password.
- Have their own user page, where others can view the films they have seen and the films they want to see.
- Can post reviews for movies.

### Reviews

- Each review contains a main body of text and an overall rating out of 5.
- Ratings are also provided for a range of other categories, including Story, Music, and Acting.
- Reviews for a particular movie can be found on that movie's page, alongside the name and profile pic of the author.
- Each film also will tell you the average rating given by the applications user's.

### Films

- Users can search for films, which used the OMDB API.
- Search results appear in pages of 10.
- Each result shows the movie poster, name, release date, and a small description of the plot.
- If logged in a user can directly, from the search results, mark a movie as watched or marked as want to watch.
- Each film has its own page, where more information can be found, including the critic's reviews the cast and crew, and a more in-depth explanation of the plot.

## Technical Information

- Created using Node.js and Express. The front end uses EJS templating, and the data is stored in a MongoDB database. 
- All user authentication is provided using Passport.js. 
