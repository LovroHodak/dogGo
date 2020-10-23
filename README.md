# Doggo

## Description

For the dog lover that can't commit, but has love to give. Our site matches those who want to volunteer their time to help with dogs or foster find people and/or shelters who need help.

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
- **sign up** - As a user I want to sign up on the webpage so that I can volunteer or seek help with dogs
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account dashboard
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account

- **dashboard** - As a user (volunteer) I want to be able to see which dogs I've contacted
  As a user (owner/org) I want to be able to see my dogs' profiles and which dogs were contacted by volunteers

- **search page** - As a user (volunteer) I want to be able see all the dogs in my area and filter by help needed

- **messages page** - As a user (volunteer) I want to be able to see the conversation between me and the dog/dog owner
  As a user (owner/org) I want to be able to see the conversation between me and the volunteer

- **add/edit dog profile** - As a user (owner/org) I want to be able to add and/or update the profile(s) of my dog(s)

## Backlog

List of other features outside of the MVPs scope

Volunteer profile:

- ability to switch between volunteer and private owner profile (for thsoe that have dogs and also want to help)
- able to search date ranges for fostering

Doggo profile:

- foster date range

Geo Location:

- customize volunteer's search radius distance based on geolocation

## ROUTES:

- GET /
  - renders the landing page with log in and sign up
- GET /signup
  - renders the signup landing page to choose if help is needed or being offered
- GET /signup/private
  - renders signup form for private dog owners
- POST /signup/private
  - body:
    - name
    - email
    - password
    - city
  - redirects to /login if successful
- GET /signup/org
  - renders signup form for orgs/shelters/rescues/etc.
- POST /signup/org
  - body:
    - org name
    - email
    - password
    - city
  - redirects to /login if successful
- GET /signup/volunteer
  - renders signup form for volunteers
- POST /signup/volunteer
  - body:
    - name
    - email
    - password
    - city
  - redirects to /login if successful
- GET /login
  - renders login form for private, orgs, and volunteers
- POST /login

  - body:
    - email
    - password
  - redirects to respective dashboard

- GET /owner/
  - renders owner dashboard with dog profiles and Add A Dog button
- GET /owner/add-a-dog
  - renders form to add a dog profile
- POST /owner/add-a-dog
  - body:
    - name
    - breed
    - size
    - age
    - gender
    - description
    - foster
    - walkies
  - redirect to /owner with new profile added
- GET /owner/:uniqueDogId/edit
  - renders dog's profile page (add-a-dog page with prefilled values)
- POST /owner/:uniqueDogId/edit
  - body:
    - any changes made
  - redirect to /owner with edited profile
- GET /owner/:uniqueDogId/delete
  - deletes dog with that unique id
- GET /owner/:uniqueDogId/messages
  - renders mailbox for that dog
- GET /owner/:messageId
  - renders messages with that specific volunteer
  - validate that this message can only be accessed by this dog
- POST /owner/:messageId

- GET /volunteer
  - renders volunteer dashboard showing dogs they've messaged and search button
- GET /volunteer/search
  - renders dog profiles within same city with additional filters offered
- GET /volunteer/:uniqueDogId
  - render detailed dog profile from dog card
- GET /volunteer/:messageId
  - renders conversation with that specific dog
- POST /volunteer/:messageId
  - redirect to /volunteer with newly messaged dog added

## Models

hoomanModel ('hooman', hoomanSchema)

```
{email: String, required
password: String, required
name: String
city: String
type: String [enum]}
{timestamps: true}
```

doggoModel ('doggo', doggoSchema)

```
name: String
breed: String
size: String [enum]
age: Number
gender: String [enum]
description: String (max 100 characters)
foster: Boolean
walkies: Boolean
 myOwner: {type: mongoose.Schema.Types.ObjectId
 ref: 'owner'}
```

Message model

```
body: String
 doggo: {type: mongoose.Schema.Types.ObjectId
 ref: 'doggo'}
 volunteer: {type: mongoose.Schema.Types.ObjectId
 ref: 'hooman'}

```

## Links

### Trello

[Trello board](https://trello.com/b/A0q880F3/doggo-app)

### Git

The url to your repository and to your deployed project

[Repository Link](https://github.com/scmendez/dogGo)

[Deploy Link](https://d-o-g-g-o.herokuapp.com/)

### Slides

The url to your presentation slides

[Slides Link](https://slides.com/alekstana/deck-172fb6/)
