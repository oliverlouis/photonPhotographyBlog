# photonPhotographyBlog

A photography blog website where users can log in and write blogs. These blogs will be visible to the public and can be commented on. All Blogs include a photo and blog text and a date created.

App contains two pre-existing users:

User: oliver
Password: password

User: arielle
Password: password

Log in to either of these pre-existing user accounts to accesss full authentication and authorization capabilities of the app, or create your own user account by clicking the "Sign Up" button.

Only corresponding authors of blogs and/or comments may edit or delete those blogs and/or comments!

IMPORTANT!!!! --> To run application locally, comment-out entire "app.listen(process.env.Port...)" code at the bottom of app.js and uncomment "app.listen(3300, () => {
console.log('Photon Server started'.blue.bold)});" code below. Save changes then run "node app.js" in the terminal to start the server
